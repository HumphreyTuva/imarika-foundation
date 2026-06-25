import React, { useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const PartnerForm = () => {
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://imarikafoundation.org/api/api/";
      await axios.post(`${apiUrl}/submit/partner/`, formData);
      alert("Thank you for partnering with us!");
      setFormData({ full_name: "", email: "", message: "" });
      setShowSponsorModal(false);
    } catch (error) {
      console.error(error);
      alert("There was a problem. Please try again later.");
    }
  };

  return (
    <>
      {showSponsorModal && (
        <div
          onClick={() => setShowSponsorModal(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in border-t-8 border-orange-500"
          >
            <button
              onClick={() => setShowSponsorModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold transition"
            >
              &times;
            </button>

            <div className="flex justify-center mb-4">
              <img
                src="/images/imarikalogo.jpeg"
                alt="Imarika Logo"
                className="h-16 w-16 object-contain animate-bounce"
              />
            </div>

            <div className="flex justify-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 relative inline-block w-fit">
                Partner With Us
                <span
                  className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 h-1 w-2/3 rounded-full"
                  style={{
                    background: "linear-gradient(to right, #f97316, #3b82f6)",
                  }}
                />
              </h2>
            </div>

            <p className="text-center text-gray-600 mb-6 text-sm">
              Fill out this form and we’ll get in touch with you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name / Organization Name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                placeholder="Your Message (Optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              ></textarea>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold rounded-lg hover:scale-105 transition transform duration-300"
              >
                Submit
              </button>
            </form>
            
          </div>
        </div>
      )}

      <section
        id="partners"
        className="py-16 px-6 bg-gray-50"
        data-aos="fade-up"
      >
        <div className="flex justify-center">
          <h2 className="text-3xl font-semibold mb-10 text-gray-800 relative inline-block w-fit">
            Our Partners
            <span
              className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 h-1 w-2/3 rounded-full"
              style={{
                background: "linear-gradient(to right, #f97316, #3b82f6)",
              }}
            />
          </h2>
        </div>

        <div className="max-w-7xl mx-auto">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            className="px-4"
          >
            {[
              {
                name: "Partner 1",
                logo: "/images/Imarika-Sacco.jpeg",
                link: "https://imarikasacco.co.ke/",
              },
              {
                name: "Sponsor 2",
                logo: "/images/zana.webp",
                link: "https://www.zanaafrica.org/",
              },
              {
                name: "Partner 3",
                logo: "/images/wananchi.png",
                link: "https://wananchihospital.org/",
              },
              {
                name: "Sponsor 4",
                logo: "/images/momeye.jpg",
                link: "https://www.mombasaeyehospital.com/",
              },
              {
                name: "Sponsor 5",
                logo: "/images/klf.jpg",
                link: "https://eservices.kilifi.go.ke/",
              },
              {
                name: "Sponsor 6",
                logo: "/images/ahadi.png",
                link: "http://www.jigger-ahadi.org/",
              },
              {
                name: "Sponsor 7",
                logo: "/images/shamba.jpg",
                link: "http://shambaprojectkilifi.org/",
              },
              {
                name: "Sponsor 8",
                logo: "/images/learn.jpg",
                link: "https://learnfoundation.nl/",
              },
              {
                name: "Sponsor 9",
                logo: "/images/serianu.png",
                link: "https://www.serianu.com/acic.html",
              },
              {
                name: "Sponsor 10",
                logo: "/images/safaricom-foundation.png",
                link: "https://www.safaricomfoundation.org/",
              },
              {
                name: "Sponsor 11",
                logo: "/images/serianultd.png",
                link: "https://www.serianu.com/",
              },
              {
                name: "Sponsor 12",
                logo: "/images/aisha.jpg",
                link: "https://aishaandfriends.com/",
              },
               {
                name: "Sponsor 13",
                logo: "/images/rotary.png",
                link: "https://www.rotary.org/en",
              },
              {
                name: "Sponsor 14",
                logo: "/images/cfsk.png",
                link: "https://cfsk.org/",
              },
            ].map((partner, index) => (
              <SwiperSlide key={index}>
                <a
                  href={partner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
      <div
        className={`relative group p-4 rounded-lg bg-white shadow hover:shadow-xl transition duration-300 w-full h-24 flex justify-center items-center ${
          index === 0 ? "ring-4 ring-orange-500 animate-pulse scale-105" : ""
        }`}
      >
        <img
          src={partner.logo}
          alt={partner.name}
          className={`h-16 object-contain transition duration-300 ease-in-out ${
            index === 0
              ? "grayscale-0 drop-shadow-xl animate-glow rounded-[10px]"
              : "grayscale group-hover:grayscale-0 group-hover:scale-105"
        }`}
      />

      </div>
    </a>
  </SwiperSlide>
))}

              
            
          </Swiper>
        </div>

        <div className="flex justify-center my-10">
  <button
    onClick={() => setShowSponsorModal(true)}
    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-orange-500 to-orange-600 text-white text-lg font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out"
  >
    <span>Partner With Us</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  </button>
</div>

      </section>
    </>
  );
};

export default PartnerForm;