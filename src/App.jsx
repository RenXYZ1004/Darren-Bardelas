import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PageTransition } from './components/layout/PageTransition';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { SEO } from './components/SEO';
import { AmbientOrbs } from './components/effects/AmbientOrbs';
import { CursorGlow } from './components/effects/CursorGlow';
import Home from './pages/Home';
import MainMenu from './pages/MainMenu';
import Projects from './pages/Projects';
import Photography from './pages/Photography';
import Certificates from './pages/Certificates';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ShareFeedback from './pages/ShareFeedback';
import TestimonialAdmin from './pages/TestimonialAdmin';
import { TESTIMONIAL_ADMIN_PATH, TESTIMONIAL_FORM_PATH } from './lib/testimonialApi';

const pageRoutes = [
  { path: '/', element: <Home /> },
  { path: '/menu', element: <MainMenu /> },
  { path: '/projects', element: <Projects /> },
  { path: '/photography', element: <Photography /> },
  { path: '/certificates', element: <Certificates /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: TESTIMONIAL_FORM_PATH, element: <ShareFeedback /> },
  { path: TESTIMONIAL_ADMIN_PATH, element: <TestimonialAdmin /> },
];

function AppContent() {
  const location = useLocation();

  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
  const isUtilityRoute = normalizedPath === TESTIMONIAL_FORM_PATH || normalizedPath === TESTIMONIAL_ADMIN_PATH;

  return (
    <>
      <SEO pathname={location.pathname} />
      {!isUtilityRoute ? <ScrollProgress /> : null}
      {!isUtilityRoute ? <Navbar /> : null}
      {!isUtilityRoute ? <AmbientOrbs /> : null}
      {!isUtilityRoute ? <CursorGlow /> : null}
      <main id="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {pageRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={isUtilityRoute ? element : <PageTransition>{element}</PageTransition>}
              />
            ))}
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isUtilityRoute ? <Footer /> : null}
      {!isUtilityRoute ? <ScrollToTop /> : null}
    </>
  );
}

export default function App() {
  return <AppContent />;
}
