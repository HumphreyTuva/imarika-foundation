import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";

const PastEventsSection = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("https://imarikafoundation.org/api/api/events/past/")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to fetch past events:", err));
  }, []);

  return (
    <section id="past-events" className="w-full px-4 py-12 md:px-20 bg-grey-50">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">Past Events</h2>
        <p className="text-gray-600">See what we’ve been up to recently.</p>
      </div>

      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
      >
        {events.map((event, index) => (
          <SwiperSlide key={event.id || index}>
            <div className="bg-gray-100 rounded-2xl shadow-md overflow-hidden flex flex-col h-[450px]">
              {/* Image Slider */}
              <div className="w-full h-48 relative flex-shrink-0">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  autoplay={{ delay: 3000 }}
                  loop
                  allowTouchMove={true}
                  pagination={{ clickable: true }}
                  className="w-full h-48"
                >
                  {event.images && event.images.length > 0 ? (
                    event.images.map((imgObj, i) => (
                      <SwiperSlide key={i}>
                        <img
                          src={imgObj.image}
                          alt={`Event ${event.title} View ${i + 1}`}
                          className="w-full h-48 object-cover"
                        />
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide key="fallback">
                      <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-6xl font-bold text-white rounded-t-2xl">
                        {event.title?.charAt(0).toUpperCase() || "E"}
                      </div>
                    </SwiperSlide>
                  )}
                </Swiper>
              </div>

              {/* Event Info */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 text-center">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 text-center">
                    {new Date(event.event_date).toDateString()} • {event.location}
                  </p>
                  <div className="mt-2 text-gray-700 text-sm text-center line-clamp-3">
                    {event.description}
                  </div>
                </div>

                {/* Button */}
                <div className="mt-4 flex justify-center">
                  <Link
                    to={`/gallery/${event.id}`}
                    className="px-5 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 shadow-md transition"
                  >
                    View Gallery →
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PastEventsSection;
