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
  Text,
  useDisclosure,
  useToast,
  Wrap,
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
import DisclosureHeader from "../dependent/DisclosureHeader";
import StringInput from "../dependent/input/StringInput";
import TimePickerModal from "../dependent/input/TimePickerModal";
import RequiredForm from "../form/RequiredForm";
import SelectUnitKerja from "../dependent/_Select/SelectUnitKerja";

interface Props extends ButtonProps {}

export default function TambahShift({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-shift-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama: "",
      jam_from: undefined,
      jam_to: undefined,
      unit_kerja: undefined as any,
    },
    validationSchema: yup.object().shape({
      nama: yup.string().required("Harus diisi"),
      jam_from: yup.string().required("Harus diisi"),
      jam_to: yup.string().required("Harus diisi"),
      unit_kerja: yup.object().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama: values.nama,
        jam_from: values.jam_from,
        jam_to: values.jam_to,
        unit_kerja_id: values.unit_kerja.value,
      };
      setUpdateLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/shift`, payload)
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
          setUpdateLoading(false);
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
        Tambah Shift
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
              title="Tambah Shift"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="tambahUnitKerjaForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={formik.errors.nama ? true : false}>
                <FormLabel>
                  Nama Shift
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="nama"
                  placeholder="Pagi 1"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("nama", input);
                  }}
                  inputValue={formik.values.nama}
                />
                <FormErrorMessage>
                  {formik.errors.nama as string}
                </FormErrorMessage>
              </FormControl>

              <FormLabel>
                Jam Kerja
                <RequiredForm />
              </FormLabel>

              <Wrap spacing={4} mb={4}>
                <FormControl flex={"1 1"} isInvalid={!!formik.errors.jam_from}>
                  <TimePickerModal
                    id="tambah-shift-jam-from-modal"
                    name="jam_from"
                    onConfirm={(input) => {
                      formik.setFieldValue("jam_from", input);
                    }}
                    inputValue={formik.values.jam_from}
                    isError={!!formik.errors.jam_from}
                  />

                  <FormErrorMessage>
                    {formik.errors.jam_from as string}
                  </FormErrorMessage>
                </FormControl>

                <Text mt={"5px"} textAlign={"center"}>
                  -
                </Text>

                <FormControl flex={"1 1"} isInvalid={!!formik.errors.jam_to}>
                  <TimePickerModal
                    id="tambah-shift-jam-to-modal"
                    name="jam_to"
                    onConfirm={(input) => {
                      formik.setFieldValue("jam_to", input);
                    }}
                    inputValue={formik.values.jam_to}
                    isError={!!formik.errors.jam_to}
                  />

                  <FormErrorMessage>
                    {formik.errors.jam_to as string}
                  </FormErrorMessage>
                </FormControl>
              </Wrap>

              <FormControl isInvalid={formik.errors.unit_kerja ? true : false}>
                <FormLabel>
                  Unit Kerja
                  <RequiredForm />
                </FormLabel>
                <SelectUnitKerja
                  name="unit_kerja"
                  onConfirm={(input) => {
                    formik.setFieldValue("unit_kerja", input);
                  }}
                  inputValue={formik.values.unit_kerja}
                  isError={!!formik.errors.unit_kerja}
                />
                <FormErrorMessage>
                  {formik.errors.unit_kerja as string}
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
              isLoading={updateLoading}
            >
              Tambahkan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
