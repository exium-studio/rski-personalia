import { useFormik } from "formik";
import { Pengumuman__Interface } from "../../../constant/interfaces";
import * as yup from "yup";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import RequiredForm from "../RequiredForm";
import Textarea from "../../dependent/input/Textarea";

interface Props {
  data: Pengumuman__Interface;
}

export default function FormDashboardUpdatePengumuman({ data }: Props) {
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { judul: data.judul, konten: data.konten },
    validationSchema: yup.object().shape({
      judul: yup.string().required("Judul harus diisi"),
      konten: yup.string().required("Pengumuman harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);

      //TODO api update pengumuman
    },
  });

  return (
    <form id="updatePengumumanForm" onSubmit={formik.handleSubmit}>
      <FormControl mb={4} isInvalid={formik.errors.judul ? true : false}>
        <FormLabel>
          Judul
          <RequiredForm />
        </FormLabel>
        <Input
          name="judul"
          placeholder="Judul Pengumuman"
          onChange={formik.handleChange}
          value={formik.values.judul}
        />
        <FormErrorMessage>{formik.errors.judul}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={formik.errors.konten ? true : false}>
        <FormLabel>
          Pengumuman
          <RequiredForm />
        </FormLabel>
        <Textarea
          name="konten"
          placeholder="Isi pengumuman"
          onChangeSetter={(input) => {
            formik.setFieldValue("konten", input);
          }}
          inputValue={formik.values.konten}
        />
        <FormErrorMessage>{formik.errors.konten}</FormErrorMessage>
      </FormControl>
    </form>
  );
}
