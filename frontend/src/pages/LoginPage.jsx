import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Lock, LoaderCircle, Globe } from "lucide-react";
import api from "../api"; // Ensure this points to a valid Axios instance

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/token/", { username, password });
      const { access, refresh } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      const isSuperRes = await api.get("/api/is-superuser/");
      const isSuperuser = isSuperRes.data.is_superuser;

      if (isSuperuser) {
        navigate("/admin");
      } else {
        setError("Access denied: Not an admin user.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-sky-200 px-4">
      <div className="bg-white shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/images/imarikalogo.jpeg" alt="Imarika Foundation Logo" className="h-16" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Imarika Login
        </h2>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin text-white" />
                <span>Verifying...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>

      {/* Go to Website Button */}
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 text-sm font-medium text-blue-700 border border-blue-300 px-5 py-2 rounded-md hover:bg-blue-50 transition-shadow shadow-sm"
        >
          <Globe className="w-4 h-4" />
          Go to Website
        </Link>
      </div>
    </div>
  );
}
