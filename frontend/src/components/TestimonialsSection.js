import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import TestimonialFormModal from "./TestimonialFormModal";

const gradients = [
  "from-orange-500 to-orange-700",
  "from-blue-500 to-blue-700",
  "from-sky-400 to-sky-600",
  "from-blue-300 to-blue-500",
  "from-blue-800 to-blue-900",
];

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/testimonials/");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setTestimonials(data);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setTestimonials([]);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="relative py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
          Voices of Impact
        </h2>

        {/* --- Testimonials Carousel --- */}
        {testimonials.length > 0 ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            spaceBetween={40}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop
            className="pb-12"
          >
            {testimonials.map((t, i) => {
              const gradient = gradients[i % gradients.length];

              return (
                <SwiperSlide key={t.id}>
                  <div className="relative group bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 h-[400px] flex flex-col items-center text-center transform hover:-translate-y-2 transition duration-500 overflow-hidden">
                    <div className="relative">
                      {t.image && (
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4"
                        />
                      )}

                      <div
                        className={`absolute bottom-0 right-0 w-10 h-10 rounded-full opacity-50 animate-ping bg-gradient-to-br ${gradient}`}
                      ></div>

                      <div
                        className={`absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center 
                        text-white text-lg font-bold border-2 border-white shadow-md 
                        bg-gradient-to-br ${gradient} 
                        transition duration-500 group-hover:scale-110 group-hover:shadow-2xl`}
                      >
                        {t.name?.charAt(0)}
                      </div>
                    </div>

                    <p className="text-gray-600 italic leading-relaxed mt-4 mb-3 line-clamp-3">
                      “{t.text}”
                    </p>

                    {t.text.length > 100 && (
                      <button
                        onClick={() => setSelectedTestimonial(t)}
                        className="text-sm text-blue-600 hover:underline mb-4"
                      >
                        Read Full Story
                      </button>
                    )}

                    <h4 className="text-lg font-bold text-blue-800">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <p className="text-center text-gray-500">No testimonials available.</p>
        )}

        {/* --- Share Your Story Button (Bottom) --- */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 rounded-full font-semibold text-white 
                       bg-gradient-to-r from-blue-600 via-orange-500 to-orange-600 
                       shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300"
          >
            Share Your Story
          </button>
        </div>
      </div>

      {/* Background accents */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-50"></div>

      {/* Full story modal */}
      {selectedTestimonial && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTestimonial(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl z-10"
            >
              &times;
            </button>

            <div className="p-8 overflow-y-auto max-h-[90vh]">
              <div className="flex flex-col items-center text-center">
                {selectedTestimonial.image && (
                  <img
                    src={selectedTestimonial.image}
                    alt={selectedTestimonial.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4"
                  />
                )}
                <h4 className="text-xl font-bold text-blue-800 mb-2">
                  {selectedTestimonial.name}
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  {selectedTestimonial.role}
                </p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  “{selectedTestimonial.text}”
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form modal */}
      <TestimonialFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchTestimonials}
      />
    </section>
  );
}

export default TestimonialsSection;
