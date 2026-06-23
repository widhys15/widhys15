import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import SectionHeader from './SectionHeader';
import TerminalLs from './TerminalLs';
import ProjectFlagship from './ProjectFlagship';
import ProjectDetail from './ProjectDetail';
import projectsData from '../data/projects.json';
import { statusMeta } from '../lib/status';
import type { Project } from '../types';

const projects = projectsData as Project[];

export default function Projects() {
  const flagship = projects.find(p => p.flagship);
  const others = projects.filter(p => !p.flagship);
  const [openId, setOpenId] = useState<string | null>(null);
  const cvUrl = `${import.meta.env.BASE_URL}data/CV_I Dewa Gde Widhy Suryana.pdf`;
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section id="projects" ref={ref} className={`projects-bg reveal${inView ? ' visible' : ''}`}>
      <SectionHeader cmd="ls ./build" title="Things I build" />
      <TerminalLs />
      {flagship && <ProjectFlagship project={flagship} />}
      <div className="proj-list">
        {others.map((p, i) => {
          const isOpen = openId === p.id;
          const st = statusMeta(p.status);
          return (
            <div className={`proj-list-item${isOpen ? ' open' : ''}`} key={p.id}>
              <button
                type="button"
                className="proj-list-trigger"
                onClick={() => setOpenId(isOpen ? null : p.id)}
                aria-expanded={isOpen}
              >
                <span className={`proj-list-status${st.active ? '' : ' done'}`}>
                  {st.mark} {st.label.toUpperCase()}
                </span>
                <span className="proj-list-title">{p.title}</span>
                <span className="proj-list-chevron">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && <ProjectDetail project={p} num={i + 2} />}
            </div>
          );
        })}
      </div>
      <div className="proj-cv-row">
        <a href={cvUrl} className="btn-ghost" target="_blank" rel="noopener">↓ download CV</a>
      </div>
    </section>
  );
}
