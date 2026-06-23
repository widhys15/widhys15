import { useEffect, useState } from 'react';

const SESSION_KEY = 'portfolio-loaded';
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => window.matchMedia('(max-width: 600px)').matches;

/**
 * Terminal "boot" on the paper canvas, then a clip wipe into the hero.
 * Runs once per session (sessionStorage). Capped at 1.2s desktop / 0.8s mobile;
 * the counter is faked and always resolves at 100%. Skipped entirely (no flash)
 * when already shown or under prefers-reduced-motion.
 */
export default function LoadingScreen() {
  const [skip] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1' || prefersReducedMotion(),
  );
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(skip);
  const [removed, setRemoved] = useState(skip);

  useEffect(() => {
    if (skip) return;
    document.body.style.overflow = 'hidden';
    const duration = isMobile() ? 800 : 1200;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 2)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };

    const finish = () => {
      sessionStorage.setItem(SESSION_KEY, '1');
      document.body.style.overflow = '';
      setDone(true);
      setTimeout(() => setRemoved(true), 800); // after the curtain wipe
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, [skip]);

  if (removed) return null;

  return (
    <div className={`loader${done ? ' done' : ''}`} aria-hidden="true">
      <div className="loader-term">
        <div><span className="ok">~ $</span> ./widhy.sh</div>
        <div><span className="ink">booting widhy@jkt</span> … {count}%</div>
        <div className="loader-bar"><span style={{ width: `${count}%` }} /></div>
        <div>{count >= 100
          ? <><span className="ok">ready</span><span className="cursor" /></>
          : 'loading build environment…'}</div>
      </div>
    </div>
  );
}
