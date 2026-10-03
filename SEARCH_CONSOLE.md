# Google Search Console setup

The portfolio includes build-time support for Google Search Console HTML-tag verification through `VITE_GOOGLE_SITE_VERIFICATION`. The verification token must come from the Google Search Console property owner; it must not be guessed or fabricated.

## Setup

1. Open Google Search Console and add the exact production site property.
2. Choose **HTML tag** verification and copy the `content` token from the generated tag.
3. In Vercel, open the project **Settings → Environment Variables** and add:

   `VITE_GOOGLE_SITE_VERIFICATION=<your exact token>`

4. Redeploy the production project so the token is emitted into the generated route HTML.
5. In Search Console, click **Verify**.
6. After deployment, submit `https://<your-production-domain>/sitemap.xml` under **Sitemaps**.

The source also accepts `VITE_SITE_URL` for a fixed production origin. This is useful when the project has a custom domain because it makes generated canonical URLs, sitemap URLs, `robots.txt`, `llms.txt`, and Open Graph URLs deterministic.

## Already implemented in the site

- Route-specific titles and meta descriptions
- Self-referential canonical URLs
- `index, follow` robots directives
- Open Graph and Twitter image metadata
- JSON-LD structured data
- Build-generated `sitemap.xml`, `robots.txt`, and `llms.txt`
- Clean route entry HTML for `/`, `/menu`, `/projects`, `/photography`, `/certificates`, `/about`, and `/contact`
