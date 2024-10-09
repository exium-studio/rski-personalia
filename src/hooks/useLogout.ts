import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import req from "../lib/req";

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
          // removeCookie("__auth_token");
          localStorage.removeItem("__auth_token");
          localStorage.removeItem("__user_data");
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
            (typeof e?.response?.data?.message === "string" &&
              (e?.response?.data?.message as string)) ||
            "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
          isClosable: true,
          position: "bottom-right",
        });
      })
      .finally(() => {
        setLogoutLoading(false);
      });
  }

  return { logout, logoutLoading };
}
