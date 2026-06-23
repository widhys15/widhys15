import { useDockMagnify } from '../hooks/useDockMagnify';
import { useScrollSpy } from '../hooks/useScrollSpy';

interface DockEntry {
  id: string;
  glyph: string;
  label: string;
}

interface DockProps {
  items: DockEntry[];
}

export default function Dock({ items }: DockProps) {
  const dockRef = useDockMagnify<HTMLDivElement>();
  const activeId = useScrollSpy(items.map(i => i.id));

  return (
    <nav className="dock" ref={dockRef} aria-label="Sections">
      {items.map(item => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`dock-item${activeId === item.id ? ' active' : ''}`}
        >
          <span className="dock-glyph">{item.glyph}</span>
          <span className="dock-label">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
