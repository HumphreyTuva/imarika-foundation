import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FaSearch, FaArrowRight, FaNewspaper, FaRedo, FaDownload, FaBookOpen, FaCalendarAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import "../components/coastal-fire.css";

const BATCH = 9; // articles per page

const CATEGORIES = ["All", "Community Voices", "Research & Insights", "Opinion", "Success Stories", "Health", "Environment", "Education"];

const AR_CSS = `
  /* Hero */
  .ar-hero { background:#043463; padding:clamp(8rem,15vh,11rem) var(--cp) clamp(4rem,7vh,6rem); position:relative; overflow:hidden; }
  .ar-ghost { position:absolute; font-family:'Bebas Neue',sans-serif; font-size:clamp(10rem,25vw,20rem); line-height:.85; color:rgba(238,76,5,.05); right:-3%; top:50%; transform:translateY(-50%); user-select:none; pointer-events:none; }
  .ar-slash { position:absolute; width:3px; background:#ee4c05; border-radius:2px; transform:rotate(12deg); transform-origin:top center; }

  /* Featured */
  .ar-featured { display:grid; grid-template-columns:1fr; gap:0; background:#ffffff; border:1px solid rgba(4,52,99,.1); border-radius:2px; overflow:hidden; transition:border-color .25s,transform .3s,box-shadow .3s; text-decoration:none; }
  @media(min-width:768px){ .ar-featured { grid-template-columns:1.2fr 1fr; } }
  .ar-featured:hover { border-color:rgba(238,76,5,.4); transform:translateY(-4px); box-shadow:0 24px 48px rgba(4,52,99,.08); }
  .ar-featured-img { width:100%; aspect-ratio:16/9; object-fit:cover; background:#f0f4f8; display:block; }
  @media(min-width:768px){ .ar-featured-img { aspect-ratio:auto; height:100%; min-height:280px; } }
  .ar-featured-ph { width:100%; aspect-ratio:16/9; background:linear-gradient(135deg,#f0f4f8,#e2e8f0); display:flex; align-items:center; justify-content:center; }
  @media(min-width:768px){ .ar-featured-ph { aspect-ratio:auto; height:100%; min-height:280px; } }
  .ar-featured-ph-icon { font-size:4rem; color:rgba(238,76,5,.15); }
  .ar-featured-body { padding:clamp(1.75rem,4vw,3rem); display:flex; flex-direction:column; gap:1rem; justify-content:center; }
  .ar-featured-badge { display:inline-flex; align-items:center; gap:.375rem; font-size:.58rem; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:#ee4c05; margin-bottom:.5rem; }
  .ar-featured-h2 { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.5rem,4vw,2.5rem); letter-spacing:.04em; color:#043463; line-height:1.05; }
  .ar-featured-p { font-size:.875rem; color:#4a5568; line-height:1.8; }
  .ar-featured-cta { display:inline-flex; align-items:center; gap:.5rem; font-size:.7rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:#ee4c05; margin-top:.5rem; transition:gap .2s; }
  .ar-featured:hover .ar-featured-cta { gap:.875rem; }

  /* Search + filter */
  .ar-toolbar { display:flex; flex-wrap:wrap; gap:1rem; align-items:center; margin-bottom:clamp(2rem,4vw,3rem); }
  .ar-search { display:flex; align-items:center; gap:.75rem; flex:1; min-width:220px; background:#ffffff; border:1px solid rgba(4,52,99,.2); padding:.75rem 1.125rem; border-radius:2px; transition:border-color .2s; }
  .ar-search:focus-within { border-color:#ee4c05; background:rgba(238,76,5,.04); }
  .ar-search input { background:none; border:none; outline:none; color:#043463; font-family:'Outfit',sans-serif; font-size:.875rem; width:100%; }
  .ar-search input::placeholder { color:#a0aec0; }
  .ar-search-icon { color:#0e7fbb; flex-shrink:0; }

  /* Category tabs - Mobile Responsive */
  .cf-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: clamp(2rem, 4vw, 3rem);
  }
  
  /* Mobile: Scrollable horizontal with fade indicator */
  @media (max-width: 640px) {
    .cf-tabs {
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding-bottom: 0.5rem;
      margin-left: calc(var(--cp) * -1);
      margin-right: calc(var(--cp) * -1);
      padding-left: var(--cp);
      padding-right: var(--cp);
      mask-image: linear-gradient(to right, black 85%, transparent 100%);
      -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
    }
    .cf-tabs::-webkit-scrollbar {
      display: none;
    }
  }
  
  /* Base tab styling for light theme */
  .cf-tabs .cf-tab {
    flex-shrink: 0;
    white-space: nowrap;
    padding: 0.625rem 1rem;
    font-size: 0.75rem;
    background: #ffffff;
    color: #043463;
    border: 1px solid rgba(4,52,99,.2);
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .cf-tabs .cf-tab:hover {
    border-color: #ee4c05;
    color: #ee4c05;
  }
  .cf-tabs .cf-tab.active {
    background: #043463;
    color: #ffffff;
    border-color: #043463;
  }
  
  /* Tablet: Auto-fit grid */
  @media (min-width: 641px) and (max-width: 900px) {
    .cf-tabs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 0.625rem;
    }
    .cf-tabs .cf-tab {
      width: 100%;
      justify-content: center;
      padding: 0.75rem 0.5rem;
    }
  }
  
  /* Desktop: Inline with wrapping */
  @media (min-width: 901px) {
    .cf-tabs {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }

  /* Cards */
  .ar-grid { display:grid; grid-template-columns:1fr; gap:1.25rem; }
  @media(min-width:640px){ .ar-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:1024px){ .ar-grid { grid-template-columns:repeat(3,1fr); } }
  .ar-card { background:#ffffff; border:1px solid rgba(4,52,99,.1); border-radius:2px; overflow:hidden; display:flex; flex-direction:column; text-decoration:none; transition:border-color .25s,transform .3s,box-shadow .3s; }
  .ar-card:hover { border-color:rgba(238,76,5,.4); transform:translateY(-4px); box-shadow:0 20px 40px rgba(4,52,99,.08); }
  .ar-card:focus-visible { outline:2px solid #ee4c05; outline-offset:2px; }
  .ar-card-img { width:100%; aspect-ratio:16/9; object-fit:cover; background:#f0f4f8; display:block; }
  .ar-card-img-ph { width:100%; aspect-ratio:16/9; background:linear-gradient(135deg,#f0f4f8,#e2e8f0); display:flex; align-items:center; justify-content:center; }
  .ar-card-body { padding:1.5rem; display:flex; flex-direction:column; gap:.75rem; flex:1; }
  .ar-card-meta { display:flex; align-items:center; justify-content:space-between; gap:.5rem; flex-wrap:wrap; }
  .ar-card-cat  { font-size:.58rem; font-weight:800; letter-spacing:.16em; text-transform:uppercase; color:#ee4c05; }
  .ar-card-date { font-size:.68rem; color:#0e7fbb; display:flex; align-items:center; gap:.35rem; }
  .ar-card-type { display:inline-flex; align-items:center; gap:.3rem; font-size:.58rem; font-weight:800; letter-spacing:.14em; text-transform:uppercase; padding:.28rem .7rem; border-radius:100px; }
  .ar-card-h3 { font-family:'Bebas Neue',sans-serif; font-size:1.25rem; letter-spacing:.04em; color:#043463; line-height:1.1; flex:1; }
  .ar-card-excerpt { font-size:.8rem; color:#4a5568; line-height:1.75; }
  .ar-card-cta { display:flex; align-items:center; gap:.5rem; font-size:.65rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; margin-top:auto; transition:gap .2s; }
  .ar-card:hover .ar-card-cta { gap:.875rem; }

  /* Pagination */
  .ar-nav-row { display:flex; align-items:center; justify-content:space-between; margin-top:clamp(2rem,4vw,3.5rem); gap:1rem; flex-wrap:wrap; }
  .ar-dots { display:flex; align-items:center; gap:.5rem; flex-wrap:wrap; }
  .ar-dot { width:8px; height:8px; border-radius:100px; background:rgba(4,52,99,.15); border:none; cursor:pointer; transition:all .2s; }
  .ar-dot.active { width:24px; background:#ee4c05; }
  .ar-dot:focus-visible { outline:2px solid #ee4c05; outline-offset:2px; }

  /* Empty */
  .ar-empty { text-align:center; padding:4rem 0; }
  .ar-empty-icon { font-size:3.5rem; color:rgba(4,52,99,.1); margin:0 auto 1.25rem; }

  /* Skel */
  .ar-skel-card { background:#ffffff; border:1px solid rgba(4,52,99,.1); border-radius:2px; overflow:hidden; }
  .ar-skel-img  { width:100%; aspect-ratio:16/9; background:#f0f4f8; }
  .ar-skel-body { padding:1.5rem; display:flex; flex-direction:column; gap:.75rem; }
  .ar-skel-card .cf-skel { background:#e2e8f0; }

  /* Fade */
  .ar-fade { transition:opacity .2s ease; }
  .ar-fade.out { opacity:0; }

  /* Reveal */
  .ar-rv { opacity:0; transform:translateY(24px); transition:opacity .7s ease,transform .7s ease; }
  .ar-rv.in { opacity:1; transform:none; }
`;

const fmtDate = d => { try { return new Date(d).toLocaleDateString("en-KE", { day:"numeric", month:"short", year:"numeric" }); } catch { return null; } };

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
  return <div ref={ref} className="ar-rv" style={{ transitionDelay:`${delay}ms`, ...style }}>{children}</div>;
};

const ArticleCard = ({ article, isFeatured }) => {
  const [imgErr, setImgErr] = useState(false);
  const cover = article.cover_image ?? article.image ?? null;
  const isPDF = !!article.file;
  const typeColor = isPDF ? "rgba(14,127,187,.1)" : "rgba(238,76,5,.1)";
  const typeText  = isPDF ? "#0e7fbb" : "#ee4c05";
  const date = fmtDate(article.date ?? article.created_at);

  if (isFeatured) {
    return (
      <Link to={`/articles/${article.id}`} className="ar-featured" aria-label={`Featured: ${article.title}`}>
        <div>
          {cover && !imgErr ? (
            <img src={cover} alt="" aria-hidden="true" className="ar-featured-img" onError={() => setImgErr(true)} loading="lazy" />
          ) : (
            <div className="ar-featured-ph" aria-hidden="true">
              <FaNewspaper className="ar-featured-ph-icon" />
            </div>
          )}
        </div>
        <div className="ar-featured-body">
          <div>
            <span className="ar-featured-badge">
              ★ Featured Article
            </span>
            {article.category && (
              <span style={{ display:"block", fontSize:".6rem", fontWeight:800, letterSpacing:".15em", textTransform:"uppercase", color:"#0e7fbb", marginBottom:".75rem" }}>
                {article.category}
              </span>
            )}
          </div>
          <h2 className="ar-featured-h2">{article.title}</h2>
          {article.excerpt && <p className="ar-featured-p truncate-3">{article.excerpt}</p>}
          {date && (
            <p style={{ fontSize:".72rem", color:"#0e7fbb", display:"flex", alignItems:"center", gap:".375rem" }}>
              <FaCalendarAlt aria-hidden="true" /> {date}
            </p>
          )}
          <span className="ar-featured-cta">
            {isPDF ? "Download" : "Read More"} <FaArrowRight aria-hidden="true" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/articles/${article.id}`} className="ar-card" aria-label={`Article: ${article.title}`}>
      {cover && !imgErr ? (
        <img src={cover} alt="" aria-hidden="true" className="ar-card-img" loading="lazy" onError={() => setImgErr(true)} />
      ) : (
        <div className="ar-card-img-ph" aria-hidden="true">
          <FaNewspaper style={{ fontSize:"2rem", color:"rgba(4,52,99,.1)" }} />
        </div>
      )}
      <div className="ar-card-body">
        <div className="ar-card-meta">
          <span className="ar-card-cat">{article.category ?? "Article"}</span>
          {date && <span className="ar-card-date"><FaCalendarAlt aria-hidden="true" />{date}</span>}
        </div>
        <span className="ar-card-type" style={{ background:typeColor, color:typeText, alignSelf:"flex-start" }}>
          {isPDF ? <><FaDownload style={{ fontSize:".55rem" }} aria-hidden="true" />PDF</> : <><FaBookOpen style={{ fontSize:".55rem" }} aria-hidden="true" />Article</>}
        </span>
        <h3 className="ar-card-h3 truncate-2">{article.title}</h3>
        {article.excerpt && <p className="ar-card-excerpt truncate-3">{article.excerpt}</p>}
        <span className="ar-card-cta" style={{ color: isPDF ? "#0e7fbb" : "#ee4c05" }}>
          {isPDF ? "Download" : "Read More"} <FaArrowRight aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
};

export default function ArticlesPage() {
  const [articles, setArticles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [hasError, setHasError]   = useState(false);
  const [search, setSearch]       = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage]           = useState(0);
  const [fading, setFading]       = useState(false);
  const sectionRef                = useRef(null);

  const fetchArticles = useCallback(() => {
    setLoading(true); setHasError(false);
    axios.get("https://imarikafoundation.org/api/api/api/articles/")
      .then(r => { setArticles(r.data.results ?? []); setLoading(false); })
      .catch(() => { setHasError(true); setLoading(false); });
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || a.title?.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured     = filtered[0] ?? null;
  const rest         = filtered.slice(1);
  const totalPages   = Math.ceil(rest.length / BATCH);
  const currentBatch = rest.slice(page * BATCH, page * BATCH + BATCH);

  const changePage = useCallback(np => {
    setFading(true);
    setTimeout(() => {
      setPage(np);
      setFading(false);
      sectionRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
    }, 200);
  }, []);

  /* Reset page when filter changes */
  useEffect(() => { setPage(0); }, [search, activeCategory]);

  return (
    <div className="cf-root">
      <style>{AR_CSS}</style>
      <Helmet><title>Articles · Imarika Foundation</title></Helmet>
      <Navbar />

      {/* Hero */}
      <section className="ar-hero">
        <div className="ar-ghost" aria-hidden="true">ARTICLES</div>
        <div className="ar-slash" style={{ height:"clamp(80px,12vh,130px)", right:"clamp(1.5rem,8vw,6rem)", top:"50%" }} aria-hidden="true" />
        <div className="ar-slash" style={{ height:"clamp(50px,7vh,80px)", right:"clamp(3rem,11vw,9.5rem)", top:"52%", opacity:.35 }} aria-hidden="true" />
        <div style={{ maxWidth:700, position:"relative", zIndex:1 }}>
          <span className="cf-label" style={{ color:"#46c5e4" }}>Knowledge Hub</span>
          <h1 className="cf-h1" style={{ color:"#fff" }}>
            ARTICLES &amp;<br/><span style={{ color:"#ee4c05" }}>INSIGHTS.</span>
          </h1>
          <p style={{ color:"#46c5e4", fontSize:"clamp(.9rem,1.8vw,1.05rem)", lineHeight:1.8, marginTop:"1.5rem", maxWidth:520 }}>
            Thought leadership, community stories, research, and opinion pieces from Imarika Foundation and our network of community voices across Kenya.
          </p>
        </div>
      </section>

      <section ref={sectionRef} style={{ background:"#ffffff", padding:"var(--cv) var(--cp)", scrollMarginTop:"68px" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>

          {/* Toolbar */}
          <Reveal>
            <div className="ar-toolbar">
              <div className="ar-search" role="search" aria-label="Search articles">
                <FaSearch className="ar-search-icon" aria-hidden="true" />
                <input type="search" placeholder="Search articles…" value={search}
                       onChange={e => setSearch(e.target.value)} aria-label="Search articles" />
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:".5rem", color:"#0e7fbb", fontSize:".72rem", fontWeight:700 }}>
                {articles.length > 0 && <span>{filtered.length} of {articles.length}</span>}
              </div>
            </div>
            {/* Category tabs */}
            <div className="cf-tabs" role="tablist" aria-label="Filter by category" style={{ marginBottom:"clamp(2rem,4vw,3rem)", overflowX:"auto", paddingBottom:".25rem" }}>
              {CATEGORIES.map(cat => (
                <button key={cat} role="tab" aria-selected={activeCategory===cat}
                        className={`cf-tab ${activeCategory===cat?"active":""}`}
                        onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Loading */}
          {loading ? (
            <>
              <div className="ar-skel-card" style={{ marginBottom:"1.25rem" }} aria-hidden="true">
                <div className="ar-skel-img cf-skel" />
                <div className="ar-skel-body">{[60,80,50,100,70].map((w,i)=><div key={i} className="cf-skel" style={{ height:i===0?22:14, width:`${w}%` }} />)}</div>
              </div>
              <div className="ar-grid">
                {Array.from({length:6}).map((_,i)=>(
                  <div key={i} className="ar-skel-card" aria-hidden="true">
                    <div className="ar-skel-img cf-skel" />
                    <div className="ar-skel-body">{[50,80,60,100].map((w,j)=><div key={j} className="cf-skel" style={{ height:j===0?14:13, width:`${w}%` }} />)}</div>
                  </div>
                ))}
              </div>
              <span role="status" className="sr-only">Loading articles…</span>
            </>
          ) : hasError ? (
            <div className="ar-empty">
              <FaNewspaper className="ar-empty-icon" aria-hidden="true" />
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.75rem", letterSpacing:".04em", color:"#043463", marginBottom:".75rem" }}>COULD NOT LOAD ARTICLES</h2>
              <p style={{ color:"#4a5568", fontSize:".875rem", marginBottom:"1.5rem" }}>Check your connection and try again.</p>
              <button className="cf-btn cf-btn-orange" onClick={fetchArticles} style={{ clipPath:"none", borderRadius:2, margin:"0 auto", display:"inline-flex" }}>
                <FaRedo aria-hidden="true" /> Try Again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="ar-empty">
              <FaNewspaper className="ar-empty-icon" aria-hidden="true" />
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.5rem", letterSpacing:".04em", color:"#043463", marginBottom:".75rem" }}>
                {search ? "NO MATCHING ARTICLES" : "NO ARTICLES YET"}
              </h3>
              <p style={{ color:"#4a5568", fontSize:".875rem" }}>
                {search ? "Try a different search term or category." : "Check back soon for new content."}
              </p>
            </div>
          ) : (
            <>
              {/* Featured article spotlight */}
              {featured && !search && activeCategory === "All" && (
                <Reveal>
                  <div style={{ marginBottom:"clamp(2.5rem,5vw,4rem)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.25rem" }}>
                      <span style={{ fontSize:".62rem", fontWeight:800, letterSpacing:".22em", textTransform:"uppercase", color:"#0e7fbb" }}>Featured</span>
                      <div style={{ height:"1px", flex:1, background:"rgba(4,52,99,.1)" }} />
                    </div>
                    <ArticleCard article={featured} isFeatured />
                  </div>
                </Reveal>
              )}

              {/* Batch grid */}
              <div className={`ar-fade ${fading ? "out" : ""}`}>
                <div className="ar-grid" role="list" aria-label={`Articles — page ${page+1}`}>
                  {(search || activeCategory !== "All" ? filtered : currentBatch).map((a, i) => (
                    <Reveal key={a.id} delay={i * 60}>
                      <div role="listitem">
                        <ArticleCard article={a} />
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              {/* Pagination — only when not filtering */}
              {!search && activeCategory === "All" && totalPages > 1 && (
                <div className="ar-nav-row">
                  <button className="cf-btn-outline" onClick={() => changePage(page-1)} disabled={page===0}
                          style={{ color:"#043463", borderColor:"rgba(4,52,99,.2)", opacity:page===0?.35:1, pointerEvents:page===0?"none":"auto" }}>
                    ← Previous
                  </button>
                  <div className="ar-dots" role="group" aria-label="Pages">
                    {Array.from({ length:totalPages }).map((_,i)=>(
                      <button key={i} className={`ar-dot ${i===page?"active":""}`}
                              onClick={()=>changePage(i)} aria-label={`Page ${i+1}`} aria-current={i===page?"true":undefined} />
                    ))}
                  </div>
                  <button className="cf-btn cf-btn-orange" onClick={() => changePage(page+1)} disabled={page===totalPages-1}
                          style={{ clipPath:"none", borderRadius:2, opacity:page===totalPages-1?.35:1, pointerEvents:page===totalPages-1?"none":"auto" }}>
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
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