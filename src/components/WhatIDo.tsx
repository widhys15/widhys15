import { useInView } from '../hooks/useInView';
import SectionHeader from './SectionHeader';

const PILLARS = [
  {
    cls: 'build', tag: '// build',
    title: 'I build things that get used',
    desc: 'Automations, tools, and side projects that actually ship — a live IDX trading dashboard, cloud APIs, IoT. If a process should be automated, I automate it.',
  },
  {
    cls: 'trade', tag: '// trade',
    title: 'I trade on a system',
    desc: 'Systematic swing trading on the Indonesia exchange and a copy-trading bot for perps. Rules and risk over hype and gut feel.',
  },
  {
    cls: 'audit', tag: '// audit',
    title: 'I audit by day',
    desc: 'IT controls audit & consulting at PwC, driven by AI and data analytics — I make systems more reliable, and that rigor makes the building sharper.',
  },
];

export default function WhatIDo() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section id="focus" ref={ref} className={`what-i-do reveal${inView ? ' visible' : ''}`}>
      <SectionHeader cmd="cat ./about" title="The short version" />
      <div className="wid-flow">
        {PILLARS.map(p => (
          <div className={`wid-block ${p.cls} stagger-child`} key={p.title}>
            <div className="wid-tag">{p.tag}</div>
            <h3 className="wid-title">{p.title}</h3>
            <p className="wid-desc">{p.desc}</p>
          </div>
        ))}
      </div>
      <div className="brand-block">
        <p>"Auditor's eye, builder's hands — I figure out how things <span>actually work</span>, then make them work better."</p>
      </div>
    </section>
  );
}
