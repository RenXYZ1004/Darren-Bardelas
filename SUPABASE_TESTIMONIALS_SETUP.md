# Portfolio Testimonials — Supabase Setup

This project adds two unlinked routes:

- `/share-feedback` — customer review form. Share this URL directly with customers; it is not in the site's main navigation.
- `/control-room-a84d2f` — private review manager. It requires a Supabase account explicitly granted the testimonials-admin claim. The URL itself is not authentication.

Approved testimonials are shown automatically on the homepage. New submissions are stored as `pending` and stay hidden until approved.

## 1. Create the Supabase table and policies

1. Open your Supabase project.
2. Go to **SQL Editor** and create a new query.
3. Paste and run the full contents of `supabase-testimonials.sql`.

The SQL enables Row Level Security (RLS), allows visitors to submit only pending reviews, allows public reads only for approved reviews, and limits moderation/deletion to accounts carrying the admin claim.

## 2. Configure environment variables

In the project root, copy `.env.example` to `.env.local` and fill in:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Find these in the Supabase Dashboard under **Project Settings → API Keys** or the project **Connect** dialog. Use the project URL and publishable key. Older projects can use a legacy anon key by setting `VITE_SUPABASE_ANON_KEY` instead. **Never** use the `service_role` or secret key in a `VITE_` variable; frontend variables are visible to visitors.

Restart the Vite development server after changing `.env.local`:

```bash
npm run dev
```

## 3. Create the dashboard administrator

1. In Supabase, go to **Authentication → Users** and create the admin user yourself. Do not enable public sign-up for this review dashboard.
2. In **SQL Editor**, run the following after replacing the email with the exact admin account email:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object('is_testimonials_admin', true)
where lower(email) = lower('YOUR_ADMIN_EMAIL');
```

3. Confirm one user row was updated. Then sign in at `/control-room-a84d2f`. If that account was already signed in before the claim was set, sign out and sign back in to refresh the session.

The dashboard checks the user's `app_metadata`, and the database independently checks the same claim in its RLS policies. Editing frontend code or knowing the URL alone does not grant moderation access.

## 4. Deploy on Vercel

In **Vercel → Project → Settings → Environment Variables**, add both variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Add them to the environments you use (Production, Preview, and/or Development), then redeploy. Set the same values in `.env.local` for local development. Do not commit `.env.local`.

## 5. Use the workflow

1. Share `https://YOUR_DOMAIN/share-feedback` directly with a customer.
2. Their testimonial appears as **Pending** in the control room.
3. Select **Approve & publish** to show it on the homepage.
4. Select **Unpublish** to remove an approved testimonial from the homepage, **Reject** to keep it hidden in the rejected queue, or **Delete** to permanently remove it.
5. Refresh the homepage to fetch the current approved testimonials.

## Notes

- The homepage shows up to the six most recent approved testimonials. The section stays hidden if there are no approved reviews or Supabase is not configured.
- The review and admin pages are marked `noindex,nofollow` and intentionally omitted from site navigation. `noindex` is a search-engine instruction, not an access-control feature.
- The form has input validation and a honeypot field, but it does not include an external CAPTCHA or server-side rate limiter. For a high-traffic public form, add CAPTCHA/rate limiting (for example, through a Supabase Edge Function) before sharing widely.
- The frontend uses Supabase Auth and REST endpoints directly, so no Supabase package dependency is required.
