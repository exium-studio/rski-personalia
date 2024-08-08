import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "typescript-cookie";
import * as yup from "yup";
import req from "../../../constant/req";
import PasswordInput from "../../dependent/input/PasswordInput";
import StringInput from "../../dependent/input/StringInput";
import RequiredForm from "../RequiredForm";
import useGetUserData from "../../../hooks/useGetUserData";

export default function FormLogin() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();
  const userData = useGetUserData();

  useEffect(() => {
    if (userData) {
      navigate("/profil");
    }
  }, [userData, navigate]);

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
            setCookie("__auth_token", r.data.token);
            localStorage.setItem(
              "__user_data",
              JSON.stringify(r.data.user.data)
            );
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
              "Maaf terjadi kesalahan pada sistem",
            isClosable: true,
            position: "bottom-right",
          });
        })
        .finally(() => {
          setLoading(false);
        });

      //TODO api login tod

      // navigate("/dashboard");
    },
  });

  return (
    <form id="FormLogin" onSubmit={formik.handleSubmit}>
      <FormControl isInvalid={formik.errors.email ? true : false} mb={4}>
        <FormLabel>
          Email
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

      <FormControl isInvalid={formik.errors.password ? true : false} mb={8}>
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

      <Button
        type="submit"
        form="FormLogin"
        colorScheme="ap"
        className="btn-ap clicky"
        w={"100%"}
        isLoading={loading}
      >
        Login
      </Button>
    </form>
  );
}
