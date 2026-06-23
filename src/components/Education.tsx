import { useInView } from '../hooks/useInView';
import SectionHeader from './SectionHeader';
import educationData from '../data/education.json';
import type { Education as EducationEntry } from '../types';

const education = educationData as EducationEntry[];

export default function Education() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section id="education" ref={ref} className={`edu-bg reveal${inView ? ' visible' : ''}`}>
      <SectionHeader cmd="cat ./background" title="Background" />
      <div className="edu-offset">
        {education.map(edu => (
          <div key={edu.id} className="edu-item stagger-child">
            <div>
              <div className="edu-period">{edu.period}</div>
              <div className="edu-school">{edu.institution}</div>
            </div>
            <div>
              <div className="edu-degree">{edu.degree}</div>
              {edu.gpa && <div className="edu-meta">GPA {edu.gpa}</div>}
              {edu.coursework && (
                <div className="edu-coursework">
                  <strong>Coursework:</strong>
                  {edu.coursework.split(' · ').map(c => (
                    <span className="edu-cw-cluster" key={c}>{c}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
