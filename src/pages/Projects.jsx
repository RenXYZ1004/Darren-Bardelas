
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal } from '../components/effects/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';

const PROJECTS = [
  {
    id: 'gatepass',
    title: 'Southville Gatepass System',
    shortTitle: 'Southville Gatepass',
    category: 'Web Apps',
    type: 'Web Application',
    description:
      'A school gatepass platform that turns the request process into a clear digital workflow for applications, approvals, and QR-based verification.',
    longDescription:
      'Southville Gatepass System digitizes the end-to-end gatepass workflow. Students can submit requests online, staff can review and manage applications, and authorized passes can be checked through QR verification—bringing requests, approvals, and verification into one streamlined system.',
    technologies: [
      'React',
      'Web Application',
      'Authentication',
      'QR Verification',
      'Database',
    ],
    url: 'https://pgp.southville.edu.ph/',
    featured: true,
  },

  {
    id: 'funrun',
    title: 'Fun Run Registration',
    shortTitle: 'Fun Run Registration',
    category: 'Web Apps',
    type: 'Custom Registration System',
    description:
      'A purpose-built event registration platform that gives participants a structured way to submit their details, select a race category, upload required files, and receive a more organized registration experience.',
    longDescription:
      'Built for the Southville Fun Run, this system centralizes participant registration and supporting submissions in one workflow. It handles participant details, race-category selection, file uploads, confirmation, and registration management through a custom online form experience.',
    technologies: [
      'React',
      'Custom Forms',
      'Registration',
      'File Upload',
      'Database',
    ],
    url: 'https://sfo-system.vercel.app/',
    featured: true,
  },

  {
    id: 'jetclicks',
    title: 'JetClicks Photography',
    shortTitle: 'JetClicks Photography',
    category: 'Photography',
    type: 'Photography Portfolio',
    description:
      'A visual-first photography portfolio built to give selected images the focus they deserve, with a clean layout that adapts smoothly across desktop and mobile screens.',
    longDescription:
      'JetClicks Photography is designed around the image itself. The experience pairs responsive layouts with a focused gallery presentation, giving photography projects a dedicated space to be browsed, viewed, and presented as a cohesive portfolio.',
    technologies: [
      'React',
      'Photography',
      'Responsive Design',
      'Gallery',
      'Vercel',
    ],
    url: 'https://jet-clicks-photography.vercel.app/',
    featured: true,
  },

  {
    id: 'aegis',
    title: 'A.E.G.I.S.',
    shortTitle: 'A.E.G.I.S.',
    category: 'Research',
    type: 'Science & Technology Project',
    description:
      'A prototype security-screening device that explores electronic metal detection through a compact inspection box, combining sensing hardware with an application-focused enclosure.',
    longDescription:
      'A.E.G.I.S. (Advanced Electronic Guarding and Inspecting System) is a science-and-technology prototype focused on electronic metal detection. The project combines metal-sensing hardware and an enclosed inspection setup to explore a practical approach to identifying metallic objects during screening.',
    technologies: [
      'Electronics',
      'Metal Detection',
      'Security Screening',
      'Embedded System',
      'Hardware',
    ],
    achievement: 'Division Science and Technology Fair — 2nd Place',
    featured: true,
  },

  {
    id: 'traq',
    title: 'TRAQ',
    shortTitle: 'TRAQ Attendance System',
    category: 'Systems',
    type: 'QR Attendance System',
    description:
      'An automated QR attendance system that reduces manual roll call by using QR-based identification to capture attendance records and make them easier to monitor digitally.',
    longDescription:
      'TRAQ (Automatic QR Code Attendance System) streamlines school attendance through QR-based identification. Instead of relying on manual roll calls, the system records scans into a digital workflow that can be monitored through stored attendance information.',
    technologies: [
      'ESP32',
      'QR Code',
      'Automation',
      'Attendance',
      'Database',
      'Embedded System',
    ],
    achievement: 'Division Science and Technology Fair — 2nd Place',
    featured: true,
  },
];

const FILTERS = [
  'All',
  'Web Apps',
  'Systems',
  'Research',
  'Photography',
];

function ExternalIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function ProjectCard({ project, index, onOpen }) {
  return (
    <motion.article
      layout
      className={`project-card ${
        project.featured ? 'project-card-featured' : ''
      }`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
      }}
      whileHover={{
        y: -7,
        transition: { duration: 0.2 },
      }}
    >
      <div className="project-card-top">
        <div className="project-number">
          {String(index + 1).padStart(2, '0')}
        </div>

        {project.achievement && (
          <span className="project-award">
            2ND PLACE
          </span>
        )}
      </div>

      <div className="project-card-content">
        <span className="project-category">
          {project.category}
        </span>

        <h3>{project.title}</h3>

        <p>{project.description}</p>

        <div className="project-tags">
          {project.technologies.slice(0, 4).map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </div>

      <div className="project-card-actions">
        <button
          type="button"
          className="project-details-button"
          onClick={() => onOpen(project)}
        >
          View Details
          <ArrowIcon />
        </button>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-live-button"
            aria-label={`Open ${project.title}`}
          >
            <ExternalIcon />
          </a>
        )}
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') {
      return PROJECTS;
    }

    return PROJECTS.filter(
      (project) => project.category === activeFilter
    );
  }, [activeFilter]);

  return (
    <div className="container projects-page">
      <SectionHeader
        title="Projects"
        subtitle="A selection of web applications, systems, research prototypes, and visual work built to turn practical ideas into working experiences."
      />

      {/* Filter */}
      <Reveal direction="up">
        <div className="projects-filter" role="tablist">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              className={
                activeFilter === filter
                  ? 'active'
                  : ''
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Project count */}
      <div className="projects-meta">
        <span>
          {filteredProjects.length}{' '}
          {filteredProjects.length === 1
            ? 'project'
            : 'projects'}
        </span>

        <span>
          {activeFilter === 'All'
            ? 'Selected work'
            : activeFilter}
        </span>
      </div>

      {/* Projects */}
      <motion.div
        layout
        className="projects-grid"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={setSelectedProject}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <motion.div
          className="projects-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No projects found in this category.
        </motion.div>
      )}

      {/* Project modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="project-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="project-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              transition={{ duration: 0.25 }}
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <button
                type="button"
                className="project-modal-close"
                aria-label="Close project details"
                onClick={() =>
                  setSelectedProject(null)
                }
              >
                <CloseIcon />
              </button>

              <div className="project-modal-header">
                <span className="project-category">
                  {selectedProject.category}
                </span>

                <h2 id="project-modal-title">
                  {selectedProject.title}
                </h2>

                <span className="project-type">
                  {selectedProject.type}
                </span>
              </div>

              {selectedProject.achievement && (
                <div className="project-achievement">
                  <span className="achievement-label">
                    Achievement
                  </span>

                  <strong>
                    {selectedProject.achievement}
                  </strong>
                </div>
              )}

              <div className="project-modal-body">
                <p>
                  {selectedProject.longDescription}
                </p>

                <div className="project-modal-section">
                  <span className="modal-section-label">
                    Technologies & Components
                  </span>

                  <div className="project-tags">
                    {selectedProject.technologies.map(
                      (technology) => (
                        <span key={technology}>
                          {technology}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="project-modal-footer">
                <button
                  type="button"
                  className="project-modal-secondary"
                  onClick={() =>
                    setSelectedProject(null)
                  }
                >
                  Close
                </button>

                {selectedProject.url && (
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-modal-primary"
                  >
                    Open Live Project
                    <ExternalIcon />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

