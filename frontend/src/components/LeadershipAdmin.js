import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API = "https://imarikafoundation.org/api/api/api/leadership";

const LeadershipAdmin = () => {
  // ================= STATE =================
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // NEW: Feedback state for success/error messages
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const [form, setForm] = useState({
    name: "",
    role: "",
    category: "board",
    bio: "",
    image: null,
  });

  const formRef = useRef(null);

  // ================= HELPER =================
  // NEW: Function to trigger feedback and auto-hide it after 3 seconds
  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 3000);
  };

  // ================= FETCH =================
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API}/`);
      setMembers(res.data.results || res.data);
    } catch (error) {
      console.error(error);
      showFeedback("error", "Failed to load members. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      role: "",
      category: "board",
      bio: "",
      image: null,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    });

    try {
      if (editingId) {
        await axios.patch(`${API}/${editingId}/`, formData);
        showFeedback("success", "Member updated successfully!");
      } else {
        await axios.post(`${API}/`, formData);
        showFeedback("success", "New member added successfully!");
      }

      resetForm();
      fetchMembers();
    } catch (err) {
      console.error(err.response?.data || err);
      showFeedback("error", "Failed to save member. Please check the inputs.");
    }
  };

  const handleEdit = (member) => {
    setForm({
      name: member.name,
      role: member.role,
      category: member.category,
      bio: member.bio,
      image: null,
    });

    setEditingId(member.id);

    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      await axios.delete(`${API}/${id}/`);
      showFeedback("success", "Member deleted successfully!");
      fetchMembers();
    } catch (error) {
      console.error(error);
      showFeedback("error", "Failed to delete member.");
    }
  };

  // ================= UI =================
  if (loading) return <p className="p-6 text-center text-gray-600">Loading members...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ===== NAVIGATION ===== */}
      <div className="flex gap-3 mb-6">
        <a
          href="/"
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          ← Website Home
        </a>

        <a
          href="/admin"
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
        >
          ⚙ Admin Home
        </a>
      </div>

      <h2 className="text-2xl font-semibold mb-4">
        Leadership Admin Dashboard
      </h2>

      {/* ===== FEEDBACK ALERT ===== */}
      {feedback.message && (
        <div
          className={`mb-4 p-4 rounded text-sm font-medium transition-all ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800 border-l-4 border-green-500"
              : "bg-red-100 text-red-800 border-l-4 border-red-500"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* ===== FORM ===== */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mb-6 border p-4 rounded bg-gray-50"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded"
        />

        <input
          type="text"
          name="role"
          placeholder="Role"
          required
          value={form.role}
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded bg-white"
        >
          <option value="board">Board Member</option>
          <option value="staff">Staff Member</option>
        </select>

        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded h-24"
        />

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Profile Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {editingId ? "Update Member" : "Add Member"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ===== MEMBERS LIST ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="border p-4 rounded flex justify-between items-center bg-white shadow-sm"
          >
            <div className="flex items-center gap-4">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover border"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold border">
                  {member.name.charAt(0)}
                </div>
              )}
              
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-gray-600">
                  {member.role} <span className="text-xs text-gray-400 uppercase tracking-wider">({member.category})</span>
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(member)}
                className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded hover:bg-yellow-500 transition text-sm font-medium"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(member.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {members.length === 0 && (
          <p className="text-gray-500 col-span-full text-center py-8 border rounded border-dashed">
            No members found. Add one above!
          </p>
        )}
      </div>
    </div>
  );
};

export default LeadershipAdmin;