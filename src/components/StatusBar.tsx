import { useClock } from '../hooks/useClock';

/** The terminal spine: a fixed top status line with a live Jakarta clock. */
export default function StatusBar() {
  const time = useClock('Asia/Jakarta');

  return (
    <div className="statusbar" role="status" aria-label="Status">
      <div className="statusbar-l">
        <span className="statusbar-host">widhy@jkt</span>
        <span className="statusbar-sep">·</span>
        <span className="statusbar-tagline">audit by day / build by night</span>
      </div>
      <div className="statusbar-r">
        <span className="statusbar-clock">{time} WIB</span>
        <span className="statusbar-sep">·</span>
        <span className="statusbar-status"><span className="statusbar-dot" aria-hidden="true" />open to build</span>
      </div>
    </div>
  );
}
