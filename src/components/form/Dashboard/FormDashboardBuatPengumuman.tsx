import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { Dispatch, MutableRefObject } from "react";
import * as yup from "yup";
import req from "../../../lib/req";
import useRenderTrigger from "../../../hooks/useRenderTrigger";
import DatePickerModal from "../../dependent/input/DatePickerModal";
import StringInput from "../../dependent/input/StringInput";
import Textarea from "../../dependent/input/Textarea";
import RequiredForm from "../RequiredForm";
import formatDate from "../../../lib/formatDate";
import backOnClose from "../../../lib/backOnClose";
import MultiSelectKaryawanWithUnitKerja from "../../dependent/_Select/MultiSelectKaryawanWithUnitKerja";

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
      konten: "",
      tgl_mulai: undefined as any,
      tgl_berakhir: undefined as any,
      user_id: [] as any[],
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
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengumuman`, payload)
        .then((r) => {
          if (r.status === 201) {
            toast({
              status: "success",
              title: r.data.message,
              isClosable: true,
              position: "bottom-right",
            });
            setRt(!rt);
            resetForm();
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

  // console.log("formik", formik.values.user_id);

  return (
    <form id="buatPengumumanForm" onSubmit={formik.handleSubmit}>
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

      <FormControl mb={4} isInvalid={!!formik.errors.judul}>
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

      <FormControl mb={4} isInvalid={!!formik.errors.tgl_berakhir}>
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

      <FormControl isInvalid={!!formik.errors.konten}>
        <FormLabel>
          Pengumuman
          <RequiredForm />
        </FormLabel>
        <Textarea
          name="konten"
          placeholder="isi konten"
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
