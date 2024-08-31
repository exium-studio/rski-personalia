import {
  Avatar,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  PinInput,
  PinInputField,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { setCookie } from "typescript-cookie";
import * as yup from "yup";
import { responsiveSpacing } from "../../../constant/sizes";
import useAuth from "../../../global/useAuth";
import useGetUserData from "../../../hooks/useGetUserData";
import req from "../../../lib/req";
import CountDownDurationShort from "../../dependent/CountDownDurationShort";
import CContainer from "../../wrapper/CContainer";

export default function FormForgotPasswordStep2() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();
  const userData = useGetUserData();

  const { setUserPermissions } = useAuth();

  const formik = useFormik({
    validateOnChange: false,

    initialValues: {
      otp: "",
    },

    validationSchema: yup.object().shape({
      otp: yup.string().required("Harus diisi"),
    }),

    onSubmit: (values, { resetForm }) => {
      setLoading(true);

      const payload = {
        otp: formik.values.otp,
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
              "Maaf terjadi kesalahan pada sistem",
            isClosable: true,
            position: "bottom-right",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  const { email } = useParams();
  const [kirimUlangOTP, setKirimUlangOTP] = useState<boolean>(false);

  function requestKirimUlangOTP() {}

  return (
    <>
      <Text fontSize={24} fontWeight={600} mb={2}>
        Verifikasi Email
      </Text>
      <Text opacity={0.6} mb={6}>
        Masukan kode OTP 6 digit yang kami kirimkan ke email {email}.
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
            <FormControl isInvalid={formik.errors.otp ? true : false} mb={4}>
              <HStack>
                <PinInput size={"lg"} isInvalid={!!formik.errors.otp}>
                  <PinInputField flex={1} h={"60px"} />
                  <PinInputField flex={1} h={"60px"} />
                  <PinInputField flex={1} h={"60px"} />
                  <PinInputField flex={1} h={"60px"} />
                  <PinInputField flex={1} h={"60px"} />
                  <PinInputField flex={1} h={"60px"} />
                </PinInput>
              </HStack>

              <FormErrorMessage>{formik.errors.otp}</FormErrorMessage>
            </FormControl>

            <Button
              mt={4}
              type="submit"
              form="FormLogin"
              colorScheme="ap"
              className="btn-ap clicky"
              w={"100%"}
              isLoading={loading}
            >
              Verifikasi OTP
            </Button>

            <CContainer>
              <Text mt={6} opacity={0.4}>
                Bermasalah dengan kode OTP?
              </Text>
              {!kirimUlangOTP && (
                <HStack opacity={0.4}>
                  <Text>Kirim ulang OTP dalam</Text>
                  <CountDownDurationShort
                    initialSeconds={120}
                    onCountFinished={() => {
                      setKirimUlangOTP(true);
                    }}
                  />
                </HStack>
              )}

              {kirimUlangOTP && (
                <Text color={"p.500"} onClick={requestKirimUlangOTP}>
                  Kirim Ulang
                </Text>
              )}
            </CContainer>
          </>
        )}
      </form>
    </>
  );
}
