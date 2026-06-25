import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaYoutube, FaInstagram, FaLinkedin, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import '../components/coastal-fire.css';

const CT_CSS = `
  .ct-hero { background:#043463; padding:clamp(8rem,15vh,11rem) var(--cp) clamp(4rem,7vh,6rem); position:relative; overflow:hidden; }
  .ct-ghost { position:absolute; font-family:'Bebas Neue',sans-serif; font-size:clamp(10rem,25vw,20rem); line-height:.85; color:rgba(255,255,255,.05); right:-3%; top:50%; transform:translateY(-50%); user-select:none; pointer-events:none; }
  .ct-slash { position:absolute; width:3px; background:#ee4c05; border-radius:2px; transform:rotate(12deg); transform-origin:top center; }
  .ct-grid { display:grid; grid-template-columns:1fr; gap:3rem; }
  @media(min-width:900px){ .ct-grid { grid-template-columns:1fr 1fr; align-items:start; } }
  .ct-card-a { display:flex; align-items:flex-start; gap:1rem; background:rgba(70,197,228,.05); border:1px solid rgba(14,127,187,.15); border-radius:2px; padding:1.5rem; text-decoration:none; color:inherit; transition:background .25s,border-color .25s,transform .25s; }
  .ct-card-a:hover { background:rgba(238,76,5,.05); border-color:#ee4c05; transform:translateY(-2px); }
  .ct-card-icon { width:42px; height:42px; border-radius:2px; display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
  .ct-card-lbl { font-size:.6rem; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:#0e7fbb; margin-bottom:.25rem; }
  .ct-card-val { font-size:.9rem; font-weight:600; color:#043463; }
  .ct-card-sub { font-size:.75rem; color:rgba(4,52,99,.6); margin-top:.125rem; }
  .ct-form-card { background:rgba(70,197,228,.05); border:1px solid rgba(14,127,187,.15); border-top:3px solid #ee4c05; border-radius:2px; padding:clamp(2rem,4vw,3rem); }
  .ct-form-body { display:flex; flex-direction:column; gap:1.25rem; }
  .ct-field-lbl { display:block; font-size:.62rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#0e7fbb; margin-bottom:.5rem; }
  .ct-success { display:flex; flex-direction:column; align-items:center; text-align:center; gap:1rem; padding:2rem 0; }
  .ct-map { width:100%; height:clamp(280px,50vw,420px); border-radius:2px; overflow:hidden; border:1px solid rgba(14,127,187,.15); }
  .ct-rv { opacity:0; transform:translateY(24px); transition:opacity .7s ease,transform .7s ease; }
  .ct-rv.in { opacity:1; transform:none; }
  
  /* Color overrides for external classes mapping to the new light theme */
  .cf-input { background:#ffffff; color:#043463; border:1px solid rgba(14,127,187,.2); }
  .cf-input::placeholder { color:rgba(4,52,99,.4); }
  .cf-input:focus { border-color:#ee4c05; outline:none; }
  .cf-social { color:#0e7fbb; background:rgba(70,197,228,.1); }
  .cf-social:hover { color:#ffffff; background:#ee4c05; }
  .cf-field-err { color:#ee4c05; }
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
  return <div ref={ref} className="ct-rv" style={{ transitionDelay:`${delay}ms`,...style }}>{children}</div>;
};

export default function ContactPage() {
  const [data, setData]   = useState({ name:"", email:"", message:"" });
  const [errs, setErrs]   = useState({});
  const [sub, setSub]     = useState(false);
  const [ok, setOk]       = useState(false);
  const [toast, setToast] = useState({ type:"", msg:"" });

  const validate = (n, v) => {
    if (n==="name" && !v.trim()) return "Name is required.";
    if (n==="email") { if (!v.trim()) return "Email is required."; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email."; }
    if (n==="message" && !v.trim()) return "Message is required.";
    return "";
  };
  const handleChange = e => { const { name, value } = e.target; setData(p=>({...p,[name]:value})); if (errs[name]) setErrs(p=>({...p,[name]:""})); };
  const handleBlur   = e => { const err = validate(e.target.name, e.target.value); if (err) setErrs(p=>({...p,[e.target.name]:err})); };
  const handleSubmit = async e => {
    e.preventDefault();
    const ne = {}; ["name","email","message"].forEach(f=>{ const err=validate(f,data[f]); if (err) ne[f]=err; });
    if (Object.keys(ne).length) { setErrs(ne); return; }
    setSub(true); setToast({type:"",msg:""});
    try {
      await axios.post("https://imarikafoundation.org/api/api/api/submit/contact/", data);
      setOk(true);
    } catch(err) {
      setToast({ type:"err", msg: err.response?.data?.message ?? "Failed to send. Please try again." });
    } finally { setSub(false); }
  };

  const CONTACTS = [
    { href:"tel:+254790289989",                icon:<FaPhoneAlt/>,   label:"Phone",   value:"+254 790 289 989",        sub:"Mon–Fri, 8am–5pm EAT",      bg:"rgba(238,76,5,.12)", col:"#ee4c05" },
    { href:"mailto:info@imarikafoundation.org",icon:<FaEnvelope/>,   label:"Email",   value:"info@imarikafoundation.org",sub:"We reply within 24 hours",  bg:"rgba(14,127,187,.12)",  col:"#0e7fbb" },
    { href:"#map",                             icon:<FaMapMarkerAlt/>,label:"Address", value:"Imarika DT Sacco Plaza",   sub:"Kilifi, Coastal Kenya",     bg:"rgba(70,197,228,.12)",  col:"#46c5e4" },
  ];

  const SOCIALS = [
    { href:"https://www.facebook.com/profile.php?id=100081154223367", icon:<FaFacebookF/>,  label:"Facebook"  },
    { href:"https://x.com/ImarikaF2023",                              icon:<FaXTwitter/>,   label:"X Twitter" },
    { href:"https://www.instagram.com/foundation_imarika_",           icon:<FaInstagram/>,  label:"Instagram" },
    { href:"https://www.linkedin.com/in/imarika-foundation-88a645253/",icon:<FaLinkedin/>, label:"LinkedIn"  },
    { href:"https://www.youtube.com/@imarikafoundation",              icon:<FaYoutube/>,    label:"YouTube"   },
  ];

  return (
    <div className="cf-root">
      <style>{CT_CSS}</style>
      <Helmet><title>Contact Us · Imarika Foundation</title></Helmet>
      <Navbar />

      {/* Hero */}
      <section className="ct-hero">
        <div className="ct-ghost" aria-hidden="true">CONTACT</div>
        <div className="ct-slash" style={{ height:"clamp(80px,12vh,130px)", right:"clamp(1.5rem,8vw,6rem)", top:"50%" }} aria-hidden="true" />
        <div className="ct-slash" style={{ height:"clamp(50px,7vh,80px)", right:"clamp(3rem,11vw,9.5rem)", top:"52%", opacity:.35 }} aria-hidden="true" />
        <div style={{ maxWidth:700, position:"relative", zIndex:1 }}>
          <span className="cf-label" style={{ color:"#ffffff" }}>Reach Out</span>
          <h1 className="cf-h1" style={{ color:"#ffffff" }}>
            LET'S BUILD<br/><span style={{ color:"#ee4c05" }}>TOGETHER.</span>
          </h1>
          <p style={{ color:"rgba(255,255,255,.9)", fontSize:"clamp(.9rem,1.8vw,1.05rem)", lineHeight:1.8, marginTop:"1.5rem", maxWidth:520 }}>
            Whether you'd like to learn more, ask a question, or start a partnership — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section style={{ background:"#ffffff", padding:"var(--cv) var(--cp)" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <div className="ct-grid">

            {/* Left — contacts + map + socials */}
            <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
              {CONTACTS.map(c => (
                <Reveal key={c.label}>
                  <a href={c.href} className="ct-card-a" aria-label={`${c.label}: ${c.value}`}>
                    <div className="ct-card-icon" style={{ background:c.bg, color:c.col }}>{c.icon}</div>
                    <div>
                      <div className="ct-card-lbl">{c.label}</div>
                      <div className="ct-card-val">{c.value}</div>
                      <div className="ct-card-sub">{c.sub}</div>
                    </div>
                  </a>
                </Reveal>
              ))}

              {/* Map */}
              <Reveal delay={100}>
                <div id="map" className="ct-map" style={{ scrollMarginTop:"80px" }}>
                  <iframe
                    title="Imarika Foundation Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.312996912001!2d39.8518343152642!3d-3.631753299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x183fdd7a32997dad%3A0xc18694330c9212fa!2sImarika%20Sacco!5e0!3m2!1sen!2ske!4v1685205123456!5m2!1sen!2ske"
                    width="100%" height="100%"
                    style={{ border:0, filter:"grayscale(1) sepia(0.1) hue-rotate(180deg) opacity(0.8)", display:"block" }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Reveal>

              {/* Socials */}
              <Reveal delay={140}>
                <div>
                  <p style={{ fontSize:".62rem", fontWeight:700, letterSpacing:".2em", textTransform:"uppercase", color:"#0e7fbb", marginBottom:"1rem" }}>Follow Us</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:".75rem" }}>
                    {SOCIALS.map(s => (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                         className="cf-social" aria-label={`Follow on ${s.label}`}>{s.icon}</a>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right — contact form */}
            <Reveal delay={80}>
              <div className="ct-form-card">
                {ok ? (
                  <div className="ct-success">
                    <FaCheckCircle style={{ fontSize:"3rem", color:"#0e7fbb" }} aria-hidden="true" />
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.75rem", letterSpacing:".04em", color:"#043463" }}>Message Sent!</div>
                    <p style={{ fontSize:".875rem", color:"rgba(4,52,99,.7)", lineHeight:1.75, maxWidth:300, textAlign:"center" }}>
                      Thank you for reaching out. We'll respond within 24 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="cf-label" style={{ marginBottom:"1rem", color:"#0e7fbb" }}>Send a Message</span>
                    <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(1.5rem,3vw,2rem)", letterSpacing:".04em", color:"#043463", marginBottom:".625rem" }}>GET IN TOUCH.</h3>
                    <p style={{ fontSize:".825rem", color:"rgba(4,52,99,.7)", lineHeight:1.75, marginBottom:"1.75rem" }}>
                      Fill in your details and we'll get back to you as soon as possible.
                    </p>
                    {toast.msg && (
                      <div role="alert" className={`cf-toast ${toast.type==="ok"?"cf-toast-ok":"cf-toast-err"}`} style={{ background: toast.type==="ok" ? "rgba(14,127,187,.1)" : "rgba(238,76,5,.1)", color: toast.type==="ok" ? "#0e7fbb" : "#ee4c05", border: `1px solid ${toast.type==="ok" ? "rgba(14,127,187,.2)" : "rgba(238,76,5,.2)"}` }}>
                        {toast.type==="ok" ? <FaCheckCircle aria-hidden="true" /> : <FaExclamationCircle aria-hidden="true" />}
                        <span>{toast.msg}</span>
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="ct-form-body" noValidate>
                      <div>
                        <label htmlFor="ct-name" className="ct-field-lbl">Full Name *</label>
                        <input id="ct-name" type="text" name="name" value={data.name}
                               onChange={handleChange} onBlur={handleBlur} autoComplete="name"
                               className={`cf-input ${errs.name?"error":""}`} placeholder="e.g. Jane Mwangi" />
                        {errs.name && <p className="cf-field-err"><FaExclamationCircle aria-hidden="true" />{errs.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="ct-email" className="ct-field-lbl">Email Address *</label>
                        <input id="ct-email" type="email" name="email" value={data.email}
                               onChange={handleChange} onBlur={handleBlur} autoComplete="email"
                               className={`cf-input ${errs.email?"error":""}`} placeholder="e.g. jane@example.com" />
                        {errs.email && <p className="cf-field-err"><FaExclamationCircle aria-hidden="true" />{errs.email}</p>}
                      </div>
                      <div>
                        <label htmlFor="ct-msg" className="ct-field-lbl">Message *</label>
                        <textarea id="ct-msg" name="message" value={data.message}
                                  onChange={handleChange} onBlur={handleBlur} rows={6}
                                  className={`cf-input ${errs.message?"error":""}`} style={{ resize:"none" }}
                                  placeholder="How can we help you? What are you interested in?" />
                        {errs.message && <p className="cf-field-err"><FaExclamationCircle aria-hidden="true" />{errs.message}</p>}
                      </div>
                      <button type="submit" disabled={sub} aria-busy={sub}
                              className="cf-btn cf-btn-orange" style={{ width:"100%", justifyContent:"center", clipPath:"none", borderRadius:2, background:"#ee4c05", color:"#ffffff", border:"none" }}>
                        {sub ? <><FaSpinner style={{ animation:"spin 1s linear infinite" }} aria-hidden="true" /> Sending…</> : "Send Message"}
                      </button>
                    </form>
                    <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:"#043463", padding:"2rem var(--cp)", textAlign:"center", borderTop:"1px solid #0e7fbb" }}>
        <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:".72rem", color:"#46c5e4" }}>
          © {new Date().getFullYear()} Imarika Foundation · Kenya
        </p>
      </footer>
    </div>
  );
}