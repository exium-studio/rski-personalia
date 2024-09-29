import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { Dispatch, MutableRefObject } from "react";
import * as yup from "yup";
import useRenderTrigger from "../../../hooks/useRenderTrigger";
import backOnClose from "../../../lib/backOnClose";
import req from "../../../lib/req";
import MultiSelectKaryawanWithUnitKerja from "../../dependent/_Select/MultiSelectKaryawanWithUnitKerja";
import RequiredForm from "../RequiredForm";
import SelectKategoriTagihan from "../../dependent/_Select/SelectKategoriTagihan";
import NumberInput from "../../dependent/input/NumberInput";
import PeriodPickerModal from "../../dependent/input/PeriodPickerModal";
import formatDate from "../../../lib/formatDate";

interface Props {
  forwardRef: MutableRefObject<null>;
  setLoading: Dispatch<boolean>;
}

export default function FormBuatTagihan({ forwardRef, setLoading }: Props) {
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      user_id: [] as any[],
      kategori: "" as any,
      besaran: undefined as any,
      bulan_mulai: "" as any,
      bulan_selesai: "" as any,
    },
    validationSchema: yup.object().shape({
      user_id: yup.array().required("Harus diisi"),
      kategori: yup.object().required("Harus diisi"),
      besaran: yup.number().required("Harus diisi"),
      bulan_mulai: yup.string().required("Harus diisi"),
      bulan_selesai: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        user_id: values?.user_id?.map((user: any) => user.value),
        kategori_tagihan_id: values?.kategori?.value,
        besaran: values?.besaran,
        bulan_mulai: formatDate(values?.bulan_mulai, "short"),
        bulan_selesai: formatDate(values?.bulan_selesai, "short"),
      };

      setLoading(true);
      req
        .post(`/api/rski/dashboard/keuangan/tagihan-potongan`, payload)
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

      <FormControl mb={4} isInvalid={!!formik.errors.kategori}>
        <FormLabel>
          Kategori
          <RequiredForm />
        </FormLabel>
        <SelectKategoriTagihan
          name="kategori"
          placeholder="Kategori"
          onConfirm={(input) => {
            formik.setFieldValue("kategori", input);
          }}
          inputValue={formik.values.kategori}
          isError={!!formik.errors.kategori}
        />
        <FormErrorMessage>{formik.errors.kategori as string}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4} isInvalid={!!formik.errors.besaran}>
        <FormLabel>
          Besaran
          <RequiredForm />
        </FormLabel>
        <NumberInput
          name="besaran"
          onChangeSetter={(input) => {
            formik.setFieldValue("besaran", input);
          }}
          inputValue={formik.values.besaran}
        />
        <FormErrorMessage>{formik.errors.besaran as string}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4} isInvalid={!!formik.errors.bulan_mulai}>
        <FormLabel>
          Periode Mulai
          <RequiredForm />
        </FormLabel>
        <PeriodPickerModal
          id="form-buat-tagihan"
          name="bulan_mulai"
          onConfirm={(input) => {
            formik.setFieldValue("bulan_mulai", input);
          }}
          inputValue={formik.values.bulan_mulai}
        />
        <FormErrorMessage>
          {formik.errors.bulan_mulai as string}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!formik.errors.bulan_selesai}>
        <FormLabel>
          Periode Selesai
          <RequiredForm />
        </FormLabel>
        <PeriodPickerModal
          id="form-buat-tagihan"
          name="bulan_selesai"
          onConfirm={(input) => {
            formik.setFieldValue("bulan_selesai", input);
          }}
          inputValue={formik.values.bulan_selesai}
        />
        <FormErrorMessage>
          {formik.errors.bulan_selesai as string}
        </FormErrorMessage>
      </FormControl>
    </form>
  );
}
