import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { Dispatch } from "react";
import * as yup from "yup";
import SelectJabatan from "../../components/dependent/_Select/SelectJabatan";
import SelectKelompokGaji from "../../components/dependent/_Select/SelectKelompokGaji";
import SelectKompetensi from "../../components/dependent/_Select/SelectKompetensi";
import SelectPotongan from "../../components/dependent/_Select/SelectPotongan";
import SelectPtkp from "../../components/dependent/_Select/SelectPtkp";
import SelectRole from "../../components/dependent/_Select/SelectRole";
import SelectStatusKaryawan from "../../components/dependent/_Select/SelectStatusKaryawan";
import SelectUnitKerja from "../../components/dependent/_Select/SelectUnitKerja";
import DatePickerModal from "../../components/dependent/input/DatePickerModal";
import RequiredForm from "../../components/form/RequiredForm";

const validationSchemaStep1 = yup.object({
  // nama_karyawan: yup.string().required("Harus diisi"),
  // email: yup.string().email("Email tidak valid").required("Harus diisi"),
  // no_rm: yup.string().required("Harus diisi"),
  // no_manulife: yup.string().required("Harus diisi"),
  // tgl_masuk: yup.string().required("Harus diisi"),
  // status_karyawan: yup.string().required("Harus diisi"),
  // unit_kerja: yup.string().required("Harus diisi"),
  // jabatan: yup.string().required("Harus diisi"),
  // kompetensi: yup.string(),
  // role: yup.string().required("Harus diisi"),
});

const validationSchemaStep2 = yup.object({
  kelompok_gaji: yup.mixed().required("Harus diisi"),
  no_rekening: yup.string().required("Harus diisi"),
  tunjangan_uang_lembur: yup.string().required("Harus diisi"),
  tunjangan_fungsional: yup.string().required("Harus diisi"),
  tunjangan_khusus: yup.string().required("Harus diisi"),
  tunjangan_lainnya: yup.string().required("Harus diisi"),
  uang_lembur: yup.string().required("Harus diisi"),
  uang_makan: yup.string().required("Harus diisi"),
  ptkp: yup.mixed().required("Harus diisi"),
  potongan: yup.array(),
});

const validationSchema = [validationSchemaStep1, validationSchemaStep2];

interface Props {
  activeStep: number;
  setActiveStep: Dispatch<number>;
  data: any;
}

export default function EditKaryawanForm({
  activeStep,
  setActiveStep,
  data,
}: Props) {
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama_karyawan: data.user.nama,
      email: data.email,
      no_rm: data.no_rm,
      no_manulife: data.no_manulife,
      tgl_masuk: data.tgl_masuk,
      status_karyawan: {
        value: data.status_karyawan.id,
        label: data.status_karyawan.label,
      },
      unit_kerja: {
        value: data.unit_kerja.id,
        label: data.unit_kerja.nama_unit,
      },
      jabatan: {
        value: data.jabatan.id,
        label: data.jabatan.nama_jabatan,
      },
      kompetensi: {
        value: data.kompetensi.id,
        label: data.kompetensi.nama_kompetensi,
      },
      role: {
        value: data.role.id,
        label: data.role.name,
      },
      kelompok_gaji: {
        value: data.kelompok_gaji.id,
        label: data.kelompok_gaji.nama_kelompok,
      },
      no_rekening: data.no_rekening,
      tunjangan_uang_lembur: data.uang_lembur,
      tunjangan_fungsional: data.tunjangan_fungsional,
      tunjangan_khusus: data.tunjangan_khusus,
      tunjangan_lainnya: data.tunjangan_lainnya,
      uang_lembur: data.uang_lembur,
      uang_makan: data.uang_makan,
      ptkp: {
        value: data.ptkp.id,
        label: data.ptkp.kode_ptkp,
      },
      potongan: data.potongan?.map((potongan: any) => ({
        value: potongan.id,
        label: potongan.nama_potongan,
      })),
    },
    validationSchema: validationSchema[activeStep],
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      //TODO api post tambah karyawan step 1
    },
  });

  const handleNext = () => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        setActiveStep(activeStep + 1);
      } else {
        const touchedErrors: Record<string, boolean> = {};
        Object.keys(errors).forEach((key) => {
          touchedErrors[key] = true;
        });
        formik.setTouched(touchedErrors);
      }
    });
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const Step1 = () => {
    return (
      <SimpleGrid columns={[1, 2, 3]} spacingX={4}>
        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.nama_karyawan}
        >
          <FormLabel>
            Nama Karyawan
            <RequiredForm />
          </FormLabel>
          <Input
            name="nama_karyawan"
            placeholder="Jolitos Kurniawan"
            onChange={formik.handleChange}
            value={formik.values.nama_karyawan}
          />
          <FormErrorMessage>
            {formik.errors.nama_karyawan as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.email}
        >
          <FormLabel>
            Email
            <RequiredForm />
          </FormLabel>
          <Input
            name="email"
            placeholder="jolitos@gmail.com"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          <FormHelperText opacity={0.4}>
            Email ini digunakan untuk masuk (login)
          </FormHelperText>
          <FormErrorMessage>{formik.errors.email as string}</FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.no_rm}
        >
          <FormLabel>
            RM
            <RequiredForm />
          </FormLabel>
          <Input
            name="no_rm"
            placeholder="871***"
            onChange={formik.handleChange}
            value={formik.values.no_rm}
          />
          <FormErrorMessage>{formik.errors.no_rm as string}</FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.no_manulife}
        >
          <FormLabel>
            No. Manulife
            <RequiredForm />
          </FormLabel>
          <Input
            name="no_manulife"
            placeholder="019***"
            onChange={formik.handleChange}
            value={formik.values.no_manulife}
          />
          <FormErrorMessage>
            {formik.errors.no_manulife as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.tgl_masuk}
        >
          <FormLabel>
            Tanggal Masuk
            <RequiredForm />
          </FormLabel>
          <DatePickerModal
            id="edit-karyawan-date-picker"
            name="tgl_masuk"
            placeholder="Pilih Tanggal Masuk"
            onConfirm={(input) => {
              formik.setFieldValue("tgl_masuk", input);
            }}
            inputValue={
              formik.values.tgl_masuk
                ? new Date(formik.values.tgl_masuk)
                : undefined
            }
          />
          <FormErrorMessage>
            {formik.errors.tgl_masuk as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.status_karyawan}
        >
          <FormLabel>
            Status Kepegawaian
            <RequiredForm />
          </FormLabel>
          <SelectStatusKaryawan
            name="status_karyawan"
            onConfirm={(input) => {
              formik.setFieldValue("status_karyawan", input);
            }}
            inputValue={formik.values.status_karyawan}
          />
          <FormErrorMessage>
            {formik.errors.unit_kerja as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.unit_kerja}
        >
          <FormLabel>
            Unit Kerja
            <RequiredForm />
          </FormLabel>
          <SelectUnitKerja
            name="unit_kerja"
            onConfirm={(input) => {
              formik.setFieldValue("unit_kerja", input);
            }}
            inputValue={formik.values.unit_kerja}
            withSearch
          />
          <FormErrorMessage>
            {formik.errors.unit_kerja as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.jabatan}
        >
          <FormLabel>
            Jabatan
            <RequiredForm />
          </FormLabel>
          <SelectJabatan
            name="jabatan"
            onConfirm={(input) => {
              formik.setFieldValue("jabatan", input);
            }}
            inputValue={formik.values.jabatan}
            withSearch
          />
          <FormErrorMessage>
            {formik.errors.jabatan as string as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.kompetensi}
        >
          <FormLabel>Kompetensi Profesi</FormLabel>
          <SelectKompetensi
            name="kompetensi"
            onConfirm={(input) => {
              formik.setFieldValue("kompetensi", input);
            }}
            inputValue={formik.values.kompetensi}
            withSearch
          />
          <FormHelperText opacity={0.4}>
            Kosongkan jika tidak memiliki kompetensi
          </FormHelperText>
          <FormErrorMessage>
            {formik.errors.kompetensi as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl mb={4} flex={"1 1 300px"} isInvalid={!!formik.errors.role}>
          <FormLabel>
            Role
            <RequiredForm />
          </FormLabel>
          <SelectRole
            name="role"
            onConfirm={(input) => {
              formik.setFieldValue("role", input);
            }}
            inputValue={formik.values.role}
          />
          <FormErrorMessage>
            {formik.errors.role as string as string}
          </FormErrorMessage>
        </FormControl>
      </SimpleGrid>
    );
  };

  const Step1Footer = () => {
    return (
      <Box mt={"auto"} pt={4}>
        <Button
          w={"100%"}
          flexShrink={0}
          colorScheme="ap"
          className="btn-ap clicky"
          h={"50px"}
          onClick={handleNext}
        >
          Lanjut
        </Button>
      </Box>
    );
  };

  const Step2 = () => {
    return (
      <SimpleGrid columns={[1, 2, 3]} spacingX={4}>
        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.kelompok_gaji}
        >
          <FormLabel>
            Kelompok Gaji
            <RequiredForm />
          </FormLabel>
          <SelectKelompokGaji
            name="kelompok_gaji"
            onConfirm={(input) => {
              formik.setFieldValue("kelompok_gaji", input);
            }}
            inputValue={formik.values.kelompok_gaji}
            withSearch
          />
          <FormErrorMessage>
            {formik.errors.kelompok_gaji as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.no_rekening}
        >
          <FormLabel>
            Nomor Rekening
            <RequiredForm />
          </FormLabel>
          <Input
            name="no_rekening"
            placeholder="09182*****"
            onChange={formik.handleChange}
            value={formik.values.no_rekening}
          />
          <FormErrorMessage>
            {formik.errors.no_rekening as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.tunjangan_uang_lembur}
        >
          <FormLabel>
            Tunjangan Uang Lembur
            <RequiredForm />
          </FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Text>Rp</Text>
            </InputLeftElement>
            <Input
              name="tunjangan_uang_lembur"
              placeholder="Rp. 500.000"
              onChange={formik.handleChange}
              value={formik.values.tunjangan_uang_lembur}
            />
          </InputGroup>
          <FormErrorMessage>
            {formik.errors.tunjangan_uang_lembur as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.tunjangan_fungsional}
        >
          <FormLabel>
            Tunjangan Fungsional
            <RequiredForm />
          </FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Text>Rp</Text>
            </InputLeftElement>
            <Input
              name="tunjangan_fungsional"
              placeholder="Rp. 500.000"
              onChange={formik.handleChange}
              value={formik.values.tunjangan_fungsional}
            />
          </InputGroup>
          <FormErrorMessage>
            {formik.errors.tunjangan_fungsional as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.tunjangan_khusus}
        >
          <FormLabel>
            Tunjangan Khusus
            <RequiredForm />
          </FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Text>Rp</Text>
            </InputLeftElement>
            <Input
              name="tunjangan_khusus"
              placeholder="Rp. 500.000"
              onChange={formik.handleChange}
              value={formik.values.tunjangan_khusus}
            />
          </InputGroup>
          <FormErrorMessage>
            {formik.errors.tunjangan_khusus as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.tunjangan_lainnya}
        >
          <FormLabel>
            Tunjangan Lainnya
            <RequiredForm />
          </FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Text>Rp</Text>
            </InputLeftElement>
            <Input
              name="tunjangan_lainnya"
              placeholder="Rp. 500.000"
              onChange={formik.handleChange}
              value={formik.values.tunjangan_lainnya}
            />
          </InputGroup>
          <FormErrorMessage>
            {formik.errors.tunjangan_lainnya as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.uang_lembur}
        >
          <FormLabel>
            Uang Lembur
            <RequiredForm />
          </FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Text>Rp</Text>
            </InputLeftElement>
            <Input
              name="uang_lembur"
              placeholder="Rp. 500.000"
              onChange={formik.handleChange}
              value={formik.values.uang_lembur}
            />
          </InputGroup>
          <FormErrorMessage>
            {formik.errors.uang_lembur as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.uang_makan}
        >
          <FormLabel>
            Uang Makan
            <RequiredForm />
          </FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Text>Rp</Text>
            </InputLeftElement>
            <Input
              name="uang_makan"
              placeholder="Rp. 500.000"
              onChange={formik.handleChange}
              value={formik.values.uang_makan}
            />
          </InputGroup>
          <FormErrorMessage>
            {formik.errors.uang_makan as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl mb={4} flex={"1 1 300px"} isInvalid={!!formik.errors.ptkp}>
          <FormLabel>
            PTKP
            <RequiredForm />
          </FormLabel>
          <SelectPtkp
            name="ptkp"
            onConfirm={(input) => {
              formik.setFieldValue("ptkp", input);
            }}
            inputValue={formik.values.ptkp}
          />
          <FormErrorMessage>
            {formik.errors.ptkp as string as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl mb={4} flex={"1 1 300px"} isInvalid={!!formik.errors.ptkp}>
          <FormLabel>
            Potongan
            <RequiredForm />
          </FormLabel>
          <SelectPotongan
            name="potongan"
            onConfirm={(input) => {
              formik.setFieldValue("potongan", input);
            }}
            inputValue={formik.values.potongan}
            withSearch
          />
          <FormErrorMessage>
            {formik.errors.potongan as string}
          </FormErrorMessage>
        </FormControl>
      </SimpleGrid>
    );
  };

  const Step2Footer = () => {
    return (
      <ButtonGroup flexShrink={0} mt={"auto"} pt={4} w={"100%"}>
        <Button
          w={"100%"}
          className="btn-solid clicky"
          h={"50px"}
          onClick={handleBack}
        >
          Sebelumnya
        </Button>
        <Button
          w={"100%"}
          colorScheme="ap"
          className="btn-ap clicky"
          h={"50px"}
          type="submit"
          form="editKaryawanForm"
        >
          Simpan
        </Button>
      </ButtonGroup>
    );
  };

  const stepComponents = [Step1, Step2];
  const stepFooterComponents = [Step1Footer, Step2Footer];

  return (
    <>
      <form id="editKaryawanForm" onSubmit={formik.handleSubmit}>
        {stepComponents[activeStep]()}
      </form>

      {stepFooterComponents[activeStep]()}
    </>
  );
}
