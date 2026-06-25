import React, { useState } from "react";
import axios from "axios";

const ActionButtons = () => {
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    message: "",
    mpesa_code: "",
  });

  const handleClick = (type) => {
    setFormType(type);
    setOpen(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        form_type: formType.toLowerCase(),
        full_name: formData.full_name,
        email: formData.email,
        message: formData.message,
        mpesa_code: formType.toLowerCase() === "donate" ? formData.mpesa_code : "",
      };

      const endpoint = `https://imarikafoundation.org/api/api/api/submit/${formType.toLowerCase()}/`;
      const res = await axios.post(endpoint, payload);

      alert(res.data.message || "Submission successful!");

      setOpen(false);
      setFormData({
        full_name: "",
        email: "",
        message: "",
        mpesa_code: "",
      });
    } catch (err) {
      alert("Submission failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <section id="get-involved" className="py-16 px-6 bg-white scroll-mt-20">
      <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">Get Involved</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[
          { title: "Volunteer", desc: "Be part of our mission by giving your time and skills." },
          { title: "Donate", desc: "Support our cause financially to reach more communities." },
          { title: "Partner", desc: "Collaborate with us in implementing sustainable programs." },
        ].map((opt, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(opt.title)}
            className="cursor-pointer bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-blue-700 mb-2">{opt.title}</h3>
            <p className="text-gray-600">{opt.desc}</p>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-4 text-gray-500 hover:text-red-600 text-xl"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4 text-orange-600">{formType} Form</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formType.toLowerCase() === "donate" ? (
                <>
                  <p className="text-sm text-gray-700">
                    <strong>Paybill:</strong> <span className="text-orange-600">832897</span> &nbsp; | &nbsp;
                    <strong>Account:</strong> <span className="text-orange-600">Your Name</span>
                  </p>
                  <input
                    type="text"
                    name="mpesa_code"
                    value={formData.mpesa_code}
                    onChange={handleChange}
                    placeholder="Paste M-Pesa Code or Message"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </>
              ) : (
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Your Message"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ActionButtons;
