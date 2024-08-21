import {
  Alert,
  AlertDescription,
  AlertIcon,
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
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import req from "../../constant/req";
import { iconSize } from "../../constant/sizes";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "../dependent/DisclosureHeader";
import DatePickerModal from "../dependent/input/DatePickerModal";
import RequiredForm from "../form/RequiredForm";
import formatDate from "../../lib/formatDate";

interface Props extends ButtonProps {}

export default function RunThr({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("run-thr-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const [countDown, setCountDown] = useState(10);
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCountDown((prevCount) => {
          if (prevCount > 0) {
            return prevCount - 1;
          } else {
            clearInterval(interval);
            return prevCount;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCountDown(10);
    }
  }, [isOpen]);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      tgl_run_thr: "",
    },
    validationSchema: yup.object().shape({
      tgl_run_thr: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        tgl_run_thr: formatDate(values.tgl_run_thr, "short"),
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/keuangan/run-thr`, payload)
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

            <Alert mt={4} status="warning" alignItems={"start"}>
              <AlertIcon />
              <AlertDescription>
                Jika tanggal run THR melebihi tanggal penggajian, maka THR akan
                diaplikasikan pada penggajian berikutnya.
              </AlertDescription>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="runThrForm"
              w={"100%"}
              className="btn-ap clicky"
              colorScheme="ap"
              isLoading={loading}
              isDisabled={countDown !== 0}
            >
              {countDown !== 0 ? `Tunggu ${countDown} detik` : "Run THR"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
