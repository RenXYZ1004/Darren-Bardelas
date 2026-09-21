import { Modal } from '../ui/Modal';
import { Placeholder } from '../ui/Placeholder';

export function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <Modal onClose={onClose} labelledBy="project-modal-title">
      <button type="button" className="close-btn" onClick={onClose} aria-label="Close project details">
        &times;
      </button>

      <div className="modal-visual">
        {project.image ? (
          <img src={project.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Placeholder label={project.title} seed={project.id} />
        )}
      </div>

      <h2 className="modal-title" id="project-modal-title">
        {project.title}
      </h2>
      <p className="modal-subtitle">
        {project.subtitle} &middot; {project.year}
      </p>

      <div className="project-tags" style={{ marginBottom: '1.2rem' }}>
        {project.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <p className="modal-desc">{project.description}</p>

      {project.link && (
        <a className="btn" href={project.link} target="_blank" rel="noopener noreferrer">
          <span>Visit Project</span>
        </a>
      )}
    </Modal>
  );
}
