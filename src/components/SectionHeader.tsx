interface SectionHeaderProps {
  /** The terminal command shown above the title, e.g. "cat ./build". */
  cmd: string;
  title: string;
}

export default function SectionHeader({ cmd, title }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div className="section-cmd">
        <span className="pr">~ $</span>
        <span className="cmd">{cmd}</span>
      </div>
      <h2 className="section-title">{title}</h2>
      <div className="section-rule" aria-hidden="true" />
    </div>
  );
}
