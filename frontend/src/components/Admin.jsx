import { Link, useNavigate } from "react-router-dom";
import { Newspaper, CalendarCheck, Home, LogOut, Users, Layers, TrendingUp } from "lucide-react";

export default function AdminHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10 flex flex-col items-center">
      {/* Page Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-6">
        Imarika Foundation Admin Dashboard
      </h1>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition"
        >
          <Home className="w-5 h-5" />
          Home Page
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      {/* Admin Cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        
        {/* Articles Card */}
        <Link to="/article-admin" className="group">
          <div className="bg-sky-100 rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-sky-900 group-hover:text-blue-800">
                Manage Articles
              </h2>
              <Newspaper className="w-10 h-10 text-sky-600" />
            </div>
            <p className="text-sky-700">
              Create and edit blog content to keep your audience updated.
            </p>
          </div>
        </Link>

        {/* Events Card */}
        <Link to="/event-admin" className="group">
          <div className="bg-orange-100 rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-orange-900 group-hover:text-orange-700">
                Manage Events
              </h2>
              <CalendarCheck className="w-10 h-10 text-orange-500" />
            </div>
            <p className="text-orange-700">
              Plan and schedule upcoming Imarika Foundation events.
            </p>
          </div>
        </Link>

        {/* Leadership Card */}
        <Link to="/leaders-admin" className="group">
          <div className="bg-green-100 rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-green-900 group-hover:text-green-700">
                Manage Leadership
              </h2>
              <Users className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-green-700">
              Add, edit, and manage board members and staff profiles.
            </p>
          </div>
        </Link>

        {/* Programmes Card */}
        <Link to="/program-admin" className="group">
          <div className="bg-purple-100 rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-purple-900 group-hover:text-purple-700">
                Manage Programmes
              </h2>
              <Layers className="w-10 h-10 text-purple-600" />
            </div>
            <p className="text-purple-700">
              Create, edit, and update the Foundation's impact pillars and initiatives.
            </p>
          </div>
        </Link>

        {/* Impact Card ✅ NEW */}
        <Link to="/impact-admin" className="group">
          <div className="bg-indigo-100 rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-indigo-900 group-hover:text-indigo-700">
                Manage Impact
              </h2>
              <TrendingUp className="w-10 h-10 text-indigo-600" />
            </div>
            <p className="text-indigo-700">
              Update the main stats, success stories, and annual reports.
            </p>
          </div>
        </Link>

      </div>
    </div>
  );
}