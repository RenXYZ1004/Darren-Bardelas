import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PageTransition } from './components/layout/PageTransition';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { AmbientOrbs } from './components/effects/AmbientOrbs';
import { CursorGlow } from './components/effects/CursorGlow';
import Home from './pages/Home';
import MainMenu from './pages/MainMenu';
import Projects from './pages/Projects';
import Photography from './pages/Photography';
import Certificates from './pages/Certificates';
import About from './pages/About';
import Contact from './pages/Contact';

const pageRoutes = [
  { path: '/', element: <Home /> },
  { path: '/menu', element: <MainMenu /> },
  { path: '/projects', element: <Projects /> },
  { path: '/photography', element: <Photography /> },
  { path: '/certificates', element: <Certificates /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
];

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    document.title = location.pathname === '/'
      ? 'Darren John L. Bardelas | Portfolio'
      : `${location.pathname.slice(1).replace(/-/g, ' ')} | Darren John L. Bardelas`;
  }, [location.pathname]);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <AmbientOrbs />
      <CursorGlow />
      <main id="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {pageRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<PageTransition>{element}</PageTransition>}
              />
            ))}
            <Route path="*" element={<PageTransition><MainMenu /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default function App() {
  return <AppContent />;
}
