import { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useTypewriter } from '../hooks/useTypewriter';

const FILES = [
  'idx-screener/', 'hyperliquid-bot/', 'ai-finance.spark', 'iot-garden/',
  'promosee/', 'enterprise-arch.bpmn', 'budgetbuddies/', 'cpu-gpu-api/',
];

/** Decorative console block that types `ls ~/build` then lists the projects. */
export default function TerminalLs() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const [start, setStart] = useState(false);
  useEffect(() => { if (inView) setStart(true); }, [inView]);
  const typed = useTypewriter('ls ~/build', start);
  const done = typed === 'ls ~/build';

  return (
    <div className="termls" ref={ref} aria-hidden="true">
      <div className="termls-cmd">
        <span className="pr">~ $</span>{typed}<span className="cursor" />
      </div>
      <div className={`termls-out${done ? ' show' : ''}`}>
        {FILES.map(f => <span key={f}>{f}</span>)}
      </div>
    </div>
  );
}
