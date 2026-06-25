import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FaArrowRight, FaArrowDown, FaGraduationCap, FaHeartbeat, FaLeaf, FaSeedling, FaHandHoldingHeart, FaTimes } from "react-icons/fa";
import Navbar from "../components/Navbar";
import '../components/coastal-fire.css';

// We leave the static 'stat' in here just as a fallback while the API loads
const PILLARS = [
  { slug: "education", icon: <FaGraduationCap />, title: "Education", tagline: "Unlocking potential through learning", desc: "We believe education is the most powerful tool for community transformation. Our education programmes span scholarships, digital literacy, vocational training, and life-skills mentorship.", color: "#f97316", bg: "rgba(249,115,22,.1)", stat: "Updating..." },
  { slug: "health", icon: <FaHeartbeat />, title: "Health", tagline: "Healthy communities, stronger futures", desc: "Access to quality healthcare remains out of reach for many. Our health programmes run community camps, mentorship initiatives, and hygiene drives that have served over 10,000 people.", color: "#ef4444", bg: "rgba(239,68,68,.1)", stat: "Updating..." },
  { slug: "agribusiness", icon: <FaSeedling />, title: "Agribusiness", tagline: "Growing food, growing incomes", desc: "We equip farmers and youth with the skills, knowledge, and market linkages to turn agriculture into a sustainable livelihood and food security solution.", color: "#eab308", bg: "rgba(234,179,8,.1)", stat: "Updating..." },
  { slug: "environment", icon: <FaLeaf />, title: "Environment", tagline: "Protecting our planet for the next generation", desc: "The coastal environment is both a resource and a risk. We work with communities to restore ecosystems, manage waste, and build climate resilience.", color: "#22c55e", bg: "rgba(34,197,94,.1)", stat: "Updating..." },
  { slug: "disaster-response", icon: <FaHandHoldingHeart />, title: "Disaster Response", tagline: "Ready, resilient, and supported", desc: "When crises strike, Imarika Foundation is on the ground. From pandemic response to flood relief, we mobilise quickly to support the most vulnerable communities.", color: "#3b82f6", bg: "rgba(59,130,246,.1)", stat: "Updating..." },
];

const PROG_CSS = `
  .pg-hero { background:#043463; padding:clamp(8rem,15vh,11rem) var(--cp) clamp(4rem,7vh,6rem); position:relative; overflow:hidden; }
  .pg-hero-ghost { position:absolute; font-family:'Bebas Neue',sans-serif; font-size:clamp(10rem,25vw,20rem); line-height:.85; color:rgba(255,255,255,0.03); right:-3%; top:50%; transform:translateY(-50%); user-select:none; pointer-events:none; }
  .pg-hero-slash { position:absolute; width:3px; border-radius:2px; transform:rotate(12deg); transform-origin:top center; }
  .pg-pillar-grid { display:grid; grid-template-columns:1fr; gap:1.5px; background:#e2e8f0; align-items: stretch; }
  @media(min-width:480px){ .pg-pillar-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:1000px){ .pg-pillar-grid { grid-template-columns:repeat(5,1fr); } }
  .pg-pillar-grid .pg-rv { display:flex; flex-direction:column; height:100%; }
  .pg-pillar-grid [role="listitem"] { display:flex; flex-direction:column; flex:1; height:100%; width:100%; }
  .pg-pillar-card { flex:1; background:#ffffff; padding:clamp(2rem,4vw,3rem) clamp(1.5rem,3vw,2rem); display:flex; flex-direction:column; gap:1.25rem; cursor:pointer; border:none; text-align:left; width:100%; position:relative; overflow:hidden; transition:transform .3s,box-shadow .3s; }
  .pg-pillar-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--pc,#ee4c05); transition:width .3s; }
  .pg-pillar-card:hover, .pg-pillar-card.active { transform:translateY(-4px); box-shadow:0 20px 40px rgba(4,52,99,0.1); z-index:2; }
  .pg-pillar-card.active::before { width:5px; }
  .pg-pillar-card:hover::before  { width:5px; }
  .pg-pillar-card:focus-visible  { outline:2px solid #ee4c05; outline-offset:-2px; z-index:2; }
  .pg-pillar-icon { width:48px; height:48px; border-radius:2px; display:flex; align-items:center; justify-content:center; font-size:1.375rem; flex-shrink:0; }
  .pg-pillar-h3   { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.375rem,3vw,1.75rem); letter-spacing:.04em; line-height:1; transition:color .3s; }
  .pg-pillar-sub  { font-size:.75rem; color:#64748b; line-height:1.6; }
  .pg-pillar-stat { font-size:.62rem; font-weight:800; letter-spacing:.15em; text-transform:uppercase; margin-top: auto; }
  .pg-pillar-cta  { display:flex; align-items:center; gap:.5rem; font-size:.68rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; transition:gap .2s; }
  .pg-pillar-card:hover .pg-pillar-cta, .pg-pillar-card.active .pg-pillar-cta { gap:.875rem; }
  .pg-sub-panel { background:#f8fafc; border-top:3px solid var(--pnl-col,#ee4c05); overflow:hidden; max-height:0; transition:max-height .45s cubic-bezier(.4,0,.2,1), opacity .3s ease; opacity:0; }
  .pg-sub-panel.open { max-height:1000px; opacity:1; }
  .pg-sub-inner { padding:clamp(2rem,5vw,4rem) var(--cp); }
  .pg-sub-header { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1.5rem; margin-bottom:clamp(2rem,4vw,3rem); }
  .pg-sub-h2 { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.75rem,4vw,3rem); letter-spacing:.04em; }
  .pg-sub-close { display:flex; align-items:center; gap:.5rem; background:#ffffff; border:1px solid #cbd5e1; color:#475569; font-family:'Outfit',sans-serif; font-size:.68rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:.55rem 1rem; cursor:pointer; border-radius:2px; transition:all .2s; }
  .pg-sub-close:hover { background:rgba(239,68,68,.1); color:#ef4444; border-color:rgba(239,68,68,.3); }
  .pg-prog-grid { display:grid; grid-template-columns:1fr; gap:1.25rem; }
  @media(min-width:640px){ .pg-prog-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:1100px){ .pg-prog-grid { grid-template-columns:repeat(4,1fr); } }
  .pg-prog-card { background:#ffffff; border:1px solid #e2e8f0; padding:1.75rem 1.5rem; display:flex; flex-direction:column; gap:1rem; text-decoration:none; transition:border-color .25s,transform .3s,box-shadow .3s; position:relative; overflow:hidden; }
  .pg-prog-card:hover { border-color:var(--pc,#ee4c05); transform:translateY(-3px); box-shadow:0 16px 32px rgba(4,52,99,.08); }
  .pg-prog-card:focus-visible { outline:2px solid #ee4c05; outline-offset:2px; }
  .pg-prog-emoji { font-size:2rem; }
  .pg-prog-h4 { font-family:'Bebas Neue',sans-serif; font-size:1.125rem; letter-spacing:.04em; color:#043463; line-height:1.1; flex:1; }
  .pg-prog-desc { font-size:.78rem; color:#475569; line-height:1.75; }
  .pg-prog-cta { display:flex; align-items:center; gap:.5rem; font-size:.65rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; margin-top:auto; transition:gap .2s; }
  .pg-prog-card:hover .pg-prog-cta { gap:.875rem; }
  .pg-rv { opacity:0; transform:translateY(24px); transition:opacity .7s ease,transform .7s ease; }
  .pg-rv.in { opacity:1; transform:none; }
`;

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
  return <div ref={ref} className="pg-rv" style={{ transitionDelay:`${delay}ms`, ...style }}>{children}</div>;
};

export default function ProgramsPage() {
  const [activePillar, setActivePillar] = useState(null);
  const [dynamicPrograms, setDynamicPrograms] = useState({});
  const [impactStats, setImpactStats] = useState({}); // New state for dynamic pillar stats
  const panelRef = useRef(null);

  useEffect(() => {
    // 1. Fetch dynamic sub-programmes
    fetch('https://imarikafoundation.org/api/api/api/programs-data/') 
      .then(res => res.json())
      .then(data => setDynamicPrograms(data))
      .catch(err => console.error("Error fetching programs data:", err));

    // 2. Fetch the impact stats to get those top-level numbers (e.g. "160 Scholars")
    fetch('https://imarikafoundation.org/api/api/api/impact-data/')
      .then(res => res.json())
      .then(data => setImpactStats(data.pillar_stats || {}))
      .catch(err => console.error("Error fetching impact data:", err));
  }, []);

  const handlePillarClick = (slug) => {
    const isSame = activePillar === slug;
    setActivePillar(isSame ? null : slug);
    if (!isSame) {
      setTimeout(() => panelRef.current?.scrollIntoView({ behavior:"smooth", block:"nearest" }), 50);
    }
  };

  const currentPillar = PILLARS.find(p => p.slug === activePillar);
  const activeSubPrograms = currentPillar ? (dynamicPrograms[currentPillar.slug] || []) : [];

  return (
    <div className="cf-root">
      <style>{PROG_CSS}</style>
      <Helmet><title>Our Programs · Imarika Foundation</title></Helmet>
      <Navbar />

      <section className="pg-hero">
        <div className="pg-hero-ghost" aria-hidden="true">PROGRAMS</div>
        <div className="pg-hero-slash" style={{ height:"clamp(80px,12vh,130px)", right:"clamp(1.5rem,8vw,6rem)", top:"50%", background: "#ee4c05" }} aria-hidden="true" />
        <div className="pg-hero-slash" style={{ height:"clamp(50px,7vh,80px)", right:"clamp(3rem,11vw,9.5rem)", top:"52%", opacity:.35, background: "#46c5e4" }} aria-hidden="true" />
        <div style={{ maxWidth:700, position:"relative", zIndex:1 }}>
          <span className="cf-label" style={{ color: "#46c5e4" }}>What We Do</span>
          <h1 className="cf-h1" style={{ color:"#fff" }}>
            OUR<br/><span style={{ color:"#ee4c05" }}>PROGRAMS.</span>
          </h1>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"clamp(.9rem,1.8vw,1.05rem)", lineHeight:1.8, marginTop:"1.5rem", maxWidth:520 }}>
            Five interconnected pillars of action — each tackling a critical dimension of community development across Kenya. Click a pillar to explore the programmes within it.
          </p>
        </div>
      </section>

      <section style={{ background:"#ffffff", paddingBottom:"0" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto", padding:"var(--cv) var(--cp) 0" }}>
          <Reveal>
            <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"clamp(2rem,4vw,3rem)", flexWrap:"wrap" }}>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(1.5rem,3vw,2.5rem)", color:"rgba(14, 127, 187, 0.1)", lineHeight:1 }}>SELECT A PILLAR</span>
              <div style={{ height:"2px", flex:1, background:"#e2e8f0", minWidth:"2rem" }} />
              <span style={{ display:"flex", alignItems:"center", gap:".5rem", fontSize:".65rem", fontWeight:700, letterSpacing:".2em", textTransform:"uppercase", color:"#0e7fbb" }}>
                <FaArrowDown aria-hidden="true" style={{ animation:"cf-sb 2s ease-in-out infinite" }} /> Click to expand
              </span>
            </div>
          </Reveal>
        </div>

        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <div className="pg-pillar-grid" role="list" aria-label="Programme pillars">
            {PILLARS.map((p, i) => {
              // Grab the stats array for this specific pillar from our API response
              // We use p.title because your impact API groups them by "Education", "Health", etc.
              const statsArray = impactStats[p.title] || [];
              
              // If we have data, combine the number and unit of the very first stat item. 
              // Otherwise, show the fallback string.
              const displayStat = statsArray.length > 0 ? `${statsArray[0].number} ${statsArray[0].unit}` : p.stat;

              return (
                <Reveal key={p.slug} delay={i*60}>
                  <div role="listitem">
                    <button
                      className={`pg-pillar-card ${activePillar===p.slug ? "active" : ""}`}
                      style={{ "--pc":p.color }}
                      onClick={() => handlePillarClick(p.slug)}
                      aria-expanded={activePillar===p.slug}
                      aria-controls={`panel-${p.slug}`}
                    >
                      <div className="pg-pillar-icon" style={{ background:p.bg, color:p.color }}>{p.icon}</div>
                      <h3 className="pg-pillar-h3" style={{ color:activePillar===p.slug ? p.color : "#043463" }}>{p.title}</h3>
                      <p className="pg-pillar-sub">{p.tagline}</p>
                      
                      {/* Here is where our newly calculated dynamic string renders */}
                      <div className="pg-pillar-stat" style={{ color:p.color }}>{displayStat}</div>
                      
                      <div className="pg-pillar-cta" style={{ color:p.color }}>
                        <span>{activePillar===p.slug ? "Close" : "Explore"}</span>
                        {activePillar===p.slug ? <FaTimes aria-hidden="true" /> : <FaArrowRight aria-hidden="true" />}
                      </div>
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div id={`panel-${activePillar}`} ref={panelRef}
               className={`pg-sub-panel ${activePillar ? "open" : ""}`}
               style={{ "--pnl-col": currentPillar?.color ?? "#ee4c05" }}
               role="region"
               aria-label={currentPillar ? `${currentPillar.title} programmes` : undefined}>
            {currentPillar && (
              <div className="pg-sub-inner" style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
                <div className="pg-sub-header">
                  <div>
                    <span style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".22em", textTransform:"uppercase", color:currentPillar.color, display:"flex", alignItems:"center", gap:".5rem", marginBottom:".75rem" }}>
                      <span style={{ width:"1.5rem", height:"2px", background:currentPillar.color, borderRadius:"2px", display:"inline-block" }} />
                      {currentPillar.title} Programmes
                    </span>
                    <h2 className="pg-sub-h2" style={{ color:"#043463" }}>
                      {activeSubPrograms.length} ACTIVE <span style={{ color:currentPillar.color }}>PROGRAMMES.</span>
                    </h2>
                    <p style={{ color:"#475569", fontSize:".875rem", lineHeight:1.75, marginTop:".75rem", maxWidth:520 }}>
                      {currentPillar.desc}
                    </p>
                  </div>
                  <button className="pg-sub-close" onClick={() => setActivePillar(null)} aria-label={`Close ${currentPillar.title} programmes`}>
                    <FaTimes aria-hidden="true" /> Close
                  </button>
                </div>

                <div className="pg-prog-grid" role="list">
                  {activeSubPrograms.length > 0 ? (
                    activeSubPrograms.map((prog) => (
                      <Link
                        key={prog.slug}
                        to={`/programs/${currentPillar.slug}/${prog.slug}`}
                        className="pg-prog-card"
                        style={{ "--pc": currentPillar.color }}
                        role="listitem"
                        aria-label={`${prog.title} — click to view full programme details`}
                      >
                        <div className="pg-prog-emoji" aria-hidden="true">{prog.icon}</div>
                        <h4 className="pg-prog-h4">{prog.title}</h4>
                        <p className="pg-prog-desc">{prog.desc}</p>
                        <div className="pg-prog-cta" style={{ color:currentPillar.color }}>
                          <span>View Programme</span>
                          <FaArrowRight aria-hidden="true" />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p style={{ color: "#64748b", fontSize: ".875rem" }}>
                      Programme details are currently being updated...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ background:"#f1f5f9", padding:"var(--cv) var(--cp)" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <Reveal>
            <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:"2rem", padding:"clamp(2rem,5vw,4rem)", background:"#ffffff", border:"1px solid #e2e8f0", borderLeft:"4px solid #ee4c05", borderRadius:2 }}>
              <div>
                <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(1.5rem,3.5vw,2.5rem)", letterSpacing:".04em", color:"#043463", marginBottom:".75rem" }}>
                  SUPPORT A PROGRAMME.
                </h3>
                <p style={{ color:"#64748b", fontSize:".9rem", lineHeight:1.75, maxWidth:480 }}>
                  Every contribution — financial, voluntary, or as a partner — directly funds one of our five programme pillars and changes lives in Kenya.
                </p>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"1rem" }}>
                <Link to="/get-involved" style={{ display:"inline-flex", alignItems:"center", gap:".625rem", background:"#043463", color:"#fff", fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:".75rem", letterSpacing:".1em", textTransform:"uppercase", padding:".95rem 2.25rem", textDecoration:"none", clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)", transition:"background .25s" }}>
                  Get Involved <FaArrowRight aria-hidden="true" />
                </Link>
                <Link to="/impact" style={{ display:"inline-flex", alignItems:"center", gap:".625rem", background:"transparent", color:"#043463", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:".75rem", letterSpacing:".1em", textTransform:"uppercase", padding:".9rem 2rem", textDecoration:"none", border:"1.5px solid rgba(4,52,99,.3)", transition:"all .25s" }}>
                  See Our Impact
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer style={{ background:"#043463", padding:"2rem var(--cp)", textAlign:"center", borderTop:"1px solid rgba(255,255,255,.05)" }}>
        <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:".72rem", color:"rgba(255,255,255,.3)" }}>
          © {new Date().getFullYear()} Imarika Foundation · Kenya
        </p>
      </footer>
    </div>
  );
}