import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function LoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleClick = () => {
    navigate(isLoggedIn ? "/admin" : "/login");
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md hover:from-blue-700 hover:to-blue-800 transition"
    >
      <ShieldCheck className="w-5 h-5" />
      {isLoggedIn ? "Admin Panel" : "Login"}
    </button>
  );
}
