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
} from "@chakra-ui/react";
import { RiAddCircleFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef } from "react";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import SelectJenisKaryawan from "../dependent/_Select/SelectJenisKaryawan";
import DisclosureHeader from "../dependent/DisclosureHeader";
import RequiredForm from "../form/RequiredForm";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";

interface Props extends ButtonProps {}

export default function TambahUnitKerja({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-unit-kerja-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { nama_unit: "", jenis_karyawan: "" as any },
    validationSchema: yup.object().shape({
      nama_unit: yup.string().required("Harus diisi"),
      jenis_karyawan: yup.number().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      //TODO api tambah kelompok gaji
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
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
