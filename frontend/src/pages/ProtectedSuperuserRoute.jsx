import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedSuperuserRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSuperuser = async () => {
      try {
        const res = await axios.get("/api/is-superuser/", {
          withCredentials: true, // if using cookies
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT
          },
        });

        if (res.data.is_superuser) {
          setAuthorized(true);
        } else {
          navigate("/not-authorized");
        }
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSuperuser();
  }, [navigate]);

  if (loading) return <div className="text-center p-10">Checking access...</div>;

  return authorized ? children : null;
}
