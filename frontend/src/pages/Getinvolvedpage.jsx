import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FaArrowRight, FaHeart, FaHandsHelping, FaHandshake, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import '../components/coastal-fire.css';

const GI_CSS = `
  .gi-hero { background:#043463; padding:clamp(8rem,15vh,11rem) var(--cp) clamp(4rem,7vh,6rem); position:relative; overflow:hidden; }
  .gi-ghost { position:absolute; font-family:'Bebas Neue',sans-serif; font-size:clamp(10rem,25vw,20rem); line-height:.85; color:rgba(238,76,5,.05); right:-3%; top:50%; transform:translateY(-50%); user-select:none; pointer-events:none; }
  .gi-slash { position:absolute; width:3px; background:#ee4c05; border-radius:2px; transform:rotate(12deg); transform-origin:top center; }

  /* Ways to help */
  .gi-ways-grid { display:grid; grid-template-columns:1fr; gap:1.5px; background:rgba(4,52,99,.1); }
  @media(min-width:768px){ .gi-ways-grid { grid-template-columns:repeat(3,1fr); } }
  .gi-way { background:#ffffff; padding:clamp(2rem,5vw,3.5rem) clamp(1.5rem,3vw,2.5rem); display:flex; flex-direction:column; gap:1.25rem; position:relative; overflow:hidden; transition:transform .3s,box-shadow .3s; }
  .gi-way::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--gc,#ee4c05); transition:width .3s; }
  .gi-way:hover { transform:translateY(-4px); box-shadow:0 24px 48px rgba(4,52,99,.08); }
  .gi-way:hover::before { width:5px; }
  .gi-way-num { font-family:'Bebas Neue',sans-serif; font-size:clamp(3rem,7vw,5.5rem); line-height:1; color:rgba(4,52,99,.05); letter-spacing:.02em; user-select:none; }
  .gi-way-icon { width:52px; height:52px; border-radius:2px; display:flex; align-items:center; justify-content:center; font-size:1.375rem; }
  .gi-way-h3 { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.5rem,3.5vw,2.25rem); letter-spacing:.04em; line-height:1; }
  .gi-way-p { font-size:.875rem; color:#4a5568; line-height:1.8; flex:1; }

  /* Form section */
  .gi-form-grid { display:grid; grid-template-columns:1fr; gap:3rem; }
  @media(min-width:900px){ .gi-form-grid { grid-template-columns:1fr 1fr; align-items:start; } }
  .gi-form-card { background:#ffffff; border:1px solid rgba(4,52,99,.1); border-radius:2px; padding:clamp(2rem,4vw,3rem); }
  .gi-form-h3 { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.5rem,3vw,2rem); letter-spacing:.04em; color:#043463; margin-bottom:.625rem; }
  .gi-form-sub { font-size:.825rem; color:#0e7fbb; line-height:1.75; margin-bottom:1.75rem; }
  .gi-form-body { display:flex; flex-direction:column; gap:1.25rem; }
  
  /* Custom Light Inputs */
  .gi-input { width:100%; background:#f8fafc; border:1px solid rgba(4,52,99,.2); border-radius:2px; padding:.875rem 1rem; font-family:inherit; font-size:.875rem; color:#043463; transition:border-color .2s,box-shadow .2s; outline:none; }
  .gi-input::placeholder { color:#a0aec0; }
  .gi-input:focus { border-color:#ee4c05; box-shadow:0 0 0 3px rgba(238,76,5,.1); }
  .gi-input.error { border-color:#ef4444; }
  .gi-field-err { display:flex; align-items:center; gap:.35rem; font-size:.7rem; color:#ef4444; margin-top:.4rem; }

  .gi-mpesa { background:rgba(14,127,187,.08); border:1px solid rgba(14,127,187,.2); border-radius:2px; padding:1.125rem; }
  .gi-mpesa-h { font-size:.6rem; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:#0e7fbb; margin-bottom:.875rem; }
  .gi-mpesa-row { display:flex; justify-content:space-between; align-items:center; padding:.375rem 0; border-bottom:1px solid rgba(4,52,99,.1); }
  .gi-mpesa-row:last-child { border-bottom:none; }
  .gi-mpesa-k { font-size:.75rem; color:#4a5568; }
  .gi-mpesa-v { font-family:'Bebas Neue',sans-serif; font-size:1.375rem; letter-spacing:.04em; color:#043463; }
  .gi-success { display:flex; flex-direction:column; align-items:center; text-align:center; gap:1rem; padding:1.5rem 0; }
  .gi-field-lbl { display:block; font-size:.62rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#043463; margin-bottom:.5rem; }

  /* Reveal */
  .gi-rv { opacity:0; transform:translateY(24px); transition:opacity .7s ease,transform .7s ease; }
  .gi-rv.in { opacity:1; transform:none; }
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
  return <div ref={ref} className="gi-rv" style={{ transitionDelay:`${delay}ms`,...style }}>{children}</div>;
};

const Toast = ({ type, msg }) => {
  if (!msg) return null;
  return (
    <div role="alert" aria-live="assertive" className={`cf-toast ${type==="ok" ? "cf-toast-ok" : "cf-toast-err"}`}>
      {type==="ok" ? <FaCheckCircle aria-hidden="true" /> : <FaExclamationCircle aria-hidden="true" />}
      <span>{msg}</span>
    </div>
  );
};

function ContactForm({ formType, color }) {
  const [data, setData]   = useState({ full_name:"", email:"", message:"", mpesa_code:"" });
  const [errs, setErrs]   = useState({});
  const [sub, setSub]     = useState(false);
  const [ok, setOk]       = useState(false);
  const [toast, setToast] = useState({ type:"", msg:"" });
  const isDonate = formType === "donate";

  const validate = (n, v) => {
    if (n==="full_name" && !v.trim()) return "Name is required.";
    if (n==="email") { if (!v.trim()) return "Email is required."; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email."; }
    if (n==="mpesa_code" && isDonate && !v.trim()) return "M-Pesa code required.";
    return "";
  };
  const handleChange = e => { const { name, value } = e.target; setData(p=>({...p,[name]:value})); if (errs[name]) setErrs(p=>({...p,[name]:""})); };
  const handleBlur   = e => { const err = validate(e.target.name, e.target.value); if (err) setErrs(p=>({...p,[e.target.name]:err})); };
  const handleSubmit = async e => {
    e.preventDefault();
    const ne = {}; ["full_name","email"].forEach(f=>{ const err=validate(f,data[f]); if (err) ne[f]=err; });
    if (isDonate){ const err=validate("mpesa_code",data.mpesa_code); if(err) ne.mpesa_code=err; }
    if (Object.keys(ne).length) { setErrs(ne); return; }
    setSub(true); setToast({type:"",msg:""});
    try {
      await axios.post(`https://imarikafoundation.org/api/api/api/submit/${formType}/`, { form_type:formType, ...data, mpesa_code:isDonate?data.mpesa_code:"" });
      setOk(true);
    } catch(err) {
      setToast({ type:"err", msg: err.response?.data?.message ?? "Submission failed. Please try again." });
    } finally { setSub(false); }
  };

  if (ok) return (
    <div className="gi-success">
      <FaCheckCircle style={{ fontSize:"3rem", color:color || "#ee4c05" }} aria-hidden="true" />
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.75rem", letterSpacing:".04em", color:"#043463" }}>
        {formType==="donate" ? "Thank You!" : "Received!"}
      </div>
      <p style={{ fontSize:".875rem", color:"#4a5568", lineHeight:1.75, maxWidth:300, textAlign:"center" }}>
        {formType==="donate" ? "Your donation code has been received. We'll confirm shortly." : "We've got your details and will be in touch soon."}
      </p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="gi-form-body" noValidate>
      <Toast type={toast.type} msg={toast.msg} />

      {/* Name */}
      <div>
        <label htmlFor={`${formType}-name`} className="gi-field-lbl">Full Name / Organisation *</label>
        <input id={`${formType}-name`} type="text" name="full_name" value={data.full_name}
               onChange={handleChange} onBlur={handleBlur} autoComplete="name"
               className={`gi-input ${errs.full_name?"error":""}`} placeholder="e.g. Humphrey Tuva" />
        {errs.full_name && <p className="gi-field-err"><FaExclamationCircle aria-hidden="true" />{errs.full_name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor={`${formType}-email`} className="gi-field-lbl">Email Address *</label>
        <input id={`${formType}-email`} type="email" name="email" value={data.email}
               onChange={handleChange} onBlur={handleBlur} autoComplete="email"
               className={`gi-input ${errs.email?"error":""}`} placeholder="e.g. tuva@example.com" />
        {errs.email && <p className="gi-field-err"><FaExclamationCircle aria-hidden="true" />{errs.email}</p>}
      </div>

      {isDonate ? (
        <>
          <div className="gi-mpesa">
            <div className="gi-mpesa-h">M-Pesa Payment Details</div>
            <div className="gi-mpesa-row"><span className="gi-mpesa-k">Paybill Number</span><span className="gi-mpesa-v">832897</span></div>
            <div className="gi-mpesa-row"><span className="gi-mpesa-k">Account Number</span><span className="gi-mpesa-v">Your Full Name</span></div>
          </div>
          <div>
            <label htmlFor="donate-code" className="gi-field-lbl">M-Pesa Confirmation Code *</label>
            <input id="donate-code" type="text" name="mpesa_code" value={data.mpesa_code}
                   onChange={handleChange} onBlur={handleBlur}
                   className={`gi-input ${errs.mpesa_code?"error":""}`}
                   placeholder="e.g. QDK7XH3JMP" style={{ fontFamily:"monospace", letterSpacing:".08em" }} />
            {errs.mpesa_code && <p className="gi-field-err"><FaExclamationCircle aria-hidden="true" />{errs.mpesa_code}</p>}
          </div>
        </>
      ) : (
        <div>
          <label htmlFor={`${formType}-msg`} className="gi-field-lbl">Message (optional)</label>
          <textarea id={`${formType}-msg`} name="message" value={data.message} onChange={handleChange}
                    rows={4} className="gi-input" style={{ resize:"none" }}
                    placeholder="Tell us about yourself or how you'd like to get involved…" />
        </div>
      )}

      <button type="submit" disabled={sub} aria-busy={sub}
              className="cf-btn cf-btn-orange" style={{ width:"100%", justifyContent:"center", clipPath:"none", borderRadius:2 }}>
        {sub ? <><FaSpinner style={{ animation:"spin 1s linear infinite" }} aria-hidden="true" /> Submitting…</> : "Submit"}
      </button>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </form>
  );
}

export default function GetInvolvedPage() {
  return (
    <div className="cf-root">
      <style>{GI_CSS}</style>
      <Helmet><title>Get Involved · Imarika Foundation</title></Helmet>
      <Navbar />

      {/* Hero */}
      <section className="gi-hero">
        <div className="gi-ghost" aria-hidden="true">ACT</div>
        <div className="gi-slash" style={{ height:"clamp(80px,12vh,130px)", right:"clamp(1.5rem,8vw,6rem)", top:"50%" }} aria-hidden="true" />
        <div className="gi-slash" style={{ height:"clamp(50px,7vh,80px)", right:"clamp(3rem,11vw,9.5rem)", top:"52%", opacity:.35 }} aria-hidden="true" />
        <div style={{ maxWidth:700, position:"relative", zIndex:1 }}>
          <span className="cf-label" style={{ color:"#46c5e4" }}>Make a Difference</span>
          <h1 className="cf-h1" style={{ color:"#fff" }}>
            GET<br/><span style={{ color:"#ee4c05" }}>INVOLVED.</span>
          </h1>
          <p style={{ color:"#46c5e4", fontSize:"clamp(.9rem,1.8vw,1.05rem)", lineHeight:1.8, marginTop:"1.5rem", maxWidth:520 }}>
            Every action counts. Whether you donate, volunteer, or partner with us — you are directly transforming lives across Kenya.
          </p>
        </div>
      </section>

      {/* Ways */}
      <section style={{ background:"#f0f4f8" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <div className="gi-ways-grid">
            {[
              { num:"01", icon:<FaHeart/>, title:"Donate Today", p:"Support our cause financially. Every shilling reaches communities directly — from scholarships to eye camps.", col:"#ee4c05", bg:"rgba(238,76,5,.1)", id:"donate-form" },
              { num:"02", icon:<FaHandsHelping/>, title:"Volunteer", p:"Give your time, skills, and energy. Join our team of 200+ volunteers making a difference across Kilifi.", col:"#0e7fbb", bg:"rgba(14,127,187,.1)", id:"volunteer-form" },
              { num:"03", icon:<FaHandshake/>, title:"Partner With Us", p:"Organisations, businesses, and institutions — collaborate with us to multiply our community impact.", col:"#46c5e4", bg:"rgba(70,197,228,.1)", id:"partner-form" },
            ].map((w, i) => (
              <Reveal key={w.num} delay={i*80}>
                <a href={`#${w.id}`} className="gi-way" style={{ "--gc":w.col, textDecoration:"none", cursor:"pointer" }}>
                  <div className="gi-way-num">{w.num}</div>
                  <div className="gi-way-icon" style={{ background:w.bg, color:w.col }}>{w.icon}</div>
                  <h3 className="gi-way-h3" style={{ color:"#043463" }}>{w.title}</h3>
                  <p className="gi-way-p">{w.p}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:".5rem", fontSize:".68rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase", color:w.col, marginTop:"auto", transition:"gap .2s" }}>
                    <span>Get Started</span><FaArrowRight aria-hidden="true" />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Forms */}
      <section style={{ background:"#ffffff", padding:"var(--cv) var(--cp)" }}>
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>

          {/* Donate */}
          <Reveal>
            <div id="donate-form" style={{ scrollMarginTop:"80px", marginBottom:"clamp(3rem,6vw,5rem)" }}>
              <div className="gi-form-grid">
                <div>
                  <span className="cf-label" style={{ color:"#043463" }}>Donate</span>
                  <h2 className="cf-h2" style={{ marginBottom:"1.25rem", color:"#043463" }}>DONATE <span style={{ color:"#ee4c05" }}>TODAY.</span></h2>
                  <p style={{ color:"#4a5568", fontSize:".9rem", lineHeight:1.8, maxWidth:440 }}>
                    Your donation directly funds our five programme pillars — from scholarships for deserving students to life-saving eye surgeries for elderly community members.
                  </p>
                  <div style={{ marginTop:"2rem", display:"flex", flexDirection:"column", gap:"1rem" }}>
                    {["160 students sponsored through secondary school","500+ cataract surgeries performed","13,000+ trees planted across Kilifi"].map(point => (
                      <div key={point} style={{ display:"flex", alignItems:"flex-start", gap:".875rem", fontSize:".875rem", color:"#4a5568" }}>
                        <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#ee4c05", flexShrink:0, marginTop:".4rem" }} />
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="gi-form-card" style={{ borderTop:"3px solid #ee4c05" }}>
                  <h3 className="gi-form-h3">Make a Donation</h3>
                  <p className="gi-form-sub">Complete your M-Pesa payment and submit your confirmation code below.</p>
                  <ContactForm formType="donate" color="#ee4c05" />
                </div>
              </div>
            </div>
          </Reveal>

          <div style={{ height:"1px", background:"rgba(4,52,99,.1)", margin:"clamp(2rem,4vw,3rem) 0" }} />

          {/* Volunteer */}
          <Reveal>
            <div id="volunteer-form" style={{ scrollMarginTop:"80px", marginBottom:"clamp(3rem,6vw,5rem)" }}>
              <div className="gi-form-grid">
                <div className="gi-form-card" style={{ borderTop:"3px solid #0e7fbb" }}>
                  <h3 className="gi-form-h3">Volunteer Application</h3>
                  <p className="gi-form-sub">Tell us about yourself and we'll be in touch with matching opportunities.</p>
                  <ContactForm formType="volunteer" color="#0e7fbb" />
                </div>
                <div>
                  <span className="cf-label" style={{ color:"#043463" }}>Volunteer</span>
                  <h2 className="cf-h2" style={{ marginBottom:"1.25rem", color:"#043463" }}>JOIN THE <span style={{ color:"#0e7fbb" }}>TEAM.</span></h2>
                  <p style={{ color:"#4a5568", fontSize:".9rem", lineHeight:1.8, maxWidth:440 }}>
                    Our 200+ volunteers are the heartbeat of Imarika Foundation. From mentoring students to running medical camps — there is a role for every skill.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div style={{ height:"1px", background:"rgba(4,52,99,.1)", margin:"clamp(2rem,4vw,3rem) 0" }} />

          {/* Partner */}
          <Reveal>
            <div id="partner-form" style={{ scrollMarginTop:"80px" }}>
              <div className="gi-form-grid">
                <div>
                  <span className="cf-label" style={{ color:"#043463" }}>Partner</span>
                  <h2 className="cf-h2" style={{ marginBottom:"1.25rem", color:"#043463" }}>PARTNER <span style={{ color:"#46c5e4" }}>WITH US.</span></h2>
                  <p style={{ color:"#4a5568", fontSize:".9rem", lineHeight:1.8, maxWidth:440 }}>
                    Join our growing network of organisations committed to sustainable community development. From corporate CSR to institutional grant-making — let's build together.
                  </p>
                </div>
                <div className="gi-form-card" style={{ borderTop:"3px solid #46c5e4" }}>
                  <h3 className="gi-form-h3">Partnership Enquiry</h3>
                  <p className="gi-form-sub">Tell us about your organisation and how you'd like to collaborate.</p>
                  <ContactForm formType="partner" color="#46c5e4" />
                </div>
              </div>
            </div>
          </Reveal>
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