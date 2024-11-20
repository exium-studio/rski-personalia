import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { Dispatch } from "react";
import * as yup from "yup";
import useRenderTrigger from "../../../hooks/useRenderTrigger";
import backOnClose from "../../../lib/backOnClose";
import formatDate from "../../../lib/formatDate";
import req from "../../../lib/req";
import DatePickerModal from "../../dependent/input/DatePickerModal";
import StringInput from "../../dependent/input/StringInput";
import Textarea from "../../dependent/input/Textarea";
import RequiredForm from "../RequiredForm";
import MultiSelectKaryawanWithUnitKerja from "../../dependent/_Select/MultiSelectKaryawanWithUnitKerja";

interface Props {
  data: any;
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
      tgl_mulai: new Date(formatDate(data.tgl_mulai, "iso")),
      tgl_berakhir: new Date(formatDate(data.tgl_berakhir, "iso")),
      user_id: data.user?.map((item: any) => ({
        value: item.id,
        label: item.nama,
      })),
    },
    validationSchema: yup.object().shape({
      judul: yup.string().required("Judul harus diisi"),
      konten: yup.string().required("Harus diisi"),
      tgl_mulai: yup.string().required("Harus diisi"),
      tgl_berakhir: yup.string().required("Harus diisi"),
      user_id: yup.array().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        judul: values.judul,
        konten: values.konten,
        tgl_mulai: formatDate(values.tgl_mulai, "short"),
        tgl_berakhir: formatDate(values.tgl_berakhir, "short"),
        user_id: values?.user_id?.map((user: any) => user.value),
        _method: "patch",
      };
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
            backOnClose();
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
    <form id="updatePengumumanForm" onSubmit={formik.handleSubmit}>
      <FormControl mb={4} isInvalid={!!formik.errors.user_id}>
        <FormLabel>
          Karyawan Penerima
          <RequiredForm />
        </FormLabel>
        <MultiSelectKaryawanWithUnitKerja
          name="user_id"
          placeholder="Karyawan Penerima"
          onConfirm={(input) => {
            formik.setFieldValue("user_id", input);
          }}
          inputValue={formik.values.user_id}
          optionsDisplay="chip"
          isError={!!formik.errors.user_id}
        />
        <FormErrorMessage>{formik.errors.user_id as string}</FormErrorMessage>
      </FormControl>

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
        <FormErrorMessage>{formik.errors.judul as string}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4} isInvalid={!!formik.errors.tgl_mulai}>
        <FormLabel>
          Tanggal Mulai
          <RequiredForm />
        </FormLabel>
        <DatePickerModal
          id="tambah-pengumuman"
          name="tgl_mulai"
          onConfirm={(input) => {
            formik.setFieldValue("tgl_mulai", input);
          }}
          inputValue={formik.values.tgl_mulai}
        />
        <FormErrorMessage>{formik.errors.tgl_mulai as string}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4} isInvalid={formik.errors.tgl_berakhir ? true : false}>
        <FormLabel>
          Tanggal Berakhir
          <RequiredForm />
        </FormLabel>
        <DatePickerModal
          id={`tambah-pengumuman-${data.id}`}
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
        <FormErrorMessage>{formik.errors.konten as string}</FormErrorMessage>
      </FormControl>
    </form>
  );
}
