import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import '../components/coastal-fire.css';
import { FaArrowRight, FaFacebookF, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const VALUES = [
  { icon:"🤝", title:"Integrity",     body:"We operate with honesty, transparency, and accountability in everything we do." },
  { icon:"🌍", title:"Inclusivity",   body:"We embrace diversity and ensure every community member has a voice and opportunity." },
  { icon:"💡", title:"Innovation",    body:"We seek creative, evidence-based solutions to persistent community challenges." },
  { icon:"🌱", title:"Sustainability",body:"We design programmes that create lasting change beyond the project cycle." },
  { icon:"🌟", title:"Hope",          body:"We believe every person deserves a chance at a better, more dignified life." },
];

const TIMELINE = [
  { year:"2015", event:"Imarika Foundation established by Imarika DT Sacco as a Corporate Social Responsibility (CSR) initiative." },
  { year:"2015", event:"Registered as a Public Benefit Organisation (PBO) to formalize community development programs." },
  { year:"2016–2020", event:"Expanded grassroots community support through education sponsorships, health outreach, and social support initiatives." },
  { year:"2021", event:"Strengthened partnerships with key stakeholders and scaled structured programming across Kenya." },
  { year:"2022", event:"Growth in multi-sector programmes including education, health, agribusiness, and environmental conservation." },
  { year:"2023", event:"Expanded partnerships with organizations such as Zana Africa and Fred Hollows Foundation; increased health and education outreach." },
  { year:"2024", event:"Scaled environmental conservation efforts and youth empowerment programmes across Kenya." },
  { year:"2025", event:"Achieved major impact milestones including scholarships, 500+ cataract surgeries, 2,500+ trees planted, and youth vocational training initiatives." },
  { year:"2026", event:"Focused on expanding partnerships, sustainability, and reaching more communities across Kenya." },
];

const SOCIALS = [
  { href:"https://www.facebook.com/profile.php?id=100081154223367",  icon:<FaFacebookF/>,  label:"Facebook"  },
  { href:"https://x.com/ImarikaF2023",                               icon:<FaXTwitter/>,   label:"X Twitter" },
  { href:"https://www.instagram.com/foundation_imarika_",            icon:<FaInstagram/>,  label:"Instagram" },
  { href:"https://www.linkedin.com/in/imarika-foundation-88a645253/",icon:<FaLinkedin/>,   label:"LinkedIn"  },
  { href:"https://www.youtube.com/@imarikafoundation",               icon:<FaYoutube/>,    label:"YouTube"   },
];

const ABOUT_CSS = `
  /* Hero */
  .ab-hero { background:#043463; padding:clamp(8rem,15vh,11rem) var(--cp) clamp(4rem,7vh,6rem); position:relative; overflow:hidden; }
  .ab-hero-ghost { position:absolute; font-family:'Bebas Neue',sans-serif; font-size:clamp(10rem,25vw,20rem); line-height:.85; color:rgba(255,255,255, 0.03); right:-3%; top:50%; transform:translateY(-50%); user-select:none; pointer-events:none; }
  .ab-hero-slash { position:absolute; width:3px; background:#ee4c05; border-radius:2px; transform:rotate(12deg); transform-origin:top center; }
  .ab-hero-inner { max-width:800px; position:relative; z-index:1; }

  /* Mission/Vision split */
  .ab-mv-grid { display:grid; grid-template-columns:1fr; gap:1.5px; background:#e2e8f0; }
  @media(min-width:768px){ .ab-mv-grid { grid-template-columns:1fr 1fr; } }
  .ab-mv-card { background:#ffffff; padding:clamp(2rem,5vw,3.5rem); }
  .ab-mv-num  { font-family:'Bebas Neue',sans-serif; font-size:clamp(4rem,8vw,7rem); line-height:1; color:rgba(14, 127, 187, 0.1); letter-spacing:.02em; user-select:none; }
  .ab-mv-h3   { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.5rem,3vw,2rem); letter-spacing:.04em; color:#043463; margin:.5rem 0 1rem; }
  .ab-mv-p    { font-size:.9rem; color:#475569; line-height:1.85; }

  /* Values */
  .ab-val-grid { display:grid; grid-template-columns:1fr; gap:1.5rem; }
  @media(min-width:480px){ .ab-val-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:900px){ .ab-val-grid { grid-template-columns:repeat(5,1fr); } }
  .ab-val-card { background:#ffffff; border:1px solid #f1f5f9; border-left:3px solid #ee4c05; padding:1.75rem 1.5rem; transition:border-color .25s,transform .3s,box-shadow .3s; height:100%; display:flex; flex-direction:column; }
  .ab-val-card:hover { transform:translateY(-4px); box-shadow:0 20px 40px rgba(4, 52, 99, 0.08); }
  .ab-val-icon { font-size:2rem; margin-bottom:1rem; }
  .ab-val-h  { font-family:'Bebas Neue',sans-serif; font-size:1.4rem; letter-spacing:.04em; color:#043463; margin-bottom:.625rem; }
  .ab-val-p  { font-size:.8rem; color:#64748b; line-height:1.75; }

  /* Timeline */
  .ab-timeline { position:relative; max-width:800px; margin:0 auto; }
  .ab-timeline::before { content:''; position:absolute; left:clamp(1.25rem,4vw,2rem); top:0; bottom:0; width:2px; background:rgba(14, 127, 187, 0.15); }
  .ab-tl-item { display:flex; gap:clamp(1.5rem,4vw,3rem); padding-bottom:2.5rem; position:relative; }
  .ab-tl-dot  { width:clamp(2.25rem,4vw,2.75rem); height:clamp(2.25rem,4vw,2.75rem); border-radius:50%; background:#ee4c05; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-left:clamp(.25rem,1.5vw,.625rem); position:relative; z-index:1; }
  .ab-tl-dot-inner { width:8px; height:8px; border-radius:50%; background:#043463; }
  .ab-tl-year { font-family:'Bebas Neue',sans-serif; font-size:1.25rem; letter-spacing:.06em; color:#0e7fbb; margin-bottom:.375rem; }
  .ab-tl-event { font-size:.875rem; color:#475569; line-height:1.75; }

  /* Stats bar */
  .ab-stats { display:grid; grid-template-columns:repeat(2,1fr); gap:0; background:#f1f5f9; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
  @media(min-width:640px){ .ab-stats { grid-template-columns:repeat(4,1fr); } }
  .ab-stat-cell { padding:2rem 1.5rem; border-right:1px solid #e2e8f0; }
  .ab-stat-cell:last-child { border-right:none; }
  .ab-stat-n { font-family:'Bebas Neue',sans-serif; font-size:clamp(2rem,5vw,3.25rem); line-height:1; color:#ee4c05; }
  .ab-stat-l { font-size:.65rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:#043463; margin-top:.375rem; opacity:0.6; }

  /* Footer Social Icons */
  .cf-social-link { color:rgba(255,255,255,0.4); font-size:1.25rem; transition:color 0.25s, transform 0.25s; display:inline-block; }
  .cf-social-link:hover { color:#ee4c05; transform:translateY(-3px); }

  /* LinkedIn card */
  .ab-linkedin-card { background:#ffffff; padding:1.5rem; border:1px solid #f1f5f9; borderTop:3px solid #0A66C2; box-shadow:0 20px 40px rgba(4,52,99,.04); height:100%; display:flex; flex-direction:column; }
  .ab-linkedin-body { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.25rem; min-height:400px; text-align:center; padding:2rem; }
  .ab-linkedin-icon { font-size:4rem; color:#0A66C2; }
  .ab-linkedin-text { color:#475569; font-size:.9rem; line-height:1.75; max-width:280px; }
  .ab-linkedin-btn { display:inline-flex; align-items:center; gap:.5rem; background:#0A66C2; color:#fff; padding:.85rem 1.75rem; border-radius:2px; text-decoration:none; font-family:'Outfit',sans-serif; font-size:.72rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; transition:background .2s; }
  .ab-linkedin-btn:hover { background:#004182; }

  /* Scroll reveal */
  .ab-rv { opacity:0; transform:translateY(24px); transition:opacity .7s ease,transform .7s ease; }
  .ab-rv.in { opacity:1; transform:none; }
`;

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("in"); obs.disconnect(); } },
      { threshold:.08, rootMargin:"0px 0px -40px 0px" }
    );
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return ref;
}

const Reveal = ({ children, delay=0, style={} }) => {
  const ref = useReveal();
  return <div ref={ref} className="ab-rv" style={{ transitionDelay:`${delay}ms`,...style }}>{children}</div>;
};

export default function AboutPage() {
  return (
    <div className="cf-root">
      <style>{ABOUT_CSS}</style>
      <Helmet><title>About Us · Imarika Foundation</title></Helmet>
      <Navbar />

      {/* Hero */}
      <section className="ab-hero">
        <div className="ab-hero-ghost" aria-hidden="true">ABOUT</div>
        <div className="ab-hero-slash" style={{ height:"clamp(80px,12vh,130px)", right:"clamp(1.5rem,8vw,6rem)", top:"50%", background: "#ee4c05" }} aria-hidden="true" />
        <div className="ab-hero-slash" style={{ height:"clamp(50px,7vh,80px)", right:"clamp(3rem,11vw,9.5rem)", top:"52%", opacity:.35, background: "#46c5e4" }} aria-hidden="true" />
        <div className="ab-hero-inner">
          <span className="cf-label" style={{ color: "#46c5e4" }}>About Us</span>
          <h1 className="cf-h1" style={{ color:"#fff" }}>
            WHO WE<br/><span style={{ color:"#ee4c05" }}>ARE.</span>
          </h1>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"clamp(.95rem,2vw,1.1rem)", lineHeight:1.8, maxWidth:560, marginTop:"1.5rem" }}>
            Imarika Foundation is a community-rooted public Benefit Organization (PBO), united by the conviction that sustainable progress is achieved when communities stand together. We work to empower vulnerable populations, strengthen livelihoods, and inspire hope across generations.
          </p>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"clamp(.95rem,2vw,1.1rem)", lineHeight:1.8, maxWidth:560, marginTop:"1rem" }}>
            We position ourselves as stewards of dignity, architects of resilience, and champions of inclusive growth. Our identity is defined by the lives transformed: the child who remains in school, the youth who acquires new skills, the farmer who adopts sustainable practices, and the community breathing cleaner air through our conservation efforts.
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"1rem", marginTop:"2rem" }}>
            <Link to="/programs" className="cf-btn" style={{ background: "#ee4c05", color: "#fff" }}>Explore Programs <FaArrowRight aria-hidden="true" /></Link>
            <Link to="/impact" className="cf-btn-outline" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}>Our Impact</Link>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section style={{ background:"#ffffff" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <Reveal>
            <div className="ab-stats">
              {[
                { n:"2015",   l:"Year Founded"    },
                { n:"5",      l:"Programme Areas" },
                { n:"Kilifi", l:"Base County"      },
                { n:"2015",   l:"PBO Registered"  },
              ].map(s => (
                <div key={s.l} className="ab-stat-cell">
                  <div className="ab-stat-n">{s.n}</div>
                  <div className="ab-stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission / Vision */}
      <section style={{ background:"#ffffff", padding:"var(--cv) 0" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto", padding:"0 var(--cp)", marginBottom:"clamp(2.5rem,5vw,4rem)" }}>
          <Reveal>
            <span className="cf-label" style={{ color: "#0e7fbb" }}>Foundation</span>
            <h2 className="cf-h2" style={{ color: "#043463" }}>MISSION &amp; <span style={{ color:"#ee4c05" }}>VISION.</span></h2>
          </Reveal>
        </div>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <div className="ab-mv-grid">
            {[
              { num:"01", h:"Our Mission", p:"To partner with individuals, communities, and organizations to enhance access to equitable opportunities for the disadvantaged across Kenya." },
              { num:"02", h:"Our Vision",  p:"Secure, empowered, resilient, and transformed communities where every person can reach their full potential." },
              { num:"03", h:"Our Goal",    p:"To provide access to sustainable development for people from disadvantaged backgrounds — today and for every generation to come." },
              { num:"04", h:"Our Approach",p:"We use a community-first, evidence-based approach — working alongside local leaders, government, and global partners to design programmes that last." },
            ].map((item, i) => (
              <Reveal key={item.num} delay={i*80}>
                <div className="ab-mv-card">
                  <div className="ab-mv-num">{item.num}</div>
                  <div style={{ width:"2rem", height:"3px", background:"#ee4c05", borderRadius:"2px", margin:".25rem 0 1rem" }} />
                  <h3 className="ab-mv-h3">{item.h}</h3>
                  <p className="ab-mv-p">{item.p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ background:"#f8fafc", padding:"var(--cv) var(--cp)" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <Reveal>
            <span className="cf-label" style={{ color: "#0e7fbb" }}>What Guides Us</span>
            <h2 className="cf-h2" style={{ color: "#043463", marginBottom:"clamp(2.5rem,5vw,4rem)" }}>CORE <span style={{ color:"#ee4c05" }}>VALUES.</span></h2>
          </Reveal>
          <div className="ab-val-grid">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i*70}>
                <div className="ab-val-card">
                  <div className="ab-val-icon" aria-hidden="true">{v.icon}</div>
                  <h3 className="ab-val-h">{v.title}</h3>
                  <p className="ab-val-p">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* History timeline */}
      <section style={{ background:"#ffffff", padding:"var(--cv) var(--cp)" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <Reveal>
            <span className="cf-label" style={{ color: "#46c5e4" }}>Our Journey</span>
            <h2 className="cf-h2" style={{ color: "#043463", marginBottom:"clamp(2.5rem,5vw,4rem)" }}>HISTORY &amp; <span style={{ color:"#ee4c05" }}>MILESTONES.</span></h2>
          </Reveal>
          <div className="ab-timeline">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year+i} delay={i*80}>
                <div className="ab-tl-item">
                  <div className="ab-tl-dot"><div className="ab-tl-dot-inner" /></div>
                  <div style={{ paddingTop:".25rem" }}>
                    <div className="ab-tl-year">{t.year}</div>
                    <p className="ab-tl-event">{t.event}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:"#ee4c05", padding:"clamp(3.5rem,7vw,6rem) var(--cp)", position:"relative", overflow:"hidden" }}>
        <div aria-hidden="true" style={{ position:"absolute", fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(8rem,20vw,16rem)", lineHeight:.85, color:"rgba(255,255,255,.1)", right:"-2%", top:"50%", transform:"translateY(-50%)", userSelect:"none", pointerEvents:"none" }}>JOIN</div>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto", position:"relative", zIndex:1, display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:"2rem" }}>
          <div>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2rem,5vw,4rem)", lineHeight:.9, color:"#ffffff", letterSpacing:".02em", marginBottom:".75rem" }}>
              BE PART OF THE STORY.
            </h2>
            <p style={{ color:"rgba(255,255,255,.8)", fontSize:"clamp(.875rem,1.5vw,1rem)", lineHeight:1.7, maxWidth:460 }}>
              Every volunteer, donor, and partner helps us reach more communities. Join the Imarika movement today.
            </p>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"1rem" }}>
            <Link to="/get-involved" style={{ display:"inline-flex", alignItems:"center", gap:".625rem", background:"#043463", color:"#fff", fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:".75rem", letterSpacing:".1em", textTransform:"uppercase", padding:".95rem 2.25rem", textDecoration:"none", clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)", transition:"background .25s" }}>
              Get Involved <FaArrowRight aria-hidden="true" />
            </Link>
            <Link to="/leadership" style={{ display:"inline-flex", alignItems:"center", gap:".625rem", background:"transparent", color:"#ffffff", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:".75rem", letterSpacing:".1em", textTransform:"uppercase", padding:".9rem 2rem", textDecoration:"none", border:"1.5px solid rgba(255,255,255,0.5)", transition:"all .25s" }}>
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section style={{ background:"#f8fafc", padding:"var(--cv) var(--cp)" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <Reveal>
            <span className="cf-label" style={{ color: "#0e7fbb" }}>Stay Connected</span>
            <h2 className="cf-h2" style={{ color: "#043463", marginBottom:"clamp(2.5rem,5vw,4rem)" }}>OUR <span style={{ color:"#ee4c05" }}>SOCIALS.</span></h2>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:"2rem", alignItems:"stretch" }}>

            {/* Facebook embed */}
            <Reveal delay={0} style={{ height:"100%" }}>
              <div style={{ background:"#ffffff", padding:"1.5rem", border:"1px solid #f1f5f9", borderTop:"3px solid #1877F2", boxShadow:"0 20px 40px rgba(4,52,99,.04)", height:"100%", display:"flex", flexDirection:"column" }}>
                <h3 className="ab-val-h" style={{ marginBottom:"1rem", color:"#1877F2" }}>Facebook</h3>
                <div style={{ width:"100%", flex:1, overflow:"hidden", display:"flex", justifyContent:"center", alignItems:"center" }}>
                  <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100081154223367&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                    width="100%"
                    height="600"
                    style={{ border:"none", overflow:"hidden", maxWidth:"500px", width:"100%" }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="Imarika Foundation Facebook Feed"
                  />
                </div>
              </div>
            </Reveal>

            {/* LinkedIn — replaced crashing Elfsight widget with a clean link card */}
            <Reveal delay={100} style={{ height:"100%" }}>
              <div style={{ background:"#ffffff", padding:"1.5rem", border:"1px solid #f1f5f9", borderTop:"3px solid #0A66C2", boxShadow:"0 20px 40px rgba(4,52,99,.04)", height:"100%", display:"flex", flexDirection:"column" }}>
                <h3 className="ab-val-h" style={{ marginBottom:"1rem", color:"#0A66C2" }}>LinkedIn</h3>
                <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1.25rem", minHeight:"400px", textAlign:"center", padding:"2rem" }}>
                  <FaLinkedin style={{ fontSize:"4rem", color:"#0A66C2" }} />
                  <p style={{ color:"#475569", fontSize:".9rem", lineHeight:1.75, maxWidth:"280px" }}>
                    Follow us on LinkedIn for updates, opportunities, and impact stories from Imarika Foundation.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/imarika-foundation-88a645253/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:".5rem", background:"#0A66C2", color:"#fff", padding:".85rem 1.75rem", borderRadius:"2px", textDecoration:"none", fontFamily:"'Outfit',sans-serif", fontSize:".72rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", transition:"background .2s" }}
                  >
                    <FaLinkedin aria-hidden="true" /> Follow on LinkedIn
                  </a>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:"#043463", padding:"3rem var(--cp) 2rem", textAlign:"center", borderTop:"1px solid rgba(255,255,255,.05)" }}>
        <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:"1.5rem", marginBottom:"1.5rem" }}>
          {SOCIALS.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="cf-social" aria-label={`Follow on ${s.label}`}>
              {s.icon}
            </a>
          ))}
        </div>
        <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:".75rem", color:"rgba(255,255,255,.4)" }}>
          © {new Date().getFullYear()} Imarika Foundation · Kenya
        </p>
      </footer>
    </div>
  );
}