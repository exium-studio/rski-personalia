import {
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
import { useRef, useState } from "react";
import * as yup from "yup";
import SelectJabatan from "../../components/dependent/_Select/SelectJabatan";
import SelectKelompokGaji from "../../components/dependent/_Select/SelectKelompokGaji";
import SelectKompetensi from "../../components/dependent/_Select/SelectKompetensi";
import SelectPtkp from "../../components/dependent/_Select/SelectPtkp";
import SelectRole from "../../components/dependent/_Select/SelectRole";
import SelectStatusKaryawan from "../../components/dependent/_Select/SelectStatusKaryawan";
import SelectUnitKerja from "../../components/dependent/_Select/SelectUnitKerja";
import DatePickerModal from "../../components/dependent/input/DatePickerModal";
import RequiredForm from "../../components/form/RequiredForm";
import { useLightDarkColor } from "../../constant/colors";
import req from "../../constant/req";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useRenderTrigger from "../../global/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import useScreenHeight from "../../lib/useScreenHeight";
import useScreenWidth from "../../lib/useScreenWidth";
import CContainer from "../wrapper/CContainer";
import MultiselectPotongan from "./_Select/MultiselectPotongan";
import DisclosureHeader from "./DisclosureHeader";
import NumberInput from "./input/NumberInput";

const validationSchemaStep1 = yup.object({
  nama_karyawan: yup.string().required("Harus diisi"),
  email: yup.string().email("Email tidak valid").required("Harus diisi"),
  no_rm: yup.string().required("Harus diisi"),
  no_manulife: yup.string().required("Harus diisi"),
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

const validationSchema = [validationSchemaStep1, validationSchemaStep2];

interface Props extends ButtonProps {}

export default function TambahKaryawanModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`tambah-karyawan-modal`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const steps = [{ title: "Data Karyawan" }, { title: "Penggajian" }];
  const { activeStep, setActiveStep } = useSteps();
  const activeStepText = steps[activeStep].title;

  const sw = useScreenWidth();
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama_karyawan: "",
      email: "",
      no_rm: "",
      no_manulife: "",
      tgl_masuk: "",
      status_karyawan: undefined as any,
      unit_kerja: undefined as any,
      jabatan: undefined as any,
      kompetensi: undefined as any,
      role: undefined as any,
      kelompok_gaji: undefined as any,
      no_rekening: "",
      tunjangan_jabatan: undefined as any,
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
      const payload = {
        nama: values.nama_karyawan,
        email: values.email,
        no_rm: values.no_rm,
        no_manulife: values.no_manulife,
        tgl_masuk: values.tgl_masuk,
        status_karyawan_id: values.status_karyawan.value,
        unit_kerja_id: values.unit_kerja.value,
        jabatan_id: values.jabatan.value,
        kompetensi_id: values.kompetensi.value,
        role_id: values.role.value,
        kelompok_gaji_id: values.kelompok_gaji.value,
        no_rekening: values.no_rekening,
        tunjangan_jabatan: values.tunjangan_jabatan,
        tunjangan_fungsional: values.tunjangan_fungsional,
        tunjangan_khusus: values.tunjangan_khusus,
        tunjangan_lainnya: values.tunjangan_lainnya,
        uang_lembur: values.uang_lembur,
        uang_makan: values.uang_makan,
        ptkp_id: values.ptkp.value,
        premi_id: values.potongan.map((pot: any) => pot.value),
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
            resetForm();
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
              e?.response?.data?.message ||
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
          <FormErrorMessage>{formik.errors.nama_karyawan}</FormErrorMessage>
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
            Email ini digunakan untuk masuk ke RSKI Karyawan (login)
          </FormHelperText>
          <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
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
          <Input
            name="no_rm"
            placeholder="871***"
            onChange={formik.handleChange}
            value={formik.values.no_rm}
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
            <RequiredForm />
          </FormLabel>
          <Input
            name="no_manulife"
            placeholder="019***"
            onChange={formik.handleChange}
            value={formik.values.no_manulife}
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
            Role
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
          <FormErrorMessage>
            {formik.errors.tunjangan_jabatan as string}
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
            Uang Makan
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
              <Text mb={6}>
                Step {activeStep + 1} : <b>{activeStepText}</b>
              </Text>
            )}

            <CContainer
              px={responsiveSpacing}
              bg={lightDarkColor}
              borderRadius={12}
              overflowY={"auto"}
              flex={1}
              className="scrollY"
            >
              <Text fontSize={22} fontWeight={600}>
                {steps[activeStep].title}
              </Text>
              <Text opacity={0.6} mb={6}>
                Silahkan Isi Semua Data Informasi Dasar Karyawan
              </Text>

              <form id="tambahKaryawanForm" onSubmit={formik.handleSubmit}>
                {stepComponents[activeStep]()}
              </form>

              {stepFooterComponents[activeStep]()}
            </CContainer>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
