import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  ButtonGroup,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  useDisclosure,
  useSteps,
  useToast,
} from "@chakra-ui/react";
import { RiAddCircleFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import SelectJabatan from "../../components/dependent/_Select/SelectJabatan";
import SelectKelompokGaji from "../../components/dependent/_Select/SelectKelompokGaji";
import SelectKompetensi from "../../components/dependent/_Select/SelectKompetensi";
import SelectPtkp from "../../components/dependent/_Select/SelectPtkp";
import SelectRole from "../../components/dependent/_Select/SelectRole";
import SelectUnitKerja from "../../components/dependent/_Select/SelectUnitKerja";
import DatePickerModal from "../../components/dependent/input/DatePickerModal";
import RequiredForm from "../../components/form/RequiredForm";
import { useLightDarkColor } from "../../constant/colors";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import req from "../../lib/req";
import useScreenHeight from "../../lib/useScreenHeight";
import useScreenWidth from "../../lib/useScreenWidth";
import CContainer from "../wrapper/CContainer";
import MultiselectPotongan from "./_Select/MultiselectPotongan";
import SelectStatusKaryawan from "./_Select/SelectStatusKaryawan";
import DisclosureHeader from "./DisclosureHeader";
import NumberInput from "./input/NumberInput";
import StringInput from "./input/StringInput";

const validationSchemaStep1 = yup.object({
  nama_karyawan: yup.string().required("Harus diisi"),
  nik: yup.string().required("Harus diisi"),
  email: yup.string().email("Email tidak valid"),
  tgl_berakhir_pks: yup.string().required("Harus diisi"),
  no_rm: yup.string().required("Harus diisi"),
  no_manulife: yup.string(),
  tgl_masuk: yup.string().required("Harus diisi"),
  tgl_diangkat: yup.string(),
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

const validationSchema = [validationSchemaStep1, validationSchemaStep2];

interface Props extends ButtonProps {}

export default function TambahKaryawanModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`tambah-karyawan-modal`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const steps = [{ title: "Data Karyawan" }, { title: "Penggajian" }];
  const { activeStep, setActiveStep } = useSteps();
  const activeStepText = steps[activeStep].title;

  useEffect(() => {
    setActiveStep(0);
  }, [setActiveStep]);

  const sw = useScreenWidth();
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();
  const isSubmitting = useRef(false);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama_karyawan: "",
      nik: "",
      email: "",
      tgl_berakhir_pks: "",
      no_rm: "",
      no_manulife: "",
      tgl_masuk: "",
      tgl_diangkat: "",
      status_karyawan: undefined as any,
      unit_kerja: undefined as any,
      jabatan: undefined as any,
      kompetensi: undefined as any,
      role: undefined as any,
      kelompok_gaji: undefined as any,
      no_rekening: "",
      tunjangan_jabatan: undefined as any,
      tunjangan_kompetensi: undefined as any,
      tunjangan_fungsional: undefined as any,
      tunjangan_khusus: undefined as any,
      tunjangan_lainnya: undefined as any,
      uang_lembur: undefined as any,
      uang_makan: undefined as any,
      ptkp: undefined as any,
      potongan: undefined as any,
    },

    validationSchema: validationSchema[activeStep],

    onSubmit: (values, { resetForm }) => {
      if (isSubmitting.current) return; // Cegah submit berulang
      isSubmitting.current = true;

      const payload = {
        nama: values.nama_karyawan,
        nik: values.nik,
        email: values.email,
        tgl_berakhir_pks: formatDate(values.tgl_berakhir_pks, "short"),
        no_rm: values.no_rm,
        no_manulife: values.no_manulife,
        tgl_masuk: formatDate(values.tgl_masuk, "short"),
        tgl_diangkat: formatDate(values.tgl_diangkat, "short"),
        status_karyawan_id: values.status_karyawan?.value,
        unit_kerja_id: values.unit_kerja?.value,
        jabatan_id: values.jabatan?.value,
        kompetensi_id: values.kompetensi?.value,
        role_id: values.role?.value,
        kelompok_gaji_id: values.kelompok_gaji?.value,
        no_rekening: values.no_rekening,
        tunjangan_fungsional: values.tunjangan_fungsional,
        tunjangan_jabatan: values.tunjangan_jabatan,
        tunjangan_khusus: values.tunjangan_khusus,
        tunjangan_lainnya: values.tunjangan_lainnya,
        uang_lembur: values.uang_lembur,
        uang_makan: values.uang_makan,
        ptkp_id: values.ptkp?.value,
        premi_id: values.potongan?.map((pot: any) => pot?.value),
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/karyawan/data-karyawan`, payload)
        .then((r) => {
          if (r.status === 200) {
            toast({
              status: "success",
              title: r.data.message,
              isClosable: true,
              position: "bottom-right",
            });
            setRt(!rt);
            // resetForm();
            if (activeStep === 1) {
              handleBack();
            }
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
          isSubmitting.current = false;
          setLoading(false);
        });
    },
  });

  const formikRef = useRef(formik);
  useEffect(() => {
    if (formik.values.jabatan) {
      formikRef.current.setFieldValue(
        "tunjangan_jabtan",
        formik.values.jabatan.original_data.tunjangan_jabatan
      );
    }
  }, [formik.values.jabatan]);

  // console.log(formik.values.jabatan.original_data.tunjangan_jabatan);

  const handleNext = () => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        if (activeStep === 1) {
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
      <SimpleGrid
        display={activeStep === 0 ? "grid" : "none"}
        columns={[1, 2, null, 3]}
        spacingX={4}
      >
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
          <FormErrorMessage>{formik.errors.nama_karyawan}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4} flex={"1 1 300px"} isInvalid={!!formik.errors.nik}>
          <FormLabel>
            No. Induk Karyawan
            <RequiredForm />
          </FormLabel>
          <StringInput
            name="nik"
            placeholder="331**********"
            onChangeSetter={(input) => {
              formik.setFieldValue("nik", input);
            }}
            inputValue={formik.values.nik}
          />
          <FormErrorMessage>{formik.errors.nik}</FormErrorMessage>
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
            placeholder="example@email.com"
            onChangeSetter={(input) => {
              formik.setFieldValue("email", input);
            }}
            inputValue={formik.values.email}
          />
          <FormHelperText opacity={0.4}>
            Email ini digunakan untuk masuk ke RSKI Karyawan (login)
          </FormHelperText>
          <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
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
          <FormErrorMessage>{formik.errors.tgl_berakhir_pks}</FormErrorMessage>
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
            placeholder="331**********"
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
            placeholder="331**********"
            onChangeSetter={(input) => {
              formik.setFieldValue("no_manulife", input);
            }}
            inputValue={formik.values.no_manulife}
          />
          <FormErrorMessage>{formik.errors.no_manulife}</FormErrorMessage>
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
          <FormErrorMessage>{formik.errors.tgl_masuk}</FormErrorMessage>
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
          <FormErrorMessage>{formik.errors.tgl_diangkat}</FormErrorMessage>
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
              formik.setFieldValue(
                "tunjangan_jabatan",
                input?.original_data.tunjangan_jabatan
              );
            }}
            inputValue={formik.values.jabatan}
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
              formik.setFieldValue(
                "tunjangan_kompetensi",
                input?.original_data.tunjangan_kompetensi
              );
            }}
            inputValue={formik.values.kompetensi}
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
      <ButtonGroup
        display={activeStep === 0 ? "flex" : "none"}
        mt={"auto"}
        pt={4}
        w={"100%"}
      >
        <Button
          w={"100%"}
          className="btn-solid clicky"
          h={"50px"}
          onClick={() => {
            formik.resetForm();
          }}
        >
          Clear
        </Button>
        <Button
          w={"100%"}
          colorScheme="ap"
          className="btn-ap clicky"
          h={"50px"}
          onClick={handleNext}
        >
          Lanjut
        </Button>
      </ButtonGroup>
    );
  };

  const Step2 = () => {
    return (
      <SimpleGrid
        display={activeStep === 1 ? "grid" : "none"}
        columns={[1, 2, null, 3]}
        spacingX={4}
      >
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
            isError={!!formik.errors.kelompok_gaji}
            // withSearch
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
          <FormErrorMessage>{formik.errors.no_rekening}</FormErrorMessage>
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
          <FormHelperText>
            Tunjangan diambil dari master data jabatan
          </FormHelperText>
          <FormErrorMessage>
            {formik.errors.tunjangan_jabatan as string}
          </FormErrorMessage>
        </FormControl>

        {/* <FormControl
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
            Uang Lembur per Jam
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
      <ButtonGroup
        display={activeStep === 1 ? "flex" : "none"}
        mt={"auto"}
        pt={4}
        w={"100%"}
      >
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
          Tambah Karyawan
        </Button>
      </ButtonGroup>
    );
  };

  const stepComponents = [Step1, Step2];
  const stepFooterComponents = [Step1Footer, Step2Footer];

  // SX
  const sh = useScreenHeight();
  const lightDarkColor = useLightDarkColor();

  return (
    <>
      <Button
        colorScheme="ap"
        className="btn-ap clicky"
        leftIcon={<Icon as={RiAddCircleFill} fontSize={iconSize} />}
        onClick={onOpen}
        pl={5}
        {...props}
      >
        Tambah Karyawan
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        size={"full"}
        scrollBehavior={sh < 650 ? "outside" : "inside"}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent borderRadius={12} minH={"calc(100vh - 32px)"}>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader
              title={"Tambah Karyawan"}
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>

          <ModalBody px={0} pb={responsiveSpacing}>
            <Stepper
              maxW={"720px"}
              w={"100%"}
              mx={"auto"}
              px={6}
              index={activeStep}
              colorScheme="ap"
              mb={6}
            >
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box flexShrink="0">
                    <StepTitle>
                      {sw >= 768 && <Text>{step.title}</Text>}
                    </StepTitle>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>

            {sw < 768 && (
              <CContainer px={5}>
                <Text mb={6}>
                  Step {activeStep + 1} : <b>{activeStepText}</b>
                </Text>
              </CContainer>
            )}

            <CContainer
              px={responsiveSpacing}
              bg={lightDarkColor}
              borderRadius={12}
              overflowY={"auto"}
              flex={1}
              className="scrollY"
            >
              <Alert
                flexShrink={0}
                status="warning"
                mb={responsiveSpacing}
                alignItems={"start"}
              >
                <AlertIcon />
                <AlertDescription maxW={"100% !important"}>
                  Setelah karyawan berhasil dibuat, pastikan semua data personal
                  telah diisi dengan benar. Jika data personal sudah lengkap,
                  aktifkan karyawan melalui halaman detail karyawan.
                </AlertDescription>
              </Alert>

              <Text fontSize={22} fontWeight={600}>
                {steps[activeStep].title}
              </Text>
              <Text opacity={0.6} mb={6}>
                Silahkan Isi Semua Data Informasi Dasar Karyawan
              </Text>

              <form id="tambahKaryawanForm" onSubmit={formik.handleSubmit}>
                {stepComponents[0]()}
                {stepComponents[1]()}
              </form>

              {stepFooterComponents[0]()}
              {stepFooterComponents[1]()}
            </CContainer>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* <PleaseWaitModal isOpen={loading} /> */}
    </>
  );
}
