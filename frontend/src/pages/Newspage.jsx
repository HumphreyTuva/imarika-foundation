import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCalendarAlt, FaMapMarkerAlt, FaImages, FaNewspaper, FaBullhorn, FaCamera, FaRedo } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import Navbar from "../components/Navbar";
import "../components/coastal-fire.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const NW_CSS = `
  /* Hero */
  .nw-hero { background:#043463; padding:clamp(8rem,15vh,11rem) var(--cp) clamp(4rem,7vh,6rem); position:relative; overflow:hidden; }
  .nw-ghost { position:absolute; font-family:'Bebas Neue',sans-serif; font-size:clamp(10rem,25vw,20rem); line-height:.85; color:rgba(238,76,5,.05); right:-3%; top:50%; transform:translateY(-50%); user-select:none; pointer-events:none; }
  .nw-slash { position:absolute; width:3px; background:#ee4c05; border-radius:2px; transform:rotate(12deg); transform-origin:top center; }

  /* Section tabs - Mobile Responsive */
  .nw-tabs { 
    display: flex; 
    flex-wrap: wrap; 
    gap: 0.5rem; 
    margin-bottom: clamp(2rem, 4vw, 3rem); 
  }
  
  /* Mobile: Full width tabs stacked vertically */
  @media (max-width: 480px) {
    .nw-tabs {
      flex-direction: column;
      gap: 0.625rem;
    }
    .nw-tabs .cf-tab {
      width: 100%;
      justify-content: center;
      padding: 0.875rem 1rem;
      font-size: 0.8rem;
    }
  }
  
  /* Tablet: Two tabs per row */
  @media (min-width: 481px) and (max-width: 767px) {
    .nw-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.625rem;
    }
    .nw-tabs .cf-tab {
      width: 100%;
      justify-content: center;
      padding: 0.875rem 0.75rem;
      font-size: 0.8rem;
    }
    /* Third tab spans full width if odd number */
    .nw-tabs .cf-tab:nth-child(3):last-child {
      grid-column: 1 / -1;
    }
  }
  
  /* Desktop: Inline tabs */
  @media (min-width: 768px) {
    .nw-tabs {
      flex-direction: row;
      flex-wrap: nowrap;
    }
    .nw-tabs .cf-tab {
      width: auto;
      white-space: nowrap;
    }
  }

  /* Light Theme Tab Styles */
  .nw-tabs .cf-tab {
    background: #ffffff;
    color: #043463;
    border: 1px solid rgba(4,52,99,.2);
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .nw-tabs .cf-tab:hover {
    border-color: #ee4c05;
    color: #ee4c05;
  }
  .nw-tabs .cf-tab.active {
    background: #043463;
    color: #ffffff;
    border-color: #043463;
  }

  /* Upcoming events grid */
  .nw-ev-grid { display:grid; grid-template-columns:1fr; gap:1.25rem; }
  @media(min-width:640px){ .nw-ev-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:1024px){ .nw-ev-grid { grid-template-columns:repeat(3,1fr); } }

  /* Event card */
  .nw-ev-card { background:#ffffff; border:1px solid rgba(4,52,99,.1); border-radius:2px; overflow:hidden; display:flex; flex-direction:column; transition:border-color .25s,transform .3s,box-shadow .3s; }
  .nw-ev-card:hover { border-color:rgba(238,76,5,.4); transform:translateY(-4px); box-shadow:0 20px 40px rgba(4,52,99,.08); }
  .nw-ev-poster { position:relative; aspect-ratio:16/9; background:#f0f4f8; overflow:hidden; }
  .nw-ev-poster img { width:100%; height:100%; object-fit:cover; transition:transform .4s; display:block; }
  .nw-ev-card:hover .nw-ev-poster img { transform:scale(1.05); }
  .nw-ev-poster-ph { width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#f0f4f8,#e2e8f0); }
  .nw-ev-cd { position:absolute; top:.75rem; right:.75rem; font-size:.6rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; padding:.3rem .75rem; border-radius:100px; }
  .nw-ev-body { padding:1.5rem; display:flex; flex-direction:column; gap:.75rem; flex:1; }
  .nw-ev-status { display:inline-flex; align-items:center; gap:.35rem; font-size:.6rem; font-weight:800; letter-spacing:.15em; text-transform:uppercase; padding:.3rem .75rem; border-radius:100px; align-self:flex-start; }
  .nw-ev-h3 { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.1rem,2.5vw,1.5rem); letter-spacing:.04em; color:#043463; line-height:1; flex:1; }
  .nw-ev-meta { display:flex; flex-direction:column; gap:.375rem; }
  .nw-ev-meta-row { display:flex; align-items:center; gap:.5rem; font-size:.775rem; color:#4a5568; }
  .nw-ev-meta-icon { color:#ee4c05; font-size:.8rem; flex-shrink:0; }

  /* Past events / gallery carousel */
  .nw-past-card { background:#ffffff; border:1px solid rgba(4,52,99,.1); border-radius:2px; overflow:hidden; display:flex; flex-direction:column; height:100%; transition:border-color .25s,transform .3s; }
  .nw-past-card:hover { border-color:rgba(238,76,5,.4); transform:translateY(-3px); }
  .nw-past-poster { position:relative; aspect-ratio:16/9; overflow:hidden; background:#f0f4f8; }
  .nw-past-poster img { width:100%; height:100%; object-fit:cover; transition:transform .4s; display:block; }
  .nw-past-card:hover .nw-past-poster img { transform:scale(1.05); }
  .nw-past-body { padding:1.25rem; flex:1; display:flex; flex-direction:column; gap:.625rem; }
  .nw-past-h3 { font-family:'Bebas Neue',sans-serif; font-size:1.25rem; letter-spacing:.04em; color:#043463; line-height:1; }
  .nw-past-count { position:absolute; bottom:.625rem; right:.625rem; display:inline-flex; align-items:center; gap:.35rem; background:rgba(4,52,99,.8); color:#ffffff; font-size:.6rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; padding:.3rem .625rem; border-radius:100px; }

  /* Newsletter */
  .nw-newsletter { background:#ee4c05; padding:clamp(3rem,6vw,5rem) var(--cp); position:relative; overflow:hidden; }
  .nw-nl-ghost { position:absolute; font-family:'Bebas Neue',sans-serif; font-size:clamp(8rem,20vw,16rem); line-height:.85; color:rgba(4,52,99,.06); right:-2%; top:50%; transform:translateY(-50%); user-select:none; pointer-events:none; }
  .nw-nl-grid { display:grid; grid-template-columns:1fr; gap:2rem; }
  @media(min-width:768px){ .nw-nl-grid { grid-template-columns:1fr 1fr; align-items:center; } }
  .nw-nl-form { display:flex; gap:.75rem; flex-wrap:wrap; }
  .nw-nl-input { flex:1; min-width:200px; background:#ffffff; border:1.5px solid rgba(4,52,99,.2); color:#043463; font-family:'Outfit',sans-serif; font-size:.875rem; padding:.875rem 1.125rem; border-radius:2px; outline:none; transition:border-color .2s; }
  .nw-nl-input::placeholder { color:#a0aec0; }
  .nw-nl-input:focus { border-color:#043463; }

  /* Skel */
  .nw-skel { background:#ffffff; border:1px solid rgba(4,52,99,.1); border-radius:2px; overflow:hidden; }
  .nw-skel-img { width:100%; aspect-ratio:16/9; background:#f0f4f8; }
  .nw-skel-body { padding:1.5rem; display:flex; flex-direction:column; gap:.75rem; }
  .nw-skel .cf-skel { background:#e2e8f0; }

  /* Reveal */
  .nw-rv { opacity:0; transform:translateY(24px); transition:opacity .7s ease,transform .7s ease; }
  .nw-rv.in { opacity:1; transform:none; }
`;

const fmtDate = d => { try { return new Date(d).toLocaleDateString("en-KE", { weekday:"short", day:"numeric", month:"short", year:"numeric" }); } catch { return null; } };
const fmtTime = t => { if (!t || !t.includes(":")) return null; try { const [h,m]=t.split(":"); const d=new Date(); d.setHours(+h,+m); return d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true}); } catch { return null; } };
const countdown = d => { if (!d) return null; try { const td=new Date(); td.setHours(0,0,0,0); const ed=new Date(d); ed.setHours(0,0,0,0); const diff=Math.round((ed-td)/86400000); if(diff<0) return null; if(diff===0) return {label:"Today",cls:"#ffffff",bg:"rgba(238,76,5,.9)"}; if(diff===1) return {label:"Tomorrow",cls:"#ffffff",bg:"rgba(14,127,187,.9)"}; if(diff<=7) return {label:`In ${diff} days`,cls:"#ffffff",bg:"rgba(4,52,99,.9)"}; return null; } catch { return null; } };
const STATUS_MAP = { upcoming:{label:"Upcoming",bg:"rgba(14,127,187,.1)",col:"#0e7fbb"}, postponed:{label:"Postponed",bg:"rgba(238,76,5,.1)",col:"#ee4c05"}, cancelled:{label:"Cancelled",bg:"rgba(4,52,99,.1)",col:"#043463"} };

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
  return <div ref={ref} className="nw-rv" style={{ transitionDelay:`${delay}ms`, ...style }}>{children}</div>;
};

/* ── Event card (upcoming) ── */
const UpcomingCard = ({ ev }) => {
  const [imgErr, setImgErr] = useState(false);
  const cover = ev.images?.[0];
  const src = cover ? (typeof cover === "string" ? cover : cover.image) : null;
  const cd = countdown(ev.event_date);
  const st = STATUS_MAP[ev.status] ?? STATUS_MAP.upcoming;
  const start = fmtTime(ev.start_time), end = fmtTime(ev.end_time);

  return (
    <article className="nw-ev-card">
      <div className="nw-ev-poster">
        {src && !imgErr ? (
          <img src={src} alt={`Event: ${ev.title}`} loading="lazy" onError={() => setImgErr(true)} />
        ) : (
          <div className="nw-ev-poster-ph" aria-hidden="true">
            <FaCalendarAlt style={{ fontSize:"3rem", color:"rgba(4,52,99,.1)" }} />
          </div>
        )}
        {cd && (
          <span className="nw-ev-cd" style={{ background:cd.bg, color:cd.cls }}>{cd.label}</span>
        )}
      </div>
      <div className="nw-ev-body">
        <span className="nw-ev-status" style={{ background:st.bg, color:st.col }}>{st.label}</span>
        <h3 className="nw-ev-h3">{ev.title}</h3>
        {ev.description && (
          <p style={{ fontSize:".8rem", color:"#4a5568", lineHeight:1.7 }} className="truncate-2">{ev.description}</p>
        )}
        <div className="nw-ev-meta">
          {ev.event_date && (
            <div className="nw-ev-meta-row"><FaCalendarAlt className="nw-ev-meta-icon" aria-hidden="true" />
              <time dateTime={ev.event_date}>{fmtDate(ev.event_date)}</time>
              {start && <span>· {start}{end ? ` – ${end}` : ""}</span>}
            </div>
          )}
          {ev.location && <div className="nw-ev-meta-row"><FaMapMarkerAlt className="nw-ev-meta-icon" aria-hidden="true" />{ev.location}</div>}
        </div>
      </div>
    </article>
  );
};

/* ── Past event card ── */
const PastCard = ({ ev }) => {
  const [imgErr, setImgErr] = useState(false);
  const cover = ev.images?.[0];
  const src = cover ? (typeof cover === "string" ? cover : cover.image) : null;
  const count = ev.images?.length ?? 0;

  return (
    <article className="nw-past-card">
      <div className="nw-past-poster">
        {src && !imgErr ? (
          <img src={src} alt={ev.title} loading="lazy" onError={() => setImgErr(true)} />
        ) : (
          <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#f0f4f8,#e2e8f0)" }} aria-hidden="true">
            <FaImages style={{ fontSize:"3rem", color:"rgba(4,52,99,.1)" }} />
          </div>
        )}
        {count > 0 && (
          <span className="nw-past-count">
            <FaImages style={{ fontSize:".65rem" }} aria-hidden="true" />{count}
          </span>
        )}
      </div>
      <div className="nw-past-body">
        <h3 className="nw-past-h3">{ev.title}</h3>
        {ev.event_date && (
          <p style={{ fontSize:".72rem", color:"#0e7fbb", display:"flex", alignItems:"center", gap:".375rem" }}>
            <FaCalendarAlt aria-hidden="true" />{fmtDate(ev.event_date)}
          </p>
        )}
        <Link to={`/gallery/${ev.id}`} style={{ display:"inline-flex", alignItems:"center", gap:".5rem", fontSize:".65rem", fontWeight:800, letterSpacing:".12em", textTransform:"uppercase", color:"#ee4c05", textDecoration:"none", marginTop:"auto", transition:"gap .2s" }}>
          View Gallery <FaArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default function NewsPage() {
  const [upcoming, setUpcoming]   = useState([]);
  const [past, setPast]           = useState([]);
  const [loadingUp, setLoadingUp] = useState(true);
  const [loadingPast, setLoadingPast] = useState(true);
  const [errUp, setErrUp]         = useState(false);
  const [errPast, setErrPast]     = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [nlEmail, setNlEmail]     = useState("");
  const [nlMsg, setNlMsg]         = useState("");
  const [paused, setPaused]       = useState(false);

  const fetchUpcoming = useCallback(() => {
    setLoadingUp(true); setErrUp(false);
    axios.get("https://imarikafoundation.org/api/api/events/upcoming/")
      .then(r => { setUpcoming(r.data ?? []); setLoadingUp(false); })
      .catch(() => { setErrUp(true); setLoadingUp(false); });
  }, []);

  const fetchPast = useCallback(() => {
    setLoadingPast(true); setErrPast(false);
    axios.get("https://imarikafoundation.org/api/api/events/past/")
      .then(r => { setPast(r.data ?? []); setLoadingPast(false); })
      .catch(() => { setErrPast(true); setLoadingPast(false); });
  }, []);

  useEffect(() => { fetchUpcoming(); fetchPast(); }, [fetchUpcoming, fetchPast]);

  const handleNlSubmit = e => {
    e.preventDefault();
    if (!nlEmail) return;
    setNlMsg("✓ Subscribed! You'll receive our latest news and event updates.");
    setNlEmail("");
  };

  return (
    <div className="cf-root">
      <style>{NW_CSS}</style>
      <Helmet><title>News & Updates · Imarika Foundation</title></Helmet>
      <Navbar />

      {/* Hero */}
      <section className="nw-hero">
        <div className="nw-ghost" aria-hidden="true">NEWS</div>
        <div className="nw-slash" style={{ height:"clamp(80px,12vh,130px)", right:"clamp(1.5rem,8vw,6rem)", top:"50%" }} aria-hidden="true" />
        <div className="nw-slash" style={{ height:"clamp(50px,7vh,80px)", right:"clamp(3rem,11vw,9.5rem)", top:"52%", opacity:.35 }} aria-hidden="true" />
        <div style={{ maxWidth:700, position:"relative", zIndex:1 }}>
          <span className="cf-label" style={{ color:"#46c5e4" }}>Stay Informed</span>
          <h1 className="cf-h1" style={{ color:"#fff" }}>
            NEWS &amp;<br/><span style={{ color:"#ee4c05" }}>UPDATES.</span>
          </h1>
          <p style={{ color:"#46c5e4", fontSize:"clamp(.9rem,1.8vw,1.05rem)", lineHeight:1.8, marginTop:"1.5rem", maxWidth:520 }}>
            Stay up to date with the latest events, announcements, and stories from Imarika Foundation and our communities across coastal Kenya.
          </p>
        </div>
      </section>

      {/* Tab selector */}
      <section style={{ background:"#ffffff", padding:"var(--cv) var(--cp)" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <Reveal>
            <div className="nw-tabs" role="tablist" aria-label="News sections" style={{ marginBottom:"clamp(2.5rem,5vw,4rem)" }}>
              {[
                { k:"upcoming", l:"Upcoming Events",    icon:<FaCalendarAlt /> },
                { k:"past",     l:"Past Events & Gallery", icon:<FaImages /> },
                { k:"articles", l:"Articles",           icon:<FaNewspaper /> },
              ].map(t => (
                <button key={t.k} role="tab" aria-selected={activeTab===t.k}
                        className={`cf-tab ${activeTab===t.k?"active":""}`}
                        onClick={() => setActiveTab(t.k)}
                        style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
                  {t.icon} {t.l}
                </button>
              ))}
            </div>
          </Reveal>

          {/* ── UPCOMING EVENTS ── */}
          {activeTab === "upcoming" && (
            <>
              <Reveal>
                <div style={{ display:"flex", flexWrap:"wrap", alignItems:"flex-end", justifyContent:"space-between", gap:"1rem", marginBottom:"clamp(2rem,4vw,3rem)" }}>
                  <div>
                    <span className="cf-label" style={{ color:"#043463" }}>What's Coming</span>
                    <h2 className="cf-h2" style={{ color:"#043463" }}>UPCOMING <span style={{ color:"#ee4c05" }}>EVENTS.</span></h2>
                  </div>
                  {upcoming.length > 0 && (
                    <span style={{ fontSize:".72rem", color:"#0e7fbb", fontWeight:700 }}>
                      {upcoming.length} event{upcoming.length!==1?"s":""} scheduled
                    </span>
                  )}
                </div>
              </Reveal>
              {loadingUp ? (
                <div className="nw-ev-grid" aria-busy="true">
                  {Array.from({length:3}).map((_,i)=>(
                    <div key={i} className="nw-skel" aria-hidden="true">
                      <div className="nw-skel-img cf-skel" />
                      <div className="nw-skel-body">{[50,80,60,100,70].map((w,j)=><div key={j} className="cf-skel" style={{ height:j===0?14:12, width:`${w}%` }} />)}</div>
                    </div>
                  ))}
                  <span role="status" className="sr-only">Loading upcoming events…</span>
                </div>
              ) : errUp ? (
                <div style={{ textAlign:"center", padding:"3rem 0" }}>
                  <FaCalendarAlt style={{ fontSize:"3rem", color:"rgba(4,52,99,.1)", marginBottom:"1rem", display:"block", margin:"0 auto 1rem" }} aria-hidden="true" />
                  <p style={{ color:"#4a5568", marginBottom:"1.25rem" }}>Could not load upcoming events.</p>
                  <button className="cf-btn cf-btn-orange" onClick={fetchUpcoming} style={{ clipPath:"none", borderRadius:2, margin:"0 auto", display:"inline-flex" }}>
                    <FaRedo aria-hidden="true" /> Retry
                  </button>
                </div>
              ) : upcoming.length === 0 ? (
                <div style={{ textAlign:"center", padding:"3rem 0" }}>
                  <FaCalendarAlt style={{ fontSize:"3rem", color:"rgba(4,52,99,.1)", marginBottom:"1rem", display:"block", margin:"0 auto 1rem" }} aria-hidden="true" />
                  <p style={{ color:"#043463", fontWeight:600 }}>No upcoming events at the moment.</p>
                  <p style={{ color:"#4a5568", fontSize:".875rem", marginTop:".5rem" }}>Subscribe to our newsletter below to be notified of new events.</p>
                </div>
              ) : (
                <div className="nw-ev-grid" role="list">
                  {upcoming.map((ev, i) => (
                    <Reveal key={ev.id} delay={i*70}>
                      <div role="listitem"><UpcomingCard ev={ev} /></div>
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── PAST EVENTS ── */}
          {activeTab === "past" && (
            <>
              <Reveal>
                <div style={{ display:"flex", flexWrap:"wrap", alignItems:"flex-end", justifyContent:"space-between", gap:"1rem", marginBottom:"clamp(2rem,4vw,3rem)" }}>
                  <div>
                    <span className="cf-label" style={{ color:"#043463" }}>In the Field</span>
                    <h2 className="cf-h2" style={{ color:"#043463" }}>PAST <span style={{ color:"#ee4c05" }}>EVENTS.</span></h2>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:".875rem", flexWrap:"wrap" }}>
                    {past.length > 3 && (
                      <button className="cf-tab" onClick={() => setPaused(p=>!p)} aria-pressed={paused}
                              style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
                        {paused ? "▶ Resume" : "⏸ Pause"}
                      </button>
                    )}
                  </div>
                </div>
              </Reveal>
              {loadingPast ? (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"1.25rem" }} aria-busy="true">
                  {Array.from({length:3}).map((_,i)=>(
                    <div key={i} className="nw-skel" aria-hidden="true">
                      <div className="nw-skel-img cf-skel" />
                      <div className="nw-skel-body">{[70,50,100].map((w,j)=><div key={j} className="cf-skel" style={{ height:j===0?18:12, width:`${w}%` }} />)}</div>
                    </div>
                  ))}
                  <span role="status" className="sr-only">Loading past events…</span>
                </div>
              ) : errPast ? (
                <div style={{ textAlign:"center", padding:"3rem 0" }}>
                  <button className="cf-btn cf-btn-orange" onClick={fetchPast} style={{ clipPath:"none", borderRadius:2, margin:"0 auto", display:"inline-flex" }}>
                    <FaRedo aria-hidden="true" /> Retry
                  </button>
                </div>
              ) : past.length === 0 ? (
                <div style={{ textAlign:"center", padding:"3rem 0" }}>
                  <FaImages style={{ fontSize:"3rem", color:"rgba(4,52,99,.1)", marginBottom:"1rem", display:"block", margin:"0 auto 1rem" }} aria-hidden="true" />
                  <p style={{ color:"#043463", fontWeight:600 }}>No past events yet.</p>
                </div>
              ) : (
                <Swiper
                  modules={[Navigation, Autoplay, Pagination]}
                  navigation
                  pagination={{ clickable:true }}
                  autoplay={paused ? false : { delay:5000, disableOnInteraction:false }}
                  loop={past.length > 3}
                  spaceBetween={16}
                  slidesPerView={1}
                  breakpoints={{ 640:{slidesPerView:2}, 1024:{slidesPerView:3} }}
                  a11y={{ prevSlideMessage:"Previous event", nextSlideMessage:"Next event" }}
                  aria-label="Past events gallery"
                  className="pb-12">
                  {past.map((ev, i) => (
                    <SwiperSlide key={ev.id ?? i}>
                      <PastCard ev={ev} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </>
          )}

          {/* ── ARTICLES redirect ── */}
          {activeTab === "articles" && (
            <Reveal>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"3rem 0", gap:"1.5rem" }}>
                <FaNewspaper style={{ fontSize:"4rem", color:"rgba(238,76,5,.2)" }} aria-hidden="true" />
                <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(1.75rem,4vw,3rem)", letterSpacing:".04em", color:"#043463" }}>
                  ARTICLES &amp; INSIGHTS
                </h2>
                <p style={{ color:"#4a5568", fontSize:".9rem", lineHeight:1.8, maxWidth:480 }}>
                  Thought leadership, community stories, research, and opinion pieces from Imarika Foundation and our network of community voices.
                </p>
                <Link to="/articles" className="cf-btn cf-btn-orange" style={{ clipPath:"none", borderRadius:2, marginTop:".5rem" }}>
                  Browse All Articles <FaArrowRight aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Newsletter subscription */}
      <section className="nw-newsletter">
        <div className="nw-nl-ghost" aria-hidden="true">SUBSCRIBE</div>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto", position:"relative", zIndex:1 }}>
          <div className="nw-nl-grid">
            <div>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2rem,5vw,3.5rem)", lineHeight:.9, color:"#ffffff", letterSpacing:".02em", marginBottom:"1rem" }}>
                STAY IN THE LOOP.
              </h2>
              <p style={{ color:"rgba(255,255,255,.9)", fontSize:"clamp(.875rem,1.5vw,1rem)", lineHeight:1.75, maxWidth:440 }}>
                Subscribe to receive news, event invitations, and updates from Imarika Foundation directly in your inbox.
              </p>
            </div>
            <div>
              {nlMsg ? (
                <div style={{ display:"flex", alignItems:"center", gap:".875rem", background:"#043463", border:"none", borderRadius:2, padding:"1.25rem", color:"#ffffff", fontSize:".9rem", fontWeight:600 }}>
                  ✓ {nlMsg}
                </div>
              ) : (
                <form onSubmit={handleNlSubmit} className="nw-nl-form" noValidate aria-label="Newsletter subscription">
                  <label htmlFor="nw-email" className="sr-only">Email address</label>
                  <input id="nw-email" type="email" className="nw-nl-input" placeholder="your@email.com"
                         value={nlEmail} onChange={e=>setNlEmail(e.target.value)} required aria-required="true" />
                  <button type="submit" style={{ display:"inline-flex", alignItems:"center", gap:".5rem", background:"#043463", color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:".72rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", padding:".875rem 2rem", border:"none", cursor:"pointer", borderRadius:2, transition:"background .2s", flexShrink:0 }}>
                    Subscribe <FaArrowRight aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background:"#043463", padding:"2rem var(--cp)", textAlign:"center", borderTop:"1px solid rgba(255,255,255,.1)" }}>
        <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:".72rem", color:"rgba(255,255,255,.7)" }}>
          © {new Date().getFullYear()} Imarika Foundation · Kenya
        </p>
      </footer>
    </div>
  );
}