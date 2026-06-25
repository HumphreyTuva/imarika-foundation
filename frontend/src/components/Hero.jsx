import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaHeart, FaArrowDown } from "react-icons/fa";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

/* ════════════════════════════════════════════════════════════
   COASTAL FIRE — EXTRAORDINARY HERO STYLES
   ════════════════════════════════════════════════════════════ */
const HERO_CSS = `
  /* ── CSS Variables ── */
  :root {
    --cf-orange: #ee4c05;
    --cf-orange-dark: #c93d00;
    --cf-navy: #043463;
    --cf-navy-light: #065091;
    --cf-cerulean: #0e7fbb;
    --cf-cerulean-light: #1a9ad8;
    --cf-cyan: #46c5e4;
    --cf-cyan-soft: rgba(70, 197, 228, 0.12);
  }

  /* ── General Accessibility ── */
  :focus-visible {
    outline: 3px solid var(--cf-orange);
    outline-offset: 2px;
  }

  /* ── Hero ── */
  .hm-hero {
    min-height: 100svh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #080808;
  }
  .hm-hero-bg {
    position: absolute;
    inset: -5%; /* Over-scale to allow parallax movement */
    background-image: url('/images/bg.jpeg'); /* Restored your custom image */
    background-size: cover;
    background-position: center 30%;
    background-repeat: no-repeat;
    transform: scale(1.04);
    will-change: transform;
    animation: kenBurns 20s ease-out forwards;
  }
  @keyframes kenBurns {
    0% { transform: scale(1.1); }
    100% { transform: scale(1.02); }
  }
  .hm-hero-bg.loaded { opacity: 1; }
  .hm-hero-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to right, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.65) 55%, rgba(8,8,8,0.45) 100%),
      linear-gradient(to top, rgba(249,115,22,0.22) 0%, transparent 45%),
      linear-gradient(135deg, rgba(8,8,8,0.3) 0%, transparent 60%);
  }
  .hm-hero-grain {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.35;
    pointer-events: none;
    mix-blend-mode: overlay;
  }
  .hm-hero-inner {
    position: relative; z-index: 10;
    width: 100%; max-width: 1400px; margin: 0 auto;
    padding: clamp(7rem,15vh,10rem) clamp(1.25rem,5vw,4rem) clamp(3.5rem,6vh,5rem);
  }
  .hm-hero-grid { display: grid; grid-template-columns: 1fr; gap: clamp(3rem,6vw,5rem); }
  @media(min-width:900px){ .hm-hero-grid { grid-template-columns: 1.2fr 400px; align-items: center; } }

  .hm-h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3.75rem,12vw,10.5rem); line-height: .88; letter-spacing: .02em; color: #fff; }

  /* ── Stat cells with glow ── */
  .hm-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  .hm-stat-cell {
    padding: 1.5rem 1rem;
    border-top: 1px solid rgba(255,255,255,.1);
    position: relative;
    transition: all 0.5s ease;
  }
  .hm-stat-cell::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(238, 76, 5, 0.15), transparent 70%);
    opacity: 0;
    transition: opacity 0.6s ease;
  }
  .hm-stat-cell.glowing::before { opacity: 1; }
  .hm-stat-cell.glowing {
    border-color: rgba(238, 76, 5, 0.4);
    box-shadow: inset 0 0 20px rgba(238, 76, 5, 0.1);
  }
  .hm-stat-cell:nth-child(2),.hm-stat-cell:nth-child(4){ border-left:1px solid rgba(255,255,255,.1); }
  .hm-stat-n {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(2.25rem,5vw,3.5rem);
    line-height:1;
    color:var(--cf-orange);
    filter: drop-shadow(0 0 8px rgba(238, 76, 5, 0.4));
  }
  .hm-stat-l { font-size:.63rem; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-top:.375rem; }

  /* ── Floating particles ── */
  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
    25% { transform: translate(15px, -15px) scale(1.1); opacity: 0.8; }
    50% { transform: translate(-10px, -25px) scale(0.9); opacity: 0.5; }
    75% { transform: translate(-20px, -10px) scale(1.05); opacity: 0.7; }
  }

  /* ── Scroll reveal ── */
  .hm-rv  { opacity:0; transform:translateY(28px); transition:opacity .72s ease,transform .72s ease; }
  .hm-rv-l{ opacity:0; transform:translateX(-28px);transition:opacity .72s ease,transform .72s ease; }
  .hm-rv-r{ opacity:0; transform:translateX(28px); transition:opacity .72s ease,transform .72s ease; }
  .hm-rv.in,.hm-rv-l.in,.hm-rv-r.in { opacity:1; transform:none; }

  /* ── Bounce ── */
  @keyframes hm-sb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
  .hm-bounce { animation:hm-sb 2s ease-in-out infinite; }

  /* ── Buttons with enhanced hover ── */
  .cf-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.875rem 1.75rem; font-size: 0.875rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; cursor: pointer; text-decoration: none; border: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .cf-btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }
  .cf-btn:hover::before {
    width: 300px;
    height: 300px;
  }
  .cf-btn-primary { background: var(--cf-orange); color: #fff; }
  .cf-btn-primary:hover {
    background: var(--cf-orange-dark);
    box-shadow: 0 0 30px rgba(238, 76, 5, 0.5), 0 0 60px rgba(238, 76, 5, 0.3);
    color: #fff;
    transform: translateY(-2px);
  }
  .cf-btn-secondary { background: transparent; border: 2px solid var(--cf-cerulean); color: var(--cf-cerulean); }
  .cf-btn-secondary:hover {
    background: var(--cf-cerulean);
    color: #fff;
    box-shadow: 0 0 25px rgba(14, 127, 187, 0.4);
    transform: translateY(-2px);
  }
`;

/* ── Hooks ── */
function useCountUp(target, delay = 0) {
  const [val, setVal] = useState(0);
  const [go, setGo] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setGo(true); obs.disconnect(); } },
      { threshold: .4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!go) return;
    let raf;
    const tid = setTimeout(() => {
      setGlowing(true);
      const t0 = performance.now(), dur = 2200;
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        setVal(Math.floor((1 - Math.pow(1 - p, 4)) * target));
        if (p < 1) raf = requestAnimationFrame(tick);
        else setTimeout(() => setGlowing(false), 800);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(tid); cancelAnimationFrame(raf); };
  }, [go, target, delay]);

  return { ref, val, glowing };
}

/* ── Sub-components ── */
const StatCell = ({ n, s, l, delay = 0 }) => {
  const { ref, val, glowing } = useCountUp(n, delay);
  return (
    <div ref={ref} className={`hm-stat-cell ${glowing ? 'glowing' : ''}`}>
      <div className="hm-stat-n">{val.toLocaleString()}{s}</div>
      <div className="hm-stat-l">{l}</div>
    </div>
  );
};

const Reveal = ({ children, cls = "hm-rv", delay = 0, style = {} }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("in"); obs.disconnect(); } },
      { threshold: .08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={cls} style={{ transitionDelay:`${delay}ms`, ...style }}>
      {children}
    </div>
  );
};

/* ── Floating Particle Component ── */
const FloatingParticle = ({ delay, duration, x, y, size, color }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: [0.3, 0.7, 0.3] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color}, transparent)`,
      filter: 'blur(2px)',
      pointerEvents: 'none',
      animation: `float ${duration}s ease-in-out ${delay}s infinite`,
    }}
  />
);

/* ── Animated Gradient Mesh Overlay ── */
const AnimatedMesh = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    style={{
      position: 'absolute',
      inset: 0,
      background: `
        radial-gradient(circle at 20% 30%, rgba(238, 76, 5, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(14, 127, 187, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(70, 197, 228, 0.08) 0%, transparent 50%)
      `,
      pointerEvents: 'none',
      mixBlendMode: 'screen',
    }}
  />
);

/* ── Main Hero Component ── */
export default function Hero({ displayStats }) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const bgParallaxX = useTransform(smoothMouseX, [0, 1], [-15, 15]);
  const bgParallaxY = useTransform(smoothMouseY, [0, 1], [-15, 15]);
  const slashParallaxX = useTransform(smoothMouseX, [0, 1], [-25, 25]);
  const slashParallaxY = useTransform(smoothMouseY, [0, 1], [-25, 25]);

  const safeStats = displayStats && displayStats.length > 0 ? displayStats : [
    { n: 5000, s: "+", l: "Constituents" },
    { n: 160, s: "", l: "Scholars" },
    { n: 13000, s: "+", l: "Trees Planted" },
    { n: 10000, s: "+", l: "Eye Patients" },
  ];

  useEffect(() => {
    const img = new Image();
    img.src = "/images/bg.jpeg";
    img.onload = () => setBgLoaded(true);
    img.onerror = () => setBgLoaded(true);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const particles = [
    { x: 15, y: 20, size: 120, color: 'rgba(238, 76, 5, 0.3)', delay: 0, duration: 6 },
    { x: 75, y: 35, size: 90, color: 'rgba(14, 127, 187, 0.25)', delay: 1, duration: 7 },
    { x: 45, y: 60, size: 110, color: 'rgba(70, 197, 228, 0.2)', delay: 2, duration: 8 },
    { x: 85, y: 75, size: 80, color: 'rgba(238, 76, 5, 0.25)', delay: 1.5, duration: 6.5 },
    { x: 25, y: 80, size: 95, color: 'rgba(14, 127, 187, 0.2)', delay: 0.5, duration: 7.5 },
    { x: 60, y: 25, size: 70, color: 'rgba(70, 197, 228, 0.3)', delay: 2.5, duration: 6 },
  ];

  return (
    <>
      <style>{HERO_CSS}</style>

      <section className="hm-hero" aria-labelledby="hero-heading" onMouseMove={handleMouseMove}>
        <motion.div
          className={`hm-hero-bg ${bgLoaded ? "loaded" : ""}`}
          role="img"
          aria-label="Community members in Kenya"
          style={{ x: bgParallaxX, y: bgParallaxY }}
        />

        <AnimatedMesh />

        {particles.map((particle, i) => (
          <FloatingParticle key={i} {...particle} />
        ))}

        <div className="hm-hero-overlay" aria-hidden="true" />
        <div className="hm-hero-grain" aria-hidden="true" />

        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "220px",
            background: "linear-gradient(to top, rgba(249,115,22,0.18) 0%, transparent 100%)",
            pointerEvents: "none"
          }}
        />

        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "3px",
            height: "clamp(80px,12vh,140px)",
            background: "#ee4c05",
            borderRadius: "2px",
            right: "clamp(1.5rem,8vw,7rem)",
            top: "50%",
            transform: "translateY(-50%) rotate(12deg)",
            transformOrigin: "top center",
            opacity: .8,
            boxShadow: '0 0 20px rgba(238, 76, 5, 0.6)',
            x: slashParallaxX,
            y: slashParallaxY,
          }}
        />
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "3px",
            height: "clamp(50px,7vh,80px)",
            background: "#ee4c05",
            borderRadius: "2px",
            right: "clamp(3rem,11vw,10rem)",
            top: "50%",
            transform: "translateY(-35%) rotate(12deg)",
            transformOrigin: "top center",
            opacity: .35,
            boxShadow: '0 0 15px rgba(238, 76, 5, 0.4)',
            x: useTransform(slashParallaxX, (x) => x * 0.7),
            y: useTransform(slashParallaxY, (y) => y * 0.7),
          }}
        />

        <motion.div
          aria-hidden="true"
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            left: '10%',
            top: '20%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(238, 76, 5, 0.3), transparent)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          aria-hidden="true"
          animate={{
            opacity: [0.15, 0.4, 0.15],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 4, delay: 1, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            right: '15%',
            bottom: '25%',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14, 127, 187, 0.25), transparent)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <div className="hm-hero-inner">
          <div className="hm-hero-grid">

            <div>
              <Reveal cls="hm-rv" delay={0}>
                <div style={{ display: "flex", alignItems: "center", gap: ".875rem", marginBottom: "1.75rem" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "2rem" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{ height: "2px", background: "#ee4c05", borderRadius: "2px", boxShadow: '0 0 8px rgba(238, 76, 5, 0.6)' }}
                  />
                  <span style={{ color: "#ee4c05", fontSize: ".65rem", fontWeight: 700, letterSpacing: ".28em", textTransform: "uppercase", fontFamily: "'Outfit',sans-serif" }}>
                    Kenya · Est. 2015
                  </span>
                </div>
              </Reveal>

              <Reveal cls="hm-rv" delay={80}>
                <h1 id="hero-heading" className="hm-h1">
                  EMPOWERING<br />
                  <motion.span
                    style={{ color: "#0e7fbb", display: 'inline-block' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    COMMUNITIES.
                  </motion.span>
                </h1>
              </Reveal>

              <Reveal cls="hm-rv" delay={180}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginTop: "2rem" }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "70px" }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    style={{ width: "3px", background: "#ee4c05", borderRadius: "2px", flexShrink: 0, marginTop: ".2rem", boxShadow: '0 0 10px rgba(238, 76, 5, 0.5)' }}
                  />
                  <p style={{ color: "rgba(255,255,255,.75)", fontSize: "clamp(.95rem,2vw,1.1rem)", lineHeight: 1.8, maxWidth: 520, fontFamily: "'Outfit',sans-serif", textShadow: "0 1px 4px rgba(0,0,0,.5)" }}>
                    Partnering for a brighter, resilient future in Kenya — through education, healthcare, environmental sustainability, and economic empowerment.
                  </p>
                </div>
              </Reveal>

              <Reveal cls="hm-rv" delay={260}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2.25rem" }}>
                  <Link to="/about" className="cf-btn cf-btn-secondary" style={{ clipPath: "polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)" }}>
                    Learn More <FaArrowRight aria-hidden="true" />
                  </Link>
                  <Link to="/get-involved#donate-form" className="cf-btn cf-btn-primary" style={{ clipPath: "polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)" }}>
                    Join Our Mission<FaHeart aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>

              <Reveal cls="hm-rv" delay={360}>
                <button
                  className="hm-bounce"
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                  aria-label="Scroll to content"
                  style={{ display: "flex", alignItems: "center", gap: ".75rem", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.25)", marginTop: "3.5rem", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", fontFamily: "'Outfit',sans-serif" }}
                >
                  <span>Scroll to explore</span>
                  <FaArrowDown aria-hidden="true" />
                </button>
              </Reveal>
            </div>

            <div>
              <Reveal cls="hm-rv" delay={200}>
                <div style={{ marginBottom: "1rem" }}>
                  <span style={{ fontSize: ".62rem", fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,255,255,.25)", fontFamily: "'Outfit',sans-serif" }}>
                    Our Impact
                  </span>
                </div>
                <div className="hm-stat-grid">
                  {safeStats.slice(0, 4).map((s, i) => (
                    <StatCell key={s.l} {...s} delay={i * 120} />
                  ))}
                </div>
                <p style={{ fontSize: ".65rem", color: "rgba(255,255,255,.2)", marginTop: ".875rem", fontFamily: "'Outfit',sans-serif", letterSpacing: ".06em" }}>
                  Numbers as of {new Date().getFullYear()} · Kenya
                </p>
              </Reveal>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}