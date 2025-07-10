// hooks/useLogout.ts
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";

// ✅ Custom hook — name starts with "use"
const useLogout = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      await refreshAuth();
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return handleLogout;
};

export default useLogout;
