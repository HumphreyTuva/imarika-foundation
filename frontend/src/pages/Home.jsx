import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper/modules";
import {
  FaArrowRight, FaArrowDown, FaArrowUp,
  FaGraduationCap, FaHeartbeat, FaLeaf, FaSeedling, FaHandHoldingHeart,
  FaHeart, FaHandsHelping, FaHandshake,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt,
  FaFacebookF, FaInstagram, FaLinkedin, FaYoutube,
  FaCalendarAlt, FaNewspaper, FaLock, FaExclamationCircle
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import { useScroll } from "../components/ScrollContext";
import "../components/coastal-fire.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/* ════════════════════════════════════════════════════════════
   COASTAL FIRE — Home.jsx (UX Optimized)
   ════════════════════════════════════════════════════════════ */

const HOME_CSS = `
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
    inset: 0;
    background-image: url('/images/bg.jpeg');
    background-size: cover;
    background-position: center 30%;
    background-repeat: no-repeat;
    transform: scale(1.04);
    transition: transform 8s ease-out;
    will-change: transform;
  }
  .hm-hero-bg.loaded { transform: scale(1); }
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
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg '%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
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
  @media(min-width:900px){ .hm-hero-grid { grid-template-columns: 1fr 400px; align-items: center; } }

  .hm-h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3.75rem,12vw,10.5rem); line-height: .88; letter-spacing: .02em; color: #fff; }

  /* ── Marquee strip ── */
  .hm-mq-strip { background: var(--cf-orange); padding: .875rem 0; overflow: hidden; }
  .hm-mq-track { display: flex; width: max-content; will-change: transform; animation: hm-mq 32s linear infinite; }
  .hm-mq-track:hover { animation-play-state: paused; }
  @keyframes hm-mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .hm-mq-item { display: flex; align-items: center; gap: 1.25rem; flex-shrink: 0; }
  .hm-mq-dot  { width:6px; height:6px; border-radius:50%; background:rgba(0,0,0,.3); }
  .hm-mq-text { font-size:.68rem; font-weight:800; letter-spacing:.22em; text-transform:uppercase; color:#080808; white-space:nowrap; font-family:'Outfit',sans-serif; }

  /* ── Stat cells ── */
  .hm-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  .hm-stat-cell { padding: 1.5rem 1rem; border-top: 1px solid rgba(255,255,255,.1); }
  .hm-stat-cell:nth-child(2),.hm-stat-cell:nth-child(4){ border-left:1px solid rgba(255,255,255,.1); }
  .hm-stat-n { font-family:'Bebas Neue',sans-serif; font-size:clamp(2.25rem,5vw,3.5rem); line-height:1; color:var(--cf-orange); }
  .hm-stat-l { font-size:.63rem; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-top:.375rem; }

  /* ── Loading Skeletons (UX Improvement) ── */
  @keyframes pulse-bg {
    0% { background-color: #e2e8f0; }
    50% { background-color: #cbd5e1; }
    100% { background-color: #e2e8f0; }
  }
  .hm-skeleton { animation: pulse-bg 1.5s infinite ease-in-out; border-radius: 2px; }
  .hm-skeleton-card { background: #fff; border: 1px solid rgba(4, 52, 99, 0.08); border-radius: 2px; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
  .hm-skeleton-img { width: 100%; aspect-ratio: 16/9; }
  .hm-skeleton-body { padding: 1.375rem; display: flex; flex-direction: column; gap: 1rem; flex: 1; }
  .hm-skeleton-line { height: 1.2rem; width: 80%; }
  .hm-skeleton-line.short { width: 40%; }
  .hm-skeleton-line.button { width: 30%; height: 1rem; margin-top: auto; }

  /* ── Programs ── */
  .hm-prog-grid { display: grid; grid-template-columns: 1fr; gap: 1.5px; background: rgba(255,255,255,.04); }
  @media(min-width:480px){ .hm-prog-grid { grid-template-columns: repeat(2,1fr); } }
  @media(min-width:1000px){ .hm-prog-grid { grid-template-columns: repeat(5,1fr); } }
  .hm-prog-card {
    background: #161616; padding: clamp(1.75rem,3.5vw,2.75rem) clamp(1.25rem,2.5vw,2rem);
    display: flex; flex-direction: column; gap: 1.125rem;
    text-decoration: none; position: relative; overflow: hidden;
    transition: transform .3s, box-shadow .3s;
  }
  .hm-prog-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--pc,var(--cf-orange)); transition:width .3s; }
  .hm-prog-card:hover { transform:translateY(-5px); box-shadow:0 24px 48px rgba(0,0,0,.55); }
  .hm-prog-card:hover::before { width:5px; }
  .hm-prog-ghost { position:absolute; font-family:'Bebas Neue',sans-serif; font-size:clamp(5rem,10vw,8rem); color:rgba(238,76,5,.06); right:1rem; bottom:-1rem; line-height:1; pointer-events:none; user-select:none; }
  .hm-prog-icon { width:44px; height:44px; border-radius:2px; display:flex; align-items:center; justify-content:center; font-size:1.25rem; flex-shrink:0; }
  .hm-prog-h3   { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.375rem,3vw,1.75rem); letter-spacing:.04em; color:#fff; line-height:1; }
  .hm-prog-sub  { font-size:.75rem; color:rgba(255,255,255,.35); line-height:1.65; flex:1; }
  .hm-prog-stat { font-family:'Bebas Neue',sans-serif; font-size:2.25rem; line-height:1; letter-spacing:.02em; }
  .hm-prog-unit { font-size:.6rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase; color:rgba(255,255,255,.3); margin-left:.375rem; }
  .hm-prog-cta  { display:flex; align-items:center; gap:.5rem; font-size:.65rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; margin-top:.25rem; transition:gap .2s; }
  .hm-prog-card:hover .hm-prog-cta { gap:.875rem; }

  /* ── Values ── */
  .hm-val-grid { display:grid; grid-template-columns:1fr; gap:1.5rem; }
  @media(min-width:480px){ .hm-val-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:900px){ .hm-val-grid { grid-template-columns:repeat(5,1fr); } }
  .hm-val-card { background:#fff; border:1px solid rgba(4, 52, 99, 0.08); border-top:3px solid var(--cf-orange); border-radius:2px; padding:1.75rem 1.5rem; transition:transform .3s,box-shadow .3s; }
  .hm-val-card:hover { transform:translateY(-4px); box-shadow:0 20px 40px rgba(4, 52, 99, 0.12); }
  .hm-val-icon { font-size:2rem; margin-bottom:.875rem; color: var(--cf-cerulean); }
  .hm-val-h { font-family:'Bebas Neue',sans-serif; font-size:1.375rem; letter-spacing:.04em; color:var(--cf-navy); margin-bottom:.625rem; }
  .hm-val-p { font-size:.8rem; color:#6b7280; line-height:1.75; }

  /* ── Get Involved ── */
  .hm-gi-grid { display:grid; grid-template-columns:1fr; gap:1.5px; background:rgba(4, 52, 99, 0.08); }
  @media(min-width:768px){ .hm-gi-grid { grid-template-columns:repeat(3,1fr); } }
  .hm-gi-card { background:#fff; padding:clamp(2rem,4vw,3rem) clamp(1.5rem,3vw,2.5rem); display:flex; flex-direction:column; gap:1.125rem; text-decoration:none; position:relative; overflow:hidden; transition:background .25s,transform .3s; }
  .hm-gi-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; background:var(--gc,var(--cf-orange)); transform:scaleX(0); transform-origin:left; transition:transform .3s; }
  .hm-gi-card:hover { background:#fafafa; transform:translateY(-3px); }
  .hm-gi-card:hover::after { transform:scaleX(1); }
  .hm-gi-num  { font-family:'Bebas Neue',sans-serif; font-size:clamp(3rem,7vw,5.5rem); line-height:1; color:rgba(4, 52, 99, 0.06); letter-spacing:.02em; user-select:none; }
  .hm-gi-icon { width:52px; height:52px; border-radius:2px; display:flex; align-items:center; justify-content:center; font-size:1.375rem; }
  .hm-gi-h3   { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.5rem,3.5vw,2.25rem); letter-spacing:.04em; color:var(--cf-navy); line-height:1; }
  .hm-gi-p    { font-size:.875rem; color:#6b7280; line-height:1.8; flex:1; }
  .hm-gi-link { display:flex; align-items:center; gap:.5rem; font-size:.7rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; transition:gap .2s; margin-top:auto; }
  .hm-gi-card:hover .hm-gi-link { gap:.875rem; }

  /* ── Partners logos ── */
  .hm-partner-logo {
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
    border-radius: 2px; display: flex; align-items: center; justify-content: center;
    padding: 1.25rem; height: 88px;
    transition: background .25s, border-color .25s, transform .25s;
  }
  .hm-partner-logo:hover { background:rgba(255,255,255,.09); border-color:rgba(238,76,5,.35); transform:translateY(-3px); }
  .hm-partner-logo img { max-height:52px; object-fit:contain; filter:grayscale(1) brightness(1.8); transition:filter .3s; }
  .hm-partner-logo:hover img { filter:none; }
  
  @keyframes partnerPulse {
    0% { box-shadow: 0 0 0 0px rgba(238, 76, 5, 0.4); }
    100% { box-shadow: 0 0 0 15px rgba(238, 76, 5, 0); }
  }
  .main-partner-highlight img {
    animation: partnerPulse 2s infinite cubic-bezier(0.66, 0, 0, 1);
    background: #ffffff !important;
  }
  .hm-partner-logo:hover img {
    filter: grayscale(0%) !important;
    opacity: 1 !important;
    border-color: #0e7fbb !important;
    box-shadow: 0 0 15px rgba(14, 127, 187, 0.15) !important;
  }

  /* ── Event card ── */
  .hm-ev-card { background:#161616; border:1px solid rgba(255,255,255,.06); border-radius:2px; overflow:hidden; display:flex; flex-direction:column; text-decoration:none; transition:border-color .25s,transform .3s,box-shadow .3s; }
  .hm-ev-card:hover { border-color:rgba(238,76,5,.4); transform:translateY(-4px); box-shadow:0 20px 40px rgba(0,0,0,.55); }
  .hm-ev-poster { aspect-ratio:16/9; overflow:hidden; background:#0f0f0f; position:relative; }
  .hm-ev-poster img { width:100%; height:100%; object-fit:cover; transition:transform .4s; display:block; }
  .hm-ev-card:hover .hm-ev-poster img { transform:scale(1.05); }
  .hm-ev-poster-ph { width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#1a1a1a,#0f0f0f); }
  .hm-ev-badge { position:absolute; top:.75rem; right:.75rem; font-size:.6rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; padding:.3rem .75rem; border-radius:100px; }
  .hm-ev-body { padding:1.375rem; display:flex; flex-direction:column; gap:.625rem; flex:1; }
  .hm-ev-h3   { font-family:'Bebas Neue',sans-serif; font-size:1.2rem; letter-spacing:.04em; color:#fff; line-height:1; flex:1; }
  .hm-ev-meta { font-size:.72rem; color:rgba(255,255,255,.35); display:flex; align-items:center; gap:.375rem; }
  .hm-ev-cta  { display:flex; align-items:center; gap:.5rem; font-size:.65rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:var(--cf-orange); margin-top:auto; transition:gap .2s; }
  .hm-ev-card:hover .hm-ev-cta { gap:.875rem; }

  /* ── Article card ── */
  .hm-ar-card {
    background: #fff; border: 1px solid rgba(4, 52, 99, 0.08); border-radius: 2px;
    overflow: hidden; display: flex; flex-direction: column; height: 100%; text-decoration: none;
    transition: border-color .25s, transform .3s, box-shadow .3s;
  }
  .hm-ar-card:hover { border-color: var(--cf-orange); transform: translateY(-4px); box-shadow: 0 20px 40px rgba(4, 52, 99, 0.12); }
  .hm-ar-img { aspect-ratio: 16/9; object-fit: cover; width: 100%; display: block; background: #f3f4f6; }
  .hm-ar-img-ph { aspect-ratio: 16/9; background: linear-gradient(135deg, #f3f4f6, #e5e7eb); display: flex; align-items: center; justify-content: center; }
  .hm-ar-body { padding: 1.375rem; flex: 1; display: flex; flex-direction: column; gap: .625rem; }
  .hm-ar-cat { font-size: .58rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: var(--cf-orange); }
  .hm-ar-h3 { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; letter-spacing: .04em; color: var(--cf-navy); line-height: 1.1; flex-grow: 1; }
  .hm-ar-cta { display: flex; align-items: center; gap: .5rem; font-size: .65rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: var(--cf-orange); margin-top: auto; transition: gap .2s; }
  .hm-ar-card:hover .hm-ar-cta { gap: .875rem; }

  /* ── Contact cards ── */
  .hm-ct-card { display:flex; align-items:flex-start; gap:1rem; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:2px; padding:1.5rem; text-decoration:none; color:inherit; transition:background .25s,border-color .25s,transform .25s; }
  .hm-ct-card:hover { background:rgba(238,76,5,.08); border-color:rgba(238,76,5,.4); transform:translateY(-2px); }
  .hm-ct-icon { width:42px; height:42px; border-radius:2px; display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
  .hm-ct-lbl  { font-size:.6rem; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.3); margin-bottom:.25rem; }
  .hm-ct-val  { font-size:.9rem; font-weight:600; color:#fff; }
  .hm-ct-sub  { font-size:.72rem; color:rgba(255,255,255,.3); margin-top:.125rem; }

  /* ── Footer ── */
  .hm-footer { background:var(--cf-navy); border-top:1px solid rgba(70, 197, 228, 0.15); }
  .hm-footer-grid { display:grid; grid-template-columns:1fr; gap:3rem; }
  @media(min-width:640px){ .hm-footer-grid { grid-template-columns:1fr 1fr; } }
  @media(min-width:1024px){ .hm-footer-grid { grid-template-columns:2fr 1fr 1fr 1fr; } }
  .hm-footer-wm { font-family:'Bebas Neue',sans-serif; font-size:clamp(2rem,5vw,3.5rem); line-height:.9; letter-spacing:.02em; color:#fff; margin-bottom:.75rem; }
  .hm-footer-nav-h { font-size:.62rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:var(--cf-cyan); margin-bottom:1.375rem; }
  .hm-footer-nav-ul { list-style:none; display:flex; flex-direction:column; gap:.875rem; }
  .hm-footer-nav-a  { font-size:.875rem; color:var(--cf-cyan); opacity: 0.7; text-decoration:none; transition:color .2s, opacity .2s; }
  .hm-footer-nav-a:hover { color:#fff; opacity: 1; }
  .hm-footer-bottom { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem; padding:1.5rem var(--cp); }
  .hm-footer-copy { font-size:.72rem; color:var(--cf-cyan); opacity: 0.5; }
  .hm-footer-back { font-size:.72rem; color:var(--cf-cyan); opacity: 0.7; background:none; border:none; cursor:pointer; letter-spacing:.1em; text-transform:uppercase; transition:color .2s, opacity .2s; font-family:'Outfit',sans-serif; }
  .hm-footer-back:hover { color:var(--cf-orange); opacity: 1; }

  /* ── Scroll reveal ── */
  .hm-rv  { opacity:0; transform:translateY(28px); transition:opacity .72s ease,transform .72s ease; }
  .hm-rv-l{ opacity:0; transform:translateX(-28px);transition:opacity .72s ease,transform .72s ease; }
  .hm-rv-r{ opacity:0; transform:translateX(28px); transition:opacity .72s ease,transform .72s ease; }
  .hm-rv.in,.hm-rv-l.in,.hm-rv-r.in { opacity:1; transform:none; }

  /* ── Bounce ── */
  @keyframes hm-sb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
  .hm-bounce { animation:hm-sb 2s ease-in-out infinite; }

  /* ── Map ── */
  .hm-map { width:100%; height:clamp(260px,45vw,420px); border-radius:2px; overflow:hidden; border:1px solid rgba(234, 119, 5, 0.08); }

  /* ── Section heading pattern ── */
  .hm-sec-label { display:flex; align-items:center; gap:.5rem; font-size:.62rem; font-weight:800; letter-spacing:.22em; text-transform:uppercase; margin-bottom:.875rem; }
  .hm-sec-label::before { content:''; width:1.5rem; height:2px; border-radius:2px; flex-shrink:0; }
  .hm-sec-orange { color:var(--cf-orange); }
  .hm-sec-orange::before { background:var(--cf-orange); }
  .hm-sec-dark { color:var(--cf-navy); }
  .hm-sec-dark::before { background:var(--cf-navy); }
  .hm-sec-white { color:rgba(255,255,255,.4); }
  .hm-sec-white::before { background:rgba(255,255,255,.4); }

  /* ── Buttons ── */
  .cf-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.875rem 1.75rem; font-size: 0.875rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; cursor: pointer; text-decoration: none; border: none;
    transition: all 0.3s ease;
  }
  .cf-btn-primary { background: var(--cf-orange); color: #fff; }
  .cf-btn-primary:hover { background: var(--cf-orange-dark); box-shadow: 0 0 20px rgba(238, 76, 5, 0.3); color: #fff;}
  .cf-btn-secondary { background: transparent; border: 2px solid var(--cf-cerulean); color: var(--cf-cerulean); }
  .cf-btn-secondary:hover { background: var(--cf-cerulean); color: #fff; }
  .cf-btn-outline-dark { background: transparent; border: 2px solid var(--cf-navy); color: var(--cf-navy); }
  .cf-btn-outline-dark:hover { background: var(--cf-navy); color: #fff; }

`;

/* ── Data ── */
const PROGRAMS = [
  { slug:"education",         icon:<FaGraduationCap/>,    title:"Education",         sub:"Scholarships · Mentorship · Digital Literacy",  stat:"160", unit:"scholars",  col:"#ee4c05", bg:"rgba(249,115,22,.12)", num:"01" },
  { slug:"health",            icon:<FaHeartbeat/>,        title:"Health",            sub:"Eye Camps · Medical · Anti-Jigger Campaigns",  stat:"10K+",unit:"patients",   col:"#ef4444", bg:"rgba(239,68,68,.12)",   num:"02" },
  { slug:"environment",       icon:<FaLeaf/>,             title:"Environment",       sub:"Tree Planting · Mangroves · Climate Action",   stat:"13K+",unit:"trees",      col:"#22c55e", bg:"rgba(34,197,94,.12)",   num:"03" },
  { slug:"agribusiness",      icon:<FaSeedling/>,         title:"Agribusiness",      sub:"Cassava Farming · Farmer Training · Finance",  stat:"200+",unit:"farmers",    col:"#eab308", bg:"rgba(234,179,8,.12)",   num:"04" },
  { slug:"disaster-response", icon:<FaHandHoldingHeart/>, title:"Disaster Response", sub:"Emergency Relief · Widows & Children · Prep",  stat:"5K+", unit:"families",   col:"#3b82f6", bg:"rgba(59,130,246,.12)",  num:"05" },
];

const STATS = [
  { n:5000,  s:"+", l:"Constituents" },
  { n:160,   s:"",  l:"Scholars"     },
  { n:13000, s:"+", l:"Trees Planted" },
  { n:10000, s:"+", l:"Eye Patients"  },
];

const VALUES = [
  { icon:"🤝", h:"Integrity",      p:"Honesty, transparency and accountability in everything we do." },
  { icon:"🌍", h:"Inclusivity",    p:"Every community member has a voice and an opportunity." },
  { icon:"💡", h:"Innovation",     p:"Creative, evidence-based solutions to persistent challenges." },
  { icon:"🌱", h:"Sustainability", p:"Lasting change that extends far beyond any project cycle." },
  { icon:"🌟", h:"Hope",           p:"We believe every person deserves a chance at a better life." },
];

const PARTNERS = [
  { name:"Imarika DT Sacco",         logo:"/images/Imarika-Sacco.jpeg",         link:"https://imarikasacco.co.ke/"             },
  { name:"Zana Africa",              logo:"/images/zana.webp",                  link:"https://www.zanaafrica.org/"             },
  { name:"Wananchi Hospital",        logo:"/images/wananchi.png",               link:"https://wananchihospital.org/"           },
  { name:"Mombasa Eye Hospital",     logo:"/images/momeye.jpg",                 link:"https://www.mombasaeyehospital.com/"     },
  { name:"Kilifi County Government", logo:"/images/klf.jpg",                    link:"https://eservices.kilifi.go.ke/"         },
  { name:"Ahadi Kenya Trust",        logo:"/images/ahadi.png",                  link:"http://www.jigger-ahadi.org/"            },
  { name:"Shamba Project Kilifi",    logo:"/images/shamba.jpg",                 link:"http://shambaprojectkilifi.org/"         },
  { name:"Learn Foundation",         logo:"/images/learn.jpg",                  link:"https://learnfoundation.nl/"             },
  { name:"Safaricom Foundation",     logo:"/images/safaricom-foundation.png",   link:"https://www.safaricomfoundation.org/"    },
  { name:"Rotary International",     logo:"/images/rotary.png",                 link:"https://www.rotary.org/en"               },
  { name:"CFSK",                     logo:"/images/cfsk.png",                   link:"https://cfsk.org/"                       },
  { name:"Serianu Ltd",              logo:"/images/serianultd.png",             link:"https://www.serianu.com/"                },
];

const MQ_ITEMS = [
  "Education","Health","Environment","Agribusiness","Disaster Response",
  "Kenya","5K+ Lives","13K+ Trees","160 Scholars",
];

const SOCIALS = [
  { href:"https://www.facebook.com/profile.php?id=100081154223367",  icon:<FaFacebookF/>,  label:"Facebook"  },
  { href:"https://x.com/ImarikaF2023",                               icon:<FaXTwitter/>,   label:"X Twitter" },
  { href:"https://www.instagram.com/foundation_imarika_",            icon:<FaInstagram/>,  label:"Instagram" },
  { href:"https://www.linkedin.com/in/imarika-foundation-88a645253/",icon:<FaLinkedin/>,   label:"LinkedIn"  },
  { href:"https://www.youtube.com/@imarikafoundation",               icon:<FaYoutube/>,    label:"YouTube"   },
];

const FOOTER_COLS = [
  { h:"Organisation", ls:[{l:"About Us",href:"/about"},{l:"Our Programs",href:"/programs"},{l:"Impact",href:"/impact"},{l:"Leadership",href:"/leadership"},{l:"Partners",href:"#partners"}] },
  { h:"Get Involved", ls:[{l:"Donate",href:"/get-involved#donate-form"},{l:"Volunteer",href:"/get-involved#volunteer-form"},{l:"Partner With Us",href:"/get-involved#partner-form"},{l:"Tenders",href:"/tenders"}] },
  { h:"Media",        ls:[{l:"Articles",href:"/articles"},{l:"News & Events",href:"/news"},{l:"Gallery",href:"/news"},{l:"Contact Us",href:"/contact"}] },
];

/* ── Hooks ── */
function useCountUp(target, delay = 0) {
  const [val, setVal] = useState(0);
  const [go, setGo]   = useState(false);
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
      const t0 = performance.now(), dur = 2200;
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        setVal(Math.floor((1 - Math.pow(1 - p, 4)) * target));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(tid); cancelAnimationFrame(raf); };
  }, [go, target, delay]);

  return { ref, val };
}

/* ── Sub-components ── */
const StatCell = ({ n, s, l, delay = 0 }) => {
  const { ref, val } = useCountUp(n, delay);
  return (
    <div ref={ref} className="hm-stat-cell">
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

/* ── Loading Skeleton (UX Add) ── */
const SkeletonCard = () => (
  <div className="hm-skeleton-card">
    <div className="hm-skeleton-img hm-skeleton"></div>
    <div className="hm-skeleton-body">
      <div className="hm-skeleton-line short hm-skeleton"></div>
      <div className="hm-skeleton-line hm-skeleton"></div>
      <div className="hm-skeleton-line hm-skeleton"></div>
      <div className="hm-skeleton-line button hm-skeleton"></div>
    </div>
  </div>
);

/* ── Event card (upcoming) ── */
const EventCard = ({ ev }) => {
  const [imgErr, setImgErr] = useState(false);
  const cover = ev.images?.[0];
  const src   = cover ? (typeof cover === "string" ? cover : cover.image) : null;
  const fmtDate = d => {
    try {
      return new Date(d).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"});
    } catch {
      return null;
    }
  };

  return (
    <Link to="/news" className="hm-ev-card" aria-label={`Event: ${ev.title}`}>
      <div className="hm-ev-poster">
        {src && !imgErr
          ? <img src={src} alt={ev.title} loading="lazy" onError={() => setImgErr(true)} />
          : <div className="hm-ev-poster-ph" aria-hidden="true"><FaCalendarAlt style={{ fontSize:"2.5rem", color:"rgba(255,255,255,.06)" }} /></div>}
        <span className="hm-ev-badge" style={{ background:"rgba(249,115,22,.9)", color:"#080808" }}>Upcoming</span>
      </div>
      <div className="hm-ev-body">
        <h3 className="hm-ev-h3">{ev.title}</h3>
        {ev.event_date && (
          <p className="hm-ev-meta"><FaCalendarAlt aria-hidden="true" />{fmtDate(ev.event_date)}{ev.location && ` · ${ev.location}`}</p>
        )}
        <span className="hm-ev-cta">View Event <FaArrowRight aria-hidden="true" /></span>
      </div>
    </Link>
  );
};

/* ── Article card ── */
const ArticleCard = ({ article }) => {
  const [imgErr, setImgErr] = useState(false);
  const cover = article.cover_image ?? article.image ?? null;

  return (
    <Link to={`/articles/${article.id}`} className="hm-ar-card" aria-label={`Article: ${article.title}`}>
      {cover && !imgErr
        ? <img src={cover} alt={article.title} className="hm-ar-img" loading="lazy" onError={() => setImgErr(true)} />
        : <div className="hm-ar-img-ph" aria-hidden="true"><FaNewspaper style={{ fontSize:"2.5rem", color:"rgba(0,0,0,.08)" }} /></div>}
      <div className="hm-ar-body">
        <div className="hm-ar-cat">{article.category ?? "Article"}</div>
        <h3 className="hm-ar-h3 truncate-2">{article.title}</h3>
        <span className="hm-ar-cta">Read More <FaArrowRight aria-hidden="true" /></span>
      </div>
    </Link>
  );
};

/* ══════════════════════════════════════════════════════════
   HOME PAGE COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function Home() {
  const [pct, setPct]             = useState(0);
  const [showTop, setShowTop]     = useState(false);
  const [events, setEvents]       = useState([]);
  const [articles, setArticles]   = useState([]);
  const [impactData, setImpactData] = useState({ bigStats: null, pillarStats: null });
  
  /* UX Improvement: Added System Status States */
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState(false);
  
  const [partnersPaused, setPartnersPaused] = useState(false);
  const [bgLoaded, setBgLoaded]   = useState(false);
  const { targetId, setTargetId } = useScroll();

  /* Pre-load hero image — Ken Burns fires only after image ready */
  useEffect(() => {
    const img = new Image();
    img.src = "/images/bg.jpeg";
    img.onload  = () => setBgLoaded(true);
    img.onerror = () => setBgLoaded(true); // graceful fallback
  }, []);

  /* Scroll progress + back-to-top */
  useEffect(() => {
    const fn = () => {
      const sy = window.scrollY;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setPct(dh > 0 ? (sy / dh) * 100 : 0);
      setShowTop(sy > 500);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Hash scroll on load */
  useEffect(() => {
    const h = window.location.hash;
    if (h) {
      const el = document.querySelector(h);
      if (el) setTimeout(() => el.scrollIntoView({ behavior:"smooth" }), 100);
    }
  }, []);

  /* Cross-page scroll context */
  useEffect(() => {
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior:"smooth" });
      setTargetId(null);
    }
  }, [targetId, setTargetId]);

  /* Fetch data concurrently with UI states */
  /* Fetch data concurrently with UI states */
  useEffect(() => {
    let isMounted = true;
    setLoadingDashboard(true);
    setDashboardError(false);

    const fetchDashboardData = async () => {
      try {
        // UPDATE: Added the impact data endpoint here
        const [eventsRes, articlesRes, impactRes] = await Promise.allSettled([
          axios.get("https://imarikafoundation.org/api/api/events/upcoming/"),
          axios.get("https://imarikafoundation.org/api/api/api/articles/"),
          // Make sure this URL matches your production backend when you deploy!
          axios.get("https://imarikafoundation.org/api/api/api/impact-data/") 
        ]);

        if (isMounted) {
          let hasError = false;
          
          if (eventsRes.status === "fulfilled") {
            setEvents((eventsRes.value.data ?? []).slice(0, 3));
          } else { hasError = true; }
          
          if (articlesRes.status === "fulfilled") {
            setArticles((articlesRes.value.data.results ?? []).slice(0, 3));
          } else { hasError = true; }

          // ADD THIS: Process the impact data
          if (impactRes.status === "fulfilled" && impactRes.value.data) {
            setImpactData({
              bigStats: impactRes.value.data.big_stats || null,
              pillarStats: impactRes.value.data.pillar_stats || null
            });
          }
          
          setDashboardError(hasError && events.length === 0 && articles.length === 0);
          setLoadingDashboard(false);
        }
      } catch (error) {
        if (isMounted) {
            setDashboardError(true);
            setLoadingDashboard(false);
        }
      }
    };

    fetchDashboardData();
    return () => { isMounted = false; };
  }, []);


  // Prepare dynamic Global Stats (or fallback to static STATS)
  const displayStats = impactData.bigStats
    ? impactData.bigStats.map(s => ({ 
        n: Number(s.number), // Ensure it's a number for the useCountUp hook
        s: s.suffix || '', 
        l: s.label 
      }))
    : STATS;

  // Prepare dynamic Programs (or fallback to static PROGRAMS)
  const displayPrograms = PROGRAMS.map(prog => {
    // Look for dynamic stats matching the program's title (e.g., "Education")
    const dynamicPillar = impactData.pillarStats?.[prog.title];
    
    // If the API has data for this pillar, override the stat and unit
    if (dynamicPillar && dynamicPillar.length > 0) {
      return { 
        ...prog, 
        stat: dynamicPillar[0].number, 
        unit: dynamicPillar[0].unit 
      };
    }
    return prog; // Otherwise keep the hardcoded one
  });

  return (
    <div className="cf-root">
      <style>{HOME_CSS}</style>

      <Helmet>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Imarika Foundation — Empowering communities through education, health, environmental conservation, agribusiness and disaster response in Kenya." />
        <title>Imarika Foundation — Empowering Communities, Transforming Lives</title>
      </Helmet>

      {/* Scroll progress bar */}
      <div className="cf-spb" style={{ width:`${pct}%` }} aria-hidden="true" />

      <Navbar />

      {/* ╔══════════════════════════════════════════════╗
          ║  HERO                                        ║
          ╚══════════════════════════════════════════════╝ */}
      <section className="hm-hero" aria-labelledby="hero-heading">
        <div className={`hm-hero-bg ${bgLoaded ? "loaded" : ""}`} role="img" aria-label="Community members in Kenya" />
        <div className="hm-hero-overlay" aria-hidden="true" />
        <div className="hm-hero-grain" aria-hidden="true" />
        <div aria-hidden="true" style={{ position:"absolute", bottom:0, left:0, right:0, height:"220px", background:"linear-gradient(to top, rgba(249,115,22,0.18) 0%, transparent 100%)", pointerEvents:"none" }} />

        {/* Slash motifs */}
        <div aria-hidden="true" style={{ position:"absolute", width:"3px", height:"clamp(80px,12vh,140px)", background:"#ee4c05", borderRadius:"2px", right:"clamp(1.5rem,8vw,7rem)", top:"50%", transform:"translateY(-50%) rotate(12deg)", transformOrigin:"top center", opacity:.8 }} />
        <div aria-hidden="true" style={{ position:"absolute", width:"3px", height:"clamp(50px,7vh,80px)", background:"#ee4c05", borderRadius:"2px", right:"clamp(3rem,11vw,10rem)", top:"50%", transform:"translateY(-35%) rotate(12deg)", transformOrigin:"top center", opacity:.35 }} />

        <div className="hm-hero-inner">
          <div className="hm-hero-grid">
            
            {/* Left — headline + CTAs */}
            <div>
              <Reveal cls="hm-rv" delay={0}>
                <div style={{ display:"flex", alignItems:"center", gap:".875rem", marginBottom:"1.75rem" }}>
                  <div style={{ width:"2rem", height:"2px", background:"#ee4c05", borderRadius:"2px" }} />
                  <span style={{ color:"#ee4c05", fontSize:".65rem", fontWeight:700, letterSpacing:".28em", textTransform:"uppercase", fontFamily:"'Outfit',sans-serif" }}>
                    Kenya · Est. 2015
                  </span>
                </div>
              </Reveal>

              <Reveal cls="hm-rv" delay={80}>
                <h1 id="hero-heading" className="hm-h1">
                  EMPOWERING<br />
                  <span style={{ color:"#0e7fbb" }}>COMMUNITIES.</span>
                </h1>
              </Reveal>

              <Reveal cls="hm-rv" delay={180}>
                <div style={{ display:"flex", gap:"1rem", alignItems:"flex-start", marginTop:"2rem" }}>
                  <div style={{ width:"3px", minHeight:"70px", background:"#ee4c05", borderRadius:"2px", flexShrink:0, marginTop:".2rem" }} />
                  <p style={{ color:"rgba(255,255,255,.75)", fontSize:"clamp(.95rem,2vw,1.1rem)", lineHeight:1.8, maxWidth:520, fontFamily:"'Outfit',sans-serif", textShadow:"0 1px 4px rgba(0,0,0,.5)" }}>
                    Partnering for a brighter, resilient future in Kenya — through education, healthcare, environmental sustainability, and economic empowerment.
                  </p>
                </div>
              </Reveal>

              <Reveal cls="hm-rv" delay={260}>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"1rem", marginTop:"2.25rem" }}>
                  <Link to="/about" className="cf-btn cf-btn-secondary" style={{ clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)" }}>
                    Learn More <FaArrowRight aria-hidden="true" />
                  </Link>
                  <Link to="/get-involved#donate-form" className="cf-btn cf-btn-primary" style={{ clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)" }}>
                    Join Our Mission<FaHeart aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>

              <Reveal cls="hm-rv" delay={360}>
                <button
                  className="hm-bounce"
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior:"smooth" })}
                  aria-label="Scroll to content"
                  style={{ display:"flex", alignItems:"center", gap:".75rem", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,.25)", marginTop:"3.5rem", fontSize:".68rem", fontWeight:700, letterSpacing:".18em", textTransform:"uppercase", fontFamily:"'Outfit',sans-serif" }}
                >
                  <span>Scroll to explore</span>
                  <FaArrowDown aria-hidden="true" />
                </button>
              </Reveal>
            </div>

            {/* Right — impact stats */}
            <div>
              <Reveal cls="hm-rv" delay={200}>
                <div style={{ marginBottom:"1rem" }}>
                  <span style={{ fontSize:".62rem", fontWeight:700, letterSpacing:".22em", textTransform:"uppercase", color:"rgba(255,255,255,.25)", fontFamily:"'Outfit',sans-serif" }}>
                    Our Impact
                  </span>
                </div>
                <div className="hm-stat-grid">
                  {displayStats.slice(0, 4).map((s, i) => (
                    <StatCell key={s.l} {...s} delay={i * 120} />
                  ))}
                </div>
                <p style={{ fontSize:".65rem", color:"rgba(255,255,255,.2)", marginTop:".875rem", fontFamily:"'Outfit',sans-serif", letterSpacing:".06em" }}>
                  Numbers as of 2025 · Kenya
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="hm-mq-strip" aria-hidden="true">
        <div className="hm-mq-track">
          {[...MQ_ITEMS, ...MQ_ITEMS].map((item, i) => (
            <span key={i} className="hm-mq-item">
              <span className="hm-mq-dot" />
              <span className="hm-mq-text">{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ╔══════════════════════════════════════════════╗
          ║  ABOUT PREVIEW                               ║
          ╚══════════════════════════════════════════════╝ */}
      <section id="about" style={{ background:"#fff", padding:"var(--cv) var(--cp)", scrollMarginTop:"68px" }} aria-labelledby="about-heading">
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:"clamp(3rem,6vw,5rem)", alignItems:"start" }}>
            
            {/* Left */}
            <Reveal cls="hm-rv-l">
              <div>
                <div className="hm-sec-label hm-sec-dark">About Imarika Foundation</div>
                <h2 id="about-heading" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.25rem,6vw,5rem)", lineHeight:.9, letterSpacing:".02em", color:"#080808", marginBottom:"1.5rem" }}>
                  WHO WE<br /><span style={{ color:"var(--cf-orange)" }}>ARE.</span>
                </h2>
                <p style={{ color:"#6b7280", fontSize:"clamp(.9rem,1.5vw,1rem)", lineHeight:1.9, maxWidth:560, marginBottom:"2rem" }}>
                  We are a community-driven Public Benefit Organisation committed to transforming lives across Kenya — partnering with individuals, communities, and organizations to enhance access to equitable opportunities for the disadvantaged.
                </p>

                {/* Mission / Vision / Goal */}
                <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem", marginBottom:"2.5rem" }}>
                  {[
                    { label:"Mission", text:"To partner with individuals, communities, and organizations to enhance access to equitable opportunities for the disadvantaged." },
                    { label:"Vision",  text:"Secure, empowered, resilient, and transformed communities." },
                    { label:"Goal",    text:"To provide access to sustainable development for people from disadvantaged backgrounds." },
                  ].map(item => (
                    <div key={item.label} style={{ display:"flex", gap:".875rem", alignItems:"flex-start" }}>
                      <div style={{ width:"3px", minHeight:"100%", background:"var(--cf-orange)", borderRadius:"2px", flexShrink:0, marginTop:".3rem", alignSelf:"stretch" }} />
                      <div>
                        <span style={{ fontSize:".6rem", fontWeight:800, letterSpacing:".18em", textTransform:"uppercase", color:"var(--cf-orange)", display:"block", marginBottom:".25rem" }}>{item.label}</span>
                        <p style={{ fontSize:".875rem", color:"#374151", lineHeight:1.75 }}>{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display:"flex", flexWrap:"wrap", gap:"1rem" }}>
                  <Link to="/about" className="cf-btn cf-btn-primary" style={{ clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)" }}>
                    Read More About Us <FaArrowRight aria-hidden="true" />
                  </Link>
                  <Link to="/impact" className="cf-btn cf-btn-outline-dark">
                    Our Impact
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Quick stats bar */}
            <Reveal cls="hm-rv-r">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5px", background:"rgba(0,0,0,.07)" }}>
                {[
                  { n:"2015",   l:"Year Founded",        bg:"#ee4c05" },
                  { n:"5",      l:"Programme Areas",     bg:"#0e7fbb" },
                  { n:"Kilifi", l:"Head Office",         bg:"#46c5e4" },
                  { 
                    n:"Public Benefit Organization (PBO)", 
                    l:"Organization Status", 
                    bg:"#043463", 
                    size:"clamp(1.25rem, 3vw, 1.75rem)" // Custom size override for the longer text
                  },
                ].map(s => (
                  <div 
                    key={s.l} 
                    style={{ 
                      background:"#f9fafb", 
                      padding:"2rem 1.5rem", 
                      borderTop:`3px solid ${s.bg}`,
                      display: "flex",           // Added to keep items vertically centered 
                      flexDirection: "column",   // when adjacent boxes have different heights
                      justifyContent: "center"
                    }}
                  >
                    <div style={{ 
                      fontFamily:"'Bebas Neue',sans-serif", 
                      fontSize: s.size || "clamp(2rem,5vw,3.25rem)", // Applies custom size if it exists
                      lineHeight:1, 
                      color:s.bg, 
                      letterSpacing:".02em" 
                    }}>
                      {s.n}
                    </div>
                    <div style={{ 
                      fontSize:".65rem", 
                      fontWeight:700, 
                      letterSpacing:".18em", 
                      textTransform:"uppercase", 
                      color:"#9ca3af", 
                      marginTop:".375rem" 
                    }}>
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════╗
          ║  PROGRAMS GRID                               ║
          ╚══════════════════════════════════════════════╝ */}
      <section id="programs" style={{ background:"#f8fbfd", padding:"var(--cv) 0", scrollMarginTop:"68px" }} aria-labelledby="programs-heading">
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto", padding:"0 var(--cp)", marginBottom:"clamp(2.5rem,5vw,4rem)" }}>
          <Reveal>
            <div className="hm-sec-label hm-sec-orange">What We Do</div>
            <div style={{ display:"flex", flexWrap:"wrap", alignItems:"flex-end", justifyContent:"space-between", gap:"1.5rem" }}>
              <h2 id="programs-heading" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,7vw,5.5rem)", lineHeight:.9, color:"#043463", letterSpacing:".02em" }}>
                OUR FOCUS <span style={{ color:"#ee4c05" }}>AREAS.</span>
              </h2>
              <Link to="/programs" style={{ display:"inline-flex", alignItems:"center", gap:".5rem", fontSize:".7rem", fontWeight:800, letterSpacing:".12em", textTransform:"uppercase", color:"#043463", textDecoration:"none", transition:"color .2s" }}
                    onMouseEnter={e=>e.currentTarget.style.color="#0e7fbb"}
                    onMouseLeave={e=>e.currentTarget.style.color="#043463"}>
                Explore All Programs <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          {/* Change PROGRAMS.map to displayPrograms.map */}
        <div className="hm-prog-grid" role="list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", alignItems: "stretch" }}>
          {displayPrograms.map((prog, i) => (
            <Reveal key={prog.slug} delay={i * 70}>
                <div role="listitem" style={{ height: "100%" }}>
                  <Link to="/programs" className="hm-prog-card" style={{ "--pc": "#0e7fbb", background: "#ffffff", border: "1px solid #e0e7ef", height: "100%", display: "flex", flexDirection: "column" }}
                        aria-label={`${prog.title} programme — click to explore`}>
                    <div className="hm-prog-ghost" aria-hidden="true" style={{ color: "rgba(4, 52, 99, 0.06)" }}>{prog.num}</div>
                    <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", gap:"1.125rem", flex: "1" }}>
                      <div className="hm-prog-icon" style={{ background:"#ee4c05", color:"#ffffff" }}>{prog.icon}</div>
                      <h3 className="hm-prog-h3" style={{ color: "#043463" }}>{prog.title}</h3>
                      <p className="hm-prog-sub" style={{ color: "#4a6b8a", flex: "1" }}>{prog.sub}</p>
                      <div>
                        <span className="hm-prog-stat" style={{ color:"#0e7fbb" }}>{prog.stat}</span>
                        <span className="hm-prog-unit" style={{ color: "#043463" }}>{prog.unit}</span>
                      </div>
                      <div className="hm-prog-cta" style={{ color:"#ee4c05" }}>
                        <span>Explore</span><FaArrowRight aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════╗
          ║  CORE VALUES                                 ║
          ╚══════════════════════════════════════════════╝ */}
      <section style={{ background:"#fff", padding:"var(--cv) var(--cp)" }} aria-labelledby="values-heading">
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <Reveal>
            <div className="hm-sec-label hm-sec-dark">Our Foundation</div>
            <h2 id="values-heading" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,7vw,5.5rem)", lineHeight:.9, color:"#080808", letterSpacing:".02em", marginBottom:"clamp(2.5rem,5vw,4rem)" }}>
              CORE <span style={{ color:"var(--cf-orange)" }}>VALUES.</span>
            </h2>
          </Reveal>
          <div className="hm-val-grid">
            {VALUES.map((v, i) => (
              <Reveal key={v.h} delay={i * 70}>
                <div className="hm-val-card" style={{ backgroundColor: "#f8fbfd" }}>
                  <div className="hm-val-icon" aria-hidden="true">{v.icon}</div>
                  <h3 className="hm-val-h">{v.h}</h3>
                  <p className="hm-val-p">{v.p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════╗
          ║  GET INVOLVED                                ║
          ╚══════════════════════════════════════════════╝ */}
      <section id="get-involved" style={{ background:"#f8fbfd", padding:"var(--cv) 0", scrollMarginTop:"68px", position:"relative", overflow:"hidden" }} aria-labelledby="gi-heading">
        <div aria-hidden="true" style={{ position:"absolute", fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(10rem,25vw,20rem)", lineHeight:.85, color:"rgba(249,115,22,.04)", right:"-2%", top:"50%", transform:"translateY(-50%)", userSelect:"none", pointerEvents:"none" }}>ACT</div>

        <div style={{ maxWidth:"var(--cw)", margin:"0 auto", padding:"0 var(--cp) var(--cv)", position:"relative", zIndex:1 }}>
          <Reveal>
            <div className="hm-sec-label hm-sec-dark">Make a Difference</div>
            <div style={{ display:"flex", flexWrap:"wrap", alignItems:"flex-end", justifyContent:"space-between", gap:"1.5rem", marginBottom:"clamp(2.5rem,5vw,4rem)" }}>
              <h2 id="gi-heading" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,7vw,5.5rem)", lineHeight:.9, color:"#080808", letterSpacing:".02em" }}>
                GET <span style={{ color:"var(--cf-orange)" }}>INVOLVED.</span>
              </h2>
              <p style={{ color:"#6b7280", fontSize:".9rem", lineHeight:1.75, maxWidth:360 }}>
                Choose how you'd like to support our mission and help build stronger communities across Kenya.
              </p>
            </div>
          </Reveal>
        </div>

        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <div className="hm-gi-grid">
            {[
              { num:"01", icon:<FaHeart/>,         title:"Donate Today",    p:"Support our cause financially. Every shilling reaches communities directly — from scholarships to eye surgeries.", col:"#ee4c05", bg:"rgba(249,115,22,.1)", href:"/get-involved#donate-form",    cta:"Donate Now" },
              { num:"02", icon:<FaHandsHelping/>,  title:"Join as a Volunteer", p:"Give your time, skills, and energy. Join our 200+ strong volunteer network making a difference across Kilifi.", col:"#1d4ed8", bg:"rgba(29,78,216,.1)",   href:"/get-involved#volunteer-form", cta:"Volunteer Now" },
              { num:"03", icon:<FaHandshake/>,     title:"Partner With Us", p:"Organisations, businesses, and institutions — collaborate with us to multiply our community impact across Kenya.", col:"#22c55e", bg:"rgba(34,197,94,.1)",  href:"/get-involved#partner-form",  cta:"Become a Partner" },
            ].map((opt, i) => (
              <Reveal key={opt.num} delay={i * 100} style={{ height: "100%" }}>
                <Link to={opt.href} className="hm-gi-card" style={{ "--gc": opt.col, display: "flex", flexDirection: "column", height: "100%" }}>
                  <div className="hm-gi-num" aria-hidden="true">{opt.num}</div>
                  <div className="hm-gi-icon" style={{ background:opt.bg, color:opt.col }}>{opt.icon}</div>
                  <h3 className="hm-gi-h3">{opt.title}</h3>
                  <p className="hm-gi-p" style={{ flexGrow: 1 }}>{opt.p}</p>
                  <span className="hm-gi-link" style={{ color:opt.col, marginTop: "auto" }}>
                    {opt.cta} <FaArrowRight aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════╗
          ║  PARTNERS SECTION                            ║
          ╚══════════════════════════════════════════════╝ */}
      <section id="partners" style={{ background:"#f8fbfd", padding:"var(--cv) var(--cp)", scrollMarginTop:"68px" }} aria-labelledby="partners-heading">
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <Reveal>
            <div style={{ display:"flex", flexWrap:"wrap", alignItems:"flex-end", justifyContent:"space-between", gap:"1.5rem", marginBottom:"clamp(2.5rem,5vw,4rem)" }}>
              <div>
                <div className="hm-sec-label hm-sec-orange">Strategic Alliance</div>
                <h2 id="partners-heading" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,7vw,5.5rem)", lineHeight:.9, color:"#043463", letterSpacing:".02em" }}>
                  OUR <span style={{ color:"#ee4c05" }}>PARTNERS.</span>
                </h2>
              </div>
              
              <button onClick={() => setPartnersPaused(p => !p)} aria-pressed={partnersPaused}
                      style={{ display:"inline-flex", alignItems:"center", gap:".5rem", background:"#ffffff", border:"1px solid #e0e7ef", color:"#043463", fontFamily:"'Outfit',sans-serif", fontSize:".7rem", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", padding:".55rem 1rem", cursor:"pointer", borderRadius:2, transition:"all .2s" }}
                      onMouseEnter={e=>{e.currentTarget.style.background="#ee4c05"; e.currentTarget.style.color="#ffffff"; e.currentTarget.style.borderColor="#ee4c05"}}
                      onMouseLeave={e=>{e.currentTarget.style.background="#ffffff"; e.currentTarget.style.color="#043463"; e.currentTarget.style.borderColor="#e0e7ef"}}>
                {partnersPaused ? "Resume" : "Pause"}
              </button>
            </div>
          </Reveal>

          <Swiper
            modules={[Autoplay, A11y]}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{ 480:{slidesPerView:3}, 768:{slidesPerView:4}, 1024:{slidesPerView:6} }}
            autoplay={partnersPaused ? false : { delay:3200, disableOnInteraction:false, pauseOnMouseEnter:true }}
            loop
            className="pb-4"
          >
            {PARTNERS.map((p, i) => {
              const isMain = i === 0;
              return (
                <SwiperSlide key={i}>
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                     className={`hm-partner-logo ${isMain ? 'main-partner-highlight' : ''}`}
                     style={{ display:"flex", position: 'relative', overflow: isMain ? 'visible' : 'hidden', transition: 'all 0.4s ease' }}>
                    
                    {isMain && (
                      <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.5rem', background: '#ee4c05', color: '#ffffff', padding: '2px 8px', fontWeight: 900, letterSpacing: '0.1em', borderRadius: '2px', zIndex: 2 }}>
                        MAIN
                      </span>
                    )}

                    <img src={p.logo} alt={`${p.name} logo`}
                         style={{ filter: isMain ? "grayscale(0%) brightness(1.1)" : "grayscale(100%)", opacity: isMain ? 1 : 0.5, transform: isMain ? 'scale(1.05)' : 'scale(1)', border: isMain ? '1px solid #ee4c05' : '1px solid #e0e7ef', boxShadow: isMain ? '0 0 20px rgba(238, 76, 5, 0.2)' : 'none', background: '#ffffff' }} />
                  </a>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <Reveal>
            <div style={{ marginTop:"clamp(3rem,5vw,5rem)", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:"2rem", padding:"clamp(2rem,4vw,3rem)", background:"#ffffff", border:"1px solid #e0e7ef", borderLeft:"4px solid #ee4c05", borderRadius:2 }}>
              <div>
                <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(1.5rem,4vw,2.75rem)", letterSpacing:".04em", color:"#043463", marginBottom:".625rem" }}>
                  BECOME A PARTNER.
                </h3>
                <p style={{ color:"#4a6b8a", fontSize:".875rem", lineHeight:1.75, maxWidth:480 }}>
                  Join our growing network of organisations committed to transforming lives across Kenya. Let's build together.
                </p>
              </div>
              <Link to="/get-involved#partner-form" className="cf-btn cf-btn-primary"
                    style={{ clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)", display:"inline-flex", padding:".75rem 1.5rem" }}>
                Partner With Us <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════╗
          ║  UPCOMING EVENTS PREVIEW                     ║
          ╚══════════════════════════════════════════════╝ */}
      <section id="events" style={{ background:"#f9fafb", padding:"var(--cv) var(--cp)", scrollMarginTop:"68px" }} aria-labelledby="events-heading">
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <Reveal>
            <div style={{ display:"flex", flexWrap:"wrap", alignItems:"flex-end", justifyContent:"space-between", gap:"1.5rem", marginBottom:"clamp(2.5rem,5vw,4rem)" }}>
              <div>
                <div className="hm-sec-label hm-sec-dark">What's Coming</div>
                <h2 id="events-heading" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,7vw,5.5rem)", lineHeight:.9, color:"#080808", letterSpacing:".02em" }}>
                  UPCOMING <span style={{ color:"var(--cf-orange)" }}>EVENTS.</span>
                </h2>
              </div>
              <Link to="/news" style={{ display:"inline-flex", alignItems:"center", gap:".5rem", fontSize:".7rem", fontWeight:800, letterSpacing:".12em", textTransform:"uppercase", color:"#374151", textDecoration:"none", transition:"color .2s" }}
                    onMouseEnter={e=>e.currentTarget.style.color="var(--cf-orange)"}
                    onMouseLeave={e=>e.currentTarget.style.color="#374151"}>
                All Events <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"1.25rem" }} role="list">
             {loadingDashboard ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
             ) : dashboardError ? (
                <div style={{ padding: "2rem", gridColumn: "1 / -1", textAlign: "center", color: "#6b7280" }}>
                  <FaExclamationCircle style={{ fontSize: "2rem", marginBottom: "1rem", color: "rgba(238,76,5,0.5)" }} />
                  <p>Unable to load upcoming events at this time.</p>
                </div>
             ) : events.length > 0 ? (
                events.map((ev, i) => (
                  <Reveal key={ev.id} delay={i * 80}>
                    <div role="listitem"><EventCard ev={ev} /></div>
                  </Reveal>
                ))
             ) : (
                <p style={{ gridColumn: "1 / -1", color: "#6b7280" }}>No upcoming events scheduled at the moment.</p>
             )}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════╗
          ║  ARTICLES PREVIEW                            ║
          ╚══════════════════════════════════════════════╝ */}
      <section id="articles" style={{ background: "#fff", padding: "var(--cv) var(--cp)", scrollMarginTop: "68px" }} aria-labelledby="articles-heading">
        <div style={{ maxWidth: "var(--cw)", margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem", marginBottom: "clamp(2.5rem,5vw,4rem)" }}>
              <div>
                <div className="hm-sec-label hm-sec-dark">Knowledge Hub</div>
                <h2 id="articles-heading" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.5rem,7vw,5.5rem)", lineHeight: 0.9, color: "#080808", letterSpacing: ".02em" }}>
                  LATEST <span style={{ color: "var(--cf-orange)" }}>ARTICLES.</span>
                </h2>
              </div>
              <Link to="/articles" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", fontSize: ".7rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "#374151", textDecoration: "none", transition: "color .2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--cf-orange)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#374151")}>
                All Articles <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.25rem", alignItems: "stretch" }} role="list">
             {loadingDashboard ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
             ) : dashboardError ? (
                <div style={{ padding: "2rem", gridColumn: "1 / -1", textAlign: "center", color: "#6b7280" }}>
                  <FaExclamationCircle style={{ fontSize: "2rem", marginBottom: "1rem", color: "rgba(238,76,5,0.5)" }} />
                  <p>Unable to load the latest articles at this time.</p>
                </div>
             ) : articles.length > 0 ? (
                articles.map((a, i) => (
                  <Reveal key={a.id} delay={i * 80}>
                    <div role="listitem" style={{ height: "100%" }}>
                      <ArticleCard article={a} />
                    </div>
                  </Reveal>
                ))
             ) : (
                <p style={{ gridColumn: "1 / -1", color: "#6b7280" }}>No articles currently available.</p>
             )}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════╗
          ║  CONTACT STRIP                               ║
          ╚══════════════════════════════════════════════╝ */}
      <section id="contact" style={{ background:"var(--cf-navy)", padding:"var(--cv) var(--cp)", scrollMarginTop:"68px" }} aria-labelledby="contact-heading">
        <div style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <Reveal>
            <div className="hm-sec-label hm-sec-orange">Reach Out</div>
            <h2 id="contact-heading" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,7vw,5.5rem)", lineHeight:.9, color:"#fff", letterSpacing:".02em", marginBottom:"clamp(2.5rem,5vw,4rem)" }}>
              GET IN <span style={{ color:"var(--cf-orange)" }}>TOUCH.</span>
            </h2>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:"2rem" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:"1rem" }}>
              {[
                { href:"tel:+254790289989",              icon:<FaPhoneAlt/>,    label:"Phone",   value:"+254 790 289 989",         sub:"Mon–Fri, 8am–5pm EAT",  bg:"rgba(249,115,22,.12)", col:"#ee4c05" },
                { href:"mailto:info@imarikafoundation.org",icon:<FaEnvelope/>,    label:"Email",   value:"info@imarikafoundation.org", sub:"We reply within 24 hours", bg:"rgba(29,78,216,.12)",  col:"#3b82f6" },
                { href:"/contact",                         icon:<FaMapMarkerAlt/>,label:"Address", value:"Imarika DT Sacco Plaza",     sub:"Kilifi, Kenya",  bg:"rgba(34,197,94,.12)",  col:"#22c55e" },
              ].map(c => (
                <Reveal key={c.label}>
                  <a href={c.href} className="hm-ct-card" aria-label={`${c.label}: ${c.value}`}>
                    <div className="hm-ct-icon" style={{ background:c.bg, color:c.col }}>{c.icon}</div>
                    <div>
                      <div className="hm-ct-lbl">{c.label}</div>
                      <div className="hm-ct-val">{c.value}</div>
                      <div className="hm-ct-sub">{c.sub}</div>
                    </div>
                  </a>
                </Reveal>
              ))}
              <Reveal>
                <Link to="/contact" className="cf-btn cf-btn-primary" style={{ clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)", marginTop:".5rem", display:"inline-flex" }}>
                  Send Us a Message <FaArrowRight aria-hidden="true" />
                </Link>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <div className="hm-map">
                <iframe
                  title="Imarika Foundation Location"
                  src="https://maps.google.com/maps?q=Imarika+DT+Sacco+Plaza,+Kilifi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%" height="100%"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════╗
          ║  FOOTER                                      ║
          ╚══════════════════════════════════════════════╝ */}
      <footer className="hm-footer">
        <div style={{ padding:"clamp(3rem,7vw,5rem) var(--cp)", borderBottom:"1px solid rgba(255,255,255,.05)", maxWidth:"var(--cw)", margin:"0 auto" }}>
          <div style={{ display:"flex", flexWrap:"wrap", alignItems:"flex-end", justifyContent:"space-between", gap:"2rem", marginBottom:"3rem", paddingBottom:"3rem", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
            <div>
              <div className="hm-footer-wm">
                IMARIKA<br/><span style={{ color:"var(--cf-orange)" }}>FOUNDATION.</span>
              </div>
              <p style={{ color:"rgba(255,255,255,.25)", fontSize:".75rem", letterSpacing:".1em", textTransform:"uppercase", fontFamily:"'Outfit',sans-serif" }}>
                Empowering Communities · Kenya
              </p>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:".75rem" }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="cf-social" aria-label={`Follow on ${s.label}`}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="hm-footer-grid">
            {FOOTER_COLS.map(col => (
              <nav key={col.h} aria-label={`${col.h} links`}>
                <h3 className="hm-footer-nav-h">{col.h}</h3>
                <ul className="hm-footer-nav-ul">
                  {col.ls.map(l => (
                    <li key={l.l}>
                      <Link to={l.href} className="hm-footer-nav-a">{l.l}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h3 className="hm-footer-nav-h">Contact</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:".875rem" }}>
                {[
                  { icon:<FaPhoneAlt/>,    val:"0790 289 989",               href:"tel:+254790289989" },
                  { icon:<FaEnvelope/>,    val:"info@imarikafoundation.org", href:"mailto:info@imarikafoundation.org" },
                  { icon:<FaMapMarkerAlt/>,val:"Imarika DT Sacco Plaza, Kilifi", href:"/contact" },
                ].map(c => (
                  <a key={c.val} href={c.href} style={{ display:"flex", alignItems:"flex-start", gap:".625rem", color:"rgba(255,255,255,.3)", textDecoration:"none", fontSize:".82rem", transition:"color .2s" }}
                     onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                     onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.3)"}>
                    <span style={{ color:"var(--cf-orange)", marginTop:".2rem", flexShrink:0 }}>{c.icon}</span>
                    <span>{c.val}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hm-footer-bottom" style={{ maxWidth:"var(--cw)", margin:"0 auto" }}>
          <p className="hm-footer-copy">
            © {new Date().getFullYear()} Imarika Foundation · All rights reserved.
          </p>

          <Link to="/admin-login" className="cf-footer-admin" aria-label="Staff Login">
            <FaLock size={10} />
          </Link>
          
          <button className="hm-footer-back" onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}>
            Back to Top ↑
          </button>
        </div>
      </footer>

      {/* Back-to-top FAB (Accessibility Fix Applied) */}
      <button 
        className={`cf-btt ${showTop ? "" : "hidden"}`} 
        onClick={() => window.scrollTo({ top:0, behavior:"smooth" })} 
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
      >
        <FaArrowUp aria-hidden="true" />
      </button>
    </div>
  );
}