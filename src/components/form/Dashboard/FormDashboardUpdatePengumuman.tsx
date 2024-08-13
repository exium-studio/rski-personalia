import { useFormik } from "formik";
import { Pengumuman__Interface } from "../../../constant/interfaces";
import * as yup from "yup";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import RequiredForm from "../RequiredForm";
import Textarea from "../../dependent/input/Textarea";
import { Dispatch } from "react";
import req from "../../../constant/req";
import formatDate from "../../../lib/formatDate";
import useRenderTrigger from "../../../global/useRenderTrigger";

interface Props {
  data: Pengumuman__Interface;
  setLoading: Dispatch<boolean>;
}

export default function FormDashboardUpdatePengumuman({
  data,
  setLoading,
}: Props) {
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      judul: data.judul,
      konten: data.konten,
      tgl_berakhir: data.tgl_berakhir,
    },
    validationSchema: yup.object().shape({
      judul: yup.string().required("Judul harus diisi"),
      konten: yup.string().required("Pengumuman harus diisi"),
      tgl_berakhir: yup.string().required("Pengumuman harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        judul: values.judul,
        konten: values.konten,
        tgl_berakhir: formatDate(values.tgl_berakhir, "short"),
        _method: "patch",
      };
      console.log(payload);
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengumuman/${data.id}`, payload)
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
