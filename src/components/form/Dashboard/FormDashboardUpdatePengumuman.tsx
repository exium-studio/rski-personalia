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
    initialValues: { judul: data.judul, pengumuman: data.pengumuman },
    validationSchema: yup.object().shape({
      judul: yup.string().required("Judul harus diisi"),
      pengumuman: yup.string().required("Pengumuman harus diisi"),
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

      <FormControl isInvalid={formik.errors.pengumuman ? true : false}>
        <FormLabel>
          Pengumuman
          <RequiredForm />
        </FormLabel>
        <Textarea
          name="pengumuman"
          placeholder="Isi pengumuman"
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
