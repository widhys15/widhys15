import { useEffect, useState } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

const PORTRAIT = `${import.meta.env.BASE_URL}images/widhy.jpg`;

export default function Hero() {
  // The prompt types itself out on load, then the rest fades up beneath it.
  const [start, setStart] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStart(true), 450);
    return () => clearTimeout(t);
  }, []);
  const typed = useTypewriter('whoami', start);

  return (
    <section id="hero" className="hero">
      <div className="hero-grid">
        <div className="hero-inner">
          <div className="hero-prompt">
            <b>~ $</b>{typed}<span className="cursor" aria-hidden="true" />
          </div>

          <h1 aria-label="I Dewa Gde Widhy Suryana — audit by day, build by night">
            <span className="hero-name">I Dewa Gde Widhy Suryana</span>
            <span className="hero-tagline" aria-hidden="true">
              Audit by day.<br />
              <span className="hl">Build</span> by night.
            </span>
          </h1>

          <p className="hero-brand">
            <strong>IT controls audit &amp; consulting at PwC</strong>, driven by AI and data analytics.
            After hours, I build my own market screeners, trading bots, and automation.
          </p>

          <div className="hero-meta">
            <span><b>loc</b> Jakarta, ID</span>
            <span><b>fuel</b> coffee</span>
            <span><b>stack</b> python · react · spark</span>
          </div>

          <div className="hero-ctas">
            <a href="#projects" className="btn-primary">view build</a>
            <a href="#contact" className="btn-ghost">say hi</a>
          </div>
        </div>

        <figure className="hero-portrait">
          <span className="hero-portrait-frame">
            <img className="hero-portrait-img" src={PORTRAIT} alt="I Dewa Gde Widhy Suryana" width={1050} height={1400} />
            <figcaption className="hero-portrait-cap">widhy · jkt · &rsquo;26</figcaption>
          </span>
        </figure>
      </div>

      {/* Duotone filter for the portrait: luminance → blue-shadow / cream-highlight. */}
      <svg className="svg-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="duotone" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"
          />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.05 0.18 0.86" />
            <feFuncG type="table" tableValues="0.16 0.46 0.97" />
            <feFuncB type="table" tableValues="0.22 0.54 0.99" />
          </feComponentTransfer>
        </filter>
      </svg>
    </section>
  );
}
