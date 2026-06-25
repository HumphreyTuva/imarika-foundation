import axios from 'axios';
import { useEffect, useState } from 'react';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://imarikafoundation.org/api/api/events/upcoming/')
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date not set';
    return new Date(dateStr).toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
  if (!timeStr || !timeStr.includes(':')) return 'Time not set';
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

  const renderEventPoster = (event) => {
    const hasImage = event.images && event.images.length > 0;
    if (hasImage) {
      const src = typeof event.images[0] === 'string' ? event.images[0] : event.images[0].image;
      return (
        <img
          src={src}
          alt={`Poster for ${event.title}`}
          className="w-full h-52 object-cover"
          onError={(e) => (e.target.style.display = 'none')}
        />
      );
    } else {
      const firstLetter = event.title?.charAt(0).toUpperCase() || '?';
      return (
        <div className="w-full h-52 flex items-center justify-center bg-blue-100 text-blue-800 text-5xl font-bold">
          {firstLetter}
        </div>
      );
    }
  };

  return (
    <section
      id="events"
      className="py-16 px-4 md:px-6 lg:px-12 bg-white scroll-mt-20"
    >
      <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
        Upcoming Events
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 animate-pulse" aria-live="polite">
          Loading events...
        </p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming events at the moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex gap-6 min-w-fit px-1">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col min-w-[280px] sm:min-w-[320px] max-w-xs"
              >
                {renderEventPoster(event)}

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-700 mb-2">{event.title}</h3>

                    <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                      {event.description || 'No description available.'}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      📍 <span className="font-medium">{event.location || 'To be announced'}</span>
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      📅 {formatDate(event.event_date)}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      🕒 {formatTime(event.start_time)} - {formatTime(event.end_time)}
                    </p>
                  </div>

                  <div className="mt-4">
                    <span
                      className={`text-xs inline-block px-2 py-1 rounded-full ${
                        event.status === 'upcoming'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default UpcomingEvents;
