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
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { responsiveSpacing } from "../../../constant/sizes";
import useGetUserData from "../../../hooks/useGetUserData";
import req from "../../../lib/req";
import PasswordInput from "../../dependent/input/PasswordInput";
import CContainer from "../../wrapper/CContainer";
import RequiredForm from "../RequiredForm";

export default function FormForgotPasswordStep3() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();
  const userData = useGetUserData();

  const { email, otp } = useParams();

  const formik = useFormik({
    validateOnChange: false,

    initialValues: {
      password: "",
      password_confirmation: "",
    },

    validationSchema: yup.object().shape({
      password: yup.string().required("Harus diisi"),
      password_confirmation: yup.string().required("Harus diisi"),
    }),

    onSubmit: (values) => {
      setLoading(true);

      const payload = {
        email: email,
        kode_otp: otp,
        password: values.password,
        password_confirmation: values.password_confirmation,
      };

      req
        .post(`/api/reset-password`, payload)
        .then((r) => {
          if (r.status === 200) {
            navigate("/");
            toast({
              status: "success",
              title: r.data.message,
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
        Verifikasi Email
      </Text>
      <Text opacity={0.6} mb={6}>
        Masukan kode OTP 6 digit yang kami kirimkan ke email <b>{email}</b>.
      </Text>

      <form id="resetPass" onSubmit={formik.handleSubmit}>
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
            <FormControl
              isInvalid={formik.errors.password ? true : false}
              mb={4}
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

            <FormControl
              isInvalid={formik.errors.password_confirmation ? true : false}
              mb={4}
            >
              <FormLabel>
                Konfirmasi Password
                <RequiredForm />
              </FormLabel>
              <PasswordInput
                name="password_confirmation"
                onChangeSetter={(input) => {
                  formik.setFieldValue("password_confirmation", input);
                }}
                inputValue={formik.values.password_confirmation}
              />
              <FormErrorMessage>
                {formik.errors.password_confirmation}
              </FormErrorMessage>
            </FormControl>

            <Button
              mt={4}
              type="submit"
              form="resetPass"
              colorScheme="ap"
              className="btn-ap clicky"
              w={"100%"}
              isLoading={loading}
            >
              Reset & Update Password
            </Button>
          </>
        )}
      </form>
    </>
  );
}
