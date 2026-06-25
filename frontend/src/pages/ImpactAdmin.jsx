import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaArrowLeft, FaGlobe, FaCheckCircle, FaFileUpload } from "react-icons/fa";
import { Helmet } from "react-helmet";

const ADMIN_CSS = `
  .admin-root { background: #f8fafc; min-height: 100vh; padding-bottom: 4rem; position: relative; }
  .admin-header { background: #043463; color: white; padding: 2rem var(--cp, 2rem); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
  .admin-container { max-width: 1400px; margin: 1rem auto; padding: 0 var(--cp, 1rem); display: flex; flex-direction: column; gap: 1.5rem; }
  
  /* Tabs */
  .admin-tabs { display: flex; gap: .5rem; overflow-x: auto; padding-bottom: .5rem; border-bottom: 2px solid #e2e8f0; margin-bottom: 1rem; scrollbar-width: none; }
  .admin-tabs::-webkit-scrollbar { display: none; }
  .tab-btn { padding: .75rem 1.5rem; background: transparent; border: none; font-weight: 700; font-family: 'Outfit', sans-serif; color: #64748b; cursor: pointer; border-radius: 4px 4px 0 0; text-transform: uppercase; letter-spacing: .05em; font-size: .85rem; white-space: nowrap; transition: all .2s; }
  .tab-btn:hover { background: #f1f5f9; color: #043463; }
  .tab-btn.active { background: #043463; color: white; }

  /* Content Area */
  .admin-content-row { display: flex; gap: 2rem; align-items: flex-start; width: 100%; }
  .admin-card { background: white; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; flex: 1; overflow: hidden; width: 100%; transition: all 0.3s ease; }
  
  /* Table */
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

  /* Form */
  .admin-form-panel { background: white; width: 500px; max-width: 100%; border-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border: 1px solid #e2e8f0; padding: 2rem; flex-shrink: 0; max-height: calc(100vh - 6rem); overflow-y: auto; position: relative; }
  .form-group { margin-bottom: 1.25rem; }
  .form-group label { display: block; font-size: .75rem; font-weight: 700; color: #475569; margin-bottom: .35rem; text-transform: uppercase; }
  .form-group .help-text { display: block; font-size: .65rem; color: #94a3b8; margin-bottom: .35rem; }
  .form-control { width: 100%; padding: .75rem; border: 1px solid #cbd5e1; border-radius: 4px; font-family: inherit; font-size: .875rem; box-sizing: border-box; resize: vertical; } 
  .form-control:focus { outline: none; border-color: #0e7fbb; box-shadow: 0 0 0 3px rgba(14,127,187,0.1); }
  .file-input { border: 1px dashed #cbd5e1; padding: 1rem; background: #f8fafc; text-align: center; cursor: pointer; }

  /* Toasts */
  .toast-notification { position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem; border-radius: 4px; color: white; font-weight: 600; box-shadow: 0 10px 15px rgba(0,0,0,0.1); z-index: 9999; animation: slideIn 0.3s forwards, fadeOut 0.3s 2.7s forwards; display: flex; align-items: center; gap: .75rem; }
  .toast-success { background-color: #22c55e; border-left: 4px solid #166534; }
  .toast-error { background-color: #ef4444; border-left: 4px solid #991b1b; }
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes fadeOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }

  /* Mobile */
  @media (max-width: 1000px) { 
    .admin-content-row { flex-direction: column; } 
    .admin-form-panel { width: 100%; max-height: none; order: -1; }
    .admin-card.hide-on-mobile-edit { display: none; }
  }
  @media (max-width: 768px) {
    .admin-table thead { display: none; }
    .admin-table, .admin-table tbody, .admin-table tr, .admin-table td { display: block; width: 100%; box-sizing: border-box; }
    .admin-table tr { margin-bottom: 1rem; border: 1px solid #cbd5e1; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .admin-table td { padding: 0.75rem 1rem; text-align: right; position: relative; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
    .admin-table td::before { content: attr(data-label); font-weight: 700; color: #64748b; text-transform: uppercase; font-size: 0.7rem; }
    .admin-header { flex-direction: column; align-items: flex-start; }
    .header-actions { width: 100%; } .header-actions .admin-btn { flex: 1; }
  }
`;

const TABS = {
  bigstats: { title: "Big Stats", endpoint: "bigstats/" },
  pillarstats: { title: "Pillar Stats", endpoint: "pillarstats/" },
  stories: { title: "Success Stories", endpoint: "stories/" },
  reports: { title: "Annual Reports", endpoint: "reports/" }
};

export default function ImpactAdmin() {
  const [activeTab, setActiveTab] = useState("bigstats");
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, type: "", message: "" });
  
  const [formData, setFormData] = useState({});

  const BASE_URL = 'https://imarikafoundation.org/api/api/api/admin/'; // Ensure port matches Django

  const showFeedback = (type, message) => {
    setFeedback({ show: true, type, message });
    setTimeout(() => setFeedback({ show: false, type: "", message: "" }), 3000);
  };

  const fetchData = () => {
    setLoading(true);
    const url = `${BASE_URL}${TABS[activeTab].endpoint}`;
    
    // Pagination handler
    const fetchAllPages = async (currentUrl, accumulated = []) => {
      const res = await fetch(currentUrl);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const items = data.results ? data.results : data;
      const all = [...accumulated, ...items];
      if (data.next) return fetchAllPages(data.next, all);
      return all;
    };

    fetchAllPages(url)
      .then(all => { setDataList(all); setLoading(false); })
      .catch(() => { setLoading(false); showFeedback("error", `Failed to load ${TABS[activeTab].title}`); });
  };

  useEffect(() => {
    fetchData();
    setIsEditing(false);
    setFormData({});
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Special handler for files (Images & PDFs)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleEdit = (item) => {
    setFormData({ ...item }); // Load existing data
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({});
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `${BASE_URL}${TABS[activeTab].endpoint}${formData.id}/` : `${BASE_URL}${TABS[activeTab].endpoint}`;
    
    // Because we have files, we MUST use FormData instead of JSON
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      // Don't append null files or the id in the body
      if (formData[key] !== null && formData[key] !== undefined && key !== 'id') {
        // If it's a file path string from Django (meaning the user didn't upload a new file), don't re-upload it
        if ((key === 'image' || key === 'file') && typeof formData[key] === 'string') {
          return; 
        }
        submitData.append(key, formData[key]);
      }
    });

    fetch(url, {
      method: method,
      body: submitData // Fetch automatically sets the multipart/form-data boundary
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    })
    .then(() => {
      fetchData(); 
      resetForm();     
      showFeedback("success", `Successfully saved!`);
    })
    .catch(() => showFeedback("error", "Error saving item. Check inputs."));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    fetch(`${BASE_URL}${TABS[activeTab].endpoint}${id}/`, { method: 'DELETE' })
      .then(res => {
        if(!res.ok) throw new Error("Failed to delete");
        fetchData();
        showFeedback("success", "Deleted successfully!");
      })
      .catch(() => showFeedback("error", "Error deleting."));
  };

  // --- TAB-SPECIFIC RENDERERS ---

  const renderTableHeaders = () => {
    switch (activeTab) {
      case "bigstats": return (<tr><th>Label</th><th>Number</th><th>Sub Label</th><th style={{textAlign:"right"}}>Actions</th></tr>);
      case "pillarstats": return (<tr><th>Pillar</th><th>Number</th><th>Unit</th><th style={{textAlign:"right"}}>Actions</th></tr>);
      case "stories": return (<tr><th>Image</th><th>Title</th><th>Category</th><th style={{textAlign:"right"}}>Actions</th></tr>);
      case "reports": return (<tr><th>Title</th><th>Meta Details</th><th>File</th><th style={{textAlign:"right"}}>Actions</th></tr>);
      default: return null;
    }
  };

  const renderTableRows = () => {
    if (loading) return <tr><td colSpan="4" style={{textAlign:"center", padding:"2rem"}}>Loading...</td></tr>;
    if (dataList.length === 0) return <tr><td colSpan="4" style={{textAlign:"center", padding:"2rem"}}>No data found.</td></tr>;

    return dataList.map(item => (
      <tr key={item.id}>
        {activeTab === "bigstats" && (
          <>
            <td data-label="Label"><strong>{item.label}</strong></td>
            <td data-label="Number" style={{color: item.color}}>{item.number}{item.suffix}</td>
            <td data-label="Sub Label">{item.sub_label}</td>
          </>
        )}
        {activeTab === "pillarstats" && (
          <>
            <td data-label="Pillar"><strong>{item.pillar}</strong></td>
            <td data-label="Number">{item.number}</td>
            <td data-label="Unit">{item.unit} ({item.year})</td>
          </>
        )}
        {activeTab === "stories" && (
          <>
            <td data-label="Image">
              {item.image ? <img src={item.image} alt="story" style={{width: 50, height: 50, objectFit: 'cover', borderRadius: 4}} /> : 'None'}
            </td>
            <td data-label="Title"><strong>{item.title}</strong></td>
            <td data-label="Category">{item.category}</td>
          </>
        )}
        {activeTab === "reports" && (
          <>
            <td data-label="Title"><strong>{item.title}</strong></td>
            <td data-label="Meta Details">{item.meta_text}</td>
            <td data-label="File">{item.file ? "Uploaded" : "None"}</td>
          </>
        )}
        <td data-label="Actions" style={{ textAlign: "right", display: "flex", gap: ".5rem", justifyContent: "flex-end" }}>
          <button className="admin-btn btn-edit" onClick={() => handleEdit(item)}><FaEdit /> Edit</button>
          <button className="admin-btn btn-danger" onClick={() => handleDelete(item.id)}><FaTrash /></button>
        </td>
      </tr>
    ));
  };

  const renderFormFields = () => {
    switch (activeTab) {
      case "bigstats":
        return (
          <>
            <div className="form-group"><label>Label</label><input required type="text" name="label" className="form-control" value={formData.label || ''} onChange={handleInputChange} /></div>
            <div style={{display:"flex", gap:"1rem"}}>
              <div className="form-group" style={{flex:1}}><label>Number</label><input required type="number" name="number" className="form-control" value={formData.number || ''} onChange={handleInputChange} /></div>
              <div className="form-group" style={{flex:1}}><label>Suffix (e.g. +)</label><input type="text" name="suffix" className="form-control" value={formData.suffix || ''} onChange={handleInputChange} /></div>
            </div>
            <div className="form-group"><label>Sub Label</label><input type="text" name="sub_label" className="form-control" value={formData.sub_label || ''} onChange={handleInputChange} /></div>
            <div className="form-group"><label>Hex Color</label><input type="text" name="color" className="form-control" value={formData.color || '#ee4c05'} onChange={handleInputChange} /></div>
            <div className="form-group"><label>Order</label><input type="number" name="order" className="form-control" value={formData.order || 0} onChange={handleInputChange} /></div>
          </>
        );
      case "pillarstats":
        return (
          <>
            <div className="form-group">
              <label>Pillar</label>
              <select required name="pillar" className="form-control" value={formData.pillar || 'Education'} onChange={handleInputChange}>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Agribusiness">Agribusiness</option>
                <option value="Environment">Environment</option>
                <option value="Disaster Response">Disaster Response</option>
              </select>
            </div>
            <div className="form-group"><label>Number (e.g. 10,000+)</label><input required type="text" name="number" className="form-control" value={formData.number || ''} onChange={handleInputChange} /></div>
            <div className="form-group"><label>Unit (e.g. Scholars)</label><input required type="text" name="unit" className="form-control" value={formData.unit || ''} onChange={handleInputChange} /></div>
            <div className="form-group"><label>Year</label><input required type="number" name="year" className="form-control" value={formData.year || new Date().getFullYear()} onChange={handleInputChange} /></div>
            <div className="form-group"><label>Order</label><input type="number" name="order" className="form-control" value={formData.order || 0} onChange={handleInputChange} /></div>
          </>
        );
      case "stories":
        return (
          <>
            <div className="form-group"><label>Category</label><input required type="text" name="category" className="form-control" value={formData.category || ''} onChange={handleInputChange} /></div>
            <div className="form-group"><label>Title</label><input required type="text" name="title" className="form-control" value={formData.title || ''} onChange={handleInputChange} /></div>
            <div className="form-group"><label>Body Text</label><textarea required name="body" className="form-control" rows="6" value={formData.body || ''} onChange={handleInputChange}></textarea></div>
            <div className="form-group">
              <label>Cover Image</label>
              <input type="file" name="image" accept="image/*" className="form-control file-input" onChange={handleFileChange} />
              {typeof formData.image === 'string' && <span className="help-text">Current file: {formData.image.split('/').pop()}</span>}
            </div>
            <div className="form-group"><label>Order</label><input type="number" name="order" className="form-control" value={formData.order || 0} onChange={handleInputChange} /></div>
          </>
        );
      case "reports":
        return (
          <>
            <div className="form-group"><label>Report Title</label><input required type="text" name="title" className="form-control" value={formData.title || ''} onChange={handleInputChange} /></div>
            <div className="form-group"><label>Meta Text (e.g. PDF · 32 Pages)</label><input required type="text" name="meta_text" className="form-control" value={formData.meta_text || ''} onChange={handleInputChange} /></div>
            <div className="form-group">
              <label>Upload PDF Document</label>
              <input type="file" name="file" accept=".pdf" className="form-control file-input" onChange={handleFileChange} />
              {typeof formData.file === 'string' && <span className="help-text">Current file: {formData.file.split('/').pop()}</span>}
            </div>
            <div className="form-group"><label>Order</label><input type="number" name="order" className="form-control" value={formData.order || 0} onChange={handleInputChange} /></div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="admin-root">
      <style>{ADMIN_CSS}</style>
      <Helmet><title>Impact Admin · Imarika</title></Helmet>

      {feedback.show && (
        <div className={`toast-notification ${feedback.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {feedback.type === 'success' ? <FaCheckCircle /> : <FaTimes />}
          {feedback.message}
        </div>
      )}

      <header className="admin-header">
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 2.5rem)", margin: 0 }}>
          IMPACT <span style={{ color: "#46c5e4" }}>ADMINISTRATION</span>
        </h1>
        <div className="header-actions">
          <Link to="/admin" className="admin-btn btn-secondary"><FaArrowLeft /> Main Admin</Link>
          <a href="/impact" target="_blank" rel="noopener noreferrer" className="admin-btn btn-secondary"><FaGlobe /> Website</a>
        </div>
      </header>

      <div className="admin-container">
        
        {/* Navigation Tabs */}
        <div className="admin-tabs">
          {Object.entries(TABS).map(([key, config]) => (
            <button 
              key={key} 
              className={`tab-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {config.title}
            </button>
          ))}
        </div>

        <div className="admin-content-row">
          
          {/* Table View */}
          <div className={`admin-card ${isEditing ? 'hide-on-mobile-edit' : ''}`}>
            <div style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#043463" }}>{TABS[activeTab].title}</h2>
              {!isEditing && (
                <button className="admin-btn btn-primary" onClick={() => setIsEditing(true)}>
                  <FaPlus /> Add New
                </button>
              )}
            </div>
            
            <div className="table-responsive">
              <table className="admin-table">
                <thead>{renderTableHeaders()}</thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>
          </div>

          {/* Form View */}
          {isEditing && (
            <aside className="admin-form-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0, color: "#043463", fontSize: "1.5rem" }}>
                  {formData.id ? "Edit Item" : "Add New Item"}
                </h3>
                <button type="button" className="admin-btn btn-secondary" style={{ padding: ".25rem .5rem" }} onClick={resetForm}><FaTimes /></button>
              </div>

              <form onSubmit={handleSave}>
                
                {/* Dynamically render fields based on active tab */}
                {renderFormFields()}

                <div style={{ marginTop: "2.5rem", display: "flex" }}>
                  <button type="submit" className="admin-btn btn-primary" style={{ flex: 1, padding: "1.25rem", fontSize: "1.1rem" }}>
                    <FaSave /> {formData.id ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </aside>
          )}

        </div>
      </div>
    </div>
  );
}