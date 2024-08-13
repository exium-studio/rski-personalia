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
import req from "../../constant/req";
import { useState } from "react";
import useRenderTrigger from "../../global/useRenderTrigger";
import formatDate from "../../lib/formatDate";
interface Props extends ButtonProps {}

export default function AjukanCutiModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("ajukan-cuti-modal", isOpen, onOpen, onClose);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      karyawan: undefined as any,
      tipe_cuti: undefined as any,
      range_tgl: undefined as any,
    },
    validationSchema: yup.object().shape({
      karyawan: yup.object().required("Harus diisi"),
      tipe_cuti: yup.object().required("Harus diisi"),
      range_tgl: yup.object().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        user_id: values.karyawan.value,
        tipe_cuti_id: values.tipe_cuti.value,
        tgl_from: formatDate(values.range_tgl?.from as string, "iso"),
        tgl_to: formatDate(values.range_tgl?.to as string, "iso"),
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/jadwal-karyawan/cuti`, payload)
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
              isLoading={loading}
            >
              Ajukan Cuti
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
