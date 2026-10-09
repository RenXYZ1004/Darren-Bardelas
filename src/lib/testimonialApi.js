const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
const SESSION_STORAGE_KEY = 'portfolio_testimonial_admin_session_v1';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const TESTIMONIAL_ADMIN_PATH = '/control-room-a84d2f';
export const TESTIMONIAL_FORM_PATH = '/share-feedback';

function ensureConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Testimonials are not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your environment variables.');
  }
}

function getErrorMessage(payload, fallback) {
  return payload?.msg || payload?.message || payload?.error_description || payload?.error || fallback;
}

async function readResponse(response) {
  const raw = await response.text();
  let payload = null;
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = { message: raw };
    }
  }

  if (!response.ok) {
    const fallback = `Request failed (${response.status}). Please try again.`;
    throw new Error(getErrorMessage(payload, fallback));
  }

  return payload;
}

function getStoredSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeSession(session) {
  try {
    if (session) window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Session persistence may be unavailable in a restrictive browser; the
    // current tab can still use the in-memory session returned by sign-in.
  }
}

let memorySession = null;
let refreshPromise = null;

function getSession() {
  return memorySession || getStoredSession();
}

function setSession(session) {
  memorySession = session;
  storeSession(session);
}

function hasAdminClaim(user) {
  return user?.app_metadata?.is_testimonials_admin === true || user?.app_metadata?.is_testimonials_admin === 'true';
}

async function authRequest(path, { method = 'GET', body, accessToken } = {}) {
  ensureConfigured();
  const headers = {
    apikey: supabaseAnonKey,
    'Content-Type': 'application/json',
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return readResponse(response);
}

async function refreshAdminSession(session) {
  if (!session?.refresh_token) {
    setSession(null);
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = authRequest('token?grant_type=refresh_token', {
      method: 'POST',
      body: { refresh_token: session.refresh_token },
    })
      .then((freshSession) => {
        if (!hasAdminClaim(freshSession.user)) {
          setSession(null);
          return null;
        }
        const updated = {
          ...freshSession,
          expires_at: freshSession.expires_at || Math.floor(Date.now() / 1000) + (freshSession.expires_in || 3600),
        };
        setSession(updated);
        return updated;
      })
      .catch(() => {
        setSession(null);
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function getValidAdminSession() {
  let session = getSession();
  if (!session?.access_token || !hasAdminClaim(session.user)) return null;

  const expiresAt = Number(session.expires_at || 0);
  if (expiresAt && expiresAt <= Math.floor(Date.now() / 1000) + 60) {
    session = await refreshAdminSession(session);
  }

  return session?.access_token && hasAdminClaim(session.user) ? session : null;
}

async function restRequest(path, { method = 'GET', body, token, prefer = 'return=minimal' } = {}) {
  ensureConfigured();
  const headers = {
    apikey: supabaseAnonKey,
    'Content-Type': 'application/json',
    Prefer: prefer,
  };
  // Public/publishable API keys are not user JWTs. Send only the apikey for
  // anonymous access; send a real Supabase Auth access token for admin calls.
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return readResponse(response);
}

export async function getApprovedTestimonials() {
  if (!isSupabaseConfigured) return [];
  const query = new URLSearchParams({
    select: 'id,name,affiliation,rating,message,created_at',
    status: 'eq.approved',
    order: 'created_at.desc',
    limit: '6',
  });
  return (await restRequest(`testimonials?${query.toString()}`)) || [];
}

export async function submitTestimonial({ name, affiliation, rating, message }) {
  const cleanName = String(name || '').trim();
  const cleanAffiliation = String(affiliation || '').trim();
  const cleanMessage = String(message || '').trim();

  if (cleanName.length < 2 || cleanName.length > 80) {
    throw new Error('Your name must be between 2 and 80 characters.');
  }
  if (cleanAffiliation.length > 100) {
    throw new Error('The relationship or project field must be 100 characters or fewer.');
  }
  if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    throw new Error('Please choose a rating from 1 to 5 stars.');
  }
  if (cleanMessage.length < 20 || cleanMessage.length > 1200) {
    throw new Error('Your review must be between 20 and 1,200 characters.');
  }

  return restRequest('testimonials', {
    method: 'POST',
    body: {
      name: cleanName,
      affiliation: cleanAffiliation,
      rating: Number(rating),
      message: cleanMessage,
    },
  });
}

export async function signInTestimonialAdmin(email, password) {
  const session = await authRequest('token?grant_type=password', {
    method: 'POST',
    body: { email: String(email || '').trim(), password },
  });

  if (!hasAdminClaim(session.user)) {
    // Do not retain a valid Supabase session for an account that is not allowed
    // to use this moderation dashboard.
    try {
      await authRequest('logout', { method: 'POST', accessToken: session.access_token });
    } catch {
      // The role check below is the security decision; logout is best effort.
    }
    throw new Error('This account does not have testimonial administrator access.');
  }

  const normalizedSession = {
    ...session,
    expires_at: session.expires_at || Math.floor(Date.now() / 1000) + (session.expires_in || 3600),
  };
  setSession(normalizedSession);
  return normalizedSession.user;
}

export async function restoreTestimonialAdmin() {
  const session = await getValidAdminSession();
  return session?.user || null;
}

export async function signOutTestimonialAdmin() {
  const session = getSession();
  setSession(null);
  if (session?.access_token && isSupabaseConfigured) {
    try {
      await authRequest('logout', { method: 'POST', accessToken: session.access_token });
    } catch {
      // Local sign-out still succeeds if the remote token has already expired.
    }
  }
}

export async function getAllTestimonialsForAdmin() {
  const session = await getValidAdminSession();
  if (!session) throw new Error('Your session expired. Please sign in again.');

  const query = new URLSearchParams({
    select: 'id,name,affiliation,rating,message,status,created_at,updated_at',
    order: 'created_at.desc',
    limit: '500',
  });
  return (await restRequest(`testimonials?${query.toString()}`, { token: session.access_token })) || [];
}

export async function updateTestimonialStatus(id, status) {
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    throw new Error('Unsupported review status.');
  }
  const session = await getValidAdminSession();
  if (!session) throw new Error('Your session expired. Please sign in again.');

  const query = new URLSearchParams({ id: `eq.${id}`, select: 'id,status' });
  const result = await restRequest(`testimonials?${query.toString()}`, {
    method: 'PATCH',
    body: { status },
    token: session.access_token,
    prefer: 'return=representation',
  });
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('The review was not updated. Check your admin permissions and database policies.');
  }
  return result[0];
}

export async function deleteTestimonial(id) {
  const session = await getValidAdminSession();
  if (!session) throw new Error('Your session expired. Please sign in again.');
  const query = new URLSearchParams({ id: `eq.${id}` });
  const result = await restRequest(`testimonials?${query.toString()}&select=id`, {
    method: 'DELETE',
    token: session.access_token,
    prefer: 'return=representation',
  });
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('The review was not deleted. Check your admin permissions and database policies.');
  }
}
