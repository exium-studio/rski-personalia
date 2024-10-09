import {
  Avatar,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { responsiveSpacing } from "../../../constant/sizes";
import useAuth from "../../../global/useAuth";
import useGetUserData from "../../../hooks/useGetUserData";
import req from "../../../lib/req";
import PasswordInput from "../../dependent/input/PasswordInput";
import StringInput from "../../dependent/input/StringInput";
import CContainer from "../../wrapper/CContainer";
import RequiredForm from "../RequiredForm";

export default function FormLogin() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();
  const userData = useGetUserData();

  const { setUserPermissions } = useAuth();

  const formik = useFormik({
    validateOnChange: false,

    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: yup.object().shape({
      email: yup.string().required("Harus diisi"),
      password: yup.string().required("Harus diisi"),
    }),

    onSubmit: (values, { resetForm }) => {
      setLoading(true);

      const payload = {
        email: formik.values.email,
        password: formik.values.password,
      };

      req
        .post(`/api/login`, payload)
        .then((r) => {
          // console.log(r.data.user.data);

          if (r.status === 200) {
            // setCookie("__auth_token", r.data.token);
            localStorage.setItem("__auth_token", r.data.token);
            localStorage.setItem(
              "__user_data",
              JSON.stringify(r.data.user.data)
            );
            // setStatusAktif(r.data.user.data.status_aktif);
            setUserPermissions(r.data.user.data.permission);

            navigate("/profil");
            toast({
              status: "success",
              title: r.data.user.message,
              isClosable: true,
              position: "bottom-right",
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
          setLoading(false);
        });
    },
  });

  return (
    <>
      <Text fontSize={24} fontWeight={600} mb={2}>
        Selamat Datang!
      </Text>
      <Text opacity={0.6} mb={8}>
        Masuk untuk mendapatkan akses ke data & informasi.
      </Text>
      <form id="FormLogin" onSubmit={formik.handleSubmit}>
        {userData && (
          <CContainer gap={responsiveSpacing}>
            <HStack p={4} gap={4} borderRadius={8} bg={"var(--divider)"}>
              <Avatar />

              <CContainer>
                <Text>{userData.nama}</Text>
                <Text>{userData.email}</Text>
              </CContainer>
            </HStack>

            <CContainer gap={2}>
              <Button
                colorScheme="ap"
                className="btn-ap clicky"
                w={"100%"}
                as={Link}
                to={"/profil"}
                size={"lg"}
              >
                Klik untuk masuk
              </Button>
            </CContainer>
          </CContainer>
        )}

        {!userData && (
          <>
            <FormControl isInvalid={formik.errors.email ? true : false} mb={4}>
              <FormLabel>
                Username/Email/NIK
                <RequiredForm />
              </FormLabel>
              <StringInput
                name="email"
                placeholder={"Email"}
                onChangeSetter={(input) => {
                  formik.setFieldValue("email", input);
                }}
                inputValue={formik.values.email}
              />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={formik.errors.password ? true : false}
              mb={2}
            >
              <FormLabel>
                Password
                <RequiredForm />
              </FormLabel>

              <PasswordInput
                name="password"
                onChangeSetter={(input) => {
                  formik.setFieldValue("password", input);
                }}
                inputValue={formik.values.password}
              />
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>

            <Text color={"p.500"} as={Link} to={"/forgot-password-1"}>
              Lupa password?
            </Text>

            <Button
              mt={4}
              type="submit"
              form="FormLogin"
              colorScheme="ap"
              className="btn-ap clicky"
              w={"100%"}
              isLoading={loading}
            >
              Login
            </Button>
          </>
        )}
      </form>
    </>
  );
}
