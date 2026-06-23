import { useInView } from '../hooks/useInView';
import SectionHeader from './SectionHeader';

export default function Contact() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section id="contact" ref={ref} className={`contact reveal${inView ? ' visible' : ''}`}>
      <SectionHeader cmd="./contact" title="Say hi" />
      <div className="contact-grid">
        <div>
          <p className="contact-intro">
            Whether it's about <strong>building something</strong>, a role, markets talk, or just the best <strong>coffee in Jakarta</strong> — I'm happy to connect.
          </p>
          <div className="contact-open">
            open to:<br />
            <span>→ roles in audit, risk &amp; data</span><br />
            <span>→ building something together</span><br />
            <span>→ trading &amp; markets talk</span><br />
            <span>→ a good coffee in Jakarta</span>
          </div>
        </div>
        <div className="contact-links">
          <a className="contact-link-item" href="mailto:widhys15@gmail.com">
            <div><div className="cli-label">Email</div><div className="cli-value">widhys15@gmail.com</div></div>
            <div className="cli-arrow">↗</div>
          </a>
          <a className="contact-link-item" href="https://www.linkedin.com/in/widhys/" target="_blank" rel="noopener">
            <div><div className="cli-label">LinkedIn</div><div className="cli-value">linkedin.com/in/widhys</div></div>
            <div className="cli-arrow">↗</div>
          </a>
          <a className="contact-link-item" href="https://github.com/widhys15" target="_blank" rel="noopener">
            <div><div className="cli-label">GitHub</div><div className="cli-value">github.com/widhys15</div></div>
            <div className="cli-arrow">↗</div>
          </a>
          <a className="contact-link-item" href="https://medium.com/@shadowwidhy" target="_blank" rel="noopener">
            <div><div className="cli-label">Medium</div><div className="cli-value">medium.com/@shadowwidhy</div></div>
            <div className="cli-arrow">↗</div>
          </a>
        </div>
      </div>
    </section>
  );
}
