import { useInView } from '../hooks/useInView';
import SectionHeader from './SectionHeader';
import experiencesData from '../data/experiences.json';
import type { Experience as ExperienceEntry } from '../types';

const experiences = experiencesData as ExperienceEntry[];

const formatPeriod = (p: string) =>
  p.replace('July', 'Jul').replace('September', 'Sep').replace('January', 'Jan')
    .replace('February', 'Feb').replace('December', 'Dec').replace('June', 'Jun');

const companyShort = (c: string) => c.split(' - ')[0].trim();

/** Pulls a punchy lead clause out of the first bullet for the margin pull-quote —
 * a real pull quote restates body copy, it isn't new content. */
function pullQuote(description: string[]): string {
  const first = description[0] || '';
  const dashIdx = first.indexOf(' — ');
  return dashIdx > 0 ? first.slice(0, dashIdx) : first;
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="exp-bullets">
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}

function PwCDescriptionSections({ description }: { description: string[] }) {
  const sections = [
    { label: 'Audit & assurance', items: description.slice(0, 2) },
    { label: 'Controls consulting', items: description.slice(2, 4) },
    { label: 'Analytics & data', items: description.slice(4, 6) },
    { label: 'Internal tools', items: description.slice(6) },
  ];
  return (
    <>
      {sections.map(s => (
        <div key={s.label}>
          <div className="exp-sublabel">{s.label}</div>
          <BulletList items={s.items} />
        </div>
      ))}
    </>
  );
}

export default function Experience() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section id="work" ref={ref} className={`exp-bg reveal${inView ? ' visible' : ''}`}>
      <SectionHeader cmd="cat ./work" title="Work" />
      <div className="exp-list">
        {experiences.map(exp => (
          <div key={exp.id} className="exp-item stagger-child">
            <div>
              {exp.logo && (
                <div className="exp-logo-wrap">
                  <img
                    src={exp.logo}
                    alt={`${companyShort(exp.company)} logo`}
                    loading="lazy"
                    onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="exp-period">{formatPeriod(exp.period)}</div>
              <div className="exp-company">{companyShort(exp.company)}</div>
            </div>
            <div>
              <div className="exp-title">{exp.title}</div>
              {exp.tags.length > 0 && (
                <div className="exp-tags">
                  {exp.tags.map(t => <span className="exp-tag" key={t}>{t}</span>)}
                </div>
              )}
              {exp.id === 1
                ? <PwCDescriptionSections description={exp.description} />
                : <BulletList items={exp.description} />}
            </div>
            <blockquote className="exp-pullquote">{pullQuote(exp.description)}</blockquote>
          </div>
        ))}
      </div>
    </section>
  );
}
