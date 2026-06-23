import { useEffect, useRef, useState } from 'react';

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Types `text` out one char at a time once `start` is true. Instant under reduced motion. */
export function useTypewriter(text: string, start: boolean, speed = 75) {
  const [out, setOut] = useState(() => (prefersReduced() ? text : ''));
  const started = useRef(false);

  useEffect(() => {
    if (!start || started.current) return;
    if (prefersReduced()) { setOut(text); return; }
    started.current = true;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [start, text, speed]);

  return out;
}
