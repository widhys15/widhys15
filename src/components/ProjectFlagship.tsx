import type { Project } from '../types';
import CaseStudyRows from './CaseStudyRows';
import ProjectLinksOrNote from './ProjectLinksOrNote';
import { statusMeta, titleCase } from '../lib/status';

/** Project ids whose real screenshot is ready. Others fall back to a clean placeholder. */
const READY_IMAGES = new Set<string>(['idx-screener']);

export default function ProjectFlagship({ project }: { project: Project }) {
  const st = statusMeta(project.status);
  const hasImg = READY_IMAGES.has(project.id) && Boolean(project.image);

  return (
    <div className="proj-flagship">
      <div className="proj-flagship-media">
        {hasImg ? (
          <img src={`${import.meta.env.BASE_URL}${project.image}`} alt={`${project.title} screenshot`} loading="lazy" />
        ) : (
          <div className="proj-flagship-ph" aria-hidden="true">
            <span className="proj-flagship-ph-glyph">◈</span>
            <span className="proj-flagship-ph-tag">// preview soon</span>
          </div>
        )}
      </div>
      <div className="proj-flagship-body">
        <div className="proj-flagship-eyebrow">Flagship project</div>
        <div className="proj-detail-meta">
          <span className="proj-detail-type">{project.type || project.group}</span>
          {st.active && <span className="proj-detail-badge wip">{st.mark} {titleCase(st.label)}</span>}
        </div>
        <h3 className="proj-flagship-title">{project.title}</h3>
        <p className="proj-flagship-desc">{project.description || project.summary}</p>
        <CaseStudyRows caseStudy={project.caseStudy} />
        {project.tags.length > 0 && (
          <div className="proj-detail-stack">
            {project.tags.map(t => <span key={t}>{t}</span>)}
          </div>
        )}
        <ProjectLinksOrNote project={project} />
      </div>
    </div>
  );
}
