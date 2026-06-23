import { Fragment } from 'react';
import { useInView } from '../hooks/useInView';
import SectionHeader from './SectionHeader';
import skillsData from '../data/skills.json';
import type { SkillsData } from '../types';

const data = skillsData as SkillsData;

const HI_GOV = new Set(['ITGC / ITAC testing', 'ICFR (BPM & RCM design)', 'Audit analytics & CAATs']);
const HI_DATA = new Set(['Python (Pandas, NumPy)', 'PySpark', 'SQL', 'Alteryx']);
const HI_CLOUD = new Set(['Google Cloud (Skill Badges)', 'Cloudera']);

function isHighlighted(skill: string, categoryIndex: number): boolean {
  if (categoryIndex === 0) return HI_GOV.has(skill);
  if (categoryIndex === 1) return HI_DATA.has(skill);
  if (categoryIndex === 2) return HI_CLOUD.has(skill);
  return false;
}

export default function Skills() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section id="skills" ref={ref} className={`skills-bg reveal${inView ? ' visible' : ''}`}>
      <SectionHeader cmd="cat ./toolkit" title="Toolkit" />
      <div className="skills-list">
        {data.professionalSkills.map((cat, i) => (
          <div key={cat.category} className="skill-row stagger-child">
            <div className="skill-cat-title">{cat.category}</div>
            <p className="skill-line">
              {cat.skills.map((s, idx) => (
                <Fragment key={s}>
                  <span className={isHighlighted(s, i) ? 'skill-hi' : undefined}>{s}</span>
                  {idx < cat.skills.length - 1 ? ' · ' : ''}
                </Fragment>
              ))}
            </p>
          </div>
        ))}
      </div>

      {data.credentials.length > 0 && (
        <>
          <div className="subsection-label">Credentials</div>
          <div className="cred-list">
            {data.credentials.map(c => (
              <div key={c.title} className="cred-row">
                <div className="cred-title">{c.title}</div>
                <div className="cred-meta">{c.date} · {c.issuer}</div>
                {c.url && <a href={c.url} className="project-link" target="_blank" rel="noopener">↗ Verify</a>}
              </div>
            ))}
          </div>
        </>
      )}

      {data.honorsAwards.length > 0 && (
        <>
          <div className="subsection-label">Honors &amp; Awards</div>
          <div className="cred-list">
            {data.honorsAwards.map(h => (
              <div key={h.title} className="cred-row">
                <div className="cred-title">{h.title}</div>
                <div className="cred-meta">{h.date} · {h.issuer}</div>
                <div className="cred-desc" dangerouslySetInnerHTML={{ __html: h.description }} />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
