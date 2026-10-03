import { certificates } from '../data/certificates';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/effects/Reveal';
import { RelatedLinks } from '../components/RelatedLinks';

export default function Certificates() {
  return (
    <div className="container">
      <SectionHeader
        title="Certifications"
        subtitle="Credentials earned alongside my Computer Science degree."
      />

      <div className="cert-grid">
        {certificates.map((cert, i) => (
          <Reveal key={cert.id} index={i} direction="up">
            <article className="card">
              <span className="tag">{cert.tag}</span>
              <h2 style={{ marginTop: '1rem' }}>{cert.title}</h2>
              <p>Issued by {cert.issuer}</p>
              <div className="cert-meta">
                <span>{cert.issuer}</span>
                <span>{cert.year}</span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <RelatedLinks links={[
        { to: '/projects', label: 'Projects' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
      ]} />
    </div>
  );
}
