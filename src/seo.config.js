export const SITE_NAME = 'Darren John L. Bardelas';
export const SITE_ALTERNATE_NAME = 'Darren Bardelas Portfolio';
export const DEFAULT_OG_IMAGE = '/og-image.jpg';

export const SEO_ROUTES = [
  {
    path: '/',
    title: 'Darren John L. Bardelas | Portfolio',
    description:
      "Computer Science student, Full-Stack Developer, Workflow automation specialist, and photographer in the Philippines. Explore Darren John L. Bardelas' projects, certifications, photography, and contact.",
    type: 'WebSite',
    breadcrumb: 'Home',
  },
  {
    path: '/menu',
    title: 'Main Menu | Darren John L. Bardelas',
    description:
      "Navigate Darren John L. Bardelas' portfolio: projects, photography, certifications, about information, and contact details.",
    type: 'WebPage',
    breadcrumb: 'Main Menu',
  },
  {
    path: '/projects',
    title: 'Projects | Darren John L. Bardelas',
    description:
      'Explore selected web applications, systems, research projects, and creative work by Darren John L. Bardelas.',
    type: 'CollectionPage',
    breadcrumb: 'Projects',
  },
  {
    path: '/photography',
    title: 'Photography | Darren John L. Bardelas',
    description:
      'Browse photography work by Darren John L. Bardelas, including urban, architectural, and street-focused visual studies.',
    type: 'CollectionPage',
    breadcrumb: 'Photography',
  },
  {
    path: '/certificates',
    title: 'Certifications | Darren John L. Bardelas',
    description:
      "View certifications and technical credentials presented in Darren John L. Bardelas' portfolio.",
    type: 'CollectionPage',
    breadcrumb: 'Certifications',
  },
  {
    path: '/about',
    title: 'About Darren John L. Bardelas | Computer Science Student',
    description:
      'Learn about Darren John L. Bardelas, a Computer Science student focused on Web & App, Workflow Automation Specialist, and photography.',
    type: 'ProfilePage',
    breadcrumb: 'About',
  },
  {
    path: '/contact',
    title: 'Contact Darren John L. Bardelas',
    description:
      'Contact Darren John L. Bardelas about projects, questions, collaborations, or opportunities through the portfolio contact form.',
    type: 'ContactPage',
    breadcrumb: 'Contact',
  },
];

export const NOT_FOUND_SEO = {
  path: '*',
  title: 'Page Not Found | Darren John L. Bardelas',
  description:
    "The requested page could not be found on Darren John L. Bardelas' portfolio.",
  type: 'WebPage',
  breadcrumb: 'Page Not Found',
};

export function getSeoForPath(pathname) {
  const normalized = pathname && pathname !== '/'
    ? pathname.replace(/\/+$/, '') || '/'
    : '/';

  return SEO_ROUTES.find((route) => route.path === normalized) || NOT_FOUND_SEO;
}
