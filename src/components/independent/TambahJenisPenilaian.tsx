import {
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiAddCircleFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";
import req from "../../lib/req";
import { iconSize } from "../../constant/sizes";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import SelectJabatan from "../dependent/_Select/SelectJabatan";
import SelectStatusKaryawan from "../dependent/_Select/SelectStatusKaryawan";
import DisclosureHeader from "../dependent/DisclosureHeader";
import StringInput from "../dependent/input/StringInput";
import RequiredForm from "../form/RequiredForm";

interface Props extends ButtonProps {}

export default function TambahJenisPenilaian({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-kompetensi-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama: "" as any,
      status_karyawan: "" as any,
      jabatan_penilai: undefined as any,
      jabatan_dinilai: undefined as any,
    },
    validationSchema: yup.object().shape({
      nama: yup.string().required("Harus diisi"),
      status_karyawan: yup.object().required("Harus diisi"),
      jabatan_penilai: yup.object().required("Harus diisi"),
      jabatan_dinilai: yup.object().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama: values.nama,
        status_karyawan_id: values.status_karyawan.value,
        jabatan_penilai: values.jabatan_penilai.value,
        jabatan_dinilai: values.jabatan_dinilai.value,
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/perusahaan/jenis-penilaian`, payload)
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
    <>
      <Button
        className="btn-ap clicky"
        colorScheme="ap"
        onClick={onOpen}
        leftIcon={<Icon as={RiAddCircleFill} fontSize={iconSize} />}
        pl={5}
        {...props}
      >
        Tambah Jenis Penilaian
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
        }}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader
              title="Tambah Jenis Penilaian"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="tambahJabatanForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={!!formik.errors.nama}>
                <FormLabel>
                  Nama
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="nama"
                  placeholder="Penilaian Karyawan Tetap"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("nama", input);
                  }}
                  inputValue={formik.values.nama}
                />
                <FormErrorMessage>
                  {formik.errors.nama as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.status_karyawan}>
                <FormLabel>
                  Status Karyawan Dinilai
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
                  {formik.errors.status_karyawan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.jabatan_penilai}>
                <FormLabel>
                  Jabatan Penilai
                  <RequiredForm />
                </FormLabel>
                <SelectJabatan
                  name="jabatan_penilai"
                  onConfirm={(input) => {
                    formik.setFieldValue("jabatan_penilai", input);
                  }}
                  inputValue={formik.values.jabatan_penilai}
                  isError={!!formik.errors.jabatan_penilai}
                />
                <FormErrorMessage>
                  {formik.errors.jabatan_penilai as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formik.errors.jabatan_dinilai}>
                <FormLabel>
                  Jabatan Dinilai
                  <RequiredForm />
                </FormLabel>
                <SelectJabatan
                  name="jabatan_dinilai"
                  onConfirm={(input) => {
                    formik.setFieldValue("jabatan_dinilai", input);
                  }}
                  inputValue={formik.values.jabatan_dinilai}
                  isError={!!formik.errors.jabatan_dinilai}
                />
                <FormErrorMessage>
                  {formik.errors.jabatan_dinilai as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="tambahJabatanForm"
              className="btn-ap clicky"
              colorScheme="ap"
              w={"100%"}
              isLoading={loading}
            >
              Tambahkan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
