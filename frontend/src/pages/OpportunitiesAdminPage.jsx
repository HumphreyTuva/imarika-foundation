import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  FaPlus, FaPen, FaTrash, FaTimes,
  FaSave, FaSpinner, FaExclamationTriangle, FaArchive, FaStar,
  FaPaperclip, FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaHashtag,
  FaFileAlt, FaCheckCircle, FaDownload, FaUpload, FaHome,
} from "react-icons/fa";
import "../components/coastal-fire.css";
import {
  STATUS_CONFIG, API_BASE, PAGE_CSS,
  fmtDate, Reveal, TypeBadge,
} from "./OpportunitiesPage";

/* ─────────────────────────────────────────────
   1. CONFIGURATION
   ───────────────────────────────────────────── */

const ADMIN_STATUS_CONFIG = {
  ...STATUS_CONFIG,
  draft: {
    label: "Draft", icon: <FaFileAlt />,
    color: "#64748b", bg: "rgba(100,116,139,.12)", border: "rgba(100,116,139,.3)", bar: "#64748b",
  },
  archived: {
    label: "Archived", icon: <FaArchive />,
    color: "#1a202c", bg: "rgba(26,32,44,.12)", border: "rgba(26,32,44,.3)", bar: "#1a202c",
  },
};

const STATUS_OPTIONS = [
  { value: "draft",    label: "Draft" },
  { value: "open",     label: "Open" },
  { value: "closed",   label: "Closed" },
  { value: "awarded",  label: "Awarded" },
  { value: "filled",   label: "Filled" },
  { value: "archived", label: "Archived" },
];

const TYPE_OPTIONS = [
  { value: "tender",      label: "Tender" },
  { value: "consultancy", label: "Consultancy" },
  { value: "job",         label: "Job Vacancy" },
  { value: "internship",  label: "Internship" },
  { value: "volunteer",   label: "Volunteer Opportunity" },
  { value: "eoi",         label: "Expression of Interest" },
];

/* ─────────────────────────────────────────────
   2. AUTH — reads the JWT set by the shared LoginPage
   ───────────────────────────────────────────── */

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
  },
});

/* ─────────────────────────────────────────────
   3. ADMIN CSS
   ───────────────────────────────────────────── */

const ADMIN_CSS = `
  .adm-header { background:#043463; padding:clamp(2rem,5vw,3rem) clamp(1.25rem,5vw,4rem); position:relative; overflow:hidden; }
  .adm-header-ghost { position:absolute; font-family:'Bebas Neue',sans-serif; font-size:clamp(6rem,16vw,12rem); line-height:.85; color:rgba(238,76,5,.05); right:-1%; top:50%; transform:translateY(-50%); user-select:none; pointer-events:none; }
  .adm-header-slash { position:absolute; width:3px; background:#ee4c05; border-radius:2px; transform:rotate(12deg); transform-origin:top center; }
  .adm-header-row { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1.5rem; position:relative; z-index:1; }
  .adm-header-left { display:flex; align-items:center; gap:1.25rem; }
  .adm-logo { width:42px; height:42px; border-radius:2px; object-fit:cover; border:2px solid rgba(255,255,255,.15); flex-shrink:0; }
  .adm-hbtn { display:inline-flex; align-items:center; gap:.5rem; font-family:'Outfit',sans-serif; font-size:.65rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; padding:.6rem 1.25rem; border-radius:2px; border:1.5px solid; cursor:pointer; text-decoration:none; transition:all .2s; white-space:nowrap; background:none; }
  .adm-hbtn-outline { color:rgba(255,255,255,.8); border-color:rgba(255,255,255,.25); }
  .adm-hbtn-outline:hover { border-color:#fff; color:#fff; background:rgba(255,255,255,.07); }

  .adm-toolbar { display:flex; flex-wrap:wrap; gap:1rem; align-items:center; justify-content:space-between; margin-bottom:clamp(1.5rem,3vw,2rem); }
  .adm-toolbar-filters { display:flex; flex-wrap:wrap; gap:1rem; align-items:center; flex:1; }

  .adm-list { display:flex; flex-direction:column; gap:1rem; }
  .adm-row { flex-direction:column; gap:1rem; }
  @media(min-width:900px) { .adm-row { flex-direction:row; align-items:center; justify-content:space-between; gap:1.5rem; } }
  .adm-row-main { display:flex; flex-direction:column; gap:.6rem; min-width:0; flex:1; }
  .adm-row-meta { display:flex; flex-wrap:wrap; gap:1rem; }
  .adm-row-meta-item { display:flex; align-items:center; gap:.4rem; font-size:.78rem; color:#4a5568; }
  .adm-row-meta-item svg { color:#ee4c05; flex-shrink:0; }
  .adm-row-actions { display:flex; gap:.5rem; flex-shrink:0; }
  .adm-pill { display:inline-flex; align-items:center; gap:.35rem; font-size:.6rem; font-weight:800; letter-spacing:.15em; text-transform:uppercase; padding:.3rem .75rem; border-radius:100px; }

  .adm-icon-btn { display:inline-flex; align-items:center; justify-content:center; width:2.35rem; height:2.35rem; border-radius:2px; border:1.5px solid; cursor:pointer; transition:all .2s; background:none; flex-shrink:0; }
  .adm-icon-btn:disabled { opacity:.5; cursor:not-allowed; }
  .adm-icon-btn-edit { color:#0e7fbb; border-color:rgba(14,127,187,.3); }
  .adm-icon-btn-edit:hover:not(:disabled) { background:#0e7fbb; color:#fff; border-color:#0e7fbb; }
  .adm-icon-btn-delete { color:#ef4444; border-color:rgba(239,68,68,.3); }
  .adm-icon-btn-delete:hover:not(:disabled) { background:#ef4444; color:#fff; border-color:#ef4444; }

  .opp-btn-danger { color:#ef4444; border-color:rgba(239,68,68,.3); background:none; }
  .opp-btn-danger:hover:not(:disabled) { background:#ef4444; color:#fff; border-color:#ef4444; }
  .opp-btn:disabled { opacity:.6; cursor:not-allowed; }

  .adm-spin { animation:adm-spin .8s linear infinite; }
  @keyframes adm-spin { to { transform:rotate(360deg); } }

  .adm-form-grid { display:grid; grid-template-columns:1fr; gap:1.25rem; }
  @media(min-width:560px) { .adm-form-grid-2 { grid-template-columns:1fr 1fr; } }
  .adm-field { display:flex; flex-direction:column; gap:.4rem; }
  .adm-label { font-size:.65rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:#043463; opacity:.7; }
  .adm-input, .adm-select, .adm-textarea {
    background:#ffffff; border:1px solid rgba(4,52,99,.2); color:#043463; font-family:'Outfit',sans-serif;
    font-size:.875rem; padding:.75rem 1rem; border-radius:2px; outline:none; transition:border-color .2s; width:100%;
  }
  .adm-input:focus, .adm-select:focus, .adm-textarea:focus { border-color:#ee4c05; background:rgba(238,76,5,.04); }
  .adm-input:disabled, .adm-textarea:disabled { background:#f0f4f8; color:#4a5568; cursor:not-allowed; }
  .adm-textarea { resize:vertical; min-height:90px; font-family:'Outfit',sans-serif; line-height:1.6; }
  .adm-hint { font-size:.7rem; color:#a0aec0; }
  .adm-error-text { font-size:.72rem; color:#ef4444; display:flex; align-items:center; gap:.35rem; }
  .adm-checkbox-row { display:flex; align-items:center; gap:.6rem; cursor:pointer; }
  .adm-checkbox-row input { width:1.05rem; height:1.05rem; accent-color:#ee4c05; cursor:pointer; }

  .adm-banner { display:flex; align-items:flex-start; gap:.65rem; padding:.875rem 1.1rem; border-radius:2px; font-size:.8rem; line-height:1.6; }
  .adm-banner-error   { background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.25); color:#b91c1c; }
  .adm-banner-success { background:rgba(34,197,94,.08); border:1px solid rgba(34,197,94,.25); color:#15803d; }

  .adm-overlay { position:fixed; inset:0; background:rgba(4,52,99,.55); z-index:90; opacity:0; transition:opacity .25s; pointer-events:none; }
  .adm-overlay.open { opacity:1; pointer-events:auto; }
  .adm-drawer { position:fixed; top:0; right:0; height:100vh; width:min(620px,100vw); background:#ffffff; z-index:91;
    box-shadow:-20px 0 50px rgba(4,52,99,.25); transform:translateX(100%); transition:transform .3s ease; display:flex; flex-direction:column; }
  .adm-drawer.open { transform:translateX(0); }
  .adm-drawer-head { display:flex; align-items:center; justify-content:space-between; padding:1.5rem clamp(1.5rem,3vw,2.5rem); border-bottom:1px solid rgba(4,52,99,.1); flex-shrink:0; }
  .adm-drawer-body { flex:1; overflow-y:auto; padding:clamp(1.5rem,3vw,2.5rem); display:flex; flex-direction:column; gap:1.5rem; }
  .adm-drawer-foot { display:flex; justify-content:flex-end; gap:.75rem; padding:1.25rem clamp(1.5rem,3vw,2.5rem); border-top:1px solid rgba(4,52,99,.1); flex-shrink:0; background:#fff; }
  .adm-close-btn { background:none; border:none; color:#043463; font-size:1.1rem; cursor:pointer; padding:.5rem; line-height:1; }
  .adm-close-btn:hover { color:#ee4c05; }

  .adm-attachment { display:flex; align-items:center; gap:.75rem; padding:.65rem .9rem; background:#f7f9fb; border:1px solid rgba(4,52,99,.1); border-radius:2px; }
  .adm-attachment-title { flex:1; font-size:.8rem; color:#043463; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .adm-attachment-row { display:flex; gap:.6rem; }
  .adm-image-preview { max-width:100%; max-height:140px; border-radius:2px; border:1px solid rgba(4,52,99,.15); object-fit:cover; }

  .adm-confirm-card { background:#ffffff; border-radius:2px; padding:clamp(1.75rem,4vw,2.25rem); max-width:420px; width:100%; box-shadow:0 30px 60px rgba(4,52,99,.3); }

  .adm-toast-wrap { position:fixed; bottom:1.5rem; right:1.5rem; z-index:99; display:flex; flex-direction:column; gap:.5rem; max-width:min(380px,90vw); }
  .adm-toast { display:flex; align-items:center; gap:.65rem; padding:.875rem 1.1rem; border-radius:2px; font-size:.8rem; font-weight:600; box-shadow:0 12px 30px rgba(4,52,99,.18); animation:adm-toast-in .25s ease; cursor:pointer; }
  @keyframes adm-toast-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
  .adm-toast-success { background:#22c55e; color:#fff; }
  .adm-toast-error   { background:#ef4444; color:#fff; }
`;

/* ─────────────────────────────────────────────
   4. SMALL PRIMITIVES
   ───────────────────────────────────────────── */

const AdminStatusBadge = ({ status }) => {
  const cfg = ADMIN_STATUS_CONFIG[status] ?? ADMIN_STATUS_CONFIG.closed;
  return (
    <span className="opp-badge opp-badge-status" style={{ "--bs-color": cfg.color, "--bs-bg": cfg.bg, "--bs-border": cfg.border }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const ToastStack = ({ toasts, onDismiss }) => (
  <div className="adm-toast-wrap" role="status" aria-live="polite">
    {toasts.map(t => (
      <div key={t.id} className={`adm-toast adm-toast-${t.type}`} onClick={() => onDismiss(t.id)}>
        {t.type === "success" ? <FaCheckCircle aria-hidden="true" /> : <FaExclamationTriangle aria-hidden="true" />}
        <span>{t.message}</span>
      </div>
    ))}
  </div>
);

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((type, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts(t => [...t, { id, type, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 5000);
  }, []);
  const dismiss = id => setToasts(t => t.filter(x => x.id !== id));
  return { toasts, push, dismiss };
}

function describeError(err, fallback) {
  if (!err?.response) return "Network error — please check your connection and that the API is reachable.";
  const { status, data } = err.response;
  if (status === 401) return "Your session is no longer valid. Please log in again.";
  if (status === 403) return "You don't have permission to do that.";
  if (data && typeof data === "object") {
    const parts = Object.entries(data).map(([key, val]) => {
      const msg = Array.isArray(val) ? val.join(" ") : String(val);
      return key === "non_field_errors" || key === "detail" ? msg : `${key}: ${msg}`;
    });
    if (parts.length) return parts.join(" — ");
  }
  return fallback || "Something went wrong. Please try again.";
}

function fieldErrorsFrom(err) {
  const data = err?.response?.data;
  if (!data || typeof data !== "object") return {};
  const out = {};
  for (const [key, val] of Object.entries(data)) {
    if (key === "non_field_errors" || key === "detail") continue;
    out[key] = Array.isArray(val) ? val.join(" ") : String(val);
  }
  return out;
}

/* ─────────────────────────────────────────────
   5. FOOTER
   ───────────────────────────────────────────── */

const AdminFooter = () => (
  <footer style={{ background: "#043463", padding: "2rem var(--cp)", textAlign: "center", borderTop: "1px solid rgba(255,255,255,.1)" }}>
    <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: ".72rem", color: "rgba(255,255,255,.7)" }}>
      © {new Date().getFullYear()} Imarika Foundation · Kenya
    </p>
  </footer>
);

/* ─────────────────────────────────────────────
   6. CONFIRM-DELETE MODAL
   ───────────────────────────────────────────── */

const ConfirmDeleteModal = ({ record, busy, onConfirm, onCancel }) => {
  if (!record) return null;
  return (
    <div className="adm-overlay open" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }} onClick={onCancel}>
      <div className="adm-confirm-card" onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.4rem", letterSpacing: ".03em", color: "#043463", marginBottom: ".75rem" }}>
          Delete this opportunity?
        </h3>
        <p style={{ color: "#4a5568", fontSize: ".875rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          <strong style={{ color: "#043463" }}>{record.title}</strong> ({record.reference_number}) will be permanently
          removed, along with any attachments. This can't be undone.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: ".75rem" }}>
          <button type="button" className="opp-btn opp-btn-secondary" onClick={onCancel} disabled={busy}>Cancel</button>
          <button type="button" className="opp-btn opp-btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? <FaSpinner className="adm-spin" aria-hidden="true" /> : <FaTrash aria-hidden="true" />}
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   7. CREATE / EDIT DRAWER
   ───────────────────────────────────────────── */

const emptyForm = {
  title: "", opportunity_type: "tender", status: "draft",
  summary: "", description: "", location: "",
  deadline: "", publish_date: "", closing_date: "", is_featured: false,
};

const OpportunityFormDrawer = ({ open, mode, record, onClose, onSaved, pushToast }) => {
  const isEdit = mode === "edit";
  const [form, setForm]                 = useState(emptyForm);
  const [fieldErrors, setFieldErrors]   = useState({});
  const [topError, setTopError]         = useState("");
  const [saving, setSaving]             = useState(false);
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [attachments, setAttachments]   = useState([]);
  const [newAttTitle, setNewAttTitle]   = useState("");
  const [newAttFile, setNewAttFile]     = useState(null);
  const [attBusy, setAttBusy]           = useState(false);
  const fileInputRef    = useRef(null);
  const attFileInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setFieldErrors({});
    setTopError("");
    setImageFile(null);
    setImagePreview(record?.featured_image_url ?? null);
    setAttachments(record?.attachments ?? []);
    setNewAttTitle("");
    setNewAttFile(null);
    setForm(record ? {
      title:            record.title            ?? "",
      opportunity_type: record.opportunity_type ?? "tender",
      status:           record.status           ?? "draft",
      summary:          record.summary          ?? "",
      description:      record.description      ?? "",
      location:         record.location         ?? "",
      deadline:         record.deadline         ?? "",
      publish_date:     record.publish_date     ?? "",
      closing_date:     record.closing_date     ?? "",
      is_featured:      !!record.is_featured,
    } : emptyForm);
  }, [open, record]);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleImageChange = e => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSaving(true);
    setTopError("");
    setFieldErrors({});

    let payload, extraHeaders;
    if (imageFile) {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("opportunity_type", form.opportunity_type);
      fd.append("status", form.status);
      fd.append("summary", form.summary || "");
      fd.append("description", form.description || "");
      fd.append("location", form.location || "");
      fd.append("is_featured", form.is_featured ? "1" : "0");
      if (form.deadline)     fd.append("deadline", form.deadline);
      if (form.publish_date) fd.append("publish_date", form.publish_date);
      if (form.closing_date) fd.append("closing_date", form.closing_date);
      fd.append("featured_image", imageFile);
      payload = fd;
      extraHeaders = { "Content-Type": "multipart/form-data" };
    } else {
      payload = {
        title:            form.title,
        opportunity_type: form.opportunity_type,
        status:           form.status,
        summary:          form.summary    || "",
        description:      form.description || "",
        location:         form.location   || "",
        is_featured:      !!form.is_featured,
        deadline:         form.deadline     || null,
        publish_date:     form.publish_date || null,
        closing_date:     form.closing_date || null,
      };
      extraHeaders = { "Content-Type": "application/json" };
    }

    const cfg = { headers: { ...getAuthHeaders().headers, ...extraHeaders } };
    const req = isEdit
      ? axios.patch(`${API_BASE}${record.id}/`, payload, cfg)
      : axios.post(API_BASE, payload, cfg);

    req
      .then(r => {
        setSaving(false);
        pushToast("success", isEdit ? "Opportunity updated." : "Opportunity created.");
        onSaved(r.data);
      })
      .catch(err => {
        setSaving(false);
        setFieldErrors(fieldErrorsFrom(err));
        setTopError(describeError(err, "Couldn't save this opportunity."));
      });
  };

  const handleAddAttachment = () => {
    if (!newAttTitle.trim() || !newAttFile || !record?.id) return;
    setAttBusy(true);
    const fd = new FormData();
    fd.append("title", newAttTitle.trim());
    fd.append("file", newAttFile);
    axios
      .post(`${API_BASE}${record.id}/attachments/`, fd, {
        headers: { ...getAuthHeaders().headers, "Content-Type": "multipart/form-data" },
      })
      .then(r => {
        setAttachments(a => [...a, r.data]);
        setNewAttTitle("");
        setNewAttFile(null);
        if (attFileInputRef.current) attFileInputRef.current.value = "";
        setAttBusy(false);
        pushToast("success", "Attachment added.");
      })
      .catch(err => {
        setAttBusy(false);
        pushToast("error", describeError(err, "Couldn't add that attachment."));
      });
  };

  const handleDeleteAttachment = att => {
    if (!record?.id) return;
    setAttBusy(true);
    axios
      .delete(`${API_BASE}${record.id}/attachments/${att.id}/`, getAuthHeaders())
      .then(() => {
        setAttachments(a => a.filter(x => x.id !== att.id));
        setAttBusy(false);
        pushToast("success", "Attachment removed.");
      })
      .catch(err => {
        setAttBusy(false);
        pushToast("error", describeError(err, "Couldn't remove that attachment."));
      });
  };

  return (
    <>
      <div className={`adm-overlay ${open ? "open" : ""}`} onClick={onClose} aria-hidden={!open} />
      <div className={`adm-drawer ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-label={isEdit ? "Edit opportunity" : "Add opportunity"}>
        <div className="adm-drawer-head">
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.3rem", letterSpacing: ".03em", color: "#043463" }}>
            {isEdit ? "Edit Opportunity" : "Add Opportunity"}
          </h2>
          <button type="button" className="adm-close-btn" onClick={onClose} aria-label="Close">
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <form id="adm-opp-form" onSubmit={handleSubmit} style={{ display: "contents" }}>
          <div className="adm-drawer-body">
            {topError && (
              <div className="adm-banner adm-banner-error">
                <FaExclamationTriangle style={{ marginTop: ".1rem", flexShrink: 0 }} aria-hidden="true" />
                <span>{topError}</span>
              </div>
            )}

            {isEdit && (
              <div className="adm-row-meta" style={{ fontSize: ".75rem", color: "#a0aec0" }}>
                <span><FaHashtag style={{ marginRight: 4 }} aria-hidden="true" />{record.reference_number}</span>
                <span>/{record.slug}</span>
              </div>
            )}

            <div className="adm-field">
              <label className="adm-label" htmlFor="f-title">Title *</label>
              <input id="f-title" className="adm-input" value={form.title} onChange={e => set("title", e.target.value)} required maxLength={255} />
              {fieldErrors.title && <span className="adm-error-text"><FaExclamationTriangle aria-hidden="true" />{fieldErrors.title}</span>}
            </div>

            <div className="adm-form-grid adm-form-grid-2">
              <div className="adm-field">
                <label className="adm-label" htmlFor="f-type">Type *</label>
                <select id="f-type" className="adm-select" value={form.opportunity_type} onChange={e => set("opportunity_type", e.target.value)}>
                  {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="f-status">Status *</label>
                <select id="f-status" className="adm-select" value={form.status} onChange={e => set("status", e.target.value)}>
                  {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div className="adm-field">
              <label className="adm-label" htmlFor="f-location">Location</label>
              <input id="f-location" className="adm-input" value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Kilifi County, or Remote" />
              {fieldErrors.location && <span className="adm-error-text"><FaExclamationTriangle aria-hidden="true" />{fieldErrors.location}</span>}
            </div>

            <div className="adm-form-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div className="adm-field">
                <label className="adm-label" htmlFor="f-deadline">Deadline</label>
                <input id="f-deadline" type="date" className="adm-input" value={form.deadline ?? ""} onChange={e => set("deadline", e.target.value)} />
                {fieldErrors.deadline && <span className="adm-error-text"><FaExclamationTriangle aria-hidden="true" />{fieldErrors.deadline}</span>}
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="f-publish">Publish Date</label>
                <input id="f-publish" type="date" className="adm-input" value={form.publish_date ?? ""} onChange={e => set("publish_date", e.target.value)} />
              </div>
              <div className="adm-field">
                <label className="adm-label" htmlFor="f-closing">Closing Date</label>
                <input id="f-closing" type="date" className="adm-input" value={form.closing_date ?? ""} onChange={e => set("closing_date", e.target.value)} />
              </div>
            </div>

            <div className="adm-field">
              <label className="adm-label" htmlFor="f-summary">
                Summary <span style={{ opacity: .6, fontWeight: 400, letterSpacing: 0, textTransform: "none" }}>— short teaser shown on listing cards</span>
              </label>
              <textarea id="f-summary" className="adm-textarea" value={form.summary} onChange={e => set("summary", e.target.value)} maxLength={500} rows={3} />
              <span className="adm-hint">{form.summary.length}/500</span>
              {fieldErrors.summary && <span className="adm-error-text"><FaExclamationTriangle aria-hidden="true" />{fieldErrors.summary}</span>}
            </div>

            <div className="adm-field">
              <label className="adm-label" htmlFor="f-description">Full Description</label>
              <textarea id="f-description" className="adm-textarea" value={form.description} onChange={e => set("description", e.target.value)} rows={6} />
            </div>

            <label className="adm-checkbox-row">
              <input type="checkbox" checked={form.is_featured} onChange={e => set("is_featured", e.target.checked)} />
              <span style={{ fontSize: ".82rem", color: "#043463" }}>Feature this opportunity (pins it to the top of the listing)</span>
            </label>

            <div className="adm-field">
              <span className="adm-label">Featured Image</span>
              {imagePreview && <img src={imagePreview} alt="" className="adm-image-preview" />}
              <button type="button" className="opp-btn opp-btn-secondary" onClick={() => fileInputRef.current?.click()} style={{ alignSelf: "flex-start" }}>
                <FaUpload aria-hidden="true" /> {imagePreview ? "Replace Image" : "Upload Image"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImageChange} style={{ display: "none" }} />
              {fieldErrors.featured_image && <span className="adm-error-text"><FaExclamationTriangle aria-hidden="true" />{fieldErrors.featured_image}</span>}
            </div>

            <div className="adm-field">
              <span className="adm-label">Attachments</span>
              {!isEdit && <span className="adm-hint">Save the opportunity first — then you can attach documents here.</span>}
              {isEdit && (
                <>
                  {attachments.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginBottom: ".5rem" }}>
                      {attachments.map(att => (
                        <div key={att.id} className="adm-attachment">
                          <FaPaperclip style={{ color: "#ee4c05", flexShrink: 0 }} aria-hidden="true" />
                          <span className="adm-attachment-title">{att.title}</span>
                          <div className="adm-attachment-row">
                            {att.file_url && (
                              <a href={att.file_url} target="_blank" rel="noopener noreferrer" className="adm-icon-btn adm-icon-btn-edit" aria-label={`Download ${att.title}`} title="Download">
                                <FaDownload aria-hidden="true" />
                              </a>
                            )}
                            <button type="button" className="adm-icon-btn adm-icon-btn-delete" disabled={attBusy} onClick={() => handleDeleteAttachment(att)} aria-label={`Remove ${att.title}`} title="Remove">
                              <FaTrash aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                    <input className="adm-input" style={{ flex: "1 1 160px" }} placeholder="Attachment title" value={newAttTitle} onChange={e => setNewAttTitle(e.target.value)} />
                    <input ref={attFileInputRef} type="file" className="adm-input" style={{ flex: "1 1 160px" }} accept=".pdf,.doc,.docx,.xls,.xlsx,.pptx,.zip" onChange={e => setNewAttFile(e.target.files?.[0] ?? null)} />
                    <button type="button" className="opp-btn opp-btn-secondary" disabled={attBusy || !newAttTitle.trim() || !newAttFile} onClick={handleAddAttachment}>
                      {attBusy ? <FaSpinner className="adm-spin" aria-hidden="true" /> : <FaPlus aria-hidden="true" />} Add
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="adm-drawer-foot">
            <button type="button" className="opp-btn opp-btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="opp-btn opp-btn-primary" disabled={saving || !form.title.trim()}>
              {saving ? <FaSpinner className="adm-spin" aria-hidden="true" /> : <FaSave aria-hidden="true" />}
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Opportunity"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   8. ADMIN ROW
   ───────────────────────────────────────────── */

const AdminRow = ({ record, onEdit, onDelete, editBusy }) => {
  const statusCfg = ADMIN_STATUS_CONFIG[record.status] ?? ADMIN_STATUS_CONFIG.closed;
  return (
    <article className="opp-card adm-row" style={{ "--card-bar": statusCfg.bar }}>
      <div className="adm-row-main">
        <div className="opp-card-badges">
          <AdminStatusBadge status={record.status} />
          <TypeBadge type={record.opportunity_type} />
          {record.is_featured && (
            <span className="adm-pill" style={{ background: "rgba(238,76,5,.1)", color: "#ee4c05" }}>
              <FaStar aria-hidden="true" /> Featured
            </span>
          )}
        </div>
        <h3 className="opp-card-title" style={{ fontSize: "1.15rem" }}>{record.title}</h3>
        <div className="adm-row-meta">
          <span className="adm-row-meta-item"><FaHashtag aria-hidden="true" />{record.reference_number}</span>
          {record.location       && <span className="adm-row-meta-item"><FaMapMarkerAlt aria-hidden="true" />{record.location}</span>}
          {record.deadline       && <span className="adm-row-meta-item"><FaCalendarAlt  aria-hidden="true" />{fmtDate(record.deadline)}</span>}
          {record.attachment_count > 0 && (
            <span className="adm-row-meta-item"><FaPaperclip aria-hidden="true" />{record.attachment_count} attachment{record.attachment_count === 1 ? "" : "s"}</span>
          )}
        </div>
      </div>
      <div className="adm-row-actions">
        <button type="button" className="adm-icon-btn adm-icon-btn-edit" onClick={() => onEdit(record)} disabled={editBusy} aria-label={`Edit ${record.title}`} title="Edit">
          {editBusy ? <FaSpinner className="adm-spin" aria-hidden="true" /> : <FaPen aria-hidden="true" />}
        </button>
        <button type="button" className="adm-icon-btn adm-icon-btn-delete" onClick={() => onDelete(record)} aria-label={`Delete ${record.title}`} title="Delete">
          <FaTrash aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};

/* ─────────────────────────────────────────────
   9. MAIN PAGE
   ───────────────────────────────────────────── */

export default function OpportunitiesAdminPage() {
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  const [records, setRecords]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [loadError, setLoadError]       = useState(false);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter]     = useState("all");
  const [drawer, setDrawer]             = useState({ open: false, mode: "create", record: null });
  const [editLoadingId, setEditLoadingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const fetchAll = useCallback(() => {
    setLoading(true);
    setLoadError(false);
    let cancelled = false;

    const loadPage = (url, acc = []) =>
      axios.get(url, getAuthHeaders()).then(r => {
        const data   = r.data;
        const page   = Array.isArray(data) ? data : (data.results ?? []);
        const merged = acc.concat(page);
        const next   = Array.isArray(data) ? null : data.next;
        return next ? loadPage(next, merged) : merged;
      });

    loadPage(API_BASE)
      .then(all => { if (!cancelled) { setRecords(all); setLoading(false); } })
      .catch(() => { if (!cancelled) { setLoadError(true); setLoading(false); } });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => fetchAll(), [fetchAll]);

  const filtered = records.filter(r => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (typeFilter   !== "all" && r.opportunity_type !== typeFilter) return false;
    if (search) {
      const q   = search.toLowerCase();
      const hay = `${r.title} ${r.reference_number} ${r.location ?? ""} ${r.summary ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const openCreate = () => setDrawer({ open: true, mode: "create", record: null });

  const openEdit = record => {
    setEditLoadingId(record.id);
    axios.get(`${API_BASE}${record.id}/`, getAuthHeaders())
      .then(r => { setEditLoadingId(null); setDrawer({ open: true, mode: "edit", record: r.data }); })
      .catch(err => { setEditLoadingId(null); pushToast("error", describeError(err, "Couldn't load this opportunity.")); });
  };

  const closeDrawer = () => setDrawer(d => ({ ...d, open: false }));

  const handleSaved = saved => {
    setRecords(rs => {
      const exists = rs.some(r => r.id === saved.id);
      return exists ? rs.map(r => r.id === saved.id ? { ...r, ...saved } : r) : [saved, ...rs];
    });
    closeDrawer();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    axios.delete(`${API_BASE}${deleteTarget.id}/`, getAuthHeaders())
      .then(() => {
        setRecords(rs => rs.filter(r => r.id !== deleteTarget.id));
        setDeleting(false);
        setDeleteTarget(null);
        pushToast("success", "Opportunity deleted.");
      })
      .catch(err => { setDeleting(false); pushToast("error", describeError(err, "Couldn't delete this opportunity.")); });
  };

  const statusTabs = [
    { key: "all", label: `All (${records.length})` },
    ...STATUS_OPTIONS.map(o => ({ key: o.value, label: `${o.label} (${records.filter(r => r.status === o.value).length})` })),
  ];
  const typeTabs = [
    { key: "all", label: "All Types" },
    ...TYPE_OPTIONS.map(o => ({ key: o.value, label: o.label })),
  ];

  return (
    <div className="cf-root">
      <style>{PAGE_CSS}</style>
      <style>{ADMIN_CSS}</style>
      <Helmet><title>Manage Opportunities · Admin · Imarika Foundation</title></Helmet>

      {/* ── Header ── */}
      <section className="adm-header">
        <div className="adm-header-ghost" aria-hidden="true">OPPS</div>
        <div className="adm-header-slash" style={{ height: "clamp(60px,10vh,100px)", right: "clamp(1.5rem,8vw,6rem)", top: "50%" }} aria-hidden="true" />
        <div className="adm-header-slash" style={{ height: "clamp(40px,6vh,65px)", right: "clamp(3rem,11vw,9.5rem)", top: "52%", opacity: .3 }} aria-hidden="true" />
        <div className="adm-header-row">
          <div className="adm-header-left">
            <img src="/images/imarikalogo.jpeg" alt="Imarika Foundation" className="adm-logo" />
            <div>
              <span className="cf-label" style={{ color: "#46c5e4", display: "block", marginBottom: ".2rem" }}>Admin Dashboard</span>
              <h1 className="cf-h1" style={{ color: "#fff", fontSize: "clamp(1.5rem,3.5vw,2.25rem)", lineHeight: 1 }}>
                MANAGE <span style={{ color: "#ee4c05" }}>OPPORTUNITIES.</span>
              </h1>
            </div>
          </div>
          <Link to="/admin" className="adm-hbtn adm-hbtn-outline">
            <FaHome aria-hidden="true" /> Dashboard
          </Link>
        </div>
      </section>

      {/* ── Main content ── */}
      <section style={{ background: "#ffffff", padding: "var(--cv) var(--cp)" }}>
        <div style={{ maxWidth: "var(--cw)", margin: "0 auto" }}>

          <div className="adm-toolbar">
            <div className="adm-toolbar-filters">
              <div className="opp-search" role="search" aria-label="Search opportunities" style={{ minWidth: 240 }}>
                <FaSearch className="opp-search-icon" aria-hidden="true" />
                <input type="search" className="opp-search-input" placeholder="Search by title, reference, or location…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="opp-filter-group">
                <span className="opp-filter-label">Status</span>
                <div className="opp-tabs" role="tablist" aria-label="Filter by status">
                  {statusTabs.map(t => (
                    <button key={t.key} role="tab" aria-selected={statusFilter === t.key}
                      className={`opp-tab ${statusFilter === t.key ? "active" : ""}`} onClick={() => setStatusFilter(t.key)}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="opp-filter-group">
                <span className="opp-filter-label">Type</span>
                <div className="opp-tabs" role="tablist" aria-label="Filter by type">
                  {typeTabs.map(t => (
                    <button key={t.key} role="tab" aria-selected={typeFilter === t.key}
                      className={`opp-tab ${typeFilter === t.key ? "active" : ""}`} onClick={() => setTypeFilter(t.key)}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button type="button" className="opp-btn opp-btn-primary" onClick={openCreate}>
              <FaPlus aria-hidden="true" /> New Opportunity
            </button>
          </div>

          {loading ? (
            <div className="adm-list" aria-busy="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="opp-card" aria-hidden="true">
                  {[30, 70, 50].map((w, j) => <div key={j} className="opp-skel" style={{ height: j === 0 ? 16 : 13, width: `${w}%` }} />)}
                </div>
              ))}
            </div>
          ) : loadError ? (
            <div className="opp-empty">
              <FaExclamationTriangle className="opp-empty-icon" aria-hidden="true" />
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.5rem", color: "#043463", marginBottom: ".5rem" }}>Couldn't Load Opportunities</h3>
              <p style={{ color: "#4a5568", fontSize: ".875rem" }}>Please check your connection and try again.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="opp-empty">
              <FaFileAlt className="opp-empty-icon" aria-hidden="true" />
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.5rem", color: "#043463", marginBottom: ".5rem" }}>No Opportunities Found</h3>
              <p style={{ color: "#4a5568", fontSize: ".875rem" }}>Try adjusting your filters, or add a new opportunity.</p>
            </div>
          ) : (
            <div className="adm-list" role="list" aria-label="Opportunities">
              {filtered.map((r, i) => (
                <Reveal key={r.id} delay={Math.min(i * 40, 300)}>
                  <AdminRow record={r} onEdit={openEdit} onDelete={setDeleteTarget} editBusy={editLoadingId === r.id} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <AdminFooter />

      <OpportunityFormDrawer
        open={drawer.open}
        mode={drawer.mode}
        record={drawer.record}
        onClose={closeDrawer}
        onSaved={handleSaved}
        pushToast={pushToast}
      />

      <ConfirmDeleteModal
        record={deleteTarget}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}