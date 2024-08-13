import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { Dispatch, MutableRefObject } from "react";
import * as yup from "yup";
import req from "../../../constant/req";
import useRenderTrigger from "../../../global/useRenderTrigger";
import DatePickerModal from "../../dependent/input/DatePickerModal";
import StringInput from "../../dependent/input/StringInput";
import Textarea from "../../dependent/input/Textarea";
import RequiredForm from "../RequiredForm";
import formatDate from "../../../lib/formatDate";

interface Props {
  forwardRef: MutableRefObject<null>;
  setLoading: Dispatch<boolean>;
}

export default function FormDashboardBuatPengumuman({
  forwardRef,
  setLoading,
}: Props) {
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      judul: "",
      pengumuman: "",
      tgl_berakhir: undefined as any,
    },
    validationSchema: yup.object().shape({
      judul: yup.string().required("Judul harus diisi"),
      pengumuman: yup.string().required("Pengumuman harus diisi"),
      tgl_berakhir: yup.string().required("Pengumuman harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        judul: values.judul,
        konten: values.pengumuman,
        tgl_berakhir: formatDate(values.tgl_berakhir, "short"),
      };
      console.log(payload);
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengumuman`, payload)
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

      <FormControl mb={4} isInvalid={formik.errors.tgl_berakhir ? true : false}>
        <FormLabel>
          Tanggal Berakhir
          <RequiredForm />
        </FormLabel>
        <DatePickerModal
          id="tambah-pengumuman"
          name="tgl_berakhir"
          onConfirm={(input) => {
            formik.setFieldValue("tgl_berakhir", input);
          }}
          inputValue={formik.values.tgl_berakhir}
        />
        <FormErrorMessage>
          {formik.errors.tgl_berakhir as string}
        </FormErrorMessage>
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
