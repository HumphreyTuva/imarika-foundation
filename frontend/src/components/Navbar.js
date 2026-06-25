import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, ShieldCheck, LogIn } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useScroll } from "./ScrollContext";
import './coastal-fire.css';

/* Updated NAV_ITEMS based on Blueprint */
const NAV_ITEMS = [
  { label: "Home",         path: "/",             type: "route" },
  { label: "About Us",     path: "/about",        type: "route" },
  { label: "Our Programs", path: "/programs",     type: "route" },
  { label: "Impact",       path: "/impact",       type: "route" },
  { label: "Get Involved", path: "/get-involved", type: "route" },  
  { label: "Leadership",   path: "/leadership",   type: "route" },
  { label: "Articles",     path: "/articles",     type: "route" },
  { label: "News",         path: "/news",         type: "route" },
  { label: "Contact Us",   id:   "contact",       type: "scroll" },
];

const NB_CSS = `
  .cf-nb { position:fixed; top:0; left:0; right:0; z-index:50; height:68px; display:flex; align-items:center; transition:background .4s ease,border-color .4s ease,backdrop-filter .4s ease; border-bottom:1px solid transparent; }
  .cf-nb.solid { background:rgba(255,255,255,.98); border-bottom-color:rgba(4,52,99,.1); box-shadow:0 4px 20px rgba(4,52,99,.05); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); }
  .cf-nb.ghost { background:transparent; }
  .cf-nb-inner { width:100%; max-width:1400px; margin:0 auto; padding:0 clamp(1.25rem,4vw,3rem); display:flex; align-items:center; justify-content:space-between; gap:1rem; }

  /* Logo Styling */
  .cf-nb-logo { display:flex; align-items:center; gap:.75rem; text-decoration:none; flex-shrink:0; }
  .cf-nb-logo-img { width:38px; height:38px; border-radius:2px; object-fit:cover; border:1.5px solid rgba(238,76,5,.5); flex-shrink:0; }
  .cf-nb-logo-fb  { width:38px; height:38px; border-radius:2px; background:#ee4c05; display:flex; align-items:center; justify-content:center; font-family:'Bebas Neue',sans-serif; font-size:1rem; color:#ffffff; flex-shrink:0; }
  
  /* Text colors adapt based on scroll state */
  .cf-nb.ghost .cf-nb-logo-name { color:#fff; }
  .cf-nb.ghost .cf-nb-logo-sub { color:rgba(255,255,255,.7); }
  .cf-nb.solid .cf-nb-logo-name { color:#043463; }
  .cf-nb.solid .cf-nb-logo-sub { color:#0e7fbb; }

  .cf-nb-logo-name { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.1rem,2.5vw,1.4rem); letter-spacing:.06em; line-height:.9; transition:color .4s ease; }
  .cf-nb-logo-sub  { font-size:.5rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase; margin-top:3px; display:none; transition:color .4s ease; }
  @media(min-width:480px){ .cf-nb-logo-sub { display:block; } }

  /* Desktop nav */
  .cf-nb-nav { display:none; align-items:center; gap:.125rem; }
  @media(min-width:1100px){ .cf-nb-nav { display:flex; } }

  .cf-nb-btn { position:relative; font-family:'Outfit',sans-serif; font-size:.72rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; background:none; border:none; cursor:pointer; padding:.5rem .75rem; transition:color .2s; white-space:nowrap; text-decoration:none; display:inline-block; }
  
  /* Nav button colors adapt based on scroll state */
  .cf-nb.ghost .cf-nb-btn { color:rgba(255,255,255,.7); }
  .cf-nb.ghost .cf-nb-btn:hover, .cf-nb.ghost .cf-nb-btn.active { color:#fff; }
  
  .cf-nb.solid .cf-nb-btn { color:#4a5568; }
  .cf-nb.solid .cf-nb-btn:hover, .cf-nb.solid .cf-nb-btn.active { color:#ee4c05; }

  .cf-nb-btn::after { content:''; position:absolute; bottom:-2px; left:50%; transform:translateX(-50%) scaleX(0); width:70%; height:2px; background:#ee4c05; border-radius:2px; transition:transform .25s ease; transform-origin:center; }
  .cf-nb-btn:hover::after { transform:translateX(-50%) scaleX(.6); }
  .cf-nb-btn.active::after { transform:translateX(-50%) scaleX(1); }

  /* Donate CTA */
  .cf-nb-donate { font-family:'Outfit',sans-serif; font-size:.7rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; padding:.6rem 1.375rem; background:#ee4c05; color:#ffffff; border:none; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:.4rem; clip-path:polygon(8px 0%,100% 0%,calc(100%-8px) 100%,0% 100%); transition:background .25s,transform .2s,box-shadow .25s; white-space:nowrap; }
  .cf-nb-donate:hover { background:#d43c00; transform:translateY(-1px); box-shadow:0 8px 20px rgba(238,76,5,.3); }

  /* Utilities */
  .cf-nb-div { width:1px; height:18px; transition:background .4s ease; margin:0 .5rem; flex-shrink:0; }
  .cf-nb.ghost .cf-nb-div { background:rgba(255,255,255,.2); }
  .cf-nb.solid .cf-nb-div { background:rgba(4,52,99,.15); }

  .cf-nb-ham { display:flex; align-items:center; justify-content:center; width:40px; height:40px; cursor:pointer; border-radius:2px; transition:all .2s; }
  .cf-nb.ghost .cf-nb-ham { background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.2); color:#fff; }
  .cf-nb.solid .cf-nb-ham { background:#f0f4f8; border:1px solid rgba(4,52,99,.1); color:#043463; }
  @media(min-width:1100px){ .cf-nb-ham { display:none; } }

  /* Mobile menu */
  .cf-mob { position:fixed; top:68px; left:0; right:0; z-index:49; background:#ffffff; border-bottom:1px solid rgba(4,52,99,.1); overflow:hidden; max-height:0; opacity:0; transition:max-height .38s cubic-bezier(.4,0,.2,1),opacity .25s ease; box-shadow:0 10px 25px rgba(4,52,99,.1); }
  .cf-mob.open { max-height:800px; opacity:1; }
  .cf-mob-nav { padding:1rem clamp(1.25rem,4vw,2rem) 1.5rem; display:flex; flex-direction:column; gap:.25rem; }
  .cf-mob-btn { display:flex; align-items:center; justify-content:space-between; width:100%; text-align:left; font-family:'Outfit',sans-serif; font-size:.78rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#4a5568; background:none; border:none; cursor:pointer; padding:.875rem 1rem; border-radius:2px; transition:color .2s,background .2s; text-decoration:none; }
  .cf-mob-btn.active { color:#ee4c05; background:rgba(238,76,5,.08); }
  .cf-mob-dot { width:6px; height:6px; border-radius:50%; background:#ee4c05; }
  .cf-mob-actions { display:flex; gap:.75rem; flex-wrap:wrap; padding:.5rem 1rem; }
  .cf-mob-donate { flex:1; min-width:120px; display:flex; justify-content:center; align-items:center; gap:.4rem; padding:.75rem; font-family:'Outfit',sans-serif; font-size:.72rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; background:#ee4c05; color:#ffffff; border:none; cursor:pointer; text-decoration:none; border-radius:2px; transition:background .2s; }
  .cf-mob-donate:hover { background:#d43c00; }
  .cf-mob-div { height:1px; background:rgba(4,52,99,.1); margin:.5rem 0; }
`;

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [loggedIn, setLogin]  = useState(false);
  const [solid, setSolid]     = useState(false);
  const [activeP, setActiveP] = useState("");
  const [logoErr, setLogoErr] = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();
  const { setTargetId } = useScroll();
  const hamRef = useRef(null);
  const mobRef = useRef(null);

  useEffect(() => { setLogin(!!localStorage.getItem("accessToken")); }, [location.pathname]);
  useEffect(() => { setActiveP(location.pathname); }, [location.pathname]);

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive:true }); fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === "Escape") { setOpen(false); hamRef.current?.focus(); } };
    const onOut = e => { if (mobRef.current && !mobRef.current.contains(e.target) && !hamRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onOut);
    document.addEventListener("touchstart", onOut);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onOut); document.removeEventListener("touchstart", onOut); };
  }, [open]);

  const handleNav = useCallback((item) => {
    if (item.type === "scroll") {
      if (location.pathname === "/") { document.getElementById(item.id)?.scrollIntoView({ behavior:"smooth" }); }
      else { setTargetId(item.id); navigate("/"); }
    } else {
      navigate(item.path);
    }
    setOpen(false);
  }, [location.pathname, navigate, setTargetId]);

  const isActive = (item) => {
    if (item.type === "scroll") return false;
    if (item.path === "/") return activeP === "/";
    return activeP.startsWith(item.path);
  };

  return (
    <>
      <style>{NB_CSS}</style>

      <header className={`cf-nb ${solid ? "solid" : "ghost"}`} role="banner">
        <div className="cf-nb-inner">
          {/* Logo Section */}
          <Link to="/" className="cf-nb-logo" aria-label="Imarika Foundation — homepage">
            {logoErr
              ? <div className="cf-nb-logo-fb">IF</div>
              : <img src="/images/imarikalogo.jpeg" alt="" aria-hidden="true" className="cf-nb-logo-img" onError={() => setLogoErr(true)} />}
            <div>
              <div className="cf-nb-logo-name">IMARIKA <span style={{ color:"#ee4c05" }}>FOUNDATION</span></div>
              <div className="cf-nb-logo-sub">Empowering Communities</div> {/* Blueprint Slogan */}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="cf-nb-nav" aria-label="Main navigation">
            {NAV_ITEMS.map(item => (
              item.type === "scroll" ? (
                <button key={item.label} className={`cf-nb-btn ${isActive(item) ? "active" : ""}`}
                        onClick={() => handleNav(item)} aria-current={isActive(item) ? "page" : undefined}>
                  {item.label}
                </button>
              ) : (
                <Link key={item.label} to={item.path}
                      className={`cf-nb-btn ${isActive(item) ? "active" : ""}`}
                      aria-current={isActive(item) ? "page" : undefined}>
                  {item.label}
                </Link>
              )
            ))}

            <div className="cf-nb-div" aria-hidden="true" />

            {/* Donate Highlighted Button */}
            <Link to="/get-involved#donate-form" className="cf-nb-donate" aria-label="Donate to Imarika Foundation" style={{ marginLeft:".5rem" }}>
              Empower
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button ref={hamRef} className="cf-nb-ham" onClick={() => setOpen(p => !p)}
                  aria-expanded={open} aria-controls="cf-mobile-nav"
                  aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div id="cf-mobile-nav" ref={mobRef} className={`cf-mob ${open ? "open" : ""}`}
           role="dialog" aria-modal="true" aria-label="Navigation">
        <nav className="cf-mob-nav" aria-label="Mobile navigation">
          {NAV_ITEMS.map(item => (
            item.type === "scroll" ? (
              <button key={item.label} className={`cf-mob-btn ${isActive(item) ? "active" : ""}`}
                      onClick={() => handleNav(item)} aria-current={isActive(item) ? "page" : undefined}>
                <span>{item.label}</span>
                {isActive(item) && <span className="cf-mob-dot" aria-hidden="true" />}
              </button>
            ) : (
              <Link key={item.label} to={item.path}
                    className={`cf-mob-btn ${isActive(item) ? "active" : ""}`}
                    onClick={() => setOpen(false)} aria-current={isActive(item) ? "page" : undefined}>
                <span>{item.label}</span>
                {isActive(item) && <span className="cf-mob-dot" aria-hidden="true" />}
              </Link>
            )
          ))}
          <div className="cf-mob-div" aria-hidden="true" />
          <div className="cf-mob-actions">
            <Link to="/get-involved#donate-form" className="cf-mob-donate" onClick={() => setOpen(false)}>Empower</Link>
          </div>
        </nav>
      </div>
    </>
  );
}