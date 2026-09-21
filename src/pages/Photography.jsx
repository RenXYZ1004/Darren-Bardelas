import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { photos } from '../data/photography';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/effects/Reveal';
import { Placeholder } from '../components/ui/Placeholder';
import { Lightbox } from '../components/features/Lightbox';

export default function Photography() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="container">
      <SectionHeader
        title="Photography"
        subtitle="Frames collected around the city — light, structure and the people moving through both."
      />

      <div className="gallery-grid">
        {photos.map((photo, i) => (
          <Reveal key={photo.id} index={i} direction="up">
            <button
              type="button"
              className="photo-card"
              onClick={() => setActiveIndex(i)}
              aria-haspopup="dialog"
              aria-label={`Open ${photo.caption} in full screen`}
            >
              {photo.src ? (
                <img src={photo.src} alt={photo.caption} loading="lazy" />
              ) : (
                <Placeholder label={photo.caption} seed={photo.id} />
              )}

              <span className="photo-zoom" aria-hidden="true">
                +
              </span>

              <span className="caption">
                <span className="caption-title">{photo.caption}</span>
                <br />
                <span className="caption-location">{photo.location}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <Lightbox
            photos={photos}
            index={activeIndex}
            onClose={() => setActiveIndex(null)}
            onNavigate={setActiveIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
