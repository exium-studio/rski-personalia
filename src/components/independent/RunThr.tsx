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
import { RiCalendarEventFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";
import req from "../../constant/req";
import { iconSize } from "../../constant/sizes";
import useRenderTrigger from "../../global/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import MultiSelectKaryawan from "../dependent/_Select/MultiSelectKaryawan";
import DisclosureHeader from "../dependent/DisclosureHeader";
import DatePickerModal from "../dependent/input/DatePickerModal";
import RequiredForm from "../form/RequiredForm";

interface Props extends ButtonProps {}

export default function RunThr({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("run-thr-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      list_karyawan: [],
      tgl_run_thr: "",
    },
    validationSchema: yup.object().shape({
      list_karyawan: yup.array().min(1, "Harus diisi").required("Harus diisi"),
      tgl_run_thr: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        tgl_run_thr: values.tgl_run_thr,
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/keuangan/data-thr-penggajian`, payload)
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
        className="btn-ap clicky"
        colorScheme="ap"
        onClick={onOpen}
        leftIcon={<Icon as={RiCalendarEventFill} fontSize={iconSize} />}
        isLoading={loading}
        {...props}
      >
        Run THR
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
        }}
        initialFocusRef={initialRef}
        blockScrollOnMount={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader
              title="Run THR"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="runThrForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={!!formik.errors.list_karyawan}>
                <FormLabel>
                  Karyawan
                  <RequiredForm />
                </FormLabel>
                <MultiSelectKaryawan
                  name="list_karyawan"
                  placeholder="Pilih Multi Karyawan"
                  onConfirm={(input) => {
                    formik.setFieldValue("list_karyawan", input);
                  }}
                  inputValue={formik.values.list_karyawan}
                  isError={!!formik.errors.list_karyawan}
                  withSearch
                  optionsDisplay="chip"
                />
                <FormErrorMessage>
                  {formik.errors.list_karyawan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formik.errors.tgl_run_thr}>
                <FormLabel>
                  Tanggal
                  <RequiredForm />
                </FormLabel>
                <DatePickerModal
                  id="tanggal-run-thr-date-picker"
                  name="tgl_run_thr"
                  onConfirm={(input) => {
                    formik.setFieldValue("tgl_run_thr", input);
                  }}
                  inputValue={
                    formik.values.tgl_run_thr
                      ? new Date(formik.values.tgl_run_thr)
                      : undefined
                  }
                  isError={!!formik.errors.tgl_run_thr}
                />
                <FormErrorMessage>
                  {formik.errors.tgl_run_thr as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="runThrForm"
              w={"100%"}
              className="btn-ap clicky"
              colorScheme="ap"
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
