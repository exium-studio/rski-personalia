import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeCookie } from "typescript-cookie";
import req from "../constant/req";

export default function useLogout() {
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();

  function logout() {
    setLogoutLoading(true);
    req
      .get("/api/rski/dashboard/logout")
      .then((r) => {
        if (r.status === 200) {
          removeCookie("__auth_token");
          navigate("/");
          toast({
            status: "success",
            title: r.data.message,
            position: "bottom-right",
            isClosable: true,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        toast({
          status: "error",
          title:
            e.response.data.message || "Maaf terjadi kesalahan pada sistem",
          position: "bottom-right",
          isClosable: true,
        });
      })
      .finally(() => {
        setLogoutLoading(false);
      });
  }

  return { logout, logoutLoading };
}
