import type { CaseStudy } from '../types';

export default function CaseStudyRows({ caseStudy }: { caseStudy?: CaseStudy }) {
  if (!caseStudy) return null;
  const rows = [
    { label: 'Context', text: caseStudy.context },
    { label: 'My role', text: caseStudy.role },
    { label: 'Outcome', text: caseStudy.outcome },
  ].filter((r): r is { label: string; text: string } => Boolean(r.text));
  if (!rows.length) return null;

  return (
    <div className="proj-detail-case">
      {rows.map(r => (
        <div className="case-row" key={r.label}>
          <span className="case-label">{r.label}</span>
          <span className="case-text">{r.text}</span>
        </div>
      ))}
    </div>
  );
}
