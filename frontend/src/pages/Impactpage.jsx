import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FaArrowRight, FaDownload, FaGraduationCap, FaHeartbeat, FaLeaf, FaSeedling, FaHandHoldingHeart } from "react-icons/fa";
import Navbar from "../components/Navbar";
import '../components/coastal-fire.css';

const IMPACT_CSS = `
  .ip-hero { background:#043463; padding:clamp(8rem,15vh,11rem) var(--cp) clamp(4rem,7vh,6rem); position:relative; overflow:hidden; }
  .ip-ghost { position:absolute; font-family:'Bebas Neue',sans-serif; font-size:clamp(10rem,25vw,20rem); line-height:.85; color:rgba(238,76,5,.05); right:-3%; top:50%; transform:translateY(-50%); user-select:none; pointer-events:none; }
  .ip-slash { position:absolute; width:3px; background:#ee4c05; border-radius:2px; transform:rotate(12deg); transform-origin:top center; }

  /* Main stats grid */
  .ip-stats-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.5px; background:rgba(4,52,99,.1); }
  @media(min-width:768px){ .ip-stats-grid { grid-template-columns:repeat(4,1fr); } }
  .ip-stat-cell { background:#ffffff; padding:clamp(2rem,4vw,3rem) clamp(1.5rem,3vw,2.5rem); }
  .ip-stat-n { font-family:'Bebas Neue',sans-serif; font-size:clamp(2.5rem,6vw,4.5rem); line-height:1; letter-spacing:.02em; transition:transform .3s; }
  .ip-stat-cell:hover .ip-stat-n { transform:scale(1.04); }
  .ip-stat-l { font-size:.65rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:#043463; margin-top:.5rem; }
  .ip-stat-sub { font-size:.75rem; color:#0e7fbb; margin-top:.25rem; }

  /* Pillar impact */
  .ip-pillar-grid { display:grid; grid-template-columns:1fr; gap:1.25rem; }
  @media(min-width:640px){ .ip-pillar-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:1100px){ .ip-pillar-grid { grid-template-columns:repeat(3,1fr); } }
  .ip-pillar-card { background:#ffffff; border:1px solid rgba(4,52,99,.1); padding:clamp(1.5rem,3vw,2.5rem); position:relative; overflow:hidden; transition:transform .3s,box-shadow .3s,border-color .25s; }
  .ip-pillar-card:hover { transform:translateY(-4px); box-shadow:0 20px 40px rgba(4,52,99,.08); border-color:var(--c,#ee4c05); }
  .ip-pillar-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--c,#ee4c05); transition:width .3s; }
  .ip-pillar-card:hover::before { width:5px; }
  .ip-pc-icon { width:44px; height:44px; border-radius:2px; display:flex; align-items:center; justify-content:center; font-size:1.25rem; margin-bottom:1.25rem; }
  .ip-pc-h3 { font-family:'Bebas Neue',sans-serif; font-size:1.5rem; letter-spacing:.04em; color:#043463; margin-bottom:1rem; }
  .ip-pc-stats { display:flex; flex-direction:column; gap:.5rem; }
  .ip-pc-stat-row { display:flex; align-items:baseline; gap:.5rem; }
  .ip-pc-num { font-family:'Bebas Neue',sans-serif; font-size:1.75rem; line-height:1; letter-spacing:.02em; }
  .ip-pc-unit { font-size:.65rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase; color:#0e7fbb; }

  /* Stories grid */
  .ip-stories-grid { display:grid; grid-template-columns:1fr; gap:1.25rem; }
  @media(min-width:640px){ .ip-stories-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:1024px){ .ip-stories-grid { grid-template-columns:repeat(3,1fr); } }
  .ip-story-card { background:#ffffff; border:1px solid rgba(4,52,99,.1); border-radius:2px; overflow:hidden; display:flex; flex-direction:column; transition:transform .3s,box-shadow .3s,border-color .25s; height:100%; }
  .ip-story-card:hover { transform:translateY(-4px); box-shadow:0 20px 40px rgba(4,52,99,.08); border-color:#ee4c05; }
  .ip-story-img { width:100%; aspect-ratio:16/9; object-fit:cover; background:#f0f4f8; }
  .ip-story-body { padding:1.5rem; flex:1; display:flex; flex-direction:column; gap:.75rem; }
  .ip-story-cat { font-size:.58rem; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:#ee4c05; }
  .ip-story-h4 { font-family:'Bebas Neue',sans-serif; font-size:1.25rem; letter-spacing:.04em; color:#043463; line-height:1.1; }
  .ip-story-p  { font-size:.825rem; color:#4a5568; line-height:1.75; flex:1; }

  /* Reports */
  .ip-report-item { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.25rem; background:#ffffff; border:1px solid rgba(4,52,99,.1); border-radius:2px; flex-wrap:wrap; transition:border-color .2s; }
  .ip-report-item:hover { border-color:rgba(238,76,5,.5); }
  .ip-report-info { display:flex; align-items:center; gap:1rem; }
  .ip-report-icon { font-size:1.5rem; color:#ee4c05; flex-shrink:0; }
  .ip-report-h4 { font-family:'Bebas Neue',sans-serif; font-size:1.125rem; letter-spacing:.04em; color:#043463; }
  .ip-report-meta { font-size:.72rem; color:#0e7fbb; margin-top:.2rem; }

  /* Reveal */
  .ip-rv { opacity:0; transform:translateY(24px); transition:opacity .7s ease,transform .7s ease; }
  .ip-rv.in { opacity:1; transform:none; }
`;

function useCountUp(target, delay=0) {
  const [val, setVal] = useState(0);
  const [go, setGo]   = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGo(true); obs.disconnect(); } }, { threshold:.4 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!go) return; let raf;
    const tid = setTimeout(() => {
      const t0 = performance.now(), dur = 2200;
      const tick = now => {
        const p = Math.min((now-t0)/dur, 1);
        setVal(Math.floor((1-Math.pow(1-p,4))*target));
        if (p<1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(tid); cancelAnimationFrame(raf); };
  }, [go, target, delay]);
  return { ref, val };
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); obs.disconnect(); } }, { threshold:.08 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return ref;
}

const Reveal = ({ children, delay=0, style={} }) => {
  const ref = useReveal();
  return <div ref={ref} className="ip-rv" style={{ transitionDelay:`${delay}ms`,...style }}>{children}</div>;
};

const StatCell = ({ n, s, l, sub, col, delay=0 }) => {
  const isNum = typeof n === "number";
  const { ref, val } = useCountUp(isNum ? n : 0, delay);
  return (
    <div ref={ref} className="ip-stat-cell">
      <div className="ip-stat-n" style={{ color:col }}>{isNum ? `${val.toLocaleString()}${s}` : n}</div>
      <div className="ip-stat-l">{l}</div>
      {sub && <div className="ip-stat-sub">{sub}</div>}
    </div>
  );
};

// Hardcode the visual/static parts of the Pillars
const FIXED_PILLARS = [
  { id: "Education", icon: <FaGraduationCap/>, title: "Education", color: "#ee4c05", bg: "rgba(238,76,5,.1)" },
  { id: "Health", icon: <FaHeartbeat/>, title: "Health", color: "#0e7fbb", bg: "rgba(14,127,187,.1)" },
  { id: "Environment", icon: <FaLeaf/>, title: "Environment", color: "#46c5e4", bg: "rgba(70,197,228,.1)" },
  { id: "Agribusiness", icon: <FaSeedling/>, title: "Agribusiness", color: "#043463", bg: "rgba(4,52,99,.1)" },
  { id: "Disaster Response", icon: <FaHandHoldingHeart/>, title: "Disaster Response", color: "#ee4c05", bg: "rgba(238,76,5,.1)" },
];

export default function ImpactPage() {
  const [data, setData] = useState({
    bigStats: [],
    pillarStats: {}, 
    stories: [],
    reports: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make sure this matches your Django server's URL
    fetch('https://imarikafoundation.org/api/api/api/impact-data/') 
      .then(res => res.json())
      .then(fetchedData => {
        setData({
          bigStats: fetchedData.big_stats || [],
          pillarStats: fetchedData.pillar_stats || {},
          stories: fetchedData.stories || [],
          reports: fetchedData.reports || []
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching impact data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: "5rem", textAlign: "center", fontFamily: "'Outfit', sans-serif" }}>Loading Impact Data...</div>;

  return (
    <div className="cf-root">
      <style>{IMPACT_CSS}</style>
      <Helmet><title>Our Impact · Imarika Foundation</title></Helmet>
      <Navbar />

      {/* Hero */}
      <section className="ip-hero">
        <div className="ip-ghost" aria-hidden="true">IMPACT</div>
        <div className="ip-slash" style={{ height:"clamp(80px,12vh,130px)", right:"clamp(1.5rem,8vw,6rem)", top:"50%" }} aria-hidden="true" />
        <div className="ip-slash" style={{ height:"clamp(50px,7vh,80px)", right:"clamp(3rem,11vw,9.5rem)", top:"52%", opacity:.35 }} aria-hidden="true" />
        <div style={{ maxWidth:700, position:"relative", zIndex:1 }}>
          <span className="cf-label" style={{ color:"#46c5e4" }}>Results &amp; Impact</span>
          <h1 className="cf-h1" style={{ color:"#fff" }}>
            NUMBERS THAT<br/><span style={{ color:"#ee4c05" }}>MATTER.</span>
          </h1>
          <p style={{ color:"#46c5e4", fontSize:"clamp(.9rem,1.8vw,1.05rem)", lineHeight:1.8, marginTop:"1.5rem", maxWidth:520 }}>
            Every stat represents a real person whose life has changed. Here is what Imarika Foundation has accomplished since 2015.
          </p>
        </div>
      </section>

      {/* Big stats */}
      <section style={{ background:"#f0f4f8" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <div className="ip-stats-grid">
            {data.bigStats.map((s, i) => (
              <StatCell 
                key={s.id || s.label} 
                n={s.number} 
                s={s.suffix} 
                l={s.label} 
                sub={s.sub_label} 
                col={s.color} 
                delay={i*100} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Per-pillar breakdown */}
      <section style={{ background:"#ffffff", padding:"var(--cv) var(--cp)" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <Reveal>
            <span className="cf-label cf-label-dark">By Programme Area</span>
            <h2 className="cf-h2d" style={{ marginBottom:"clamp(2.5rem,5vw,4rem)", color:"#043463" }}>
              IMPACT BY <span style={{ color:"#ee4c05" }}>PILLAR.</span>
            </h2>
          </Reveal>
          <div className="ip-pillar-grid">
            {FIXED_PILLARS.map((p, i) => {
              const dynamicStats = data.pillarStats[p.id] || [];

              return (
                <Reveal key={p.id} delay={i*80}>
                  <div className="ip-pillar-card" style={{ "--c":p.color }}>
                    <div className="ip-pc-icon" style={{ background:p.bg, color:p.color }}>{p.icon}</div>
                    <h3 className="ip-pc-h3">{p.title}</h3>
                    <div className="ip-pc-stats">
                      {dynamicStats.length > 0 ? (
                        dynamicStats.map((s, idx) => (
                          <div key={idx} className="ip-pc-stat-row">
                            <span className="ip-pc-num" style={{ color:p.color }}>{s.number}</span>
                            <span className="ip-pc-unit">{s.unit}</span>
                          </div>
                        ))
                      ) : (
                        <span style={{ fontSize: '.8rem', color: '#888' }}>Updating stats...</span>
                      )}
                    </div>
                    <Link to={`/programs`} style={{ display:"inline-flex", alignItems:"center", gap:".5rem", marginTop:"1.25rem", fontSize:".65rem", fontWeight:800, letterSpacing:".12em", textTransform:"uppercase", color:p.color, textDecoration:"none" }}>
                      View Programmes <FaArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success stories */}
      <section style={{ background:"#f0f4f8", padding:"var(--cv) var(--cp)" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <Reveal>
            <span className="cf-label cf-label-dark">Stories</span>
            <h2 className="cf-h2d" style={{ marginBottom:"clamp(2.5rem,5vw,4rem)", color:"#043463" }}>
              SUCCESS <span style={{ color:"#ee4c05" }}>STORIES.</span>
            </h2>
          </Reveal>
          <div className="ip-stories-grid">
            {data.stories.map((s, i) => (
              <Reveal key={s.id || s.title} delay={i*80} style={{ height: "100%" }}> 
                <article className="ip-story-card">
                  <div className="ip-story-img" style={{ background:"#e5e7eb", display:"flex", alignItems:"center", justifyContent:"center" }} aria-hidden="true">
                    {s.image ? (
                      <img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"3rem", color:"rgba(4,52,99,.1)" }}>{s.category.charAt(0)}</span>
                    )}
                  </div>
                  <div className="ip-story-body">
                    <div className="ip-story-cat">{s.category}</div>
                    <h4 className="ip-story-h4">{s.title}</h4>
                    <p className="ip-story-p" style={{ whiteSpace: "pre-line" }}>{s.body}</p>
                    <Link to="/articles" style={{ display:"inline-flex", alignItems:"center", gap:".5rem", fontSize:".65rem", fontWeight:800, letterSpacing:".12em", textTransform:"uppercase", color:"#ee4c05", textDecoration:"none", marginTop:"auto" }}>
                      Read More <FaArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Annual reports */}
      <section style={{ background:"#ffffff", padding:"var(--cv) var(--cp)" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <Reveal>
            <span className="cf-label cf-label-dark">Downloads</span>
            <h2 className="cf-h2d" style={{ marginBottom:"clamp(2.5rem,5vw,4rem)", color:"#043463" }}>
              ANNUAL <span style={{ color:"#ee4c05" }}>REPORTS.</span>
            </h2>
          </Reveal>
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            {data.reports.map((r, i) => (
              <Reveal key={r.id || r.title} delay={i*70}>
                <div className="ip-report-item">
                  <div className="ip-report-info">
                    <FaDownload className="ip-report-icon" aria-hidden="true" />
                    <div>
                      <div className="ip-report-h4">{r.title}</div>
                      <div className="ip-report-meta">{r.meta_text}</div>
                    </div>
                  </div>
                  {r.file ? (
                    <a href={r.file} download target="_blank" rel="noopener noreferrer" className="cf-btn cf-btn-orange" style={{ clipPath:"polygon(8px 0%,100% 0%,calc(100%-8px) 100%,0% 100%)" }}>
                      <FaDownload aria-hidden="true" /> Download
                    </a>
                  ) : (
                    <span style={{ fontSize:".72rem", color:"#0e7fbb", fontFamily:"'Outfit',sans-serif", fontWeight:"600" }}>Coming soon</span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:"#043463", padding:"2rem var(--cp)", textAlign:"center", borderTop:"1px solid rgba(255,255,255,.1)" }}>
        <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:".72rem", color:"rgba(255,255,255,.7)" }}>
          © {new Date().getFullYear()} Imarika Foundation · Kenya
        </p>
      </footer>
    </div>
  );
}