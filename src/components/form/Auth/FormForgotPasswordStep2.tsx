import {
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
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import backOnClose from "../../../lib/backOnClose";
import req from "../../../lib/req";
import CContainer from "../../wrapper/CContainer";

export default function FormForgotPasswordStep2() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();

  const { email } = useParams();

  const formik = useFormik({
    validateOnChange: false,

    initialValues: {
      otp: "",
    },

    validationSchema: yup.object().shape({
      otp: yup.string().required("Harus diisi"),
    }),

    onSubmit: (values) => {
      setLoading(true);

      const payload = {
        email: email,
        kode_otp: values.otp,
      };

      req
        .post(`/api/forgot-password-verifyOtp`, payload)
        .then((r) => {
          if (r.status === 200) {
            navigate(`/forgot-password-3/${email}/${values.otp}`);
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

      <form id="verifOTPform" onSubmit={formik.handleSubmit}>
        <FormControl isInvalid={formik.errors.otp ? true : false} mb={4}>
          <HStack>
            <PinInput
              size={"lg"}
              isInvalid={!!formik.errors.otp}
              onChange={(input) => {
                formik.setFieldValue("otp", input);
              }}
            >
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
          form="verifOTPform"
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
          <Text
            color={"p.500"}
            w={"fit-content"}
            cursor={"pointer"}
            onClick={backOnClose}
          >
            Kirim Ulang
          </Text>
        </CContainer>
      </form>
    </>
  );
}
