import type { Project } from '../types';

const LINK_DEFS: { key: 'code' | 'demo' | 'doc' | 'website'; label: string }[] = [
  { key: 'code', label: 'Code' },
  { key: 'demo', label: 'Demo' },
  { key: 'doc', label: 'Docs' },
  { key: 'website', label: 'Website' },
];

export default function ProjectLinksOrNote({ project }: { project: Project }) {
  const links = LINK_DEFS.filter(d => project[d.key]);
  if (links.length) {
    return (
      <div className="proj-detail-links">
        {links.map(d => (
          <a href={project[d.key]} className="project-link" target="_blank" rel="noopener" key={d.key}>
            ↗ {d.label}
          </a>
        ))}
      </div>
    );
  }
  return project.note ? <p className="proj-note">{project.note}</p> : null;
}
