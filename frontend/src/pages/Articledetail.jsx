import DOMPurify from "dompurify";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaDownload, FaNewspaper, FaCalendarAlt, FaRedo, FaFacebookF, FaTwitter, FaLinkedin, FaLink } from "react-icons/fa";
import Navbar from "../components/Navbar";
import "../components/coastal-fire.css";

/* ── Related article thumbnail — own component so useState is valid ── */
const RelatedArticleItem = ({ rel }) => {
  const [relErr, setRelErr] = useState(false);
  const relCover = rel.cover_image ?? rel.image ?? null;
  return (
    <Link to={`/articles/${rel.id}`} className="ad-related-item" aria-label={`Read: ${rel.title}`}>
      {relCover && !relErr ? (
        <img src={relCover} alt="" aria-hidden="true" className="ad-related-thumb" loading="lazy" onError={() => setRelErr(true)} />
      ) : (
        <div className="ad-related-thumb" style={{ display:"flex", alignItems:"center", justifyContent:"center" }} aria-hidden="true">
          <FaNewspaper style={{ color:"rgba(4,52,99,.1)", fontSize:"1rem" }} />
        </div>
      )}
      <div>
        <div className="ad-related-title truncate-2">{rel.title}</div>
        {fmtDate(rel.date ?? rel.created_at) && (
          <div className="ad-related-date">{fmtDate(rel.date ?? rel.created_at)}</div>
        )}
      </div>
    </Link>
  );
};

const AD_CSS = `
  /* Hero */
  .ad-hero { background:#043463; padding:clamp(7rem,14vh,10rem) var(--cp) clamp(3rem,5vh,4.5rem); position:relative; overflow:hidden; border-bottom:1px solid rgba(255,255,255,.1); }
  .ad-hero-slash { position:absolute; width:3px; background:#ee4c05; border-radius:2px; transform:rotate(12deg); transform-origin:top center; }

  /* Layout */
  .ad-layout { display:grid; grid-template-columns:1fr; gap:3rem; }
  @media(min-width:1100px){ .ad-layout { grid-template-columns:1fr 320px; align-items:start; } }

  /* Article body */
  .ad-prose { font-family:'Outfit',sans-serif; font-size:clamp(.9rem,1.5vw,1rem); line-height:1.95; color:#4a5568; }
  .ad-prose p  { margin-bottom:1.5rem; }
  .ad-prose h2 { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.5rem,3vw,2.25rem); letter-spacing:.04em; color:#043463; margin:2.5rem 0 1rem; }
  .ad-prose h3 { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.25rem,2.5vw,1.75rem); letter-spacing:.04em; color:#043463; margin:2rem 0 .875rem; }
  .ad-prose ul,.ad-prose ol { padding-left:1.5rem; margin-bottom:1.5rem; }
  .ad-prose li { margin-bottom:.5rem; }
  .ad-prose blockquote { border-left:3px solid #ee4c05; padding-left:1.5rem; margin:2rem 0; color:#0e7fbb; font-style:italic; background:rgba(238,76,5,.05); padding-top:1rem; padding-bottom:1rem; border-radius:0 2px 2px 0; }
  .ad-prose strong { color:#043463; font-weight:700; }
  .ad-prose a { color:#ee4c05; text-decoration:underline; }
  .ad-prose img { max-width:100%; border-radius:2px; margin:1.5rem 0; }

  /* Cover image */
  .ad-cover { width:100%; aspect-ratio:16/9; object-fit:cover; display:block; border-radius:2px; background:#f0f4f8; }
  .ad-cover-ph { width:100%; aspect-ratio:16/9; background:linear-gradient(135deg,#f0f4f8,#e2e8f0); display:flex; align-items:center; justify-content:center; border-radius:2px; }

  /* Sidebar */
  .ad-sidebar { display:flex; flex-direction:column; gap:2rem; }
  .ad-sidebar-card { background:#ffffff; border:1px solid rgba(4,52,99,.1); border-radius:2px; padding:1.5rem; box-shadow:0 4px 15px rgba(4,52,99,.03); }
  .ad-sidebar-h { font-family:'Bebas Neue',sans-serif; font-size:1rem; letter-spacing:.08em; color:#043463; text-transform:uppercase; margin-bottom:1.25rem; }

  /* Related articles */
  .ad-related-item { display:flex; gap:.875rem; text-decoration:none; padding:1rem 0; border-bottom:1px solid rgba(4,52,99,.1); transition:opacity .2s; }
  .ad-related-item:last-child { border-bottom:none; padding-bottom:0; }
  .ad-related-item:hover { opacity:.75; }
  .ad-related-thumb { width:64px; height:52px; object-fit:cover; border-radius:2px; background:#f0f4f8; flex-shrink:0; display:block; }
  .ad-related-title  { font-family:'Bebas Neue',sans-serif; font-size:.975rem; letter-spacing:.04em; color:#0e7fbb; line-height:1.15; }
  .ad-related-date   { font-size:.65rem; color:#4a5568; margin-top:.25rem; }

  /* Share */
  .ad-share { display:flex; gap:.75rem; flex-wrap:wrap; }
  .ad-share-btn { width:38px; height:38px; border-radius:2px; display:flex; align-items:center; justify-content:center; background:#ffffff; border:1px solid rgba(4,52,99,.2); color:#043463; cursor:pointer; transition:all .2s; font-size:.875rem; }
  .ad-share-btn:hover { background:#ee4c05; color:#ffffff; border-color:#ee4c05; transform:translateY(-2px); }
  .ad-share-btn:focus-visible { outline:2px solid #ee4c05; outline-offset:2px; }
  .ad-copy-msg { font-size:.72rem; color:#22c55e; margin-top:.625rem; }

  /* Nav between articles */
  .ad-nav { display:flex; gap:1.25rem; flex-wrap:wrap; margin-top:clamp(3rem,6vw,5rem); padding-top:2rem; border-top:1px solid rgba(4,52,99,.1); }
  .ad-nav-btn { flex:1; min-width:180px; display:flex; flex-direction:column; gap:.375rem; padding:1.25rem; background:#ffffff; border:1px solid rgba(4,52,99,.1); border-radius:2px; text-decoration:none; transition:border-color .25s,transform .25s,box-shadow .25s; }
  .ad-nav-btn:hover { border-color:rgba(238,76,5,.4); transform:translateY(-2px); box-shadow:0 8px 20px rgba(4,52,99,.05); }
  .ad-nav-dir { font-size:.6rem; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:#0e7fbb; display:flex; align-items:center; gap:.375rem; }
  .ad-nav-title { font-family:'Bebas Neue',sans-serif; font-size:1rem; letter-spacing:.04em; color:#043463; line-height:1.15; }

  /* Reveal */
  .ad-rv { opacity:0; transform:translateY(20px); transition:opacity .7s ease,transform .7s ease; }
  .ad-rv.in { opacity:1; transform:none; }
`;

const sanitise = html => {
  if (typeof DOMPurify !== "undefined" && DOMPurify.sanitize) return DOMPurify.sanitize(html, { USE_PROFILES:{ html:true } });
  return html?.replace(/<[^>]*>/g, "") ?? "";
};

const fmtDate = d => { try { return new Date(d).toLocaleDateString("en-KE", { day:"numeric", month:"long", year:"numeric" }); } catch { return null; } };

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
  return <div ref={ref} className="ad-rv" style={{ transitionDelay:`${delay}ms`, ...style }}>{children}</div>;
};

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle]     = useState(null);
  const [allArticles, setAll]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [hasError, setHasError]   = useState(false);
  const [copied, setCopied]       = useState(false);
  const [coverErr, setCoverErr]   = useState(false);

  const fetchAll = useCallback(() => {
    setLoading(true); setHasError(false);
    axios.get("https://imarikafoundation.org/api/api/api/articles/")
      .then(r => {
        const list = r.data.results ?? [];
        setAll(list);
        const found = list.find(a => String(a.id) === String(id));
        setArticle(found ?? null);
        if (!found) setHasError(true);
        setLoading(false);
      })
      .catch(() => { setHasError(true); setLoading(false); });
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const currentIndex = allArticles.findIndex(a => String(a.id) === String(id));
  const prevArticle  = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle  = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;
  const related      = allArticles.filter(a => String(a.id) !== String(id)).slice(0, 4);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const cover = article?.cover_image ?? article?.image ?? null;

  if (loading) return (
    <div className="cf-root">
      <Navbar />
      <div style={{ background:"#ffffff", padding:"clamp(8rem,15vh,11rem) var(--cp) var(--cv)" }}>
        <div style={{ maxWidth:800, margin:"0 auto", display:"flex", flexDirection:"column", gap:"1.25rem" }} aria-busy="true">
          <div className="cf-skel" style={{ height:16, width:"30%", background:"#e2e8f0" }} aria-hidden="true" />
          <div className="cf-skel" style={{ height:"clamp(2.5rem,7vw,5rem)", width:"80%", background:"#e2e8f0" }} aria-hidden="true" />
          <div className="cf-skel" style={{ height:"clamp(2.5rem,7vw,5rem)", width:"60%", background:"#e2e8f0" }} aria-hidden="true" />
          <div className="cf-skel" style={{ width:"100%", aspectRatio:"16/9", marginTop:"1rem", background:"#e2e8f0" }} aria-hidden="true" />
          {Array.from({length:6}).map((_,i)=><div key={i} className="cf-skel" style={{ height:14, width:`${70+Math.random()*30}%`, background:"#e2e8f0" }} aria-hidden="true" />)}
        </div>
        <span role="status" className="sr-only">Loading article…</span>
      </div>
    </div>
  );

  if (hasError || !article) return (
    <div className="cf-root">
      <Navbar />
      <div style={{ minHeight:"70vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"var(--cp)", textAlign:"center", background:"#ffffff" }}>
        <FaNewspaper style={{ fontSize:"3.5rem", color:"rgba(4,52,99,.1)", marginBottom:"1.25rem" }} aria-hidden="true" />
        <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.75rem", letterSpacing:".04em", color:"#043463", marginBottom:".75rem" }}>ARTICLE NOT FOUND</h2>
        <p style={{ color:"#4a5568", fontSize:".875rem", marginBottom:"1.75rem" }}>This article may have been removed or the link may be broken.</p>
        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", justifyContent:"center" }}>
          <button onClick={fetchAll} className="cf-btn cf-btn-orange" style={{ clipPath:"none", borderRadius:2 }}><FaRedo aria-hidden="true" /> Retry</button>
          <Link to="/articles" className="cf-btn-outline" style={{ borderColor:"rgba(4,52,99,.2)", color:"#043463" }}>← All Articles</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cf-root">
      <style>{AD_CSS}</style>
      <Helmet>
        <title>{article.title} · Imarika Foundation</title>
        <meta name="description" content={article.excerpt ?? `Read ${article.title} from Imarika Foundation.`} />
      </Helmet>
      <Navbar />

      {/* Article hero */}
      <section className="ad-hero">
        <div className="ad-hero-slash" style={{ height:"clamp(60px,10vh,100px)", right:"clamp(1.5rem,8vw,5rem)", top:"50%" }} aria-hidden="true" />
        <div className="ad-hero-slash" style={{ height:"clamp(40px,6vh,65px)", right:"clamp(3rem,11vw,8rem)", top:"52%", opacity:.35 }} aria-hidden="true" />
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto", position:"relative", zIndex:1 }}>
          {/* Back link */}
          <Link to="/articles" style={{ display:"inline-flex", alignItems:"center", gap:".5rem", fontSize:".7rem", fontWeight:800, letterSpacing:".12em", textTransform:"uppercase", color:"rgba(255,255,255,.6)", textDecoration:"none", marginBottom:"2rem", transition:"color .2s" }}
                onMouseEnter={e=>e.currentTarget.style.color="#ee4c05"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.6)"}>
            <FaArrowLeft aria-hidden="true" /> All Articles
          </Link>

          {/* Meta */}
          <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:".875rem", marginBottom:"1.5rem" }}>
            {article.category && (
              <span style={{ fontSize:".6rem", fontWeight:800, letterSpacing:".18em", textTransform:"uppercase", color:"#46c5e4" }}>
                {article.category}
              </span>
            )}
            {article.file && (
              <span style={{ display:"inline-flex", alignItems:"center", gap:".35rem", fontSize:".58rem", fontWeight:800, letterSpacing:".15em", textTransform:"uppercase", padding:".28rem .7rem", borderRadius:"100px", background:"rgba(255,255,255,.15)", color:"#ffffff" }}>
                <FaDownload style={{ fontSize:".55rem" }} aria-hidden="true" /> PDF Document
              </span>
            )}
            {fmtDate(article.date ?? article.created_at) && (
              <span style={{ fontSize:".7rem", color:"rgba(255,255,255,.7)", display:"flex", alignItems:"center", gap:".375rem" }}>
                <FaCalendarAlt aria-hidden="true" />
                {fmtDate(article.date ?? article.created_at)}
              </span>
            )}
          </div>

          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.25rem,7vw,6rem)", lineHeight:.92, letterSpacing:".02em", color:"#ffffff", maxWidth:900 }}>
            {article.title}
          </h1>

          {article.excerpt && (
            <p style={{ color:"rgba(255,255,255,.8)", fontSize:"clamp(.9rem,1.5vw,1.05rem)", lineHeight:1.8, marginTop:"1.25rem", maxWidth:680 }}>
              {article.excerpt}
            </p>
          )}

          <p style={{ fontSize:".72rem", color:"#46c5e4", marginTop:"1.5rem", fontWeight:600, letterSpacing:".08em" }}>
            Published by Imarika Foundation
          </p>
        </div>
      </section>

      {/* Main content */}
      <section style={{ background:"#ffffff", padding:"var(--cv) var(--cp)" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <div className="ad-layout">

            {/* Left — article content */}
            <article>
              {/* Cover image */}
              {cover && !coverErr ? (
                <img src={cover} alt="" aria-hidden="true" className="ad-cover" loading="eager" onError={() => setCoverErr(true)} style={{ marginBottom:"clamp(2rem,4vw,3rem)" }} />
              ) : !cover ? null : (
                <div className="ad-cover-ph" style={{ marginBottom:"clamp(2rem,4vw,3rem)" }} aria-hidden="true">
                  <FaNewspaper style={{ fontSize:"4rem", color:"rgba(4,52,99,.1)" }} />
                </div>
              )}

              {/* Body */}
              {article.file ? (
                <div style={{ textAlign:"center", padding:"clamp(3rem,6vw,5rem) 0", border:"1px solid rgba(4,52,99,.1)", borderRadius:"2px", background:"#f0f4f8" }}>
                  <FaDownload style={{ fontSize:"3.5rem", color:"rgba(238,76,5,.5)", marginBottom:"1.25rem", display:"block", margin:"0 auto 1.25rem" }} aria-hidden="true" />
                  <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.75rem", letterSpacing:".04em", color:"#043463", marginBottom:".75rem" }}>
                    PDF DOCUMENT
                  </h2>
                  <p style={{ color:"#4a5568", fontSize:".875rem", lineHeight:1.75, marginBottom:"2rem", maxWidth:360, margin:"0 auto 2rem" }}>
                    This article is available as a downloadable PDF document.
                  </p>
                  <a href={article.file} download target="_blank" rel="noopener noreferrer"
                     className="cf-btn cf-btn-orange" style={{ clipPath:"none", borderRadius:2, display:"inline-flex" }}>
                    <FaDownload aria-hidden="true" /> Download Full Article
                  </a>
                </div>
              ) : (
                <div
                  className="ad-prose"
                  dangerouslySetInnerHTML={{ __html: sanitise(article.content ?? "") }}
                />
              )}

              {/* Prev / Next nav */}
              {(prevArticle || nextArticle) && (
                <Reveal>
                  <div className="ad-nav">
                    {prevArticle ? (
                      <Link to={`/articles/${prevArticle.id}`} className="ad-nav-btn">
                        <span className="ad-nav-dir"><FaArrowLeft aria-hidden="true" /> Previous</span>
                        <span className="ad-nav-title">{prevArticle.title}</span>
                      </Link>
                    ) : <div />}
                    {nextArticle && (
                      <Link to={`/articles/${nextArticle.id}`} className="ad-nav-btn" style={{ textAlign:"right", alignItems:"flex-end" }}>
                        <span className="ad-nav-dir">Next <FaArrowRight aria-hidden="true" /></span>
                        <span className="ad-nav-title">{nextArticle.title}</span>
                      </Link>
                    )}
                  </div>
                </Reveal>
              )}
            </article>

            {/* Right — sidebar */}
            <aside aria-label="Article sidebar">
              {/* Share */}
              <Reveal>
                <div className="ad-sidebar-card">
                  <div className="ad-sidebar-h">Share This Article</div>
                  <div className="ad-share">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                       target="_blank" rel="noopener noreferrer" className="ad-share-btn" aria-label="Share on Facebook">
                      <FaFacebookF aria-hidden="true" />
                    </a>
                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
                       target="_blank" rel="noopener noreferrer" className="ad-share-btn" aria-label="Share on X (Twitter)">
                      <FaTwitter aria-hidden="true" />
                    </a>
                    <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(article.title)}`}
                       target="_blank" rel="noopener noreferrer" className="ad-share-btn" aria-label="Share on LinkedIn">
                      <FaLinkedin aria-hidden="true" />
                    </a>
                    <button className="ad-share-btn" onClick={handleCopy} aria-label="Copy article link">
                      <FaLink aria-hidden="true" />
                    </button>
                  </div>
                  {copied && <p className="ad-copy-msg">✓ Link copied to clipboard</p>}
                </div>
              </Reveal>

              {/* Related articles */}
              {related.length > 0 && (
                <Reveal delay={100}>
                  <div className="ad-sidebar-card">
                    <div className="ad-sidebar-h">More Articles</div>
                    <nav aria-label="Related articles">
                      {related.map(rel => (
                        <RelatedArticleItem key={rel.id} rel={rel} />
                      ))}
                    </nav>
                    <Link to="/articles" style={{ display:"inline-flex", alignItems:"center", gap:".5rem", fontSize:".65rem", fontWeight:800, letterSpacing:".12em", textTransform:"uppercase", color:"#ee4c05", textDecoration:"none", marginTop:"1.25rem", transition:"gap .2s" }}>
                      View All Articles <FaArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </Reveal>
              )}

              {/* CTA */}
              <Reveal delay={160}>
                <div style={{ background:"#ee4c05", borderRadius:2, padding:"2rem 1.5rem", textAlign:"center" }}>
                  <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.625rem", letterSpacing:".04em", color:"#ffffff", marginBottom:".75rem" }}>
                    SUPPORT OUR MISSION
                  </h3>
                  <p style={{ fontSize:".825rem", color:"rgba(255,255,255,.9)", lineHeight:1.7, marginBottom:"1.5rem" }}>
                    Help us continue transforming lives across Kenya.
                  </p>
                  <Link to="/get-involved" style={{ display:"inline-flex", alignItems:"center", gap:".5rem", background:"#043463", color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:".72rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", padding:".875rem 1.75rem", textDecoration:"none", borderRadius:2, transition:"background .2s" }}>
                    Get Involved <FaArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            </aside>
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