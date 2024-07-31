import { useNavigate } from "react-router-dom";
import { removeCookie } from "typescript-cookie";
import { useCallback } from "react";

export default function useLogout() {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    removeCookie("__auth_token");
    removeCookie("__user_data");
    navigate("/");
  }, [navigate]);

  return logout;
}
