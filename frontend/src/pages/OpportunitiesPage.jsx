/**
 * OpportunitiesPage.jsx
 * Imarika Foundation — Opportunities (Tenders, Jobs, Internships, Volunteers, EOIs, Consultancies)
 *
 * Architecture notes:
 *  - Fully data-driven: all opportunities come from the Django REST API
 *    (see API_BASE / mapOpportunity below). No local sample data.
 *  - STATUS_CONFIG / TYPE_CONFIG are the single source of truth for badge colours & labels.
 *  - Reusable primitives: <Reveal>, <StatusBadge>, <TypeBadge>, <OpportunityCard>, <StatStrip>,
 *    <FilterBar>, <SubscribePanel>, <ContactNote>.
 *  - Additional fields (attachments, apply_url, contact_email, salary_range …) can be added
 *    to the data shape and rendered in OpportunityCard without touching anything else.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import {
  FaDownload, FaEnvelope, FaSearch, FaCalendarAlt,
  FaFileAlt, FaHashtag, FaCheckCircle, FaTimesCircle,
  FaClock, FaMapMarkerAlt, FaExternalLinkAlt, FaImage,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import "../components/coastal-fire.css";

/* ─────────────────────────────────────────────
   1. CONFIGURATION — colours, labels, icons
   ───────────────────────────────────────────── */

export const STATUS_CONFIG = {
  open: {
    label: "Open",
    icon: <FaClock />,
    color: "#22c55e",
    bg: "rgba(34,197,94,.12)",
    border: "rgba(34,197,94,.3)",
    bar: "#22c55e",
  },
  closed: {
    label: "Closed",
    icon: <FaTimesCircle />,
    color: "#ef4444",
    bg: "rgba(239,68,68,.12)",
    border: "rgba(239,68,68,.3)",
    bar: "#ef4444",
  },
  awarded: {
    label: "Awarded",
    icon: <FaCheckCircle />,
    color: "#0e7fbb",
    bg: "rgba(14,127,187,.12)",
    border: "rgba(14,127,187,.3)",
    bar: "#0e7fbb",
  },
  filled: {
    label: "Filled",
    icon: <FaCheckCircle />,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,.12)",
    border: "rgba(139,92,246,.3)",
    bar: "#8b5cf6",
  },
};

export const TYPE_CONFIG = {
  tender: { label: "Tender", color: "#ee4c05", bg: "rgba(238,76,5,.1)" },
  consultancy: { label: "Consultancy", color: "#0e7fbb", bg: "rgba(14,127,187,.1)" },
  job: { label: "Job Vacancy", color: "#043463", bg: "rgba(4,52,99,.1)" },
  internship: { label: "Internship", color: "#22c55e", bg: "rgba(34,197,94,.1)" },
  volunteer: { label: "Volunteer", color: "#f59e0b", bg: "rgba(245,158,11,.1)" },
  eoi: { label: "EOI", color: "#8b5cf6", bg: "rgba(139,92,246,.1)" },
};

/* ─────────────────────────────────────────────
   2. BACKEND INTEGRATION
   Base endpoint exposed by the Django "opportunities" app
   (see opportunities/urls.py — DefaultRouter on OpportunityViewSet).
   GET (list/retrieve) is public; write methods require staff auth.
   ───────────────────────────────────────────── */

export const API_BASE = "https://imarikafoundation.pythonanywhere.com/api/opportunities/";

/**
 * Normalises a raw Opportunity record returned by the API
 * (OpportunityListSerializer / OpportunityDetailSerializer) into the
 * flat shape this page's components expect.
 *
 * Fields the backend doesn't model yet (category, apply_url,
 * contact_email) are simply left null — every component already
 * treats them as optional and falls back gracefully.
 */
export function mapOpportunity(api) {
  return {
    id: api.id,
    type: api.opportunity_type,
    status: api.status,
    title: api.title,
    ref: api.reference_number,
    description: api.description || api.summary || null,
    location: api.location || null,
    deadline: api.deadline,
    category: null,
    file: null,
    apply_url: null,
    contact_email: null,
    featuredImageUrl: api.featured_image_url || null,
    // Used by <OpportunityCard> to lazily resolve a downloadable file,
    // since the list endpoint only returns a count, not the files.
    attachmentCount:
      api.attachment_count ?? (Array.isArray(api.attachments) ? api.attachments.length : 0),
  };
}

/* ─────────────────────────────────────────────
   3. PAGE-SCOPED CSS  (unchanged visual language)
   ───────────────────────────────────────────── */

export const PAGE_CSS = `
  /* ── Hero ── */
  .opp-hero { background:#043463; padding:clamp(8rem,15vh,11rem) var(--cp) clamp(4rem,7vh,6rem); position:relative; overflow:hidden; }
  .opp-ghost { position:absolute; font-family:'Bebas Neue',sans-serif; font-size:clamp(8rem,22vw,18rem); line-height:.85; color:rgba(238,76,5,.05); right:-2%; top:50%; transform:translateY(-50%); user-select:none; pointer-events:none; }
  .opp-slash { position:absolute; width:3px; background:#ee4c05; border-radius:2px; transform:rotate(12deg); transform-origin:top center; }

  /* ── Stats strip ── */
  .opp-stats { display:flex; flex-wrap:wrap; gap:1.5px; background:rgba(4,52,99,.1); margin-bottom:2.5rem; }
  .opp-stat { flex:1; min-width:100px; background:#ffffff; padding:1.25rem 1.5rem; }
  .opp-stat-n { font-family:'Bebas Neue',sans-serif; font-size:2rem; line-height:1; letter-spacing:.02em; }
  .opp-stat-l { font-size:.62rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:#043463; margin-top:.25rem; }

  /* ── Filter bar ── */
  .opp-filter-bar { display:flex; flex-wrap:wrap; gap:1rem; align-items:center; margin-bottom:clamp(2rem,4vw,3rem); }
  .opp-search { display:flex; align-items:center; gap:.75rem; flex:1; min-width:220px; background:#ffffff; border:1px solid rgba(4,52,99,.2); padding:.75rem 1.125rem; border-radius:2px; transition:border-color .2s; }
  .opp-search:focus-within { border-color:#ee4c05; background:rgba(238,76,5,.04); }
  .opp-search-icon { color:#0e7fbb; flex-shrink:0; }
  .opp-search-input { background:none; border:none; outline:none; color:#043463; font-family:'Outfit',sans-serif; font-size:.875rem; width:100%; }
  .opp-search-input::placeholder { color:#a0aec0; }

  .opp-filter-group { display:flex; flex-direction:column; gap:.375rem; }
  .opp-filter-label { font-size:.6rem; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:#043463; opacity:.55; padding-left:.25rem; }
  .opp-tabs { display:flex; flex-wrap:wrap; gap:.5rem; }
  .opp-tab {
    background:#ffffff; color:#043463; border:1px solid rgba(4,52,99,.2); border-radius:100px;
    cursor:pointer; transition:all .2s; padding:.55rem .9rem; font-family:'Outfit',sans-serif;
    font-size:.72rem; font-weight:700; white-space:nowrap; letter-spacing:.02em;
  }
  .opp-tab:hover { border-color:#ee4c05; color:#ee4c05; }
  .opp-tab.active { background:#043463; color:#ffffff; border-color:#043463; }

  /* ── Grid ── */
  .opp-grid { display:grid; grid-template-columns:1fr; gap:1.25rem; }
  @media(min-width:768px)  { .opp-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:1200px) { .opp-grid { grid-template-columns:repeat(3,1fr); } }

  /* ── Card ── */
  .opp-card {
    height:100%; background:#ffffff; border:1px solid rgba(4,52,99,.1); border-radius:2px;
    padding:clamp(1.25rem,3vw,2rem); display:flex; flex-direction:column; gap:1rem;
    transition:border-color .25s, transform .3s, box-shadow .3s; position:relative; overflow:hidden;
  }
  .opp-card::before {
    content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
    background:var(--card-bar,#ee4c05); transition:width .3s;
  }
  .opp-card:hover { border-color:rgba(238,76,5,.4); transform:translateY(-3px); box-shadow:0 20px 40px rgba(4,52,99,.08); }
  .opp-card:hover::before { width:5px; }

  .opp-card-top { display:flex; flex-wrap:wrap; align-items:flex-start; justify-content:space-between; gap:.875rem; }
  .opp-card-badges { display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; }
  .opp-badge { display:inline-flex; align-items:center; gap:.35rem; font-size:.6rem; font-weight:800; letter-spacing:.15em; text-transform:uppercase; padding:.3rem .75rem; border-radius:100px; }
  .opp-badge-status { border:1px solid var(--bs-border); background:var(--bs-bg); color:var(--bs-color); }
  .opp-badge-type   { background:var(--bt-bg); color:var(--bt-color); }

  .opp-card-ref { font-family:'Bebas Neue',sans-serif; font-size:.95rem; letter-spacing:.08em; color:#0e7fbb; white-space:nowrap; }
  .opp-card-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.125rem,2.5vw,1.5rem); letter-spacing:.04em; color:#043463; line-height:1.1; }
  .opp-card-desc { font-size:.85rem; color:#4a5568; line-height:1.75; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }

  .opp-card-foot { margin-top:auto; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:.875rem; padding-top:.875rem; border-top:1px solid rgba(4,52,99,.1); }
  .opp-card-meta-row { display:flex; flex-direction:column; gap:.35rem; }
  .opp-card-meta-item { display:flex; align-items:center; gap:.5rem; font-size:.78rem; color:#4a5568; }
  .opp-card-meta-item svg { color:#ee4c05; flex-shrink:0; }

  /* ── Action buttons ── */
  .opp-btn { display:inline-flex; align-items:center; gap:.5rem; font-family:'Outfit',sans-serif; font-size:.68rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; padding:.5rem 1rem; cursor:pointer; border-radius:2px; transition:all .2s; text-decoration:none; border:1.5px solid; }
  .opp-btn-primary { color:#ee4c05; border-color:rgba(238,76,5,.3); background:none; }
  .opp-btn-primary:hover { background:#ee4c05; color:#ffffff; border-color:#ee4c05; }
  .opp-btn-secondary { color:#0e7fbb; border-color:rgba(14,127,187,.3); background:none; }
  .opp-btn-secondary:hover { background:#0e7fbb; color:#ffffff; border-color:#0e7fbb; }

  /* ── Subscribe panel ── */
  .opp-sub { background:#f0f4f8; border:1px solid rgba(4,52,99,.1); border-radius:2px; padding:clamp(2rem,4vw,3rem); margin-top:clamp(3rem,6vw,5rem); }
  .opp-sub-grid { display:grid; grid-template-columns:1fr; gap:2rem; }
  @media(min-width:768px) { .opp-sub-grid { grid-template-columns:1fr 1fr; align-items:center; } }
  .opp-sub-form { display:flex; gap:.75rem; flex-wrap:wrap; }
  .opp-sub-input { flex:1; min-width:200px; background:#ffffff; border:1px solid rgba(4,52,99,.2); color:#043463; font-family:'Outfit',sans-serif; font-size:.875rem; padding:.875rem 1.125rem; border-radius:2px; outline:none; transition:border-color .2s; }
  .opp-sub-input::placeholder { color:#a0aec0; }
  .opp-sub-input:focus { border-color:#ee4c05; background:rgba(238,76,5,.04); box-shadow:0 0 0 3px rgba(238,76,5,.1); }

  /* ── Skeleton / empty state ── */
  .opp-skel { background:#e2e8f0; border-radius:2px; animation:opp-pulse 1.4s ease-in-out infinite; }
  @keyframes opp-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
  .opp-empty { text-align:center; padding:4rem 0; }
  .opp-empty-icon { font-size:3.5rem; color:rgba(4,52,99,.1); margin:0 auto 1.25rem; }

  /* ── Reveal ── */
  .opp-rv { height:100%; opacity:0; transform:translateY(24px); transition:opacity .7s ease, transform .7s ease; }
  .opp-rv.in { opacity:1; transform:none; }
`;

/* ─────────────────────────────────────────────
   4. UTILITY HELPERS
   ───────────────────────────────────────────── */

export const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-KE", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch {
    return iso;
  }
};

export const isPast = (iso) => {
  try { return new Date(iso) < new Date(); } catch { return false; }
};

const DEFAULT_CONTACT = "info@imarikafoundation.org";

/* ─────────────────────────────────────────────
   5. REUSABLE PRIMITIVES
   ───────────────────────────────────────────── */

/** Intersection-Observer reveal wrapper */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("in"); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export const Reveal = ({ children, delay = 0 }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className="opp-rv" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

/** Status badge (Open / Closed / Awarded / Filled) */
export const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.closed;
  return (
    <span
      className="opp-badge opp-badge-status"
      style={{
        "--bs-color": cfg.color,
        "--bs-bg": cfg.bg,
        "--bs-border": cfg.border,
      }}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
};

/** Opportunity type badge (Tender / Job / Internship …) */
export const TypeBadge = ({ type }) => {
  const cfg = TYPE_CONFIG[type] ?? { label: type, color: "#043463", bg: "rgba(4,52,99,.1)" };
  return (
    <span
      className="opp-badge opp-badge-type"
      style={{ "--bt-color": cfg.color, "--bt-bg": cfg.bg }}
    >
      {cfg.label}
    </span>
  );
};

/** Individual opportunity card */
export const OpportunityCard = ({ opportunity: opp }) => {
  const statusCfg = STATUS_CONFIG[opp.status] ?? STATUS_CONFIG.closed;
  const past      = isPast(opp.deadline);
  const email     = opp.contact_email ?? DEFAULT_CONTACT;

  /* The list endpoint only sends an attachment count, not the file
     itself. If this opportunity has attachments, lazily fetch the
     detail record once to resolve a downloadable URL for the first one. */
  const [resolvedFile, setResolvedFile] = useState(opp.file ?? null);
  useEffect(() => {
    if (resolvedFile || !opp.attachmentCount || !opp.id) return;
    let cancelled = false;
    axios
      .get(`${API_BASE}${opp.id}/`)
      .then(r => {
        if (cancelled) return;
        const first = r.data?.attachments?.[0];
        if (first?.file_url) setResolvedFile(first.file_url);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [opp.id, opp.attachmentCount, resolvedFile]);

  const deadlineColor =
    opp.status === "open" && !past ? "#22c55e" : "#4a5568";

  const deadlineLabel =
    opp.status === "awarded" || opp.status === "filled" ? "Awarded" :
    past ? "Closed" : "Deadline";

  return (
    <article
      className="opp-card"
      style={{ "--card-bar": statusCfg.bar }}
      role="listitem"
      aria-labelledby={`opp-title-${opp.id}`}
    >
      {/* Top row: badges + ref */}
      <div className="opp-card-top">
        <div className="opp-card-badges">
          <StatusBadge status={opp.status} />
          <TypeBadge type={opp.type} />
          {opp.category && (
            <span style={{ fontSize: ".6rem", fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", padding: ".3rem .75rem", borderRadius: "100px", background: "rgba(14,127,187,.1)", color: "#0e7fbb" }}>
              {opp.category}
            </span>
          )}
        </div>
        {opp.ref && (
          <span className="opp-card-ref" title="Reference number">
            <FaHashtag style={{ display: "inline", fontSize: ".7em", marginRight: 2 }} />
            {opp.ref}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 id={`opp-title-${opp.id}`} className="opp-card-title">{opp.title}</h3>

      {/* Description */}
      {opp.description && (
        <p className="opp-card-desc">{opp.description}</p>
      )}

      {/* Footer: deadline + location + actions */}
      <div className="opp-card-foot">
        <div className="opp-card-meta-row">
          <div className="opp-card-meta-item">
            <FaCalendarAlt aria-hidden="true" />
            <span>
              {deadlineLabel}:{" "}
              <strong style={{ color: deadlineColor }}>{fmtDate(opp.deadline)}</strong>
            </span>
          </div>
          {opp.location && (
            <div className="opp-card-meta-item">
              <FaMapMarkerAlt aria-hidden="true" />
              <span>{opp.location}</span>
            </div>
          )}
        </div>

        {/* Action buttons — priority: download > external apply link > enquire (open only) */}
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          {resolvedFile && (
            <a
              href={resolvedFile}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="opp-btn opp-btn-primary"
              aria-label={`Download: ${opp.title}`}
            >
              <FaDownload aria-hidden="true" /> Download
            </a>
          )}
          {opp.apply_url && opp.status === "open" && (
            <a
              href={opp.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="opp-btn opp-btn-primary"
              aria-label={`Apply for: ${opp.title}`}
            >
              <FaExternalLinkAlt aria-hidden="true" /> Apply
            </a>
          )}
          {!resolvedFile && !opp.apply_url && opp.status === "open" && (
            <a
              href={`mailto:${email}?subject=Opportunity Enquiry: ${encodeURIComponent(opp.title)}`}
              className="opp-btn opp-btn-secondary"
              aria-label={`Enquire about: ${opp.title}`}
            >
              <FaEnvelope aria-hidden="true" /> Enquire
            </a>
          )}
          {opp.featuredImageUrl && (
            <a
              href={opp.featuredImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="opp-btn opp-btn-secondary"
              aria-label={`View image: ${opp.title}`}
            >
              <FaImage aria-hidden="true" /> View Image
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

/** Summary stats strip */
const StatStrip = ({ opportunities }) => {
  const stats = [
    { label: "Total",       value: opportunities.length,                                               color: "#ee4c05" },
    { label: "Open",        value: opportunities.filter(o => o.status === "open").length,              color: "#22c55e" },
    { label: "Jobs & Intern", value: opportunities.filter(o => ["job","internship"].includes(o.type)).length, color: "#043463" },
    { label: "Volunteers",  value: opportunities.filter(o => o.type === "volunteer").length,           color: "#f59e0b" },
    { label: "Closed",      value: opportunities.filter(o => o.status === "closed").length,            color: "#ef4444" },
    { label: "Awarded",     value: opportunities.filter(o => o.status === "awarded").length,           color: "#0e7fbb" },
  ];
  return (
    <div className="opp-stats" role="region" aria-label="Opportunity statistics">
      {stats.map(s => (
        <div key={s.label} className="opp-stat">
          <div className="opp-stat-n" style={{ color: s.color }}>{s.value}</div>
          <div className="opp-stat-l">{s.label}</div>
        </div>
      ))}
    </div>
  );
};

/** Dual filter bar: Status tabs + Type tabs + Search */
const FilterBar = ({ statusFilter, typeFilter, search, onStatus, onType, onSearch, counts }) => {
  const statusTabs = [
    { key: "all",     label: `All (${counts.all})` },
    { key: "open",    label: `Open (${counts.open})` },
    { key: "closed",  label: `Closed (${counts.closed})` },
    { key: "awarded", label: `Awarded (${counts.awarded})` },
  ];
  const typeTabs = [
    { key: "all",         label: "All Types" },
    { key: "tender",      label: "Tender" },
    { key: "consultancy", label: "Consultancy" },
    { key: "job",         label: "Job" },
    { key: "internship",  label: "Internship" },
    { key: "volunteer",   label: "Volunteer" },
    { key: "eoi",         label: "EOI" },
  ];

  return (
    <div className="opp-filter-bar">
      {/* Search */}
      <div className="opp-search" role="search" aria-label="Search opportunities">
        <FaSearch className="opp-search-icon" aria-hidden="true" />
        <input
          type="search"
          className="opp-search-input"
          placeholder="Search by title, reference, or keyword…"
          value={search}
          onChange={e => onSearch(e.target.value)}
          aria-label="Search opportunities"
        />
      </div>

      {/* Status filter */}
      <div className="opp-filter-group">
        <span className="opp-filter-label">Status</span>
        <div className="opp-tabs" role="tablist" aria-label="Filter by status">
          {statusTabs.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={statusFilter === t.key}
              className={`opp-tab ${statusFilter === t.key ? "active" : ""}`}
              onClick={() => onStatus(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type filter */}
      <div className="opp-filter-group">
        <span className="opp-filter-label">Type</span>
        <div className="opp-tabs" role="tablist" aria-label="Filter by opportunity type">
          {typeTabs.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={typeFilter === t.key}
              className={`opp-tab ${typeFilter === t.key ? "active" : ""}`}
              onClick={() => onType(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Email subscription panel */
const SubscribePanel = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg]     = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!email) return;
    // TODO: POST to /api/subscribe/ when backend is ready
    setMsg("✓ You're subscribed! We'll notify you when new opportunities are published.");
    setEmail("");
  };

  return (
    <Reveal>
      <div className="opp-sub" role="complementary" aria-labelledby="opp-sub-heading">
        <div className="opp-sub-grid">
          <div>
            <span className="cf-label" style={{ color: "#0e7fbb" }}>Stay Updated</span>
            <h3 id="opp-sub-heading" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(1.5rem,3vw,2.25rem)", letterSpacing: ".04em", color: "#043463", marginBottom: ".75rem" }}>
              GET OPPORTUNITY ALERTS.
            </h3>
            <p style={{ color: "#4a5568", fontSize: ".875rem", lineHeight: 1.75 }}>
              Subscribe to receive email notifications whenever new opportunities are published by Imarika Foundation.
            </p>
          </div>
          <div>
            {msg ? (
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", color: "#22c55e", fontSize: ".875rem", padding: "1rem", background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 2 }}>
                <FaCheckCircle aria-hidden="true" /> {msg}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="opp-sub-form" noValidate aria-label="Subscribe to opportunity alerts">
                <label htmlFor="opp-email" className="sr-only">Email address</label>
                <input
                  id="opp-email"
                  type="email"
                  className="opp-sub-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  aria-required="true"
                />
                <button type="submit" className="cf-btn cf-btn-orange" style={{ clipPath: "polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)", flexShrink: 0 }}>
                  <FaEnvelope aria-hidden="true" /> Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
};

/** Contact / procurement note */
const ContactNote = () => (
  <Reveal>
    <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(14,127,187,.05)", border: "1px solid rgba(14,127,187,.2)", borderRadius: 2, display: "flex", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
      <FaEnvelope style={{ color: "#0e7fbb", fontSize: "1.25rem", flexShrink: 0, marginTop: ".15rem" }} aria-hidden="true" />
      <div>
        <p style={{ color: "#4a5568", fontSize: ".875rem", lineHeight: 1.7 }}>
          <strong style={{ color: "#043463" }}>Questions about an opportunity?</strong>{" "}
          Contact our team at{" "}
          <a href={`mailto:${DEFAULT_CONTACT}`} style={{ color: "#0e7fbb" }}>{DEFAULT_CONTACT}</a>
          {" "}or call{" "}
          <a href="tel:+254790289989" style={{ color: "#0e7fbb" }}>+254 790 289 989</a>.
          All responses to procurement enquiries will be circulated to all registered bidders.
        </p>
      </div>
    </div>
  </Reveal>
);

/** Loading skeleton grid */
const SkeletonGrid = () => (
  <div className="opp-grid" aria-busy="true">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} style={{ background: "#ffffff", border: "1px solid rgba(4,52,99,.1)", borderRadius: 2, padding: "1.75rem", display: "flex", flexDirection: "column", gap: ".875rem" }} aria-hidden="true">
        {[40, 80, 60, 100, 70].map((w, j) => (
          <div key={j} className="opp-skel" style={{ height: j === 0 ? 16 : 13, width: `${w}%` }} />
        ))}
      </div>
    ))}
    <span role="status" className="sr-only">Loading opportunities…</span>
  </div>
);

/** Empty / error state */
const EmptyState = ({ hasSearch, error }) => (
  <div className="opp-empty">
    <FaFileAlt className="opp-empty-icon" aria-hidden="true" />
    <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.75rem", letterSpacing: ".04em", color: "#043463", marginBottom: ".75rem" }}>
      {error ? "Unable to Load Opportunities" : hasSearch ? "No Matching Opportunities" : "No Opportunities Found"}
    </h3>
    <p style={{ color: "#4a5568", fontSize: ".875rem", maxWidth: 360, margin: "0 auto" }}>
      {error
        ? "We couldn't reach the server. Please check your connection and try again shortly."
        : hasSearch
        ? "Try adjusting your search or changing the filters."
        : "There are no opportunities in this category at the moment. Check back soon."}
    </p>
  </div>
);

/* ─────────────────────────────────────────────
   6. PAGE COMPONENT
   ───────────────────────────────────────────── */

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(false);
  const [statusFilter, setStatusFilter]   = useState("all");
  const [typeFilter, setTypeFilter]       = useState("all");
  const [search, setSearch]               = useState("");

  /* Data fetching — follows DRF pagination (count/next/results) and
     maps each record to the UI shape via mapOpportunity(). All data
     comes from the backend; on failure we surface an error state
     rather than showing placeholder content. */
  const fetchOpportunities = useCallback(() => {
    setLoading(true);
    setError(false);
    let cancelled = false;

    const loadPage = (url, acc = []) =>
      axios.get(url).then(r => {
        const data = r.data;
        const page = Array.isArray(data) ? data : (data.results ?? []);
        const merged = acc.concat(page);
        const next = Array.isArray(data) ? null : data.next;
        return next ? loadPage(next, merged) : merged;
      });

    loadPage(API_BASE)
      .then(all => {
        if (cancelled) return;
        setOpportunities(all.map(mapOpportunity));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setOpportunities([]);
        setError(true);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const cleanup = fetchOpportunities();
    return cleanup;
  }, [fetchOpportunities]);

  /* Filtering */
  const filtered = opportunities.filter(opp => {
    const matchStatus = statusFilter === "all" || opp.status === statusFilter;
    const matchType   = typeFilter === "all"   || opp.type   === typeFilter;
    const q           = search.toLowerCase();
    const matchSearch = !q
      || opp.title.toLowerCase().includes(q)
      || (opp.ref        ?? "").toLowerCase().includes(q)
      || (opp.description ?? "").toLowerCase().includes(q)
      || (opp.location    ?? "").toLowerCase().includes(q);
    return matchStatus && matchType && matchSearch;
  });

  /* Status counts (for tab labels) */
  const counts = {
    all:     opportunities.length,
    open:    opportunities.filter(o => o.status === "open").length,
    closed:  opportunities.filter(o => o.status === "closed").length,
    awarded: opportunities.filter(o => o.status === "awarded" || o.status === "filled").length,
  };

  return (
    <div className="cf-root">
      <style>{PAGE_CSS}</style>
      <Helmet><title>Opportunities · Imarika Foundation</title></Helmet>
      <Navbar />

      {/* ── Hero ── */}
      <section className="opp-hero">
        <div className="opp-ghost" aria-hidden="true">OPPORTUNITIES</div>
        <div className="opp-slash" style={{ height: "clamp(80px,12vh,130px)", right: "clamp(1.5rem,8vw,6rem)", top: "50%" }} aria-hidden="true" />
        <div className="opp-slash" style={{ height: "clamp(50px,7vh,80px)", right: "clamp(3rem,11vw,9.5rem)", top: "52%", opacity: 0.35 }} aria-hidden="true" />
        <div style={{ maxWidth: 700, position: "relative", zIndex: 1 }}>
          <span className="cf-label" style={{ color: "#46c5e4" }}>Work With Us</span>
          <h1 className="cf-h1" style={{ color: "#fff" }}>
            OPPORTUNITIES &amp;<br />
            <span style={{ color: "#ee4c05" }}>OPEN CALLS.</span>
          </h1>
          <p style={{ color: "#46c5e4", fontSize: "clamp(.9rem,1.8vw,1.05rem)", lineHeight: 1.8, marginTop: "1.5rem", maxWidth: 540 }}>
            We believe in transparent, open engagement — with vendors, consultants, partners, and people who want to contribute their talent. Browse our current tenders, jobs, internships, volunteer roles, and more.
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <section style={{ background: "#ffffff", padding: "var(--cv) var(--cp)" }}>
        <div style={{ maxWidth: "var(--cw)", margin: "0 auto" }}>

          {/* Stats */}
          <Reveal>
            <StatStrip opportunities={opportunities} />
          </Reveal>

          {/* Filters */}
          <Reveal>
            <FilterBar
              statusFilter={statusFilter}
              typeFilter={typeFilter}
              search={search}
              onStatus={setStatusFilter}
              onType={setTypeFilter}
              onSearch={setSearch}
              counts={counts}
            />
          </Reveal>

          {/* Opportunity cards */}
          {loading ? (
            <SkeletonGrid />
          ) : filtered.length === 0 ? (
            <EmptyState hasSearch={!!search || statusFilter !== "all" || typeFilter !== "all"} error={error} />
          ) : (
            <div className="opp-grid" role="list" aria-label="Opportunities list">
              {filtered.map((opp, i) => (
                <Reveal key={opp.id} delay={i * 60}>
                  <OpportunityCard opportunity={opp} />
                </Reveal>
              ))}
            </div>
          )}

          {/* Subscribe & contact */}
          <SubscribePanel />
          <ContactNote />
        </div>
      </section>

      {/* ── Footer strip ── */}
      <footer style={{ background: "#043463", padding: "2rem var(--cp)", textAlign: "center", borderTop: "1px solid rgba(255,255,255,.1)" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: ".72rem", color: "rgba(255,255,255,.7)" }}>
          © {new Date().getFullYear()} Imarika Foundation · Kenya
        </p>
      </footer>
    </div>
  );
}