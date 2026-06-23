import type { Project } from '../types';
import CaseStudyRows from './CaseStudyRows';
import ProjectLinksOrNote from './ProjectLinksOrNote';
import { statusMeta, titleCase } from '../lib/status';

export default function ProjectDetail({ project, num }: { project: Project; num: number }) {
  const st = statusMeta(project.status);
  const isPwC = project.id.includes('pwc');
  const badge = st.active
    ? <span className="proj-detail-badge wip">{st.mark} {titleCase(st.label)}</span>
    : isPwC ? <span className="proj-detail-badge pwc">PwC engagement</span> : null;

  return (
    <div className="proj-detail-inner">
      <div className="proj-detail-num">{String(num).padStart(2, '0')}</div>
      <div className="proj-detail-meta">
        <span className="proj-detail-type">{project.type || project.group || ''}</span>
        {badge}
      </div>
      <h3 className="proj-detail-title">{project.title}</h3>
      <p className="proj-detail-desc">{project.description || project.summary}</p>
      <CaseStudyRows caseStudy={project.caseStudy} />
      {project.tags.length > 0 && (
        <div className="proj-detail-stack">
          {project.tags.map(t => <span key={t}>{t}</span>)}
        </div>
      )}
      <ProjectLinksOrNote project={project} />
    </div>
  );
}
