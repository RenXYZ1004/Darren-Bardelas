import { Reveal } from '../effects/Reveal';

export function SectionHeader({ title, subtitle }) {
  return (
    <header>
      <Reveal as="h1" className="page-title" direction="right">
        {title}
      </Reveal>
      <Reveal className="title-rule" direction="right" delay={0.08} />
      {subtitle && (
        <Reveal as="p" className="page-subtitle" delay={0.14}>
          {subtitle}
        </Reveal>
      )}
    </header>
  );
}
