import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { FaTimes, FaCheckCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import "../components/coastal-fire.css";

const LD_CSS = `
  /* ── Hero ── */
  .ld-hero { background: #043463; padding: clamp(8rem, 15vh, 11rem) var(--cp) clamp(4rem, 7vh, 6rem); position: relative; overflow: hidden; }
  .ld-ghost { position: absolute; font-family: 'Bebas Neue', sans-serif; font-size: clamp(10rem, 25vw, 20rem); line-height: .85; color: rgba(238, 76, 5, 0.05); right: -3%; top: 50%; transform: translateY(-50%); user-select: none; pointer-events: none; }
  .ld-slash { position: absolute; width: 3px; background: #ee4c05; border-radius: 2px; transform: rotate(12deg); transform-origin: top center; }

  /* ── Grid ── */
  .ld-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; align-items: stretch; }
  @media(min-width: 640px) { .ld-grid { grid-template-columns: repeat(3, 1fr); } }
  @media(min-width: 1024px){ .ld-grid { grid-template-columns: repeat(4, 1fr); } }

  .ld-grid .ld-rv { display: flex; flex-direction: column; height: 100%; }
  .ld-grid [role="listitem"] { display: flex; flex-direction: column; flex: 1; }

  /* ── Card ── */
  .ld-card { flex: 1; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden; cursor: pointer; transition: all .3s ease; display: flex; flex-direction: column; width: 100%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
  .ld-card:hover { border-color: #ee4c05; transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
  .ld-card:focus-visible { outline: 2px solid #ee4c05; outline-offset: 2px; }
  
  .ld-card-photo { position: relative; aspect-ratio: 1/1; overflow: hidden; background: #f1f5f9; flex-shrink: 0; }
  .ld-card-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
  .ld-card:hover .ld-card-photo img { transform: scale(1.06); }
  
  .ld-card-photo-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f1f5f9, #e2e8f0); }
  .ld-card-photo-letter { font-family: 'Bebas Neue', sans-serif; font-size: 3.5rem; color: #0e7fbb; opacity: 0.3; letter-spacing: .04em; }
  
  .ld-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(4, 52, 99, 0.8), transparent 60%); opacity: 0; transition: opacity .3s; display: flex; align-items: flex-end; justify-content: flex-end; padding: .875rem; }
  .ld-card:hover .ld-card-overlay { opacity: 1; }
  .ld-card-view { font-family: 'Outfit', sans-serif; font-size: .65rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #46c5e4; }
  
  .ld-card-body { padding: 1.25rem 1.125rem 1.375rem; flex: 1; display: flex; flex-direction: column; }
  .ld-card-name { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; letter-spacing: .02em; color: #043463; line-height: 1.1; margin-bottom: 0.25rem; }
  .ld-card-role { font-size: .75rem; color: #64748b; line-height: 1.4; font-weight: 500; }
  .ld-card-bar  { height: 3px; border-radius: 2px; margin-top: auto; padding-top: 1rem; transition: width .3s; }

  /* ── Modal ── */
  .ld-modal { background: #ffffff; border-radius: 8px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; padding: 0; position: relative; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
  .ld-modal-banner { width: 100%; height: clamp(140px, 30vw, 220px); object-fit: cover; display: block; border-bottom: 4px solid #ee4c05; }
  .ld-modal-banner-ph { width: 100%; height: clamp(140px, 30vw, 220px); background: #043463; display: flex; align-items: center; justify-content: center; }
  .ld-modal-body { padding: clamp(1.5rem, 4vw, 2.5rem); }
  .ld-modal-name { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2rem, 4vw, 2.75rem); color: #043463; margin-bottom: .25rem; }
  .ld-modal-role { font-size: .85rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
  .ld-modal-bio  { font-size: .95rem; color: #475569; line-height: 1.8; }
  .ld-modal-close { position: absolute; top: 1rem; right: 1rem; width: 36px; height: 36px; background: rgba(255, 255, 255, 0.9); color: #043463; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all .2s; z-index: 2; border: 1px solid #e2e8f0; }
  .ld-modal-close:hover { background: #fee2e2; color: #ef4444; border-color: #fca5a5; }

  /* ── Section UI ── */
  .ld-section-label { display: flex; align-items: center; gap: 1.25rem; margin-bottom: clamp(2rem, 4vw, 3rem); }
  .ld-section-label-h { font-family: 'Bebas Neue', sans-serif; font-size: clamp(1.75rem, 4vw, 3rem); letter-spacing: .04em; color: #043463; white-space: nowrap; }
  .ld-section-label-line { height: 2px; flex: 1; background: #e2e8f0; }

  /* ── Skeleton ── */
  .ld-skel-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden; }
  .ld-skel-photo { width: 100%; aspect-ratio: 1/1; background: #f1f5f9; }
  .ld-skel-body  { padding: 1.25rem; display: flex; flex-direction: column; gap: .625rem; }

  /* ── Reveal ── */
  .ld-rv { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
  .ld-rv.in { opacity: 1; transform: none; }
`;

function useFocusTrap(isOpen) {
  const ref = useRef(null);
  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const els = ref.current.querySelectorAll('a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])');
    const first = els[0], last = els[els.length - 1];
    first?.focus();
    const trap = e => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus(); } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first?.focus(); } }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [isOpen]);
  return ref;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); obs.disconnect(); } }, { threshold: .08, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return ref;
}

const Reveal = ({ children, delay = 0, style = {} }) => {
  const ref = useReveal();
  return <div ref={ref} className="ld-rv" style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</div>;
};

const MemberCard = ({ member, color, onOpen }) => {
  const [imgErr, setImgErr] = useState(false);
  const triggerRef = useRef(null);
  const src = member.photo ? (member.photo.startsWith('http') ? member.photo : `/images/${member.photo}`) : null;

  return (
    <div
      ref={triggerRef}
      className="ld-card"
      role="button"
      tabIndex={0}
      aria-label={`View bio of ${member.name}, ${member.role}`}
      onClick={() => onOpen(member, triggerRef)}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(member, triggerRef); } }}
    >
      <div className="ld-card-photo">
        {src && !imgErr ? (
          <img src={src} alt={`Portrait of ${member.name}`} loading="lazy" onError={() => setImgErr(true)} />
        ) : (
          <div className="ld-card-photo-ph">
            <span className="ld-card-photo-letter" aria-hidden="true">
              {member.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="ld-card-overlay" aria-hidden="true">
          <span className="ld-card-view">View Bio →</span>
        </div>
      </div>
      <div className="ld-card-body">
        <h3 className="ld-card-name">{member.name}</h3>
        <p className="ld-card-role">{member.role}</p>
        <div className="ld-card-bar" style={{ background: color, width: "2.5rem", marginTop: "1rem" }} />
      </div>
    </div>
  );
};

const BioModal = ({ member, color, onClose, triggerRef }) => {
  const trapRef = useFocusTrap(true);
  const [imgErr, setImgErr] = useState(false);
  const src = member.photo ? (member.photo.startsWith('http') ? member.photo : `/images/${member.photo}`) : null;

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => triggerRef?.current?.focus(), 50);
  }, [onClose, triggerRef]);

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [handleClose]);

  return (
    <div
      className="cf-overlay"
      style={{ background: "rgba(4, 52, 99, 0.85)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ld-modal-name"
    >
      <div ref={trapRef} className="ld-modal">
        <button className="ld-modal-close" onClick={handleClose} aria-label="Close bio">
          <FaTimes aria-hidden="true" />
        </button>

        {src && !imgErr ? (
          <img src={src} alt="" aria-hidden="true" className="ld-modal-banner" onError={() => setImgErr(true)} />
        ) : (
          <div className="ld-modal-banner-ph" aria-hidden="true">
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "5rem", color: "rgba(255,255,255,0.1)" }}>
              {member.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="ld-modal-body">
          <h2 id="ld-modal-name" className="ld-modal-name">{member.name}</h2>
          <p className="ld-modal-role" style={{ color }}>{member.role}</p>
          <div style={{ width: "3rem", height: "4px", background: color, borderRadius: "2px", marginBottom: "1.5rem" }} />
          <p className="ld-modal-bio">{member.bio || "Bio coming soon."}</p>

          <button
            onClick={handleClose}
            className="cf-btn"
            style={{ marginTop: "2rem", width: "100%", justifyContent: "center", background: "#043463", color: "#fff", borderRadius: 4 }}
          >
            Close Bio
          </button>
        </div>
      </div>
    </div>
  );
};

const SkeletonGrid = ({ count = 6 }) => (
  <div className="ld-grid">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="ld-skel-card" aria-hidden="true">
        <div className="ld-skel-photo cf-skel" />
        <div className="ld-skel-body">
          <div className="cf-skel" style={{ height: 16, width: "70%" }} />
          <div className="cf-skel" style={{ height: 12, width: "50%" }} />
        </div>
      </div>
    ))}
  </div>
);

const MemberSection = ({ title, members, color, loading }) => {
  const [selected, setSelected] = useState(null);
  const [triggerRef, setTriggerRef] = useState(null);

  const handleOpen = useCallback((member, ref) => {
    setSelected(member);
    setTriggerRef(ref);
  }, []);

  return (
    <div style={{ marginBottom: "clamp(3.5rem, 7vw, 6rem)" }}>
      <div className="ld-section-label">
        <div style={{ height: "4px", width: "3rem", background: color, borderRadius: "2px", flexShrink: 0 }} />
        <h2 className="ld-section-label-h">{title}</h2>
        <div className="ld-section-label-line" />
      </div>

      {loading ? (
        <SkeletonGrid count={title.includes("Board") ? 6 : 3} />
      ) : members.length === 0 ? (
        <p style={{ color: "#64748b", fontSize: ".875rem" }}>No members listed yet.</p>
      ) : (
        <div className="ld-grid" role="list" aria-label={`${title} members`}>
          {members.map((m, i) => (
            <Reveal key={m.name + i} delay={i * 60}>
              <div role="listitem">
                <MemberCard member={m} color={color} onOpen={handleOpen} />
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {selected && (
        <BioModal
          member={selected}
          color={color}
          onClose={() => { setSelected(null); setTriggerRef(null); }}
          triggerRef={triggerRef}
        />
      )}
    </div>
  );
};

export default function LeadershipPage() {
  const [board, setBoard] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // axios.get("http://127.0.0.1:8080/api/api/leadership/")
    axios.get("https://imarikafoundation.org/api/api/api/leadership/")
      .then(res => {
        const data = res.data.results || res.data;
        const boardItems = data.filter(item => item.category === "board");
        const staffItems = data.filter(item => item.category === "staff");
        const mapper = (list) => list.map(m => ({
          name: m.name,
          role: m.role,
          photo: m.image,
          bio: m.bio
        }));
        setBoard(boardItems.length > 0 ? mapper(boardItems) : []);
        setStaff(staffItems.length > 0 ? mapper(staffItems) : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("API ERROR:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="cf-root" style={{ background: "#ffffff" }}>
      <style>{LD_CSS}</style>
      <Helmet><title>Leadership · Imarika Foundation</title></Helmet>
      <Navbar />

      <section className="ld-hero">
        <div className="ld-ghost" aria-hidden="true">PEOPLE</div>
        <div className="ld-slash" style={{ height: "clamp(80px, 12vh, 130px)", right: "clamp(1.5rem, 8vw, 6rem)", top: "50%" }} aria-hidden="true" />
        <div className="ld-slash" style={{ height: "clamp(50px, 7vh, 80px)", right: "clamp(3rem, 11vw, 9.5rem)", top: "52%", opacity: .35 }} aria-hidden="true" />
        <div style={{ maxWidth: 700, position: "relative", zIndex: 1 }}>
          <span className="cf-label" style={{ color: "#46c5e4" }}>Our Leadership</span>
          <h1 className="cf-h1" style={{ color: "#fff" }}>
            GUIDED BY<br /><span style={{ color: "#ee4c05" }}>VISION.</span>
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "clamp(.9rem, 1.8vw, 1.05rem)", lineHeight: 1.8, marginTop: "1.5rem", maxWidth: 540 }}>
            Guided by vision, integrity, and community trust — meet the board members and staff who lead Imarika Foundation's mission to transform lives across Kenya.
          </p>
        </div>
      </section>

      <section style={{ background: "#f8fafc", padding: "var(--cv) var(--cp)" }}>
        <div style={{ maxWidth: "var(--cw)", margin: "0 auto" }}>
          <MemberSection title="Board Members" members={board} color="#ee4c05" loading={loading} />
          <MemberSection title="Staff Members" members={staff} color="#0e7fbb" loading={loading} />
        </div>
      </section>

      <section style={{ background: "#ffffff", padding: "clamp(3rem, 6vw, 5rem) var(--cp)" }}>
        <div style={{ maxWidth: "var(--cw)", margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "3rem", alignItems: "flex-start", padding: "clamp(2rem, 5vw, 4rem)", background: "#f1f5f9", border: "1px solid #e2e8f0", borderLeft: "6px solid #ee4c05", borderRadius: 4 }}>
              <div style={{ flex: "1 1 280px" }}>
                <span className="cf-label" style={{ marginBottom: "1rem", color: "#0e7fbb" }}>Governance</span>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", letterSpacing: ".04em", color: "#043463", marginBottom: "1rem" }}>COMMITTED TO TRANSPARENCY.</h3>
                <p style={{ color: "#475569", fontSize: ".95rem", lineHeight: 1.8, maxWidth: 460 }}>
                  Imarika Foundation operates under a governance framework aligned with Kenya's PBO Act. Our board meets quarterly to review progress, approve budgets, and ensure accountability to our communities and partners.
                </p>
              </div>
              <div style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {["Annual General Meeting held every year", "Independent external audit", "Registered PBO", "Compliant with NGO Coordination Board requirements"].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: ".875rem", fontSize: ".9rem", color: "#334155", fontWeight: 500 }}>
                    <FaCheckCircle style={{ color: "#10b981", flexShrink: 0, marginTop: ".25rem" }} aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer style={{ background: "#043463", padding: "3rem var(--cp)", textAlign: "center" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: ".8rem", color: "rgba(255, 255, 255, 0.6)", letterSpacing: "0.05em" }}>
          © {new Date().getFullYear()} Imarika Foundation · Kenya
        </p>
      </footer>
    </div>
  );
}