import { useNavigate } from "react-router-dom";
import { removeCookie } from "typescript-cookie";

const useGetUserData = () => {
  const navigate = useNavigate();

  const storedData = localStorage.getItem("__user_data");

  let data = null;
  try {
    if (storedData) {
      data = JSON.parse(storedData);
    }
  } catch (error) {
    removeCookie("__auth_token");
    localStorage.removeItem("__user_data");
    navigate("/");
  }

  return data;
};

export default useGetUserData;
