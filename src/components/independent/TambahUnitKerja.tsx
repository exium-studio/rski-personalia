import {
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
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
import { iconSize } from "../../constant/sizes";
import SelectJenisKaryawan from "../dependent/_Select/SelectJenisKaryawan";
import DisclosureHeader from "../dependent/DisclosureHeader";
import RequiredForm from "../form/RequiredForm";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import req from "../../constant/req";
import useRenderTrigger from "../../global/useRenderTrigger";

interface Props extends ButtonProps {}

export default function TambahUnitKerja({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-unit-kerja-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { nama_unit: "", jenis_karyawan: "" as any },
    validationSchema: yup.object().shape({
      nama_unit: yup.string().required("Harus diisi"),
      jenis_karyawan: yup.object().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama_unit: values.nama_unit,
        jenis_karyawan: values.jenis_karyawan.value,
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/unit-kerja`, payload)
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
            title: "Maaf terjadi kesalahan pada sistem",
            isClosable: true,
            position: "bottom-right",
          });
          setRt(!rt);
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
        Tambah Unit Kerja
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
              title="Tambah Unit Kerja"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="tambahUnitKerjaForm" onSubmit={formik.handleSubmit}>
              <FormControl
                mb={4}
                isInvalid={formik.errors.nama_unit ? true : false}
              >
                <FormLabel>
                  Nama Unit
                  <RequiredForm />
                </FormLabel>
                <Input
                  name="nama_unit"
                  placeholder="Human Resource"
                  onChange={formik.handleChange}
                  value={formik.values.nama_unit}
                />
                <FormErrorMessage>
                  {formik.errors.nama_unit as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.jenis_karyawan ? true : false}
              >
                <FormLabel>
                  Jenis Pegawai
                  <RequiredForm />
                </FormLabel>
                <SelectJenisKaryawan
                  name="jenis_karyawan"
                  onConfirm={(input) => {
                    formik.setFieldValue("jenis_karyawan", input);
                  }}
                  inputValue={formik.values.jenis_karyawan}
                  placeholder="Pilih Jenis Pegawai"
                />
                <FormErrorMessage>
                  {formik.errors.jenis_karyawan as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="tambahUnitKerjaForm"
              className="btn-ap clicky"
              colorScheme="ap"
              w={"100%"}
              isLoading={loading}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
