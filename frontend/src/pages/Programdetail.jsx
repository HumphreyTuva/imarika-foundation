import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  FaArrowLeft, FaArrowRight, FaCheckCircle,
  FaHandHoldingHeart, FaGraduationCap, FaHeartbeat, FaLeaf, FaSeedling,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import "../components/coastal-fire.css";

// 1. Keep ONLY the visual configuration here. All text data is removed.
const PILLAR_CONFIG = {
  "education": { color: "#ee4c05", bg: "rgba(238,76,5,.1)", icon: FaGraduationCap, pillarTitle: "Education", bannerImg: "/images/scholarship.jpg" },
  "health": { color: "#0e7fbb", bg: "rgba(14,127,187,.1)", icon: FaHeartbeat, pillarTitle: "Health", bannerImg: "/images/health.jpg" },
  "environment": { color: "#46c5e4", bg: "rgba(70,197,228,.1)", icon: FaLeaf, pillarTitle: "Environment", bannerImg: "/images/enviro.jpg" },
  "agribusiness": { color: "#ee4c05", bg: "rgba(238,76,5,.1)", icon: FaSeedling, pillarTitle: "Agribusiness", bannerImg: "/images/agrics.jpg" },
  "disaster-response": { color: "#0e7fbb", bg: "rgba(14,127,187,.1)", icon: FaHandHoldingHeart, pillarTitle: "Disaster Response", bannerImg: "/images/disaster.jpg" }
};

const PD_CSS = `
  /* Paste all your exact PD_CSS here - No changes needed to the CSS! */
  .pd-hero { position:relative; overflow:hidden; padding:clamp(8rem,15vh,11rem) var(--cp) clamp(4rem,7vh,6rem); background:#043463; }
  .pd-hero-slash { position:absolute; width:3px; background:var(--pc,#ee4c05); border-radius:2px; transform:rotate(12deg); transform-origin:top center; }
  .pd-banner { width:100%; max-width:var(--cw); margin:0 auto clamp(2.5rem,5vw,4rem); border-radius:2px; overflow:hidden; aspect-ratio:21/6; position:relative; background:#f0f4f8; }
  .pd-banner img { width:100%; height:100%; object-fit:cover; display:block; }
  .pd-banner-overlay { position:absolute; inset:0; background:linear-gradient(to right,rgba(4,52,99,.6) 0%,transparent 60%); }
  .pd-layout { display:grid; grid-template-columns:1fr; gap:3rem; }
  @media(min-width:1100px){ .pd-layout { grid-template-columns:1fr 300px; align-items:start; } }
  .pd-obj { display:flex; flex-direction:column; gap:.875rem; }
  .pd-obj-item { display:flex; align-items:flex-start; gap:.875rem; font-size:.9rem; color:#4a5568; line-height:1.75; }
  .pd-activities { display:grid; grid-template-columns:1fr; gap:1rem; }
  @media(min-width:640px){ .pd-activities { grid-template-columns:repeat(2,1fr); } }
  .pd-activity { background:#ffffff; border:1px solid rgba(4,52,99,.1); border-left:3px solid var(--pc,#ee4c05); border-radius:2px; padding:1.5rem; transition:transform .25s,border-color .25s; }
  .pd-activity:hover { transform:translateY(-2px); border-color:rgba(238,76,5,.4); }
  .pd-activity h4 { font-family:'Bebas Neue',sans-serif; font-size:1.125rem; letter-spacing:.04em; color:#043463; margin-bottom:.5rem; }
  .pd-activity p  { font-size:.825rem; color:#4a5568; line-height:1.75; }
  .pd-impact-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.5px; background:rgba(4,52,99,.1); }
  @media(min-width:640px){ .pd-impact-grid { grid-template-columns:repeat(4,1fr); } }
  .pd-impact-cell { background:#ffffff; padding:1.75rem 1.5rem; }
  .pd-impact-num { font-family:'Bebas Neue',sans-serif; font-size:clamp(2rem,5vw,3.25rem); line-height:1; letter-spacing:.02em; }
  .pd-impact-lbl { font-size:.65rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:#043463; margin-top:.375rem; }
  .pd-impact-sub { font-size:.72rem; color:#0e7fbb; margin-top:.25rem; }
  .pd-partners { display:flex; flex-wrap:wrap; gap:.75rem; }
  .pd-partner  { background:#f0f4f8; border:1px solid rgba(4,52,99,.1); border-radius:2px; padding:.625rem 1.125rem; font-size:.75rem; color:#0e7fbb; font-family:'Outfit',sans-serif; font-weight:600; }
  .pd-story { background:#ffffff; border:1px solid rgba(4,52,99,.1); border-left:3px solid var(--pc,#ee4c05); border-radius:2px; padding:1.75rem; }
  .pd-story-badge { font-size:.6rem; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:var(--pc,#ee4c05); margin-bottom:.875rem; display:block; }
  .pd-story-body { font-size:.875rem; color:#4a5568; line-height:1.9; font-style:italic; }
  .pd-story-attr { font-size:.75rem; color:#0e7fbb; margin-top:1rem; font-style:normal; }
  .pd-sidebar { display:flex; flex-direction:column; gap:1.5rem; }
  .pd-sidebar-card { background:#ffffff; border:1px solid rgba(4,52,99,.1); border-radius:2px; padding:1.5rem; }
  .pd-sidebar-h { font-family:'Bebas Neue',sans-serif; font-size:.95rem; letter-spacing:.08em; color:#0e7fbb; text-transform:uppercase; margin-bottom:1.125rem; }
  .pd-nav-link { display:flex; align-items:center; gap:.5rem; padding:.625rem 0; font-size:.8rem; color:#4a5568; text-decoration:none; border-bottom:1px solid rgba(4,52,99,.1); transition:color .2s; }
  .pd-nav-link:last-child { border-bottom:none; }
  .pd-nav-link:hover { color:#ee4c05; }
  .pd-rv { opacity:0; transform:translateY(24px); transition:opacity .7s ease,transform .7s ease; }
  .pd-rv.in { opacity:1; transform:none; }
  .pd-sec-label { display:flex; align-items:center; gap:.5rem; font-size:.6rem; font-weight:800; letter-spacing:.22em; text-transform:uppercase; margin-bottom:1.25rem; }
  .pd-sec-label span.bar { width:1.5rem; height:2px; border-radius:2px; display:inline-block; flex-shrink:0; }
`;

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useReveal();
  return <div ref={ref} className="pd-rv" style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</div>;
}

const SecLabel = ({ label, color }) => (
  <div className="pd-sec-label" style={{ color }}>
    <span className="bar" style={{ background: color }} />
    {label}
  </div>
);

export default function ProgramDetail() {
  const { pillar, slug } = useParams();
  const [allPrograms, setAllPrograms] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all programs (groups by pillar) from the API we built previously
    fetch('https://imarikafoundation.org/api/api/api/programs-data/')
      .then(res => res.json())
      .then(data => {
        setAllPrograms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching program details:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: "5rem", textAlign: "center", fontFamily: "'Outfit', sans-serif" }}>Loading Programme Details...</div>;

  // 1. Get the visual config for this pillar
  const pillarVisuals = PILLAR_CONFIG[pillar];
  
  // 2. Safely find the active subprogram from the fetched data
  const pillarDataArray = allPrograms ? (allPrograms[pillar] || []) : [];
  const activeProgram = pillarDataArray.find(p => p.slug === slug);
  const siblings = pillarDataArray.filter(p => p.slug !== slug);

  if (!pillarVisuals || !activeProgram) {
    return (
      <div className="cf-root">
        <Navbar />
        <div style={{ minHeight:"70vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"var(--cp)", textAlign:"center", background:"#ffffff" }}>
          <FaHandHoldingHeart style={{ fontSize:"3.5rem", color:"rgba(4,52,99,.1)", marginBottom:"1.25rem" }} aria-hidden="true" />
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.75rem", letterSpacing:".04em", color:"#043463", marginBottom:".75rem" }}>
            PROGRAMME NOT FOUND
          </h2>
          <p style={{ color:"#4a5568", fontSize:".875rem", marginBottom:"1.75rem" }}>
            This programme page doesn't exist or the link may be broken.
          </p>
          <Link to="/programs" className="cf-btn cf-btn-orange" style={{ clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)", display:"inline-flex" }}>
            ← All Programmes
          </Link>
        </div>
      </div>
    );
  }

  const { color, bg, icon: IconComp, pillarTitle, bannerImg } = pillarVisuals;

  // Helper functions to turn the backend multiline strings back into arrays
  const parseList = (textString) => {
    if (!textString) return [];
    return textString.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  };

  const objectivesArray = parseList(activeProgram.objectives_list);
  const partnersArray = parseList(activeProgram.partners_list);

  return (
    <div className="cf-root">
      <style>{PD_CSS}</style>
      <Helmet>
        <title>{activeProgram.title} · Imarika Foundation</title>
        <meta name="description" content={activeProgram.desc} />
      </Helmet>
      <Navbar />

      <section className="pd-hero" style={{ "--pc": color }}>
        <div aria-hidden="true" style={{ position:"absolute", fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(10rem,25vw,20rem)", lineHeight:.85, color:"rgba(255,255,255,0.05)", right:"-3%", top:"50%", transform:"translateY(-50%)", userSelect:"none", pointerEvents:"none" }}>
          {pillarTitle.charAt(0)}
        </div>
        <div className="pd-hero-slash" style={{ height:"clamp(80px,12vh,130px)", right:"clamp(1.5rem,8vw,6rem)", top:"50%" }} aria-hidden="true" />
        <div className="pd-hero-slash" style={{ height:"clamp(50px,7vh,80px)", right:"clamp(3rem,11vw,9.5rem)", top:"52%", opacity:.35 }} aria-hidden="true" />

        <div style={{ maxWidth:"var(--cw)", margin:"0 auto", position:"relative", zIndex:1 }}>
          <nav aria-label="Breadcrumb" style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:"2rem", flexWrap:"wrap" }}>
            {[
              { to:"/programs", label:"Programmes", col:"rgba(255,255,255,.6)" },
              { to:"/programs", label:pillarTitle,  col:color                  },
            ].map((bc, i) => (
              <span key={i} style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
                {i > 0 && <span style={{ color:"rgba(255,255,255,.3)" }}>›</span>}
                <Link to={bc.to} style={{ color:bc.col, textDecoration:"none", fontSize:".7rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", transition:"color .2s" }}
                      onMouseEnter={e=>e.currentTarget.style.color=color}
                      onMouseLeave={e=>e.currentTarget.style.color=bc.col}>
                  {bc.label}
                </Link>
              </span>
            ))}
            <span style={{ color:"rgba(255,255,255,.3)" }}>›</span>
            <span style={{ color:"#46c5e4", fontSize:".7rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" }}>{activeProgram.title}</span>
          </nav>

          <div style={{ display:"flex", alignItems:"flex-start", gap:"1.5rem", flexWrap:"wrap" }}>
            <div style={{ width:"clamp(52px,8vw,72px)", height:"clamp(52px,8vw,72px)", borderRadius:2, background:bg, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"clamp(1.375rem,3vw,2rem)", flexShrink:0 }}>
              <IconComp aria-hidden="true" />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:".6rem", fontWeight:800, letterSpacing:".22em", textTransform:"uppercase", color, display:"flex", alignItems:"center", gap:".5rem", marginBottom:".875rem" }}>
                <span style={{ width:"1.5rem", height:"2px", background:color, borderRadius:"2px", display:"inline-block" }} />
                {pillarTitle} Programme
              </div>
              <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2rem,7vw,6rem)", lineHeight:.88, letterSpacing:".02em", color:"#ffffff", marginBottom:".875rem" }}>
                {activeProgram.title.toUpperCase()}
              </h1>
              <p style={{ color:"#46c5e4", fontSize:"clamp(.9rem,1.8vw,1.05rem)", lineHeight:1.8, maxWidth:580 }}>
                {activeProgram.desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact strip fetched from backend */}
      {activeProgram.impacts?.length > 0 && (
        <section style={{ background:"#f0f4f8" }}>
          <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
            <div className="pd-impact-grid">
              {activeProgram.impacts.map((item, i) => (
                <div key={i} className="pd-impact-cell">
                  <div className="pd-impact-num" style={{ color }}>{item.number}</div>
                  <div className="pd-impact-lbl">{item.label}</div>
                  {item.sub_label && <div className="pd-impact-sub">{item.sub_label}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {bannerImg && (
        <div style={{ background:"#ffffff", padding:"0 var(--cp)" }}>
          <div className="pd-banner" style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
            <img src={bannerImg} alt={`${pillarTitle} programme`} loading="lazy" />
            <div className="pd-banner-overlay" aria-hidden="true" />
          </div>
        </div>
      )}

      <section style={{ background:"#ffffff", padding:"0 var(--cp) var(--cv)" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <div className="pd-layout">

            {/* Left Column */}
            <div style={{ display:"flex", flexDirection:"column", gap:"clamp(2.5rem,5vw,4rem)" }}>
              <Reveal>
                <SecLabel label="Programme Overview" color={color} />
                <p style={{ color:"#4a5568", fontSize:"clamp(.9rem,1.5vw,1rem)", lineHeight:1.9, maxWidth:740, whiteSpace: "pre-line" }}>
                  {activeProgram.overview || "Overview coming soon."}
                </p>
              </Reveal>

              {objectivesArray.length > 0 && (
                <Reveal delay={60}>
                  <SecLabel label="Programme Objectives" color={color} />
                  <div className="pd-obj">
                    {objectivesArray.map((obj, i) => (
                      <div key={i} className="pd-obj-item">
                        <FaCheckCircle style={{ color, flexShrink:0, marginTop:".25rem", fontSize:".875rem" }} aria-hidden="true" />
                        {obj}
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {activeProgram.activities?.length > 0 && (
                <Reveal delay={100}>
                  <SecLabel label="Key Activities" color={color} />
                  <div className="pd-activities" style={{ "--pc": color }}>
                    {activeProgram.activities.map((a, i) => (
                      <Reveal key={a.title} delay={i * 55}>
                        <div className="pd-activity">
                          <h4>{a.title}</h4>
                          <p>{a.desc}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </Reveal>
              )}

              {activeProgram.story_quote && (
                <Reveal delay={120}>
                  <SecLabel label="Success Story" color={color} />
                  <div className="pd-story" style={{ "--pc": color }}>
                    <span className="pd-story-badge">Real Impact · Real People</span>
                    <blockquote className="pd-story-body">"{activeProgram.story_quote}"</blockquote>
                    {activeProgram.story_attr && <p className="pd-story-attr">{activeProgram.story_attr}</p>}
                  </div>
                </Reveal>
              )}

              {partnersArray.length > 0 && (
                <Reveal delay={140}>
                  <SecLabel label="Programme Partners" color={color} />
                  <div className="pd-partners">
                    {partnersArray.map((p) => <span key={p} className="pd-partner">{p}</span>)}
                  </div>
                </Reveal>
              )}
            </div>

            {/* Sidebar */}
            <aside className="pd-sidebar" aria-label="Programme sidebar">
              <Reveal>
                <div style={{ background:color, borderRadius:2, padding:"2rem 1.5rem", textAlign:"center" }}>
                  <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.625rem", letterSpacing:".04em", color:"#ffffff", margin:"0 0 .75rem 0" }}>
                    SUPPORT THIS PROGRAMME
                  </h3>
                  <p style={{ fontSize:".825rem", color:"rgba(255,255,255,.9)", lineHeight:1.7, marginBottom:"1.5rem" }}>
                    Your contribution goes directly to {activeProgram.title.toLowerCase()}.
                  </p>
                  <Link to="/get-involved" style={{ display:"inline-flex", alignItems:"center", gap:".5rem", background:"#043463", color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:".72rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", padding:".875rem 1.75rem", textDecoration:"none", borderRadius:2 }}>
                    Get Involved <FaArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>

              {siblings.length > 0 && (
                <Reveal delay={80}>
                  <div className="pd-sidebar-card">
                    <div className="pd-sidebar-h">More {pillarTitle} Programmes</div>
                    <nav aria-label={`Other ${pillarTitle} programmes`}>
                      {siblings.map((prog) => (
                        <Link key={prog.slug} to={`/programs/${pillar}/${prog.slug}`} className="pd-nav-link">
                          <FaArrowRight style={{ color, fontSize:".65rem", flexShrink:0 }} aria-hidden="true" />
                          {prog.title}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </Reveal>
              )}

              <Reveal delay={160}>
                <Link to="/programs"
                      style={{ display:"flex", alignItems:"center", gap:".75rem", background:"#ffffff", border:"1px solid rgba(4,52,99,.1)", borderRadius:2, padding:"1.125rem 1.25rem", textDecoration:"none", fontSize:".72rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"#0e7fbb", transition:"color .2s,border-color .2s" }}
                      onMouseEnter={e=>{ e.currentTarget.style.color="#ee4c05"; e.currentTarget.style.borderColor="#ee4c05"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.color="#0e7fbb"; e.currentTarget.style.borderColor="rgba(4,52,99,.1)"; }}>
                  <FaArrowLeft aria-hidden="true" /> All Programmes
                </Link>
              </Reveal>
            </aside>
            
          </div>
        </div>
      </section>

      <footer style={{ background:"#043463", padding:"2rem var(--cp)", textAlign:"center", borderTop:"1px solid rgba(255,255,255,.1)" }}>
        <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:".72rem", color:"rgba(255,255,255,.7)" }}>
          © {new Date().getFullYear()} Imarika Foundation
        </p>
      </footer>
    </div>
  );
}