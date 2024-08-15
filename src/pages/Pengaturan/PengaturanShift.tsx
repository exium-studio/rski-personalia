import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import StringInput from "../../components/dependent/input/StringInput";
import TimePickerModal from "../../components/dependent/input/TimePickerModal";
import RequiredForm from "../../components/form/RequiredForm";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import { useState } from "react";
import useRenderTrigger from "../../global/useRenderTrigger";
import req from "../../constant/req";

export default function PengaturanShift() {
  // SX
  const lightDarkColor = useLightDarkColor();

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama: "",
      jam_kerja: "",
    },
    validationSchema: yup.object().shape({
      nama: yup.string().required("Harus diisi"),
      jam_kerja: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama: values.nama,
        jam_kerja: values.jam_kerja,
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/shift`, payload)
        .then((r) => {
          if (r.status === 200) {
            toast({
              status: "success",
              title: r.data.message,
              isClosable: true,
              position: "bottom-right",
            });
            setRt(!rt);
            resetForm();
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

  return (
    <CContainer
      p={responsiveSpacing}
      pb={responsiveSpacing}
      bg={lightDarkColor}
      borderRadius={12}
      flex={"1 1 600px"}
      h={"100%"}
      overflowY={"auto"}
    >
      <form id="jamKerjaNonShiftForm">
        <FormControl mb={4} isInvalid={!!formik.errors.jam_kerja}>
          <FormLabel>
            Nama
            <RequiredForm />
          </FormLabel>
          <StringInput
            name="nama"
            onChangeSetter={(input) => {
              formik.setFieldValue("nama", input);
            }}
            inputValue={formik.values.nama}
            placeholder="Nama Jam Kerja"
          />
          <FormErrorMessage>
            {formik.errors.jam_kerja as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl mb={4} isInvalid={!!formik.errors.jam_kerja}>
          <FormLabel>
            Jam Kerja
            <RequiredForm />
          </FormLabel>
          <TimePickerModal
            id="create-jam-kerja-non-shift-modal"
            name="jam_kerja"
            onConfirm={(input) => {
              formik.setFieldValue("jam_kerja", input);
            }}
            inputValue={formik.values.jam_kerja}
            isError={!!formik.errors.jam_kerja}
          />
          <FormErrorMessage>
            {formik.errors.jam_kerja as string}
          </FormErrorMessage>
        </FormControl>
      </form>

      <Button
        className="btn-ap clicky"
        colorScheme="ap"
        ml={"auto"}
        mt={"auto"}
        type="submit"
        form="jamKerjaNonShiftForm"
        isLoading={loading}
      >
        Simpan
      </Button>
    </CContainer>
  );
}
