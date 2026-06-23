import { useEffect, useRef } from 'react';

const INFLUENCE = 110;
const MAX_SCALE = 1.22;
const MAX_LIFT = 7;

/** macOS-dock-style proximity magnify — imperative transform writes on
 * pointermove, not React state, since this drives a continuous value. */
export function useDockMagnify<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const items = Array.from(container.querySelectorAll<HTMLElement>('.dock-item'));

    const onMove = (e: PointerEvent) => {
      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const dist = Math.abs(e.clientX - centerX);
        const t = Math.max(0, 1 - dist / INFLUENCE);
        item.style.transform = `translateY(${-MAX_LIFT * t}px) scale(${1 + (MAX_SCALE - 1) * t})`;
      }
    };
    const onLeave = () => {
      for (const item of items) item.style.transform = '';
    };

    container.addEventListener('pointermove', onMove);
    container.addEventListener('pointerleave', onLeave);
    return () => {
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return containerRef;
}
