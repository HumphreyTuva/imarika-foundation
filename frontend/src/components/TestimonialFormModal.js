import React, { useState } from "react";
import axios from "axios";

function TestimonialFormModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    text: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) form.append(key, formData[key]);
      });

      await axios.post("http://127.0.0.1:8000/api/testimonials/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Submitted successfully!");
      setFormData({ name: "", role: "", text: "", image: null });

      if (onSuccess) onSuccess();
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit testimonial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative transform transition-all scale-100 sm:scale-105"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
        >
          &times;
        </button>

        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Share Your Story
        </h3>

        {message && (
          <p
            className={`text-center mb-4 text-sm font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Your Role / Title"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="Your Testimonial"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 h-28 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold text-white 
                       bg-gradient-to-r from-blue-600 via-orange-500 to-orange-600 
                       shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TestimonialFormModal;
