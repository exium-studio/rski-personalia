import {
  Button,
  ButtonGroup,
  ButtonProps,
  Checkbox,
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
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiCalendarScheduleFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { Interface__SelectOption } from "../../constant/interfaces";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnCloseOld";
import formatDate from "../../lib/formatDate";
import req from "../../lib/req";
import MultiSelectKaryawanShift from "../dependent/_Select/MultiSelectKaryawanShift";
import SelectShift from "../dependent/_Select/SelectShift";
import DisclosureHeader from "../dependent/DisclosureHeader";
import DatePickerModal from "../dependent/input/DatePickerModal";
import RequiredForm from "../form/RequiredForm";

interface Props extends ButtonProps {}

export default function TerapkanJadwalModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("terapkan-jadwal-batch-modal", isOpen, onOpen, onClose);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      list_karyawan: undefined as any,
      tgl_mulai: undefined as any,
      shift: undefined as any,
      // tgl_selesai: undefined as any,
    },
    validationSchema: yup.object().shape({
      list_karyawan: yup.array().min(1, "Harus diisi").required("Harus diisi"),
      tgl_mulai: yup.string().required("Harus diisi"),
      shift: yup.object().required("Harus diisi"),
      // tgl_selesai: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        user_id: values?.list_karyawan?.map(
          (user: Interface__SelectOption) => user.value
        ),
        tgl_mulai: formatDate(values.tgl_mulai as string, "short"),
        tgl_selesai: "",
        shift_id: values.shift.value,
      };

      setLoading(true);
      req
        .post(`/api/rski/dashboard/jadwal-karyawan/data-jadwal`, payload)
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
            setLibur(false);
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
          setLoading(false);
        });
    },
  });
  const formikRef = useRef(formik);
  const [libur, setLibur] = useState<boolean>(false);
  useEffect(() => {
    formikRef.current.setFieldValue("shift", undefined);
    if (libur) {
      formikRef.current.setFieldValue("shift", { value: 0, label: "Libur" });
    }
  }, [libur, formikRef]);

  return (
    <>
      <Button
        colorScheme="ap"
        className="btn-ap clicky"
        onClick={onOpen}
        leftIcon={<Icon as={RiCalendarScheduleFill} fontSize={iconSize} />}
        {...props}
      >
        Terapkan Shift
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose(onClose);
          formik.resetForm();
          setLibur(false);
        }}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={0}>
            <DisclosureHeader
              title="Terapkan Jadwal Shift"
              onClose={() => {
                formik.resetForm();
                setLibur(false);
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="terapkanJadwalForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={!!formik.errors.list_karyawan}>
                <FormLabel>
                  Karyawan Shift
                  <RequiredForm />
                </FormLabel>
                <MultiSelectKaryawanShift
                  name="list_karyawan"
                  onConfirm={(input) => {
                    formik.setFieldValue("list_karyawan", input);
                  }}
                  inputValue={formik.values.list_karyawan}
                  isError={!!formik.errors.list_karyawan}
                  optionsDisplay="chip"
                  withSearch
                />
                <FormErrorMessage>
                  {formik.errors.list_karyawan as string}
                </FormErrorMessage>
              </FormControl>

              <SimpleGrid columns={[1]} gap={4}>
                <FormControl mb={4} isInvalid={!!formik.errors.tgl_mulai}>
                  <FormLabel>
                    Tanggal Mulai
                    <RequiredForm />
                  </FormLabel>
                  <DatePickerModal
                    id="terapkan-jadwal-tanggal-mulai"
                    name="tgl_mulai"
                    onConfirm={(input) => {
                      formik.setFieldValue("tgl_mulai", input);
                    }}
                    inputValue={
                      formik.values.tgl_mulai
                        ? new Date(formik.values.tgl_mulai)
                        : undefined
                    }
                    isError={!!formik.errors.tgl_mulai}
                  />
                  <FormErrorMessage>
                    {formik.errors.tgl_mulai as string}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <FormControl isInvalid={!!formik.errors.shift}>
                <FormLabel>
                  Jam Kerja (Shift)
                  <RequiredForm />
                </FormLabel>
                <SelectShift
                  name="shift"
                  placeholder="Pilih Jam Kerja"
                  onConfirm={(input) => {
                    formik.setFieldValue("shift", input);
                  }}
                  inputValue={formik.values.shift}
                  isError={!!formik.errors.shift}
                  mb={4}
                />
                <Checkbox
                  colorScheme="ap"
                  onChange={(e) => {
                    setLibur(e.target.checked);
                  }}
                  isChecked={libur}
                >
                  <Text mt={"-3px"}>Jadwalkan Libur</Text>
                </Checkbox>
                <FormErrorMessage>
                  {formik.errors.shift as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup w={"100%"}>
              <Button
                type="submit"
                form="terapkanJadwalForm"
                w={"100%"}
                colorScheme="ap"
                className="btn-ap clicky"
                isLoading={loading}
              >
                Terapkan
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
