import { certificates } from '../data/certificates';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/effects/Reveal';

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
              <h3 style={{ marginTop: '1rem' }}>{cert.title}</h3>
              <p>Issued by {cert.issuer}</p>
              <div className="cert-meta">
                <span>{cert.issuer}</span>
                <span>{cert.year}</span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
