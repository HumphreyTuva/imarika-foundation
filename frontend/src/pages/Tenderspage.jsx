import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FaDownload, FaEnvelope, FaSearch, FaFilter, FaCalendarAlt, FaFileAlt, FaHashtag, FaCheckCircle, FaTimesCircle, FaClock, FaRedo } from "react-icons/fa";
import Navbar from "../components/Navbar";
import '../components/coastal-fire.css';

/* ── Sample data fallback (until API endpoint is live) ── */
/* Data aligned with Imarika Foundation Annual Report 2025 programmes */
const SAMPLE_TENDERS = [
  {
    id: 1,
    title: "Supply of Dignity Packs — Reproductive Health Programme 2026",
    ref: "IF/TDR/2026/001",
    description: "Supply of sanitary pads, innerwear, and hygiene items for the 2026 reproductive health programme targeting adolescent girls and boys across schools and CBO groups in Kilifi County. In 2025, the programme reached 2,249 adolescents across 19 schools.",
    deadline: "2026-05-10",
    status: "open",
    file: null,
    category: "Supplies",
  },
  {
    id: 2,
    title: "Consultancy — M&E Framework for Imarisha Life Skills Programme",
    ref: "IF/TDR/2026/002",
    description: "Design and implement a Monitoring & Evaluation framework for the Imarisha Life Skills Programme running in public comprehensive schools in Magarini Sub-County. The programme currently supports 75 student champions and 10 patron-teachers across 5 schools.",
    deadline: "2026-04-30",
    status: "open",
    file: null,
    category: "Consultancy",
  },
  {
    id: 3,
    title: "Audit Services — Financial Year 2025/2026",
    ref: "IF/TDR/2026/003",
    description: "Provision of external audit services for Imarika Foundation's 2025/2026 financial year in compliance with Public Benefit Organizations (PBO) Act regulations. Total programme expenditure in 2025 was Ksh 15,532,814.",
    deadline: "2026-06-30",
    status: "open",
    file: null,
    category: "Consultancy",
  },
  {
    id: 4,
    title: "Supply of Cassava Seedlings — 2026 Season Expansion",
    ref: "IF/TDR/2026/004",
    description: "Supply of certified cassava seedlings for the 2026 expansion of the Imarisha Cassava Project, targeting 20 additional farmers across Kilifi County. The 2025 season distributed 40,000 seedlings to 8 farmers with a 2-acre demonstration farm established in Kaloleni.",
    deadline: "2026-05-15",
    status: "open",
    file: null,
    category: "Supplies",
  },
  {
    id: 5,
    title: "Supply of Computer Equipment — Digital Literacy Programme",
    ref: "IF/TDR/2025/006",
    description: "Supply of 15 refurbished computers and accessories for the Digital Literacy Support Programme at Mtundani Comprehensive School, benefiting 500 learners.",
    deadline: "2025-02-28",
    status: "awarded",
    file: null,
    category: "Supplies",
  },
  {
    id: 6,
    title: "Medical Supplies — Eye Medical Camp, December 2025",
    ref: "IF/TDR/2025/007",
    description: "Supply of consumables, reading glasses (150 pairs), post-surgery sunglasses (150 pairs), and surgical sundries for the eye medical camp conducted 1–5 December 2025 across Kilifi North, Malindi, and Ganze. The camp conducted 500 cataract operations.",
    deadline: "2025-11-15",
    status: "awarded",
    file: null,
    category: "Medical Supplies",
  },
  {
    id: 7,
    title: "Catering Services — Mijikenda Fundraising Dinner 2025",
    ref: "IF/TDR/2025/005",
    description: "Provision of catering and event logistics services for the Imarika Foundation Mijikenda Fundraising Dinner, which raised Ksh 704,170 towards the Foundation's 2025 programme activities.",
    deadline: "2025-09-30",
    status: "awarded",
    file: null,
    category: "Services",
  },
  {
    id: 8,
    title: "Supply of Tree & Mangrove Seedlings — Environmental Programme 2025",
    ref: "IF/TDR/2025/004",
    description: "Supply of 2,500 indigenous tree seedlings and 5,000 mangrove propagules for the 2025 Climate Change Action & Environmental Protection programme across Kilifi County and coastal ecosystems.",
    deadline: "2025-03-31",
    status: "closed",
    file: null,
    category: "Supplies",
  },
];

const TENDER_CSS = `
  /* Hero */
  .td-hero { background:#043463; padding:clamp(8rem,15vh,11rem) var(--cp) clamp(4rem,7vh,6rem); position:relative; overflow:hidden; }
  .td-ghost { position:absolute; font-family:'Bebas Neue',sans-serif; font-size:clamp(10rem,25vw,20rem); line-height:.85; color:rgba(238,76,5,.05); right:-3%; top:50%; transform:translateY(-50%); user-select:none; pointer-events:none; }
  .td-slash { position:absolute; width:3px; background:#ee4c05; border-radius:2px; transform:rotate(12deg); transform-origin:top center; }

  /* Filters */
  .td-filter-bar { display:flex; flex-wrap:wrap; gap:1rem; align-items:center; margin-bottom:clamp(2rem,4vw,3rem); }
  .td-search { display:flex; align-items:center; gap:.75rem; flex:1; min-width:220px; background:#ffffff; border:1px solid rgba(4,52,99,.2); padding:.75rem 1.125rem; border-radius:2px; transition:border-color .2s; }
  .td-search:focus-within { border-color:#ee4c05; background:rgba(238,76,5,.04); }
  .td-search-icon { color:#0e7fbb; flex-shrink:0; }
  .td-search-input { background:none; border:none; outline:none; color:#043463; font-family:'Outfit',sans-serif; font-size:.875rem; width:100%; }
  .td-search-input::placeholder { color:#a0aec0; }

  /* Light Theme Tab Styles */
  .td-filter-bar .cf-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .td-filter-bar .cf-tab {
    background: #ffffff;
    color: #043463;
    border: 1px solid rgba(4,52,99,.2);
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0.625rem 1rem;
    font-size: 0.75rem;
    white-space: nowrap;
  }
  .td-filter-bar .cf-tab:hover {
    border-color: #ee4c05;
    color: #ee4c05;
  }
  .td-filter-bar .cf-tab.active {
    background: #043463;
    color: #ffffff;
    border-color: #043463;
  }

  /* Stats strip */
  .td-stats { display:flex; flex-wrap:wrap; gap:1.5px; background:rgba(4,52,99,.1); margin-bottom:2.5rem; }
  .td-stat { flex:1; min-width:120px; background:#ffffff; padding:1.25rem 1.5rem; }
  .td-stat-n { font-family:'Bebas Neue',sans-serif; font-size:2rem; line-height:1; letter-spacing:.02em; }
  .td-stat-l { font-size:.62rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:#043463; margin-top:.25rem; }

  /* Card */
  .td-card { height:100%; background:#ffffff; border:1px solid rgba(4,52,99,.1); border-radius:2px; padding:clamp(1.25rem,3vw,2rem); display:flex; flex-direction:column; gap:1rem; transition:border-color .25s,transform .3s,box-shadow .3s; position:relative; overflow:hidden; }
  .td-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--cb,#ee4c05); transition:width .3s; }
  .td-card:hover { border-color:rgba(238,76,5,.4); transform:translateY(-3px); box-shadow:0 20px 40px rgba(4,52,99,.08); }
  .td-card:hover::before { width:5px; }
  .td-card-top { display:flex; flex-wrap:wrap; align-items:flex-start; justify-content:space-between; gap:.875rem; }
  .td-card-meta { display:flex; flex-wrap:wrap; gap:.625rem; align-items:center; }
  .td-card-ref { font-family:'Bebas Neue',sans-serif; font-size:.95rem; letter-spacing:.08em; color:#0e7fbb; }
  .td-card-h3 { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.125rem,2.5vw,1.5rem); letter-spacing:.04em; color:#043463; line-height:1.1; }
  .td-card-desc { font-size:.85rem; color:#4a5568; line-height:1.75; }
  .td-card-foot { margin-top:auto; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:.875rem; padding-top:.875rem; border-top:1px solid rgba(4,52,99,.1); }
  .td-deadline { display:flex; align-items:center; gap:.5rem; font-size:.78rem; color:#4a5568; }
  .td-deadline-icon { color:#ee4c05; flex-shrink:0; }
  .td-category { font-size:.6rem; font-weight:800; letter-spacing:.15em; text-transform:uppercase; padding:.3rem .75rem; border-radius:100px; background:rgba(14,127,187,.1); color:#0e7fbb; }

  /* Download btn */
  .td-dl-btn { display:inline-flex; align-items:center; gap:.5rem; font-family:'Outfit',sans-serif; font-size:.68rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:#ee4c05; background:none; border:1.5px solid rgba(238,76,5,.3); padding:.5rem 1rem; cursor:pointer; border-radius:2px; transition:all .2s; text-decoration:none; }
  .td-dl-btn:hover { background:#ee4c05; color:#ffffff; border-color:#ee4c05; }
  .td-dl-btn:disabled { opacity:.4; cursor:not-allowed; }

  /* Subscribe */
  .td-sub { background:#f0f4f8; border:1px solid rgba(4,52,99,.1); border-radius:2px; padding:clamp(2rem,4vw,3rem); margin-top:clamp(3rem,6vw,5rem); }
  .td-sub-grid { display:grid; grid-template-columns:1fr; gap:2rem; }
  @media(min-width:768px){ .td-sub-grid { grid-template-columns:1fr 1fr; align-items:center; } }
  .td-sub-form { display:flex; gap:.75rem; flex-wrap:wrap; }
  .td-sub-input { flex:1; min-width:200px; background:#ffffff; border:1px solid rgba(4,52,99,.2); color:#043463; font-family:'Outfit',sans-serif; font-size:.875rem; padding:.875rem 1.125rem; border-radius:2px; outline:none; transition:border-color .2s; }
  .td-sub-input::placeholder { color:#a0aec0; }
  .td-sub-input:focus { border-color:#ee4c05; background:rgba(238,76,5,.04); box-shadow:0 0 0 3px rgba(238,76,5,.1); }

  /* Empty/error */
  .td-empty { text-align:center; padding:4rem 0; }
  .td-empty-icon { font-size:3.5rem; color:rgba(4,52,99,.1); margin:0 auto 1.25rem; }

  /* Reveal */
  .td-rv { height:100%; opacity:0; transform:translateY(24px); transition:opacity .7s ease,transform .7s ease; }
  .td-rv.in { opacity:1; transform:none; }

  /* Grid */
  .td-grid { display:grid; grid-template-columns:1fr; gap:1.25rem; }
  @media(min-width:768px){ .td-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:1200px){ .td-grid { grid-template-columns:repeat(3,1fr); } }
`;

const STATUS_CONFIG = {
  open:    { label:"Open",    icon:<FaClock/>,       color:"#22c55e", bg:"rgba(34,197,94,.12)",  border:"rgba(34,197,94,.3)",  bar:"#22c55e" },
  closed:  { label:"Closed",  icon:<FaTimesCircle/>, color:"#ef4444", bg:"rgba(239,68,68,.12)",  border:"rgba(239,68,68,.3)",  bar:"#ef4444" },
  awarded: { label:"Awarded", icon:<FaCheckCircle/>, color:"#0e7fbb", bg:"rgba(14,127,187,.12)", border:"rgba(14,127,187,.3)", bar:"#0e7fbb" },
};

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); obs.disconnect(); } }, { threshold:.08 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return ref;
}
const Reveal = ({ children, delay=0 }) => {
  const ref = useReveal();
  return <div ref={ref} className="td-rv" style={{ transitionDelay:`${delay}ms` }}>{children}</div>;
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.closed;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:".35rem", fontSize:".6rem", fontWeight:800, letterSpacing:".15em", textTransform:"uppercase", padding:".3rem .75rem", borderRadius:"100px", background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}` }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const fmtDeadline = (d) => { try { return new Date(d).toLocaleDateString("en-KE", { day:"numeric", month:"long", year:"numeric" }); } catch { return d; } };
const isExpired   = (d) => { try { return new Date(d) < new Date(); } catch { return false; } };

export default function TendersPage() {
  const [tenders, setTenders]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [hasError, setHasError]   = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch]       = useState("");
  const [subEmail, setSubEmail]   = useState("");
  const [subMsg, setSubMsg]       = useState("");

  const fetchTenders = useCallback(() => {
    setLoading(true); setHasError(false);
    axios.get("https://imarikafoundation.org/api/api/tenders/")
      .then(r => { setTenders(r.data ?? []); setLoading(false); })
      .catch(() => {
        /* Graceful fallback — use sample data so page is always useful */
        setTenders(SAMPLE_TENDERS);
        setLoading(false);
      });
  }, []);

  useEffect(() => { fetchTenders(); }, [fetchTenders]);

  const filtered = tenders.filter(t => {
    const matchTab    = activeTab === "all" || t.status === activeTab;
    const q           = search.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) || t.ref?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const counts = {
    all:     tenders.length,
    open:    tenders.filter(t => t.status === "open").length,
    closed:  tenders.filter(t => t.status === "closed").length,
    awarded: tenders.filter(t => t.status === "awarded").length,
  };

  const handleSubscribe = e => {
    e.preventDefault();
    if (!subEmail) return;
    setSubMsg("✓ You're subscribed! We'll notify you when new tenders are published.");
    setSubEmail("");
  };

  return (
    <div className="cf-root">
      <style>{TENDER_CSS}</style>
      <Helmet><title>Tenders · Imarika Foundation</title></Helmet>
      <Navbar />

      {/* Hero */}
      <section className="td-hero">
        <div className="td-ghost" aria-hidden="true">TENDERS</div>
        <div className="td-slash" style={{ height:"clamp(80px,12vh,130px)", right:"clamp(1.5rem,8vw,6rem)", top:"50%" }} aria-hidden="true" />
        <div className="td-slash" style={{ height:"clamp(50px,7vh,80px)", right:"clamp(3rem,11vw,9.5rem)", top:"52%", opacity:.35 }} aria-hidden="true" />
        <div style={{ maxWidth:700, position:"relative", zIndex:1 }}>
          <span className="cf-label" style={{ color:"#46c5e4" }}>Procurement</span>
          <h1 className="cf-h1" style={{ color:"#fff" }}>
            TENDERS &amp;<br/><span style={{ color:"#ee4c05" }}>OPPORTUNITIES.</span>
          </h1>
          <p style={{ color:"#46c5e4", fontSize:"clamp(.9rem,1.8vw,1.05rem)", lineHeight:1.8, marginTop:"1.5rem", maxWidth:520 }}>
            We are committed to transparency in procurement. Below are current and past tender opportunities for vendors, suppliers, and consultants.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section style={{ background:"#ffffff", padding:"var(--cv) var(--cp)" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>

          {/* Stats */}
          <Reveal>
            <div className="td-stats">
              {[
                { n:counts.all,     l:"Total Tenders", col:"#ee4c05" },
                { n:counts.open,    l:"Open",          col:"#22c55e" },
                { n:counts.closed,  l:"Closed",        col:"#ef4444" },
                { n:counts.awarded, l:"Awarded",       col:"#0e7fbb" },
              ].map(s => (
                <div key={s.l} className="td-stat">
                  <div className="td-stat-n" style={{ color:s.col }}>{s.n}</div>
                  <div className="td-stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Filter bar */}
          <Reveal>
            <div className="td-filter-bar">
              <div className="td-search" role="search" aria-label="Search tenders">
                <FaSearch className="td-search-icon" aria-hidden="true" />
                <input type="search" className="td-search-input" placeholder="Search by title, reference, or keyword…"
                       value={search} onChange={e => setSearch(e.target.value)} aria-label="Search tenders" />
              </div>
              <div className="cf-tabs" role="tablist" aria-label="Filter by status">
                {[
                  { k:"all",     l:`All (${counts.all})` },
                  { k:"open",    l:`Open (${counts.open})` },
                  { k:"closed",  l:`Closed (${counts.closed})` },
                  { k:"awarded", l:`Awarded (${counts.awarded})` },
                ].map(t => (
                  <button key={t.k} role="tab" aria-selected={activeTab === t.k}
                          className={`cf-tab ${activeTab === t.k ? "active" : ""}`}
                          onClick={() => setActiveTab(t.k)}>
                    {t.l}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Tenders */}
          {loading ? (
            <div className="td-grid">
              {Array.from({length:6}).map((_,i) => (
                <div key={i} style={{ background:"#ffffff", border:"1px solid rgba(4,52,99,.1)", borderRadius:2, padding:"1.75rem", display:"flex", flexDirection:"column", gap:".875rem" }} aria-hidden="true">
                  {[40,80,60,100,70].map((w,j) => <div key={j} className="cf-skel" style={{ height:j===0?16:13, width:`${w}%`, background:"#e2e8f0" }} />)}
                </div>
              ))}
              <span role="status" className="sr-only">Loading tenders…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="td-empty">
              <FaFileAlt className="td-empty-icon" aria-hidden="true" />
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.75rem", letterSpacing:".04em", color:"#043463", marginBottom:".75rem" }}>
                {search ? "No Matching Tenders" : "No Tenders Found"}
              </h3>
              <p style={{ color:"#4a5568", fontSize:".875rem", maxWidth:360, margin:"0 auto" }}>
                {search ? "Try adjusting your search or changing the filter." : "There are no tenders in this category at the moment."}
              </p>
            </div>
          ) : (
            <div className="td-grid" role="list">
              {filtered.map((t, i) => {
                const cfg     = STATUS_CONFIG[t.status] ?? STATUS_CONFIG.closed;
                const expired = isExpired(t.deadline);
                return (
                  <Reveal key={t.id} delay={i * 60}>
                    <article className="td-card" style={{ "--cb": cfg.bar }} role="listitem" aria-labelledby={`td-${t.id}`}>
                      <div className="td-card-top">
                        <div className="td-card-meta">
                          <StatusBadge status={t.status} />
                          {t.category && <span className="td-category">{t.category}</span>}
                        </div>
                        {t.ref && (
                          <span className="td-card-ref" title="Reference number">
                            <FaHashtag style={{ display:"inline", fontSize:".7em", marginRight:2 }} />{t.ref}
                          </span>
                        )}
                      </div>
                      <h3 id={`td-${t.id}`} className="td-card-h3">{t.title}</h3>
                      {t.description && <p className="td-card-desc truncate-3">{t.description}</p>}
                      <div className="td-card-foot">
                        <div className="td-deadline">
                          <FaCalendarAlt className="td-deadline-icon" aria-hidden="true" />
                          <span>
                            {t.status === "awarded" ? "Awarded" : expired ? "Closed" : "Deadline"}:{" "}
                            <strong style={{ color: t.status === "open" && !expired ? "#22c55e" : "#4a5568" }}>
                              {fmtDeadline(t.deadline)}
                            </strong>
                          </span>
                        </div>
                        {t.file ? (
                          <a href={t.file} download target="_blank" rel="noopener noreferrer"
                             className="td-dl-btn" aria-label={`Download tender document: ${t.title}`}>
                            <FaDownload aria-hidden="true" /> Download
                          </a>
                        ) : t.status === "open" ? (
                          <a href="mailto:info@imarikafoundation.org?subject=Tender Enquiry: "
                             className="td-dl-btn" style={{ color:"#0e7fbb", borderColor:"rgba(14,127,187,.3)" }}
                             onMouseEnter={e=>{ e.currentTarget.style.background="#0e7fbb"; e.currentTarget.style.color="#fff"; }}
                             onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color="#0e7fbb"; }}>
                            <FaEnvelope aria-hidden="true" /> Enquire
                          </a>
                        ) : null}
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}

          {/* Email subscription */}
          <Reveal>
            <div className="td-sub" role="complementary" aria-labelledby="td-sub-h">
              <div className="td-sub-grid">
                <div>
                  <span className="cf-label" style={{ color:"#0e7fbb" }}>Stay Updated</span>
                  <h3 id="td-sub-h" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(1.5rem,3vw,2.25rem)", letterSpacing:".04em", color:"#043463", marginBottom:".75rem" }}>
                    GET TENDER ALERTS.
                  </h3>
                  <p style={{ color:"#4a5568", fontSize:".875rem", lineHeight:1.75 }}>
                    Subscribe to receive email notifications whenever new tenders are published by Imarika Foundation.
                  </p>
                </div>
                <div>
                  {subMsg ? (
                    <div style={{ display:"flex", alignItems:"center", gap:".75rem", color:"#22c55e", fontSize:".875rem", padding:"1rem", background:"rgba(34,197,94,.08)", border:"1px solid rgba(34,197,94,.2)", borderRadius:2 }}>
                      <FaCheckCircle aria-hidden="true" /> {subMsg}
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="td-sub-form" noValidate aria-label="Subscribe to tender alerts">
                      <label htmlFor="td-email" className="sr-only">Email address</label>
                      <input id="td-email" type="email" className="td-sub-input" placeholder="your@email.com"
                             value={subEmail} onChange={e => setSubEmail(e.target.value)} required aria-required="true" />
                      <button type="submit" className="cf-btn cf-btn-orange" style={{ clipPath:"polygon(8px 0%,100% 0%,calc(100%-8px) 100%,0% 100%)", flexShrink:0 }}>
                        <FaEnvelope aria-hidden="true" /> Subscribe
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Contact note */}
          <Reveal>
            <div style={{ marginTop:"2rem", padding:"1.5rem", background:"rgba(14,127,187,.05)", border:"1px solid rgba(14,127,187,.2)", borderRadius:2, display:"flex", alignItems:"flex-start", gap:"1rem", flexWrap:"wrap" }}>
              <FaEnvelope style={{ color:"#0e7fbb", fontSize:"1.25rem", flexShrink:0, marginTop:".15rem" }} aria-hidden="true" />
              <div>
                <p style={{ color:"#4a5568", fontSize:".875rem", lineHeight:1.7 }}>
                  <strong style={{ color:"#043463" }}>Questions about a tender?</strong>{" "}
                  Contact our procurement team at{" "}
                  <a href="mailto:info@imarikafoundation.org" style={{ color:"#0e7fbb" }}>info@imarikafoundation.org</a>
                  {" "}or call{" "}
                  <a href="tel:+254790289989" style={{ color:"#0e7fbb" }}>+254 790 289 989</a>.
                  All responses will be circulated to all registered bidders.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer strip */}
      <footer style={{ background:"#043463", padding:"2rem var(--cp)", textAlign:"center", borderTop:"1px solid rgba(255,255,255,.1)" }}>
        <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:".72rem", color:"rgba(255,255,255,.7)" }}>
          © {new Date().getFullYear()} Imarika Foundation · Kenya
        </p>
      </footer>
    </div>
  );
}