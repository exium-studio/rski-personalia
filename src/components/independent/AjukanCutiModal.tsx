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
} from "@chakra-ui/react";
import { RiCalendarCloseFill } from "@remixicon/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import SelectKaryawan from "../dependent/_Select/SelectKaryawan";
import SelectTipeCuti from "../dependent/_Select/SelectTipeCuti";
import DisclosureHeader from "../dependent/DisclosureHeader";
import DateRangePickerModal from "../dependent/input/DateRangePickerModal";
import RequiredForm from "../form/RequiredForm";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
interface Props extends ButtonProps {}

export default function AjukanCutiModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("ajukan-cuti-modal", isOpen, onOpen, onClose);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      karyawan: "" as any,
      tipe_cuti: "" as any,
      range_tgl: undefined,
    },
    validationSchema: yup.object().shape({
      karyawan: yup.object().required("Harus diisi"),
      tipe_cuti: yup.object().required("Harus diisi"),
      range_tgl: yup.object().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);
    },
  });

  return (
    <>
      <Button
        colorScheme="ap"
        className="btn-ap clicky"
        onClick={onOpen}
        leftIcon={<Icon as={RiCalendarCloseFill} fontSize={iconSize} />}
        {...props}
      >
        Ajukan Cuti
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title="Ajukan Cuti" />
          </ModalHeader>
          <ModalBody>
            <form id="ajukanCutiForm" onSubmit={formik.handleSubmit}>
              <FormControl
                mb={4}
                isInvalid={formik.errors.karyawan ? true : false}
              >
                <FormLabel>
                  Karyawan
                  <RequiredForm />
                </FormLabel>
                <SelectKaryawan
                  name="karyawan"
                  onConfirm={(input) => {
                    formik.setFieldValue("karyawan", input);
                  }}
                  inputValue={formik.values.karyawan}
                  isError={!!formik.errors.karyawan}
                />
                <FormErrorMessage>
                  {formik.errors.karyawan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.tipe_cuti ? true : false}
              >
                <FormLabel>
                  Tipe Cuti
                  <RequiredForm />
                </FormLabel>
                <SelectTipeCuti
                  name="tipe_cuti"
                  onConfirm={(input) => {
                    formik.setFieldValue("tipe_cuti", input);
                  }}
                  inputValue={formik.values.tipe_cuti}
                  isError={!!formik.errors.tipe_cuti}
                />
                <FormErrorMessage>
                  {formik.errors.tipe_cuti as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.range_tgl ? true : false}>
                <FormLabel>
                  Rentang Tanggal
                  <RequiredForm />
                </FormLabel>
                <DateRangePickerModal
                  id="ajukan-cuti-date-range-picker-modal"
                  name="range_tgl"
                  onConfirm={(input) => {
                    formik.setFieldValue("range_tgl", input);
                  }}
                  inputValue={formik.values.range_tgl}
                  maxRange={31}
                  isError={!!formik.errors.range_tgl}
                />
                <FormErrorMessage>
                  {formik.errors.range_tgl as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="ajukanCutiForm"
              w={"100%"}
              colorScheme="ap"
              className="btn-ap clicky"
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
