import {
  Box,
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
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
import { RiArrowUpDownLine, RiCalendarCheckFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import SelectKaryawan from "../dependent/_Select/SelectKaryawan";
import SelectJadwalKaryawan from "../dependent/_Select/SelectJadwalKaryawan";
import DisclosureHeader from "../dependent/DisclosureHeader";
import RequiredForm from "../form/RequiredForm";
import SelectKaryawanDitukar from "../dependent/_Select/SelectKaryawanDitukar";
import SelectJadwalKaryawanDitukar from "../dependent/_Select/SelectJadwalKaryawanDitukar";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import req from "../../lib/req";

interface Props extends ButtonProps {}

export default function AjukanTukarJadwalModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("ajukan-tukar-jadwal-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      user_pengajuan: "" as any,
      jadwal_pengajuan: "" as any,
      user_ditukar: "" as any,
      jadwal_ditukar: "" as any,
    },
    validationSchema: yup.object().shape({
      user_pengajuan: yup.object().required("Harus diisi"),
      jadwal_pengajuan: yup.object().required("Harus diisi"),
      user_ditukar: yup.object().required("Harus diisi"),
      jadwal_ditukar: yup.object().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        user_pengajuan: values.user_pengajuan.value,
        jadwal_pengajuan: values.jadwal_pengajuan.value,
        user_ditukar: values.user_ditukar.value,
        jadwal_ditukar: values.jadwal_ditukar.value,
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/jadwal-karyawan/tukar-jadwal`, payload)
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
        leftIcon={<Icon as={RiCalendarCheckFill} fontSize={iconSize} />}
        {...props}
      >
        Ajukan Tukar Jadwal
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
              title="Ajukan Tukar Jadwal"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="ajukanPenukaranJadwalForm" onSubmit={formik.handleSubmit}>
              <FormControl
                mb={4}
                isInvalid={formik.errors.user_pengajuan ? true : false}
              >
                <FormLabel>
                  Karyawan Pengajuan
                  <RequiredForm />
                </FormLabel>
                <SelectKaryawan
                  name="user_pengajuan"
                  onConfirm={(input) => {
                    formik.resetForm();
                    formik.setFieldValue("user_pengajuan", input);
                  }}
                  inputValue={formik.values.user_pengajuan}
                  isError={!!formik.errors.user_pengajuan}
                />
                <FormErrorMessage>
                  {formik.errors.user_pengajuan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.jadwal_pengajuan ? true : false}
              >
                <FormLabel>
                  Jadwal Pengajuan
                  <RequiredForm />
                </FormLabel>
                <SelectJadwalKaryawan
                  user_id={formik.values.user_pengajuan?.value}
                  isDisabled={!formik.values.user_pengajuan}
                  name="jadwal_pengajuan"
                  onConfirm={(input) => {
                    formik.setFieldValue("jadwal_pengajuan", input);
                  }}
                  inputValue={formik.values.jadwal_pengajuan}
                  isError={!!formik.errors.jadwal_pengajuan}
                />
                <FormErrorMessage>
                  {formik.errors.jadwal_pengajuan as string}
                </FormErrorMessage>
              </FormControl>

              <HStack my={8}>
                <Box w={"100%"} h={"2px"} bg={"var(--divider2)"} />
                <Icon as={RiArrowUpDownLine} fontSize={20} color={"p.500"} />
                <Box w={"100%"} h={"2px"} bg={"var(--divider2)"} />
              </HStack>

              <FormControl
                mb={4}
                isInvalid={formik.errors.user_ditukar ? true : false}
              >
                <FormLabel>
                  Karyawan Ditukar
                  <RequiredForm />
                </FormLabel>
                <SelectKaryawanDitukar
                  jadwal_id={formik.values.jadwal_pengajuan?.value}
                  isDisabled={!formik.values.jadwal_pengajuan}
                  name="user_ditukar"
                  onConfirm={(input) => {
                    formik.setFieldValue("user_ditukar", input);
                  }}
                  inputValue={formik.values.user_ditukar}
                  isError={!!formik.errors.user_ditukar}
                />
                <FormErrorMessage>
                  {formik.errors.user_ditukar as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.jadwal_ditukar ? true : false}
              >
                <FormLabel>
                  Jadwal Ditukar
                  <RequiredForm />
                </FormLabel>
                <SelectJadwalKaryawanDitukar
                  user_id={formik.values.user_pengajuan?.value}
                  isDisabled={!formik.values.user_pengajuan}
                  name="jadwal_ditukar"
                  onConfirm={(input) => {
                    formik.setFieldValue("jadwal_ditukar", input);
                  }}
                  inputValue={formik.values.jadwal_ditukar}
                  isError={!!formik.errors.jadwal_ditukar}
                />
                <FormErrorMessage>
                  {formik.errors.jadwal_ditukar as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type={"submit"}
              form="ajukanPenukaranJadwalForm"
              w={"100%"}
              colorScheme="ap"
              className="btn-ap clicky"
              isLoading={loading}
            >
              Tukar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
