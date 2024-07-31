import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import RequiredForm from "../../components/form/RequiredForm";
import PasswordInput from "../../components/input/PasswordInput";
import CContainer from "../../components/wrapper/CContainer";
import { useBodyColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";

export default function PengaturanUbahKataSandi() {
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      password_lama: "",
      password_baru: "",
      konfirmasi_password_baru: "",
    },
    validationSchema: yup.object().shape({
      password_lama: yup.string().required("Harus diisi"),
      password_baru: yup.string().required("Harus diisi"),
      konfirmasi_password_baru: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      //TODO api simpan password baru
      console.log(values);
    },
  });

  return (
    <CContainer
      p={responsiveSpacing}
      bg={useBodyColor()}
      borderRadius={12}
      flex={"1 1 600px"}
      h={"100%"}
    >
      <form id="ubahKataSandiForm" onSubmit={formik.handleSubmit}>
        {/* <Text fontSize={20} fontWeight={600} mb={responsiveSpacing}>
                Ubah Kata Sandi
              </Text> */}

        <FormControl
          mb={4}
          isInvalid={formik.errors.password_lama ? true : false}
        >
          <FormLabel>
            Kata Sandi Lama
            <RequiredForm />
          </FormLabel>
          <PasswordInput
            name="password_lama"
            placeholder="Masukkan kata sandi lama"
            formik={formik}
          />
          <FormErrorMessage>
            {formik.errors.password_lama as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          isInvalid={formik.errors.password_baru ? true : false}
        >
          <FormLabel>
            Kata Sandi Baru
            <RequiredForm />
          </FormLabel>
          <PasswordInput
            name="password_baru"
            placeholder="Masukkan kata sandi baru"
            formik={formik}
          />
          <FormErrorMessage>
            {formik.errors.password_baru as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={responsiveSpacing}
          isInvalid={formik.errors.konfirmasi_password_baru ? true : false}
        >
          <FormLabel>
            Konfirmasi Kata Sandi Baru
            <RequiredForm />
          </FormLabel>
          <PasswordInput
            name="konfirmasi_password_baru"
            placeholder="Masukkan lagi kata sandi baru untuk konfirmasi"
            formik={formik}
          />
          <FormErrorMessage>
            {formik.errors.konfirmasi_password_baru as string}
          </FormErrorMessage>
        </FormControl>
      </form>

      <Button
        mt={"auto"}
        ml={"auto"}
        w={"120px"}
        className="btn-ap clicky"
        colorScheme="ap"
        type="submit"
        form="ubahKataSandiForm"
      >
        Simpan
      </Button>
    </CContainer>
  );
}
