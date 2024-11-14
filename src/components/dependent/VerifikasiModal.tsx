import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  IconButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiCheckLine, RiCloseLine } from "@remixicon/react";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import useBackOnClose from "../../hooks/useBackOnClose";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import req from "../../lib/req";
import RequiredForm from "../form/RequiredForm";
import DisclosureHeader from "./DisclosureHeader";
import Textarea from "./input/Textarea";

interface Props extends IconButtonProps {
  id: string;
  submitUrl: string;
  titleDitolak?: string;
  titleDisetujui?: string;
  approvePayloadKey?: string;
  disapprovePayloadKey?: string;
}

export default function VerifikasiModal({
  id,
  submitUrl,
  titleDitolak,
  titleDisetujui,
  approvePayloadKey,
  disapprovePayloadKey,
  ...props
}: Props) {
  const [verifikasi, setVerifikasi] = useState<boolean | undefined>(undefined);

  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `${id}-${verifikasi ? "disetujui" : "ditolak"}`,
    isOpen,
    onOpen,
    onClose
  );

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      verifikasi: undefined as number | undefined,
      alasan: "",
    },
    validationSchema: yup.object().shape({
      alasan: !verifikasi ? yup.string().required("Harus diisi") : yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);

      let payload;

      const payload1 = {
        [approvePayloadKey || "verifikasi_disetujui"]: 1,
      };
      const payload2 = {
        [disapprovePayloadKey || "verifikasi_ditolak"]: 1,
        alasan: values.alasan,
      };
      if (verifikasi) {
        payload = payload1;
      } else {
        payload = payload2;
      }

      req
        .post(submitUrl, payload)
        .then((r) => {
          if (r.status === 200) {
            toast({
              status: "success",
              title: r.data.message,
              position: "bottom-right",
              isClosable: true,
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
              e?.response?.data?.message ||
              "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
            position: "bottom-right",
            isClosable: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <>
      <HStack>
        <Tooltip
          label={props?.isDisabled ? "" : titleDitolak || "Ditolak"}
          openDelay={500}
        >
          <IconButton
            icon={<Icon as={RiCloseLine} fontSize={24} />}
            className="clicky"
            // color={"var(--divider-text)"}
            borderRadius={"full"}
            size={"sm"}
            variant={"ghost"}
            color={"red.400"}
            colorScheme="red"
            onClick={() => {
              setVerifikasi(false);
              onOpen();
            }}
            {...props}
          />
        </Tooltip>

        <Tooltip
          label={props?.isDisabled ? "" : titleDisetujui || "Disetujui"}
          openDelay={500}
        >
          <IconButton
            icon={<Icon as={RiCheckLine} fontSize={24} />}
            className="clicky"
            // color={"var(--divider-text)"}
            borderRadius={"full"}
            size={"sm"}
            variant={"ghost"}
            color={"green.400"}
            colorScheme="green"
            onClick={() => {
              setVerifikasi(true);
              onOpen();
            }}
            {...props}
          />
        </Tooltip>
      </HStack>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
        }}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader
              title={
                verifikasi
                  ? titleDisetujui || "Verifikasi Disetujui?"
                  : titleDitolak || "Verifikasi Ditolak?"
              }
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            {verifikasi && (
              <Text opacity={0.6}>
                Apakah anda yakin <b>verifikasi</b> ini akan <b>disetujui</b>?
              </Text>
            )}

            {!verifikasi && (
              <Text opacity={0.6}>
                Apakah anda yakin <b>verifikasi</b> ini akan <b>ditolak</b>{" "}
                dengan alasan berikut?
              </Text>
            )}

            <form
              id="verifikasiPermintaanPerubahanDataForm"
              onSubmit={formik.handleSubmit}
            >
              {!verifikasi && (
                <FormControl mt={4} isInvalid={!!formik.errors.alasan}>
                  <FormLabel>
                    Alasan
                    <RequiredForm />
                  </FormLabel>
                  <Textarea
                    name="alasan"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("alasan", input);
                    }}
                    inputValue={formik.values.alasan}
                    isDisabled={verifikasi}
                    placeholder="Alasan verifikasi ditolak"
                  />
                  <FormErrorMessage>
                    {formik.errors.alasan as string}
                  </FormErrorMessage>
                </FormControl>
              )}
            </form>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              isDisabled={loading}
              onClick={backOnClose}
            >
              Tidak
            </Button>
            <Button
              w={"100%"}
              className="btn-ap clicky"
              colorScheme="ap"
              isLoading={loading}
              type="submit"
              form="verifikasiPermintaanPerubahanDataForm"
            >
              Ya
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
