import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { Dispatch, useEffect, useState } from "react";
import * as yup from "yup";
import MultiselectPotongan from "../../components/dependent/_Select/MultiselectPotongan";
import SelectAgama from "../../components/dependent/_Select/SelectAgama";
import SelectGender from "../../components/dependent/_Select/SelectGender";
import SelectGoldar from "../../components/dependent/_Select/SelectGoldar";
import SelectJabatan from "../../components/dependent/_Select/SelectJabatan";
import SelectKelompokGaji from "../../components/dependent/_Select/SelectKelompokGaji";
import SelectKompetensi from "../../components/dependent/_Select/SelectKompetensi";
import SelectPendidikan from "../../components/dependent/_Select/SelectPendidikan";
import SelectPtkp from "../../components/dependent/_Select/SelectPtkp";
import SelectRole from "../../components/dependent/_Select/SelectRole";
import SelectStatusKaryawan from "../../components/dependent/_Select/SelectStatusKaryawan";
import SelectUnitKerja from "../../components/dependent/_Select/SelectUnitKerja";
import DatePickerModal from "../../components/dependent/input/DatePickerModal";
import NumberInput from "../../components/dependent/input/NumberInput";
import StringInput from "../../components/dependent/input/StringInput";
import Textarea from "../../components/dependent/input/Textarea";
import RequiredForm from "../../components/form/RequiredForm";
import useGetUserData from "../../hooks/useGetUserData";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import parseNumber from "../../lib/parseNumber";
import req from "../../lib/req";

interface Props {
  activeStep: number;
  setActiveStep: Dispatch<number>;
  data: any;
  loading: boolean;
  setLoading: Dispatch<boolean>;
}

export default function EditKaryawanForm({
  activeStep,
  setActiveStep,
  data,
  loading,
  setLoading,
}: Props) {
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();
  const userData = useGetUserData();
  const isUserSuperAdmin = userData?.role?.id === 1;

  const [noLimitStr, setNoLimitStr] = useState<boolean>(
    data?.masa_berlaku_str === null ? true : false
  );
  const [noLimitSip, setNoLimitSip] = useState<boolean>(
    data?.masa_berlaku_str === null ? true : false
  );

  useEffect(() => {
    setNoLimitStr(data?.masa_berlaku_str === null);
    setNoLimitSip(data?.masa_berlaku_sip === null);
  }, [data]);

  const validationSchemaStep1 = yup.object({
    nama_karyawan: yup.string().required("Harus diisi"),
    nik: yup.string().required("Harus diisi"),
    email: yup.string().email("Email tidak valid"),
    tgl_berakhir_pks: yup.string().required("Harus diisi"),
    no_rm: yup.string().required("Harus diisi"),
    no_manulife: yup.string(),
    tgl_masuk: yup.string().required("Harus diisi"),
    status_karyawan: yup.object().required("Harus diisi"),
    unit_kerja: yup.object().required("Harus diisi"),
    jabatan: yup.object().required("Harus diisi"),
    kompetensi: yup.object(),
    role: yup.object().required("Harus diisi"),
  });

  const validationSchemaStep2 = yup.object({
    kelompok_gaji: yup.object().required("Harus diisi"),
    no_rekening: yup.string().required("Harus diisi"),
    tunjangan_jabatan: yup.string().required("Harus diisi"),
    tunjangan_fungsional: yup.string().required("Harus diisi"),
    tunjangan_khusus: yup.string().required("Harus diisi"),
    tunjangan_lainnya: yup.string().required("Harus diisi"),
    uang_lembur: yup.string().required("Harus diisi"),
    uang_makan: yup.string().required("Harus diisi"),
    ptkp: yup.object().required("Harus diisi"),
    potongan: yup.array(),
  });

  const validationSchemaStep3 = yup.object({
    // tempat_lahir: yup.string().required("Harus diisi"),
    // tgl_lahir: yup.date().required("Harus diisi"),
    // no_hp: yup.string().required("Harus diisi"),
    // jenis_kelamin: yup.object().required("Harus diisi"),
    // nik_ktp: yup
    //   .string()
    //   .required("Harus diisi")
    //   .length(16, "Harus 16 karakter"),
    // no_kk: yup.string().required("Harus diisi").length(16, "Harus 16 karakter"),
    // agama: yup.object().required("Harus diisi"),
    // golongan_darah: yup.object().required("Harus diisi"),
    // tinggi_badan: yup.string().required("Harus diisi"),
    // berat_badan: yup.string().required("Harus diisi"),
    // alamat: yup.string().required("Harus diisi"),
    // no_ijazah: yup.string().required("Harus diisi"),
    // tahun_lulus: yup.string().required("Harus diisi"),
    // pendidikan_terakhir: yup.string().required("Harus diisi"),
    // asal_sekolah: yup.string().required("Harus diisi"),
    // gelar_depan: yup.mixed(),
    // gelar_belakang: yup.mixed(),
    // str: yup.string(),
    // masa_berlaku_str: noLimitStr ? yup.mixed() : yup.mixed(),
    // sip: yup.string(),
    // masa_berlaku_sip: noLimitSip ? yup.mixed() : yup.mixed(),
    // no_bpjsksh: yup.string().required("Harus diisi"),
    // no_bpjsktk: yup.string(),
    // npwp: yup.string().required("Harus diisi"),
  });

  const validationSchema = [
    validationSchemaStep1,
    validationSchemaStep2,
    validationSchemaStep3,
  ];

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama_karyawan: data?.user.nama,
      nik: data?.nik,
      email: data?.email || "",
      tgl_berakhir_pks:
        (new Date(
          formatDate(data?.tgl_berakhir_pks as string, "iso")
        ) as any) || undefined,
      no_rm: data?.no_rm as string,
      no_manulife: data?.no_manulife as string,
      tgl_masuk: new Date(formatDate(data?.tgl_masuk as string, "iso")) as any,
      tgl_diangkat: new Date(
        formatDate(data?.tgl_diangkat as string, "iso")
      ) as any,
      status_karyawan: {
        value: data?.status_karyawan?.id,
        label: data?.status_karyawan?.label,
      },
      unit_kerja: {
        value: data?.unit_kerja?.id,
        label: data?.unit_kerja?.nama_unit,
      },
      jabatan: {
        value: data?.jabatan?.id,
        label: data?.jabatan?.nama_jabatan,
      },
      kompetensi: data?.kompetensi
        ? {
            value: data?.kompetensi?.id,
            label: data?.kompetensi?.nama_kompetensi,
          }
        : undefined,
      role: data?.role
        ? {
            value: data?.role?.id,
            label: data?.role?.name,
          }
        : undefined,
      kelompok_gaji: {
        value: data?.kelompok_gaji?.id,
        label: data?.kelompok_gaji?.nama_kelompok,
        label2: `Rp ${formatNumber(data?.kelompok_gaji?.besaran_gaji)}`,
      },
      no_rekening: data?.no_rekening,
      tunjangan_jabatan: data?.tunjangan_jabatan,
      tunjangan_kompetensi: data?.kompetensi?.tunjangan_kompetensi,
      tunjangan_fungsional: data?.tunjangan_fungsional,
      tunjangan_khusus: data?.tunjangan_khusus,
      tunjangan_lainnya: data?.tunjangan_lainnya,
      uang_lembur: data?.uang_lembur,
      uang_makan: data?.uang_makan,
      ptkp: {
        value: data?.ptkp?.id,
        label: data?.ptkp?.kode_ptkp,
      },
      potongan: data?.potongan_gaji?.map((potongan: any) => ({
        value: potongan?.id,
        label: potongan?.nama_premi,
      })),
      tempat_lahir: data?.tempat_lahir,
      tgl_lahir: data?.tgl_lahir && new Date(data?.tgl_lahir),
      no_hp: data?.no_hp,
      jenis_kelamin: data?.jenis_kelamin
        ? {
            value: data?.jenis_kelamin,
            label: data?.jenis_kelamin === 1 ? "Laki - Laki" : "Perempuan",
          }
        : undefined,
      nik_ktp: data?.nik_ktp,
      no_kk: data?.no_kk,
      agama: data?.agama
        ? {
            value: data?.agama?.id,
            label: data?.agama?.label,
          }
        : undefined,
      golongan_darah: data?.golongan_darah
        ? {
            value: data?.golongan_darah?.id,
            label: data?.golongan_darah?.label,
          }
        : undefined,
      tinggi_badan: data?.tinggi_badan,
      berat_badan: data?.berat_badan,
      riwayat_penyakit: data?.riwayat_penyakit,
      alamat: data?.alamat,
      no_ijazah: data?.no_ijazah,
      tahun_lulus: data?.tahun_lulus,
      // pendidikan_terakhir: data?.pendidikan_terakhir || "",
      pendidikan_terakhir: data?.pendidikan_terakhir
        ? {
            value: data?.pendidikan_terakhir?.id,
            label: data?.pendidikan_terakhir?.label,
          }
        : undefined,
      asal_sekolah: data?.asal_sekolah || "",
      gelar_depan: data?.gelar_depan || "",
      gelar_belakang: data?.gelar_belakang || "",
      str: data?.no_str,
      masa_berlaku_str: data?.masa_berlaku_str
        ? new Date(data?.masa_berlaku_str)
        : undefined,
      sip: data?.no_sip,
      masa_berlaku_sip: data?.masa_berlaku_sip
        ? new Date(data?.masa_berlaku_sip)
        : undefined,
      no_bpjsksh: data?.no_bpjsksh,
      no_bpjsktk: data?.no_bpjsktk,
      npwp: data?.npwp,
    },

    validationSchema: validationSchema[activeStep],

    onSubmit: (values, { resetForm }) => {
      const payload = {
        _method: "patch",
        nama: values.nama_karyawan,
        nik: values.nik,
        email: values.email,
        tgl_berakhir_pks: formatDate(
          values.tgl_berakhir_pks as string,
          "short"
        ),
        no_rm: values.no_rm.toString(),
        no_manulife: values.no_manulife.toString(),
        tgl_masuk: formatDate(values.tgl_masuk as string, "short"),
        tgl_diangkat: formatDate(values.tgl_diangkat as string, "short"),
        status_karyawan_id: values.status_karyawan.value,
        unit_kerja_id: values.unit_kerja.value,
        jabatan_id: values.jabatan.value,
        kompetensi_id: values?.kompetensi?.value,
        role_id: values?.role?.value,
        kelompok_gaji_id: values.kelompok_gaji.value,
        no_rekening: values.no_rekening,
        tunjangan_jabatan: values.tunjangan_jabatan,
        tunjangan_fungsional: values.tunjangan_fungsional,
        tunjangan_khusus: values.tunjangan_khusus,
        tunjangan_lainnya: values.tunjangan_lainnya,
        uang_lembur: values.uang_lembur,
        uang_makan: values.uang_makan,
        ptkp_id: values.ptkp.value,
        premi_id: values.potongan?.map((pot: any) => pot.value),

        tempat_lahir: values?.tempat_lahir,
        tgl_lahir: formatDate(values?.tgl_lahir, "short"),
        no_hp: values?.no_hp,
        jenis_kelamin: values?.jenis_kelamin?.value,
        nik_ktp: values?.nik_ktp,
        no_kk: values?.no_kk,
        kategori_agama_id: values?.agama?.value,
        kategori_darah_id: values?.golongan_darah?.value,
        tinggi_badan: values?.tinggi_badan,
        berat_badan: values?.berat_badan,
        riwayat_penyakit: values?.riwayat_penyakit,
        alamat: values.alamat,
        no_ijazah: values.no_ijazah,
        tahun_lulus: values.tahun_lulus,
        pendidikan_terakhir: values.pendidikan_terakhir?.value || "",
        asal_sekolah: values.asal_sekolah || "",
        gelar_depan: values.gelar_depan || "",
        gelar_belakang: values.gelar_belakang || "",

        no_str: values?.str,
        masa_berlaku_str: values?.masa_berlaku_str || "",
        no_sip: values?.sip,
        masa_berlaku_sip: values?.masa_berlaku_sip || "",
        no_bpjsksh: values?.no_bpjsksh,
        no_bpjsktk: values?.no_bpjsktk,
        npwp: values?.npwp,
      };

      // console.log(payload);

      setLoading(true);
      req
        .post(`/api/rski/dashboard/karyawan/data-karyawan/${data.id}`, payload)
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

  // console.log(formik.values);

  const handleNext = () => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        if (isUserSuperAdmin ? activeStep === 2 : activeStep === 1) {
          formik.submitForm();
        } else {
          setActiveStep(activeStep + 1);
        }
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
      <SimpleGrid columns={[1, 2, null, 3]} spacingX={4}>
        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.nama_karyawan}
        >
          <FormLabel>
            Nama Karyawan
            <RequiredForm />
          </FormLabel>
          <StringInput
            name="nama_karyawan"
            placeholder="Jolitos Kurniawan"
            onChangeSetter={(input) => {
              formik.setFieldValue("nama_karyawan", input);
            }}
            inputValue={formik.values.nama_karyawan}
          />
          <FormErrorMessage>
            {formik.errors.nama_karyawan as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl mb={4} flex={"1 1 300px"} isInvalid={!!formik.errors.nik}>
          <FormLabel>
            No. Induk Karyawan
            <RequiredForm />
          </FormLabel>
          <StringInput
            name="nik"
            placeholder="Jolitos Kurniawan"
            onChangeSetter={(input) => {
              formik.setFieldValue("nik", input);
            }}
            inputValue={formik.values.nik}
          />
          <FormErrorMessage>{formik.errors.nik as string}</FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.email}
        >
          <FormLabel>
            Email
            {/* <RequiredForm /> */}
          </FormLabel>
          <StringInput
            name="email"
            placeholder="example@mail.com"
            onChangeSetter={(input) => {
              formik.setFieldValue("email", input);
            }}
            inputValue={formik.values.email}
          />
          <FormHelperText opacity={0.4}>
            Email ini digunakan untuk masuk ke RSKI Karyawan (login)
          </FormHelperText>
          <FormErrorMessage>{formik.errors.email as string}</FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.tgl_berakhir_pks}
        >
          <FormLabel>
            Tanggal Berakhir PKS
            <RequiredForm />
          </FormLabel>
          <DatePickerModal
            id="tambah-karyawan-date-picker"
            name="tgl_berakhir_pks"
            placeholder="Pilih Tanggal Berakhir PKS"
            onConfirm={(input) => {
              formik.setFieldValue("tgl_berakhir_pks", input);
            }}
            inputValue={
              formik.values.tgl_berakhir_pks
                ? new Date(formik.values.tgl_berakhir_pks)
                : undefined
            }
            isError={!!formik.errors.tgl_berakhir_pks}
          />
          <FormErrorMessage>
            {formik.errors.tgl_berakhir_pks as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.no_rm}
        >
          <FormLabel>
            No. Rekam Medis
            <RequiredForm />
          </FormLabel>
          <StringInput
            name="no_rm"
            placeholder="Jolitos Kurniawan"
            onChangeSetter={(input) => {
              formik.setFieldValue("no_rm", input);
            }}
            inputValue={formik.values.no_rm}
          />
          <FormErrorMessage>{formik.errors.no_rm}</FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.no_manulife}
        >
          <FormLabel>
            No. Manulife
            {/* <RequiredForm /> */}
          </FormLabel>
          <StringInput
            name="no_manulife"
            placeholder="Jolitos Kurniawan"
            onChangeSetter={(input) => {
              formik.setFieldValue("no_manulife", input);
            }}
            inputValue={formik.values.no_manulife}
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
            id="tambah-karyawan-date-picker"
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
            isError={!!formik.errors.tgl_masuk}
          />
          <FormErrorMessage>
            {formik.errors.tgl_masuk as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.tgl_diangkat}
        >
          <FormLabel>
            Tanggal Diangkat
            {/* <RequiredForm /> */}
          </FormLabel>
          <DatePickerModal
            id="tambah-karyawan-date-picker"
            name="tgl_diangkat"
            placeholder="Pilih Tanggal Diangkat"
            onConfirm={(input) => {
              formik.setFieldValue("tgl_diangkat", input);
            }}
            inputValue={
              formik.values.tgl_diangkat
                ? new Date(formik.values.tgl_diangkat)
                : undefined
            }
            isError={!!formik.errors.tgl_diangkat}
          />
          <FormErrorMessage>
            {formik.errors.tgl_diangkat as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.status_karyawan}
        >
          <FormLabel>
            Status Karyawan
            <RequiredForm />
          </FormLabel>
          <SelectStatusKaryawan
            name="status_karyawan"
            onConfirm={(input) => {
              formik.setFieldValue("status_karyawan", input);
            }}
            inputValue={formik.values.status_karyawan}
            isError={!!formik.errors.status_karyawan}
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
            isError={!!formik.errors.unit_kerja}
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
            isError={!!formik.errors.jabatan}
          />
          <FormErrorMessage>{formik.errors.jabatan as string}</FormErrorMessage>
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
            isError={!!formik.errors.kompetensi}
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
            Hak Akses (Role)
            <RequiredForm />
          </FormLabel>
          <SelectRole
            name="role"
            onConfirm={(input) => {
              formik.setFieldValue("role", input);
            }}
            inputValue={formik.values.role}
            isError={!!formik.errors.role}
          />
          <FormErrorMessage>{formik.errors.role as string}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>
    );
  };

  const Step1Footer = () => {
    return (
      <Box mt={"auto"} pt={4}>
        <Button
          w={"100%"}
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
      <SimpleGrid columns={[1, 2, null, 3]} spacingX={4}>
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
          isInvalid={!!formik.errors.tunjangan_jabatan}
        >
          <FormLabel>
            Tunjangan Jabatan
            <RequiredForm />
          </FormLabel>
          <InputGroup>
            <InputLeftElement pl={4}>
              <Text>Rp</Text>
            </InputLeftElement>
            <NumberInput
              pl={12}
              name="tunjangan_jabatan"
              placeholder="500.000"
              onChangeSetter={(input) => {
                formik.setFieldValue("tunjangan_jabatan", input);
              }}
              inputValue={formik.values.tunjangan_jabatan}
            />
          </InputGroup>
          {/* <FormHelperText>
            Tunjangan diambil dari master data jabatan
          </FormHelperText> */}
          <FormErrorMessage>
            {formik.errors.tunjangan_jabatan as string}
          </FormErrorMessage>
        </FormControl>

        {/*<FormControl
          mb={4}
          flex={"1 1 300px"}
          isInvalid={!!formik.errors.tunjangan_kompetensi}
        >
          <FormLabel>
            Tunjangan Kompetensi
            <RequiredForm />
          </FormLabel>
          <InputGroup>
            <InputLeftElement pl={4}>
              <Text>Rp</Text>
            </InputLeftElement>
            <NumberInput
              isReadOnly
              pl={12}
              name="tunjangan_kompetensi"
              placeholder="500.000"
              onChangeSetter={(input) => {
                formik.setFieldValue("tunjangan_kompetensi", input);
              }}
              inputValue={formik.values.tunjangan_kompetensi}
            />
          </InputGroup>
          <FormHelperText>
            Tunjangan diambil dari master data kompetensi
          </FormHelperText>
          <FormErrorMessage>
            {formik.errors.tunjangan_kompetensi as string}
          </FormErrorMessage>
        </FormControl> */}

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
            <InputLeftElement pl={4}>
              <Text>Rp</Text>
            </InputLeftElement>
            <NumberInput
              pl={12}
              name="tunjangan_fungsional"
              placeholder="500.000"
              onChangeSetter={(input) => {
                formik.setFieldValue("tunjangan_fungsional", input);
              }}
              inputValue={formik.values.tunjangan_fungsional}
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
            <InputLeftElement pl={4}>
              <Text>Rp</Text>
            </InputLeftElement>
            <NumberInput
              pl={12}
              name="tunjangan_khusus"
              placeholder="500.000"
              onChangeSetter={(input) => {
                formik.setFieldValue("tunjangan_khusus", input);
              }}
              inputValue={formik.values.tunjangan_khusus}
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
            <InputLeftElement pl={4}>
              <Text>Rp</Text>
            </InputLeftElement>
            <NumberInput
              pl={12}
              name="tunjangan_lainnya"
              placeholder="500.000"
              onChangeSetter={(input) => {
                formik.setFieldValue("tunjangan_lainnya", input);
              }}
              inputValue={formik.values.tunjangan_lainnya}
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
            <InputLeftElement pl={4}>
              <Text>Rp</Text>
            </InputLeftElement>
            <NumberInput
              pl={12}
              name="uang_lembur"
              placeholder="500.000"
              onChangeSetter={(input) => {
                formik.setFieldValue("uang_lembur", input);
              }}
              inputValue={formik.values.uang_lembur}
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
            Uang Makan per Hari
            <RequiredForm />
          </FormLabel>
          <InputGroup>
            <InputLeftElement pl={4}>
              <Text>Rp</Text>
            </InputLeftElement>
            <NumberInput
              pl={12}
              name="uang_makan"
              placeholder="500.000"
              onChangeSetter={(input) => {
                formik.setFieldValue("uang_makan", input);
              }}
              inputValue={formik.values.uang_makan}
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
          <FormErrorMessage>{formik.errors.ptkp as string}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4} flex={"1 1 300px"} isInvalid={!!formik.errors.ptkp}>
          <FormLabel>Potongan</FormLabel>
          <MultiselectPotongan
            name="potongan"
            onConfirm={(input) => {
              formik.setFieldValue("potongan", input);
            }}
            inputValue={formik.values.potongan}
            optionsDisplay="chip"
            // withSearch
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
      <ButtonGroup mt={"auto"} pt={4} w={"100%"}>
        <Button
          w={"100%"}
          className="btn-solid clicky"
          h={"50px"}
          onClick={handleBack}
        >
          Sebelumnya
        </Button>
        <Button
          type="submit"
          form="tambahKaryawanForm"
          w={"100%"}
          colorScheme="ap"
          className="btn-ap clicky"
          h={"50px"}
          onClick={handleNext}
          isLoading={loading}
        >
          {isUserSuperAdmin ? "Lanjut" : "Simpan"}
        </Button>
      </ButtonGroup>
    );
  };

  const Step3 = () => {
    return (
      <>
        <SimpleGrid columns={[1, 2, null, 3]} spacingX={4}>
          <FormControl mb={4} isInvalid={!!formik.errors.tempat_lahir}>
            <FormLabel>
              Tempat Lahir
              {/* <RequiredForm /> */}
            </FormLabel>
            <StringInput
              name="tempat_lahir"
              placeholder="Semarang"
              onChangeSetter={(input) => {
                formik.setFieldValue("tempat_lahir", input);
              }}
              inputValue={formik.values.tempat_lahir}
            />
            <FormErrorMessage>
              {formik.errors.tempat_lahir as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.tgl_lahir}>
            <FormLabel>
              Tanggal Lahir
              {/* <RequiredForm /> */}
            </FormLabel>
            <DatePickerModal
              id="lengkapi-data-user-1-select-tgl_lahir"
              name={"tgl_lahir"}
              onConfirm={(inputValue) => {
                formik.setFieldValue("tgl_lahir", inputValue);
              }}
              inputValue={formik.values.tgl_lahir}
              isError={!!formik.errors.tgl_lahir}
            />
            <FormErrorMessage>
              {formik.errors.tgl_lahir as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.no_hp}>
            <FormLabel>
              Nomor Telepon
              {/* <RequiredForm /> */}
            </FormLabel>

            <InputGroup>
              <InputLeftElement ml={2}>
                <Text>+62</Text>
              </InputLeftElement>
              <StringInput
                pl={12}
                name="no_hp"
                placeholder="8***********"
                onChangeSetter={(input) => {
                  formik.setFieldValue("no_hp", input);
                }}
                inputValue={formik.values.no_hp}
              />
            </InputGroup>
            <FormErrorMessage>{formik.errors.no_hp as string}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.jenis_kelamin}>
            <FormLabel>
              Jenis Kelamin
              {/* <RequiredForm /> */}
            </FormLabel>
            <SelectGender
              id="lengkapi-data-user-1-select-gender"
              name="jenis_kelamin"
              onConfirm={(inputValue) => {
                formik.setFieldValue("jenis_kelamin", inputValue);
              }}
              inputValue={formik.values.jenis_kelamin}
              isError={!!formik.errors.jenis_kelamin}
              placeholder="Pilih Jenis Kelamin"
            />
            <FormErrorMessage>
              {formik.errors.jenis_kelamin as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.nik_ktp}>
            <FormLabel>
              Nomor Induk Kependudukan
              {/* <RequiredForm /> */}
            </FormLabel>
            <StringInput
              name="nik_ktp"
              placeholder="3301************"
              onChangeSetter={(input) => {
                formik.setFieldValue("nik_ktp", input);
              }}
              inputValue={formik.values.nik_ktp}
            />
            <FormErrorMessage>
              {formik.errors.nik_ktp as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.no_kk}>
            <FormLabel>
              Nomor Kartu Keluarga
              {/* <RequiredForm /> */}
            </FormLabel>
            <StringInput
              name="no_kk"
              placeholder="3301************"
              onChangeSetter={(input) => {
                formik.setFieldValue("no_kk", input);
              }}
              inputValue={formik.values.no_kk}
            />
            <FormErrorMessage>{formik.errors.no_kk as string}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.agama}>
            <FormLabel>
              Agama
              {/* <RequiredForm /> */}
            </FormLabel>
            <SelectAgama
              id="lengkapi-data-user-1-select-agama"
              name="agama"
              onConfirm={(inputValue) => {
                formik.setFieldValue("agama", inputValue);
              }}
              inputValue={formik.values.agama}
              placeholder="Pilih Agama"
              isError={!!formik.errors.agama}
            />
            <FormErrorMessage>{formik.errors.agama as string}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.golongan_darah}>
            <FormLabel>
              Golongan Darah
              {/* <RequiredForm /> */}
            </FormLabel>
            <SelectGoldar
              id="lengkapi-data-user-1-select"
              name="golongan_darah"
              onConfirm={(inputValue) => {
                formik.setFieldValue("golongan_darah", inputValue);
              }}
              inputValue={formik.values.golongan_darah}
              placeholder="Pilih Golongan Darah"
              isError={!!formik.errors.golongan_darah}
            />
            <FormErrorMessage>
              {formik.errors.golongan_darah as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.tinggi_badan}>
            <FormLabel>
              Tinggi Badan
              {/* <RequiredForm /> */}
            </FormLabel>
            <InputGroup>
              <InputRightElement mr={1}>
                <Text>cm</Text>
              </InputRightElement>
              <NumberInput
                name="tinggi_badan"
                onChangeSetter={(input) => {
                  formik.setFieldValue("tinggi_badan", input);
                }}
                inputValue={formik.values.tinggi_badan}
              />
            </InputGroup>
            <FormErrorMessage>
              {formik.errors.tinggi_badan as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.berat_badan}>
            <FormLabel>
              Berat Badan
              {/* <RequiredForm /> */}
            </FormLabel>
            <InputGroup>
              <InputRightElement mr={1}>
                <Text>kg</Text>
              </InputRightElement>
              <Input
                pr={12}
                name="berat_badan"
                onChange={(e) => {
                  formik.setFieldValue(
                    "berat_badan",
                    parseNumber(e.target.value)
                  );
                }}
                value={
                  formik.values.berat_badan === 0
                    ? ""
                    : formatNumber(formik.values.berat_badan)
                }
                placeholder="65"
              />
            </InputGroup>
            <FormErrorMessage>
              {formik.errors.berat_badan as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.riwayat_penyakit}>
            <FormLabel>
              Riwayat Penyakit
              {/* <RequiredForm /> */}
            </FormLabel>
            <Textarea
              name="riwayat_penyakit"
              onChangeSetter={(input) => {
                formik.setFieldValue("riwayat_penyakit", input);
              }}
              inputValue={formik.values.riwayat_penyakit}
              placeholder="Masukkan riwayat penyakit"
            />
            <FormErrorMessage>
              {formik.errors.riwayat_penyakit as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.alamat}>
            <FormLabel>
              Alamat
              {/* <RequiredForm /> */}
            </FormLabel>
            <Textarea
              name="alamat"
              onChangeSetter={(input) => {
                formik.setFieldValue("alamat", input);
              }}
              inputValue={formik.values.alamat}
              placeholder="Jalan Malaka no.100"
            />
            <FormErrorMessage>
              {formik.errors.alamat as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.no_ijazah}>
            <FormLabel>
              Nomor Ijazah Terakhir
              {/* <RequiredForm /> */}
            </FormLabel>
            <StringInput
              name="no_ijazah"
              placeholder="1101************"
              onChangeSetter={(input) => {
                formik.setFieldValue("no_ijazah", input);
              }}
              inputValue={formik.values.no_ijazah}
            />
            <FormErrorMessage>
              {formik.errors.no_ijazah as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.tahun_lulus}>
            <FormLabel>
              Tahun Lulus Ijazah Terakhir
              {/* <RequiredForm /> */}
            </FormLabel>
            <StringInput
              name="tahun_lulus"
              placeholder="2024"
              onChangeSetter={(input) => {
                formik.setFieldValue("tahun_lulus", input);
              }}
              inputValue={formik.values.tahun_lulus}
            />
            <FormErrorMessage>
              {formik.errors.tahun_lulus as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.pendidikan_terakhir}>
            <FormLabel>
              Pendidikan Terakhir
              {/* <RequiredForm /> */}
            </FormLabel>
            {/* <StringInput
              name="pendidikan_terakhir"
              placeholder="S1 Kedokteran"
              onChangeSetter={(input) => {
                formik.setFieldValue("pendidikan_terakhir", input);
              }}
              inputValue={formik.values.pendidikan_terakhir}
            /> */}
            <SelectPendidikan
              name="pendidikan_terakhir"
              placeholder="Diploma 1 (D1)"
              onConfirm={(input) => {
                formik.setFieldValue("pendidikan_terakhir", input);
              }}
              inputValue={formik.values.pendidikan_terakhir}
              isError={!!formik.errors.pendidikan_terakhir}
            />
            <FormErrorMessage>
              {formik.errors.pendidikan_terakhir as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.asal_sekolah}>
            <FormLabel>
              Asal Sekolah
              {/* <RequiredForm /> */}
            </FormLabel>
            <StringInput
              name="asal_sekolah"
              placeholder="Universitas"
              onChangeSetter={(input) => {
                formik.setFieldValue("asal_sekolah", input);
              }}
              inputValue={formik.values.asal_sekolah}
            />
            <FormErrorMessage>
              {formik.errors.asal_sekolah as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.gelar_depan}>
            <FormLabel>Gelar Depan</FormLabel>
            <StringInput
              name="gelar_depan"
              placeholder="dr."
              onChangeSetter={(input) => {
                formik.setFieldValue("gelar_depan", input);
              }}
              inputValue={formik.values.gelar_depan || ""}
            />
            <FormErrorMessage>
              {formik.errors.gelar_depan as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.gelar_belakang}>
            <FormLabel>Gelar Belakang</FormLabel>
            <StringInput
              name="gelar_belakang"
              placeholder="S.Kom"
              onChangeSetter={(input) => {
                formik.setFieldValue("gelar_belakang", input);
              }}
              inputValue={formik.values.gelar_belakang || ""}
            />
            <FormErrorMessage>
              {formik.errors.gelar_belakang as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.str}>
            <FormLabel>
              No. STR
              {/* <RequiredForm /> */}
            </FormLabel>
            <StringInput
              name="str"
              placeholder="3310**********"
              onChangeSetter={(input) => {
                formik.setFieldValue("str", input);
              }}
              inputValue={formik.values.str}
            />
            <FormErrorMessage>{formik.errors.str as string}</FormErrorMessage>
          </FormControl>

          <FormControl
            mb={4}
            isInvalid={formik.errors.masa_berlaku_str ? true : false}
          >
            <FormLabel>
              Masa Berlaku STR
              {/* <RequiredForm /> */}
            </FormLabel>
            <DatePickerModal
              id="lengkapi-data-user-3-select-masa-berlaku-str"
              name={"masa_berlaku_str"}
              onConfirm={(inputValue) => {
                formik.setFieldValue("masa_berlaku_str", inputValue);
              }}
              inputValue={formik.values.masa_berlaku_str}
              isError={!!formik.errors.masa_berlaku_str}
              isDisabled={noLimitStr}
            />
            <Checkbox
              colorScheme="ap"
              onChange={(e) => {
                setNoLimitStr(e.target.checked);
                if (e.target.checked) {
                  formik.setFieldValue("masa_berlaku_str", undefined);
                }
              }}
              mt={3}
              isChecked={noLimitStr}
            >
              <Text mt={"-2.5px"} opacity={noLimitStr ? 1 : 0.4}>
                Masa berlaku seumur hidup
              </Text>
            </Checkbox>
            <FormErrorMessage>
              {formik.errors.masa_berlaku_str as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!formik.errors.sip}>
            <FormLabel>
              No. SIP
              {/* <RequiredForm /> */}
            </FormLabel>
            <StringInput
              name="sip"
              placeholder="3310**********"
              onChangeSetter={(input) => {
                formik.setFieldValue("sip", input);
              }}
              inputValue={formik.values.sip}
            />
            <FormErrorMessage>{formik.errors.sip as string}</FormErrorMessage>
          </FormControl>

          <FormControl
            mb={4}
            isInvalid={formik.errors.masa_berlaku_sip ? true : false}
          >
            <FormLabel>
              Masa Berlaku SIP
              {/* <RequiredForm /> */}
            </FormLabel>
            <DatePickerModal
              id="lengkapi-data-user-3-select-masa-berlaku-sip"
              name={"masa_berlaku_sip"}
              onConfirm={(inputValue) => {
                formik.setFieldValue("masa_berlaku_sip", inputValue);
              }}
              inputValue={formik.values.masa_berlaku_sip}
              isError={!!formik.errors.masa_berlaku_sip}
              isDisabled={noLimitSip}
            />
            <Checkbox
              colorScheme="ap"
              onChange={(e) => {
                setNoLimitSip(e.target.checked);
                if (e.target.checked) {
                  formik.setFieldValue("masa_berlaku_sip", undefined);
                }
              }}
              mt={3}
              isChecked={noLimitSip}
            >
              <Text mt={"-2.5px"} opacity={noLimitSip ? 1 : 0.4}>
                Masa berlaku seumur hidup
              </Text>
            </Checkbox>
            <FormErrorMessage>
              {formik.errors.masa_berlaku_sip as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            mb={4}
            isInvalid={formik.errors.no_bpjsksh ? true : false}
          >
            <FormLabel>
              No. BPJS Kesehatan
              {/* <RequiredForm /> */}
            </FormLabel>
            <StringInput
              name="no_bpjsksh"
              placeholder="231*****"
              onChangeSetter={(input) => {
                formik.setFieldValue("no_bpjsksh", input);
              }}
              inputValue={formik.values.no_bpjsksh}
            />
            <FormErrorMessage>
              {formik.errors.no_bpjsksh as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            mb={6}
            isInvalid={formik.errors.no_bpjsktk ? true : false}
          >
            <FormLabel>No. BPJS Ketenagakerjaan</FormLabel>
            <StringInput
              name="no_bpjsktk"
              placeholder="231*****"
              onChangeSetter={(input) => {
                formik.setFieldValue("no_bpjsktk", input);
              }}
              inputValue={formik.values.no_bpjsktk || ""}
            />
            <FormErrorMessage>
              {formik.errors.no_bpjsktk as string}
            </FormErrorMessage>
          </FormControl>

          <FormControl mb={6} isInvalid={formik.errors.npwp ? true : false}>
            <FormLabel>
              NPWP
              {/* <RequiredForm /> */}
            </FormLabel>
            <StringInput
              name="npwp"
              placeholder="231*****"
              onChangeSetter={(input) => {
                formik.setFieldValue("npwp", input);
              }}
              inputValue={formik.values.npwp}
            />
            <FormErrorMessage>{formik.errors.npwp as string}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
      </>
    );
  };

  const Step3Footer = () => {
    return (
      <ButtonGroup mt={"auto"} pt={4} w={"100%"}>
        <Button
          w={"100%"}
          className="btn-solid clicky"
          h={"50px"}
          onClick={handleBack}
        >
          Sebelumnya
        </Button>
        <Button
          type="submit"
          form="tambahKaryawanForm"
          w={"100%"}
          colorScheme="ap"
          className="btn-ap clicky"
          h={"50px"}
          onClick={handleNext}
          isLoading={loading}
        >
          Simpan
        </Button>
      </ButtonGroup>
    );
  };

  const stepComponents = [Step1, Step2, Step3];
  const stepFooterComponents = [Step1Footer, Step2Footer, Step3Footer];

  return (
    <>
      <form id="editKaryawanForm" onSubmit={formik.handleSubmit}>
        {stepComponents[activeStep]()}
      </form>

      <Box mt={"auto"}>{stepFooterComponents[activeStep]()}</Box>
    </>
  );
}
