import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { DEFAULT_OG_IMAGE, SITE_ALTERNATE_NAME, SITE_NAME, SEO_ROUTES } from '../src/seo.config.js';

const root = process.cwd();
const distDir = path.join(root, 'dist');

function resolveSiteUrl() {
  const candidates = [
    process.env.VITE_SITE_URL,
    process.env.SITE_URL,
    process.env.VITE_VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ].filter(Boolean);

  if (!candidates.length && process.env.VERCEL_ENV === 'production') {
    throw new Error('Production SEO generation requires VITE_SITE_URL or an exposed Vercel production URL environment variable.');
  }

  const raw = candidates[0] || 'http://localhost:4173';
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const url = new URL(withProtocol);
  url.search = '';
  url.hash = '';
  return url.origin.replace(/\/+$/, '');
}

function xmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function htmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function routeUrl(siteUrl, route) {
  return `${siteUrl}${route === '/' ? '/' : route}`;
}

function buildStructuredData({ siteUrl, canonicalUrl, meta }) {
  const breadcrumb = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${siteUrl}/`,
    },
  ];

  if (meta.path !== '/') {
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
      '@id': `${siteUrl}/#person`,
      name: SITE_NAME,
      url: `${siteUrl}/`,
      jobTitle: 'Full-Stack Developer, Workflow & Automation, Photographer',
      image: `${siteUrl}${DEFAULT_OG_IMAGE}`,
    },
    {
      '@type': meta.type,
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: meta.title,
      description: meta.description,
      inLanguage: 'en',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#person` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumb,
    },
  ];

  if (meta.path === '/') {
    graph.push({
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
      inLanguage: 'en',
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

function replaceMeta(html, attribute, key, content) {
  const escapedKey = escapeRegExp(key);
  const escapedContent = htmlEscape(content);
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${escapedKey}["']\\s+content=["'][^"']*["']\\s*/?>`, 'i');

  if (pattern.test(html)) {
    return html.replace(pattern, `<meta ${attribute}="${key}" content="${escapedContent}" />`);
  }

  return html.replace('</head>', `    <meta ${attribute}="${key}" content="${escapedContent}" />\n  </head>`);
}

function replaceCanonical(html, canonicalUrl) {
  const pattern = /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i;
  const replacement = `<link rel="canonical" href="${htmlEscape(canonicalUrl)}" />`;
  return pattern.test(html)
    ? html.replace(pattern, replacement)
    : html.replace('</head>', `    ${replacement}\n  </head>`);
}

function replaceTitle(html, title) {
  const pattern = /<title>[^<]*<\/title>/i;
  const replacement = `<title>${htmlEscape(title)}</title>`;
  return pattern.test(html)
    ? html.replace(pattern, replacement)
    : html.replace('</head>', `    ${replacement}\n  </head>`);
}

function injectStructuredData(html, meta, siteUrl, canonicalUrl) {
  const data = buildStructuredData({ siteUrl, canonicalUrl, meta });
  const script = `    <script id="portfolio-structured-data" type="application/ld+json">${JSON.stringify(data)}</script>`;
  const withoutExisting = html.replace(/\s*<script id="portfolio-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/i, '');
  return withoutExisting.replace('</head>', `${script}\n  </head>`);
}

function buildRouteHtml(template, siteUrl, meta, verification) {
  const canonicalUrl = routeUrl(siteUrl, meta.path);
  const imageUrl = `${siteUrl}${DEFAULT_OG_IMAGE}`;
  let html = template;

  html = replaceTitle(html, meta.title);
  html = replaceMeta(html, 'name', 'description', meta.description);
  html = replaceMeta(html, 'name', 'author', SITE_NAME);
  html = replaceMeta(html, 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  html = replaceMeta(html, 'property', 'og:type', 'website');
  html = replaceMeta(html, 'property', 'og:site_name', SITE_NAME);
  html = replaceMeta(html, 'property', 'og:title', meta.title);
  html = replaceMeta(html, 'property', 'og:description', meta.description);
  html = replaceMeta(html, 'property', 'og:url', canonicalUrl);
  html = replaceMeta(html, 'property', 'og:image', imageUrl);
  html = replaceMeta(html, 'property', 'og:image:alt', 'Darren John L. Bardelas portfolio');
  html = replaceMeta(html, 'property', 'og:image:width', '1200');
  html = replaceMeta(html, 'property', 'og:image:height', '630');
  html = replaceMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = replaceMeta(html, 'name', 'twitter:title', meta.title);
  html = replaceMeta(html, 'name', 'twitter:description', meta.description);
  html = replaceMeta(html, 'name', 'twitter:image', imageUrl);
  html = replaceCanonical(html, canonicalUrl);

  const marker = '<!-- GOOGLE_SITE_VERIFICATION -->';
  if (verification) {
    html = html.replace(marker, `<meta name="google-site-verification" content="${htmlEscape(verification)}" />`);
  } else {
    html = html.replace(marker, '');
  }

  return injectStructuredData(html, meta, siteUrl, canonicalUrl);
}

const siteUrl = resolveSiteUrl();
const verification = (process.env.VITE_GOOGLE_SITE_VERIFICATION || '').trim();

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${SEO_ROUTES
  .map((route) => `  <url><loc>${xmlEscape(routeUrl(siteUrl, route.path))}</loc></url>`)
  .join('\n')}\n</urlset>\n`;

const robots = `User-agent: *\nAllow: /\nDisallow: /legacy/\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

const llms = `# ${SITE_NAME}\n\n> Portfolio of ${SITE_NAME}, a Computer Science student focused on web & app development, Workflow automation specialist, photography, systems, and creative technology work.\n\n## Primary pages\n\n${SEO_ROUTES.map((route) => `- [${route.breadcrumb}](${routeUrl(siteUrl, route.path)}): ${route.description}`).join('\n')}\n\n## Projects\n\n- **Southville Gatepass System** — Web application for school gatepass submission, review, management, and QR verification.\n- **Fun Run Registration** — Custom online event registration system with participant data and registration management.\n- **JetClicks Photography** — Photography portfolio website focused on visual presentation and gallery browsing.\n- **A.E.G.I.S.** — Advanced Electronic Guarding and Inspecting System, a metal detection box for security screening applications.\n- **TRAQ** — Automatic QR Code Attendance System for school attendance management.\n\n## Notes for agents\n\nThe portfolio is a client-side React application using React Router. Project details are presented in interactive dialogs on the Projects page rather than separate project-detail URLs.\n`;

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(distDir, 'robots.txt'), robots, 'utf8');
fs.writeFileSync(path.join(distDir, 'llms.txt'), llms, 'utf8');

const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
  const template = fs.readFileSync(indexPath, 'utf8');

  // Home is also explicitly normalized in the root file.
  fs.writeFileSync(path.join(distDir, 'index.html'), buildRouteHtml(template, siteUrl, SEO_ROUTES[0], verification), 'utf8');

  // Emit clean route entry points so crawlers receive route-specific metadata
  // before the React client renders. The app itself remains a single SPA.
  for (const meta of SEO_ROUTES.slice(1)) {
    const routeDir = path.join(distDir, meta.path.slice(1));
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), buildRouteHtml(template, siteUrl, meta, verification), 'utf8');
  }
}

console.log(`SEO assets generated for ${siteUrl}`);
console.log(`Generated ${SEO_ROUTES.length} sitemap URLs and ${SEO_ROUTES.length} route HTML entry points.`);
