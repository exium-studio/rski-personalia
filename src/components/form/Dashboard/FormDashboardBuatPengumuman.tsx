import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { useFormik } from "formik";
import { MutableRefObject } from "react";
import * as yup from "yup";
import StringInput from "../../dependent/input/StringInput";
import RequiredForm from "../RequiredForm";
import Textarea from "../../dependent/input/Textarea";

interface Props {
  forwardRef: MutableRefObject<null>;
}

export default function FormDashboardBuatPengumuman({ forwardRef }: Props) {
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { judul: "", pengumuman: "" },
    validationSchema: yup.object().shape({
      judul: yup.string().required("Judul harus diisi"),
      pengumuman: yup.string().required("Pengumuman harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);

      // TODO api create pengumuman
    },
  });

  return (
    <form id="buatPengumumanForm" onSubmit={formik.handleSubmit}>
      <FormControl mb={4} isInvalid={formik.errors.judul ? true : false}>
        <FormLabel>
          Judul
          <RequiredForm />
        </FormLabel>
        <StringInput
          name="judul"
          placeholder="Judul Pengumuman"
          onChangeSetter={(input) => {
            formik.setFieldValue("judul", input);
          }}
          inputValue={formik.values.judul}
        />
        <FormErrorMessage>{formik.errors.judul}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={formik.errors.pengumuman ? true : false}>
        <FormLabel>
          Pengumuman
          <RequiredForm />
        </FormLabel>
        <Textarea
          name="pengumuman"
          placeholder="isi pengumuman"
          onChangeSetter={(input) => {
            formik.setFieldValue("pengumuman", input);
          }}
          inputValue={formik.values.pengumuman}
        />
        <FormErrorMessage>{formik.errors.pengumuman}</FormErrorMessage>
      </FormControl>
    </form>
  );
}
