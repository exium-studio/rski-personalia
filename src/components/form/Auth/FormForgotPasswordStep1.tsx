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
import useGetUserData from "../../../hooks/useGetUserData";
import req from "../../../lib/req";
import StringInput from "../../dependent/input/StringInput";
import CContainer from "../../wrapper/CContainer";
import RequiredForm from "../RequiredForm";

export default function FormForgotPasswordStep1() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();
  const userData = useGetUserData();

  const formik = useFormik({
    validateOnChange: false,

    initialValues: {
      email: "",
    },

    validationSchema: yup.object().shape({
      email: yup.string().required("Harus diisi"),
    }),

    onSubmit: (values) => {
      setLoading(true);

      const payload = {
        email: values.email,
      };

      req
        .post(`/api/forgot-password-sendOtp`, payload)
        .then((r) => {
          if (r.status === 200) {
            navigate(`/forgot-password-2/${values.email}`);
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
        Lupa Password? Tenang
      </Text>
      <Text opacity={0.6} mb={6}>
        Masukkan email anda dan kami akan mengirimkan OTP ke email anda.
      </Text>

      <form id="verifEmailForm" onSubmit={formik.handleSubmit}>
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

            <Button
              mt={4}
              type="submit"
              form="verifEmailForm"
              colorScheme="ap"
              className="btn-ap clicky"
              w={"100%"}
              isLoading={loading}
            >
              Kirim OTP
            </Button>
          </>
        )}
      </form>
    </>
  );
}
