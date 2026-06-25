import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Globe, Loader2 } from 'lucide-react';

// ✅ Feedback Notification Component
const FeedbackNotification = ({ message, type }) => (
  <div
    className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-xl shadow-xl transition-all duration-300
    ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
  >
    {message}
  </div>
);

// ✅ Confirmation Dialog
const ConfirmationDialog = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center">
      <p className="mb-4 text-lg text-gray-800">{message}</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
        >
          Yes, I'm sure
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-400"
        >
          No, take me back
        </button>
      </div>
    </div>
  </div>
);

// ✅ Full-screen loading overlay
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <Loader2 className="w-12 h-12 text-white animate-spin" />
  </div>
);

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');

  const [existingImages, setExistingImages] = useState([]); // ✅ event images from API
  const [newImages, setNewImages] = useState([]); // ✅ newly added files

  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, type: null, id: null });
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const formRef = useRef(null);
  const navigate = useNavigate();

  const showFeedback = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [upcomingRes, pastRes] = await Promise.all([
          fetch('https://imarikafoundation.org/api/api/api/events/upcoming/'),
          fetch('https://imarikafoundation.org/api/api/api/events/past/')
        ]);
        if (!upcomingRes.ok || !pastRes.ok) throw new Error('Failed to fetch events');
        const [upcomingEvents, pastEvents] = await Promise.all([
          upcomingRes.json(),
          pastRes.json()
        ]);
        setEvents([...upcomingEvents, ...pastEvents]);
      } catch (error) {
        console.error('Error fetching events:', error);
        showFeedback('Failed to fetch events.', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ handle adding new images without replacing
  const handleImageChange = (e) => {
    setNewImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  // ✅ remove images
  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const removeNewImage = (file) => {
    setNewImages((prev) => prev.filter((img) => img !== file));
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('event_date', eventDate);
    formData.append('start_time', startTime);
    formData.append('end_time', endTime);
    formData.append('location', location);

    // ✅ append existing image URLs if backend supports them
    existingImages.forEach((url) => formData.append('existing_images', url));

    // ✅ append new files
    newImages.forEach((img) => formData.append('images', img));

    const url = editingEventId
      ? `https://imarikafoundation.org/api/api/api/events/${editingEventId}/`
      : 'https://imarikafoundation.org/api/api/api/events/create-with-images/';
    const method = editingEventId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error('Error submitting event');
      setEditingEventId(null);
      setTitle('');
      setDescription('');
      setEventDate('');
      setStartTime('');
      setEndTime('');
      setLocation('');
      setExistingImages([]);
      setNewImages([]);
      showFeedback(editingEventId ? 'Event updated successfully!' : 'Event created successfully!');
      const refreshed = await fetch('https://imarikafoundation.org/api/api/api/events/upcoming/');
      setEvents(await refreshed.json());
    } catch (error) {
      console.error('Error submitting event:', error);
      showFeedback('Failed to submit event.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://imarikafoundation.org/api/api/api/events/${id}/`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Failed to delete event');
      showFeedback('Event deleted successfully!');
      const refreshed = await fetch('https://imarikafoundation.org/api/api/api/events/upcoming/');
      setEvents(await refreshed.json());
    } catch (error) {
      console.error(error);
      showFeedback('Failed to delete event.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const editEvent = (event) => {
    setTitle(event.title);
    setDescription(event.description);
    setEventDate(event.event_date);
    setStartTime(event.start_time || '');
    setEndTime(event.end_time || '');
    setLocation(event.location);

    // ✅ load existing images from event (assuming API returns them as array of URLs)
    setExistingImages(event.images || []);
    setNewImages([]);

    setEditingEventId(event.id);
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      100
    );
  };

  const confirmDelete = () => {
    if (confirmDialog.type === 'event') deleteEvent(confirmDialog.id);
    setConfirmDialog({ show: false, type: null, id: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-sky-100 via-blue-50 to-orange-50 p-6">
      {feedback.message && (
        <FeedbackNotification message={feedback.message} type={feedback.type} />
      )}
      {loading && <LoadingOverlay />}

      {/* Centered Top Buttons */}
      <div className="flex justify-center gap-6 mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 shadow-md"
        >
          <Globe size={20} /> Website
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-xl hover:bg-orange-700 shadow-md"
        >
          <Home size={20} /> Admin Home
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6 border-t-4 border-orange-500">
        <h1 className="text-3xl font-bold text-center mb-6">Manage Events</h1>

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleEventSubmit}
          className="space-y-4 mb-10"
          encType="multipart/form-data"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-3 border border-blue-300 rounded-xl"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-3 border border-blue-300 rounded-xl"
            rows={4}
            required
          />

          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full p-3 border border-blue-300 rounded-xl"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-xl"
              required
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-xl"
              required
            />
          </div>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full p-3 border border-blue-300 rounded-xl"
            required
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border border-blue-300 rounded-xl"
          />

          {/* ✅ Preview existing images */}
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {existingImages.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt="Event"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ✅ Preview new images */}
          {newImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {newImages.map((file, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="New"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(file)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-sky-600 text-white px-5 py-2 rounded-xl hover:bg-sky-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {editingEventId ? 'Updating...' : 'Creating...'}
              </>
            ) : editingEventId ? (
              'Update Event'
            ) : (
              'Create Event'
            )}
          </button>
        </form>

        {/* Event List */}
        <div>
          <h3 className="text-xl font-semibold text-blue-900 mb-4">All Events</h3>
          <ul className="space-y-2">
            {events.map((event) => (
              <li
                key={event.id}
                className="bg-sky-50 p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-blue-800">{event.title}</p>
                </div>
                <div className="space-x-4">
                  <button
                    onClick={() => editEvent(event)}
                    className="text-sky-700 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setConfirmDialog({ show: true, type: 'event', id: event.id })
                    }
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {confirmDialog.show && (
          <ConfirmationDialog
            message="Are you sure you want to delete this event?"
            onConfirm={confirmDelete}
            onCancel={() => setConfirmDialog({ show: false, type: null, id: null })}
          />
        )}
      </div>
    </div>
  );
}
