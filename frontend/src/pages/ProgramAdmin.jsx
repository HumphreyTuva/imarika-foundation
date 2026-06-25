import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaArrowLeft, FaGlobe, FaCheckCircle } from "react-icons/fa";
import { Helmet } from "react-helmet";

const ADMIN_CSS = `
  .admin-root { background: #f8fafc; min-height: 100vh; padding-bottom: 4rem; position: relative; }
  .admin-header { background: #043463; color: white; padding: 2rem var(--cp, 2rem); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
  .admin-container { max-width: 1400px; margin: 2rem auto; padding: 0 var(--cp, 1rem); display: flex; gap: 2rem; align-items: flex-start; }
  
  .admin-card { background: white; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; flex: 1; overflow: hidden; width: 100%; transition: all 0.3s ease; }
  
  /* Desktop Table */
  .admin-table { width: 100%; border-collapse: collapse; text-align: left; font-size: .875rem; }
  .admin-table th { background: #f1f5f9; padding: 1rem; color: #475569; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; }
  .admin-table td { padding: 1rem; border-bottom: 1px solid #e2e8f0; color: #1e293b; vertical-align: middle; }
  .admin-table tr:hover { background: #f8fafc; }
  
  /* Buttons */
  .admin-btn { padding: .5rem 1rem; border-radius: 4px; border: none; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: .5rem; font-size: .75rem; text-transform: uppercase; transition: opacity .2s; text-decoration: none; }
  .admin-btn:hover { opacity: .8; }
  .btn-primary { background: #ee4c05; color: white; }
  .btn-secondary { background: #e2e8f0; color: #475569; }
  .btn-danger { background: #ef4444; color: white; }
  .btn-edit { background: #0e7fbb; color: white; }
  .header-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

  /* Form Panel */
  .admin-form-panel { background: white; width: 600px; max-width: 100%; border-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border: 1px solid #e2e8f0; padding: 2rem; flex-shrink: 0; max-height: calc(100vh - 6rem); overflow-y: auto; position: relative; }
  .form-section-title { font-size: .9rem; font-weight: 800; color: #0e7fbb; text-transform: uppercase; margin: 2rem 0 1rem; border-bottom: 2px solid #f1f5f9; padding-bottom: .5rem; }
  .form-group { margin-bottom: 1.25rem; }
  .form-group label { display: block; font-size: .75rem; font-weight: 700; color: #475569; margin-bottom: .35rem; text-transform: uppercase; }
  .form-group .help-text { display: block; font-size: .65rem; color: #94a3b8; margin-bottom: .35rem; }
  .form-control { width: 100%; padding: .75rem; border: 1px solid #cbd5e1; border-radius: 4px; font-family: inherit; font-size: .875rem; box-sizing: border-box; resize: vertical; } 
  .form-control:focus { outline: none; border-color: #0e7fbb; box-shadow: 0 0 0 3px rgba(14,127,187,0.1); }

  /* Dynamic Arrays */
  .dynamic-list-item { background: #f8fafc; border: 1px dashed #cbd5e1; padding: 1.25rem; border-radius: 4px; margin-bottom: 1rem; position: relative; }
  .btn-remove-item { position: absolute; top: .5rem; right: .5rem; background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 1.25rem; padding: .25rem; }
  .btn-remove-item:hover { background: #fee2e2; border-radius: 4px; }
  .btn-add-item { width: 100%; padding: .875rem; background: #f1f5f9; border: 1px dashed #0e7fbb; color: #0e7fbb; font-weight: 700; cursor: pointer; border-radius: 4px; text-transform: uppercase; font-size: .75rem; }
  .btn-add-item:hover { background: #e0f2fe; }
  .form-actions { margin-top: 2.5rem; display: flex; gap: 1rem; }

  /* Toast Notifications */
  .toast-notification { position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem; border-radius: 4px; color: white; font-weight: 600; box-shadow: 0 10px 15px rgba(0,0,0,0.1); z-index: 9999; animation: slideIn 0.3s forwards, fadeOut 0.3s 2.7s forwards; display: flex; align-items: center; gap: .75rem; }
  .toast-success { background-color: #22c55e; border-left: 4px solid #166534; }
  .toast-error { background-color: #ef4444; border-left: 4px solid #991b1b; }
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes fadeOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }

  /* =========================================
     MOBILE RESPONSIVE STYLES
     ========================================= */
  @media (max-width: 1000px) { 
    .admin-container { flex-direction: column; } 
    .admin-form-panel { width: 100%; max-height: none; order: -1; }
    /* Hide table entirely when editing on mobile to give full focus to the form */
    .admin-card.hide-on-mobile-edit { display: none; }
  }

  @media (max-width: 768px) {
    /* Convert Table to Cards */
    .admin-table thead { display: none; }
    .admin-table, .admin-table tbody, .admin-table tr, .admin-table td { display: block; width: 100%; box-sizing: border-box; }
    .admin-table tr { margin-bottom: 1rem; border: 1px solid #cbd5e1; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); background: white; }
    .admin-table td { padding: 0.75rem 1rem; text-align: right; position: relative; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
    .admin-table td::before { content: attr(data-label); font-weight: 700; color: #64748b; text-transform: uppercase; font-size: 0.7rem; }
    .admin-table td:last-child { border-bottom: none; background: #f8fafc; justify-content: flex-end; gap: 0.5rem; }
    
    /* Header Adjustments */
    .admin-header { flex-direction: column; align-items: flex-start; }
    .header-actions { width: 100%; }
    .header-actions .admin-btn { flex: 1; }

    /* Sticky Save Button on Mobile */
    .form-actions { position: sticky; bottom: 0; background: white; padding: 1rem; margin: 0 -2rem -2rem -2rem; border-top: 1px solid #e2e8f0; box-shadow: 0 -4px 10px rgba(0,0,0,0.05); z-index: 10; }
    
    /* Toast Mobile */
    .toast-notification { top: 10px; left: 10px; right: 10px; width: auto; justify-content: center; }
  }
`;

export default function AdminDashboard() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [feedback, setFeedback] = useState({ show: false, type: "", message: "" });
  
  const [formData, setFormData] = useState({
    id: null, pillar: "education", slug: "", title: "", desc: "", icon: "🎓", order: 0,
    overview: "", objectives_list: "", partners_list: "", story_quote: "", story_attr: "",
    activities: [], impacts: []
  });

  const API_URL = 'https://imarikafoundation.org/api/api/api/admin/programs/'; // Ensure port matches Django

  const showFeedback = (type, message) => {
    setFeedback({ show: true, type, message });
    setTimeout(() => {
      setFeedback({ show: false, type: "", message: "" });
    }, 3000);
  };

  const fetchPrograms = () => {
    setLoading(true);

    const fetchAllPages = async (url, accumulated = []) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch data");
      
      const data = await res.json();
      const items = data.results ? data.results : data;
      const all = [...accumulated, ...items];

      if (data.next) {
        return fetchAllPages(data.next, all);
      }
      return all;
    };

    fetchAllPages(API_URL)
      .then(all => {
        setPrograms(all);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        showFeedback("error", "Failed to load programmes.");
      });
  };

  useEffect(() => { fetchPrograms(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (e, index, field, arrayName) => {
    const newArray = [...formData[arrayName]];
    newArray[index][field] = e.target.value;
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const addArrayItem = (arrayName, defaultItem) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName], defaultItem] });
  };

  const removeArrayItem = (index, arrayName) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const handleEdit = (prog) => {
    setFormData({
      id: prog.id, pillar: prog.pillar || "education", slug: prog.slug || "",
      title: prog.title || "", desc: prog.desc || "", icon: prog.icon || "🎓", order: prog.order || 0,
      overview: prog.overview || "", objectives_list: prog.objectives_list || "",
      partners_list: prog.partners_list || "", story_quote: prog.story_quote || "", story_attr: prog.story_attr || "",
      activities: prog.activities || [], impacts: prog.impacts || [] 
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ 
      id: null, pillar: "education", slug: "", title: "", desc: "", icon: "🎓", order: 0,
      overview: "", objectives_list: "", partners_list: "", story_quote: "", story_attr: "",
      activities: [], impacts: []
    });
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `${API_URL}${formData.id}/` : API_URL;
    const actionText = formData.id ? "Updated" : "Added";

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    })
    .then(() => {
      fetchPrograms(); 
      resetForm();     
      showFeedback("success", `Programme successfully ${actionText}!`);
    })
    .catch(err => {
      showFeedback("error", "Error saving programme. Check console.");
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this programme? This cannot be undone.")) return;
    
    fetch(`${API_URL}${id}/`, { method: 'DELETE' })
      .then(res => {
        if(!res.ok) throw new Error("Failed to delete");
        fetchPrograms();
        showFeedback("success", "Programme deleted successfully!");
      })
      .catch(() => showFeedback("error", "Error deleting programme."));
  };

  return (
    <div className="admin-root">
      <style>{ADMIN_CSS}</style>
      <Helmet><title>Programme Admin · Imarika</title></Helmet>

      {/* TOAST FEEDBACK UI */}
      {feedback.show && (
        <div className={`toast-notification ${feedback.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {feedback.type === 'success' ? <FaCheckCircle /> : <FaTimes />}
          {feedback.message}
        </div>
      )}

      <header className="admin-header">
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 2.5rem)", margin: 0 }}>
          SYSTEM <span style={{ color: "#ee4c05" }}>ADMINISTRATION</span>
        </h1>
        <div className="header-actions">
          <Link to="/admin" className="admin-btn btn-secondary"><FaArrowLeft /> Main Admin</Link>
          <a href="/programs" target="_blank" rel="noopener noreferrer" className="admin-btn btn-secondary"><FaGlobe /> Website</a>
        </div>
      </header>

      <div className="admin-container">
        
        {/* Table View (Hides on mobile when editing so form takes full focus) */}
        <div className={`admin-card ${isEditing ? 'hide-on-mobile-edit' : ''}`}>
          <div style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#043463" }}>Manage Programmes</h2>
            {!isEditing && (
              <button className="admin-btn btn-primary" onClick={() => setIsEditing(true)}>
                <FaPlus /> New Programme
              </button>
            )}
          </div>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>Icon</th><th>Title</th><th>Pillar</th><th>Slug</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="5" style={{textAlign:"center", padding:"2rem"}}>Loading...</td></tr>
              : programs.length === 0 ? <tr><td colSpan="5" style={{textAlign:"center", padding:"2rem"}}>No programmes found.</td></tr>
              : programs.map(prog => (
                <tr key={prog.id}>
                  {/* data-label allows CSS to inject headers on mobile views */}
                  <td data-label="Icon" style={{ fontSize: "1.5rem" }}>{prog.icon}</td>
                  <td data-label="Title" style={{ fontWeight: 600 }}>{prog.title}</td>
                  <td data-label="Pillar" style={{ textTransform: "capitalize" }}>{prog.pillar.replace('-', ' ')}</td>
                  <td data-label="Slug" style={{ color: "#64748b" }}>{prog.slug}</td>
                  <td data-label="Actions" style={{ textAlign: "right", display: "flex", gap: ".5rem", justifyContent: "flex-end" }}>
                    <button className="admin-btn btn-edit" onClick={() => handleEdit(prog)}><FaEdit /> Edit</button>
                    <button className="admin-btn btn-danger" onClick={() => handleDelete(prog.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form View */}
        {isEditing && (
          <aside className="admin-form-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, color: "#043463", fontSize: "1.5rem" }}>
                {formData.id ? "Edit Programme" : "Add Programme"}
              </h3>
              <button type="button" className="admin-btn btn-secondary" style={{ padding: ".25rem .5rem" }} onClick={resetForm}><FaTimes /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-section-title">1. Basic Details</div>
              
              <div className="form-group">
                <label>Title *</label>
                <input required type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>URL Slug *</label>
                <input required type="text" name="slug" className="form-control" value={formData.slug} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Pillar *</label>
                <select name="pillar" className="form-control" value={formData.pillar} onChange={handleInputChange}>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="agribusiness">Agribusiness</option>
                  <option value="environment">Environment</option>
                  <option value="disaster-response">Disaster Response</option>
                </select>
              </div>
              <div className="form-group">
                <label>Short Description *</label>
                <textarea required name="desc" className="form-control" rows="3" value={formData.desc} onChange={handleInputChange}></textarea>
              </div>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <div className="form-group" style={{ flex: "1 1 100px" }}>
                  <label>Emoji Icon *</label>
                  <input required type="text" name="icon" className="form-control" value={formData.icon} onChange={handleInputChange} />
                </div>
                <div className="form-group" style={{ flex: "1 1 100px" }}>
                  <label>Order</label>
                  <input type="number" name="order" className="form-control" value={formData.order} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-section-title">2. Text Content</div>
              <div className="form-group">
                <label>Full Overview</label>
                <textarea name="overview" className="form-control" rows="6" value={formData.overview} onChange={handleInputChange}></textarea>
              </div>
              <div className="form-group">
                <label>Objectives (Press Enter to separate)</label>
                <textarea name="objectives_list" className="form-control" rows="5" value={formData.objectives_list} onChange={handleInputChange}></textarea>
              </div>
              <div className="form-group">
                <label>Partners (Press Enter to separate)</label>
                <textarea name="partners_list" className="form-control" rows="4" value={formData.partners_list} onChange={handleInputChange}></textarea>
              </div>

              {/* ----- IMPACT STRIP (DYNAMIC ARRAY) ----- */}
              <div className="form-section-title">3. Impact Stats</div>
              {formData.impacts.map((imp, index) => (
                <div key={index} className="dynamic-list-item">
                  <button type="button" className="btn-remove-item" onClick={() => removeArrayItem(index, 'impacts')}><FaTimes /></button>
                  <div style={{ display: "flex", gap: "1rem", marginBottom: ".75rem", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 100px" }}>
                      <label style={{ fontSize: ".65rem" }}>Number (e.g. 160+)</label>
                      <input type="text" className="form-control" value={imp.number} onChange={(e) => handleArrayChange(e, index, 'number', 'impacts')} />
                    </div>
                    <div style={{ flex: "2 1 150px" }}>
                      <label style={{ fontSize: ".65rem" }}>Label (e.g. Scholars)</label>
                      <input type="text" className="form-control" value={imp.label} onChange={(e) => handleArrayChange(e, index, 'label', 'impacts')} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: ".65rem" }}>Sub Label (Optional)</label>
                    <input type="text" className="form-control" value={imp.sub_label} onChange={(e) => handleArrayChange(e, index, 'sub_label', 'impacts')} />
                  </div>
                </div>
              ))}
              <button type="button" className="btn-add-item" onClick={() => addArrayItem('impacts', { number: "", label: "", sub_label: "" })}>
                + Add Impact Stat
              </button>

              {/* ----- ACTIVITIES (DYNAMIC ARRAY) ----- */}
              <div className="form-section-title">4. Key Activities</div>
              {formData.activities.map((act, index) => (
                <div key={index} className="dynamic-list-item">
                  <button type="button" className="btn-remove-item" onClick={() => removeArrayItem(index, 'activities')}><FaTimes /></button>
                  <div className="form-group" style={{ marginBottom: ".75rem" }}>
                    <label style={{ fontSize: ".65rem" }}>Activity Title</label>
                    <input type="text" className="form-control" value={act.title} onChange={(e) => handleArrayChange(e, index, 'title', 'activities')} />
                  </div>
                  <div>
                    <label style={{ fontSize: ".65rem" }}>Description</label>
                    <textarea className="form-control" rows="3" value={act.desc} onChange={(e) => handleArrayChange(e, index, 'desc', 'activities')}></textarea>
                  </div>
                </div>
              ))}
              <button type="button" className="btn-add-item" onClick={() => addArrayItem('activities', { title: "", desc: "" })}>
                + Add Activity
              </button>

              {/* Success Story */}
              <div className="form-section-title">5. Success Story</div>
              <div className="form-group">
                <label>Story Quote</label>
                <textarea name="story_quote" className="form-control" rows="4" value={formData.story_quote} onChange={handleInputChange}></textarea>
              </div>
              <div className="form-group">
                <label>Quote Attribution</label>
                <input type="text" name="story_attr" className="form-control" value={formData.story_attr} onChange={handleInputChange} />
              </div>

              {/* Submit - Now Sticky on Mobile */}
              <div className="form-actions">
                <button type="submit" className="admin-btn btn-primary" style={{ flex: 1, justifyContent: "center", padding: "1.25rem", fontSize: "1.1rem" }}>
                  <FaSave /> {formData.id ? "Update Programme" : "Save New Programme"}
                </button>
              </div>
            </form>
          </aside>
        )}

      </div>
    </div>
  );
}