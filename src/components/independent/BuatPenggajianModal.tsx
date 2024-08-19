import {
  Button,
  ButtonProps,
  Checkbox,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiFileList3Fill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";
import req from "../../constant/req";
import { iconSize } from "../../constant/sizes";
import useRenderTrigger from "../../global/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "../dependent/DisclosureHeader";
import PleaseWaitModal from "../dependent/PleaseWaitModal";
import CContainer from "../wrapper/CContainer";

interface Props extends ButtonProps {}

export default function BuatPenggajianModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("buat-penggajian-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { sertakan_bor: false },
    validationSchema: yup.object().shape({ sertakan_bor: yup.boolean() }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        bor: values.sertakan_bor,
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/keuangan/penggajian`, payload)
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
        leftIcon={<Icon as={RiFileList3Fill} fontSize={iconSize} />}
        pl={5}
        {...props}
      >
        Buat Penggajian
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
        }}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title="Buat Penggajian" />
          </ModalHeader>

          <ModalBody>
            <Text mb={4} opacity={0.4}>
              Apakah penggajian ini menyertakan BOR?
            </Text>
            <Checkbox
              colorScheme="ap"
              onChange={(e) => {
                formik.setFieldValue("sertakan_bor", e.target.checked);
              }}
            >
              <Text mt={"-3px"}>Sertakan BOR</Text>
            </Checkbox>
          </ModalBody>

          <ModalFooter>
            <CContainer>
              {/* <Alert status="warning" alignItems={"start"} mb={4}>
                <AlertIcon mt={1} />
                <AlertDescription>
                  Silakan cek atau refresh tabel penggajian secara berkala
                  karena pembuatan gaji memerlukan waktu.
                </AlertDescription>
              </Alert> */}

              <Button
                onClick={() => {
                  formik.submitForm();
                }}
                w={"100%"}
                className="btn-ap clicky"
                colorScheme="ap"
              >
                Buat Penggajian
              </Button>
            </CContainer>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <PleaseWaitModal isOpen={loading} />
    </>
  );
}
