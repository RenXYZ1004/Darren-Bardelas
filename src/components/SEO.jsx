import { useEffect } from 'react';

import { DEFAULT_OG_IMAGE, SITE_ALTERNATE_NAME, SITE_NAME, getSeoForPath } from '../seo.config';

function getSiteOrigin() {
  const configured = import.meta.env.VITE_SITE_URL || import.meta.env.VITE_VERCEL_PROJECT_PRODUCTION_URL;

  if (configured) {
    try {
      return new URL(configured.startsWith('http') ? configured : `https://${configured}`).origin;
    } catch {
      // Fall through to the active browser origin.
    }
  }

  return window.location.origin;
}

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  const withoutTrailingSlash = pathname.replace(/\/+$/, '');
  return withoutTrailingSlash || '/';
}

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${CSS.escape(key)}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function setCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }

  element.href = url;
}

function setStructuredData(id, data) {
  const existing = document.getElementById(id);
  existing?.remove();

  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function buildStructuredData({ origin, canonicalUrl, pathname, meta }) {
  const breadcrumb = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${origin}/`,
    },
  ];

  if (pathname !== '/') {
    breadcrumb.push({
      '@type': 'ListItem',
      position: 2,
      name: meta.breadcrumb,
      item: canonicalUrl,
    });
  }

  const graph = [
    {
      '@type': 'Person',
      '@id': `${origin}/#person`,
      name: SITE_NAME,
      url: `${origin}/`,
      jobTitle: 'Computer Science Student, Web Developer, UI Designer, Photographer',
      image: new URL(DEFAULT_OG_IMAGE, `${origin}/`).href,
    },
    {
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      url: `${origin}/`,
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
      inLanguage: 'en',
    },
    {
      '@type': meta.type,
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: meta.title,
      description: meta.description,
      inLanguage: 'en',
      isPartOf: {
        '@id': `${origin}/#website`,
      },
      about: {
        '@id': `${origin}/#person`,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumb,
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function SEO({ pathname }) {
  useEffect(() => {
    const normalizedPath = normalizePath(pathname);
    const meta = getSeoForPath(normalizedPath);
    const origin = getSiteOrigin();
    const canonicalUrl = new URL(normalizedPath, `${origin}/`).href.replace(/\/$/, normalizedPath === '/' ? '/' : '');
    const imageUrl = new URL(DEFAULT_OG_IMAGE, `${origin}/`).href;

    document.title = meta.title;

    setMeta('name', 'description', meta.description);
    setMeta('name', 'author', SITE_NAME);
    setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', imageUrl);
    setMeta('property', 'og:image:alt', 'Darren John L. Bardelas portfolio');
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', meta.title);
    setMeta('name', 'twitter:description', meta.description);
    setMeta('name', 'twitter:image', imageUrl);

    setCanonical(canonicalUrl);
    setStructuredData('portfolio-structured-data', buildStructuredData({
      origin,
      canonicalUrl,
      pathname: normalizedPath,
      meta,
    }));
  }, [pathname]);

  return null;
}
