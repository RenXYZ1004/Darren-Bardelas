import { useCallback, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Placeholder } from '../ui/Placeholder';

/** Full-screen photo viewer with arrow-key and button navigation. */
export function Lightbox({ photos, index, onClose, onNavigate }) {
  const photo = photos[index];

  const goPrev = useCallback(
    () => onNavigate((index - 1 + photos.length) % photos.length),
    [index, photos.length, onNavigate]
  );

  const goNext = useCallback(
    () => onNavigate((index + 1) % photos.length),
    [index, photos.length, onNavigate]
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goPrev, goNext]);

  if (!photo) return null;

  return (
    <Modal onClose={onClose} labelledBy="lightbox-caption" className="lightbox-figure">
      <button type="button" className="close-btn" onClick={onClose} aria-label="Close photo viewer">
        &times;
      </button>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            onClick={goPrev}
            aria-label="Previous photo"
          >
            &#8249;
          </button>
          <button
            type="button"
            className="lightbox-nav lightbox-next"
            onClick={goNext}
            aria-label="Next photo"
          >
            &#8250;
          </button>
        </>
      )}

      <div className="lightbox-stage">
        {photo.src ? (
          <img src={photo.src} alt={photo.caption} />
        ) : (
          <Placeholder label={photo.caption} seed={photo.id} />
        )}
      </div>

      <div className="lightbox-caption" id="lightbox-caption">
        <div className="caption-title">{photo.caption}</div>
        <div className="caption-location">
          {photo.location} &middot; {index + 1} / {photos.length}
        </div>
      </div>
    </Modal>
  );
}
