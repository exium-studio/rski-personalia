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
import { RiCalendarScheduleFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import req from "../../lib/req";
import SelectJadwalKaryawanLembur from "../dependent/_Select/SelectJadwalKaryawanLembur";
import SelectKaryawanAllJenisKaryawan from "../dependent/_Select/SelectKaryawanAllJenisKaryawan";
import DisclosureHeader from "../dependent/DisclosureHeader";
import DatePickerModal from "../dependent/input/DatePickerModal";
import Textarea from "../dependent/input/Textarea";
import TimePickerModal from "../dependent/input/TimePickerModal";
import RequiredForm from "../form/RequiredForm";

interface Props extends ButtonProps {}

export default function AjukanLemburModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("ajukan-lembur-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const [isShift, setIsShift] = useState<boolean>(false);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      karyawan: undefined as any,
      jadwal: undefined as any,
      tgl_pengajuan: undefined as any,
      durasi: undefined as any,
      catatan: "",
    },
    validationSchema: yup.object().shape({
      karyawan: yup.object().required("Harus diisi"),
      jadwal: isShift ? yup.object().required("Harus diisi") : yup.mixed(),
      tgl_pengajuan: !isShift
        ? yup.string().required("Harus diisi")
        : yup.mixed(),
      durasi: yup.string().required("Harus diisi"),
      catatan: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        user_id: values.karyawan.value,
        jadwal_id: values?.jadwal?.value,
        tgl_pengajuan: values.tgl_pengajuan
          ? formatDate(values.tgl_pengajuan, "short")
          : null,
        durasi: values.durasi,
        catatan: values.catatan,
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/jadwal-karyawan/lembur`, payload)
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
          setLoading(false);
        });
    },
  });

  useEffect(() => {
    if (formik.values?.karyawan?.label2 === "Shift") {
      setIsShift(true);
    } else {
      setIsShift(false);
    }
  }, [formik.values?.karyawan?.label2]);

  return (
    <>
      <Button
        colorScheme="ap"
        className="btn-ap clicky"
        onClick={onOpen}
        leftIcon={<Icon as={RiCalendarScheduleFill} fontSize={iconSize} />}
        {...props}
      >
        Ajukan Lembur
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
              title="Ajukan Lembur"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="ajukanLemburForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={!!formik.errors.karyawan}>
                <FormLabel>
                  Karyawan
                  <RequiredForm />
                </FormLabel>
                <SelectKaryawanAllJenisKaryawan
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

              {formik.values?.karyawan?.label2 === "Non-Shift" && (
                <FormControl mb={4} isInvalid={!!formik.errors.tgl_pengajuan}>
                  <FormLabel>
                    Tanggal Lembur
                    <RequiredForm />
                  </FormLabel>
                  <DatePickerModal
                    id="ajukan-lembur-tgl-pengajuan"
                    name="tgl_pengajuan"
                    onConfirm={(input) => {
                      formik.setFieldValue("tgl_pengajuan", input);
                    }}
                    inputValue={
                      formik.values.tgl_pengajuan
                        ? new Date(formik.values.tgl_pengajuan)
                        : undefined
                    }
                    isError={!!formik.errors.tgl_pengajuan}
                  />
                  <FormErrorMessage>
                    {formik.errors.tgl_pengajuan as string}
                  </FormErrorMessage>
                </FormControl>
              )}

              {formik.values?.karyawan?.label2 === "Shift" && (
                <FormControl mb={4} isInvalid={!!formik.errors.jadwal}>
                  <FormLabel>
                    Jadwal
                    <RequiredForm />
                  </FormLabel>
                  <SelectJadwalKaryawanLembur
                    user_id={formik.values?.karyawan?.value}
                    isDisabled={!!!formik.values?.karyawan}
                    name="jadwal"
                    placeholder="Pilih Jadwal"
                    onConfirm={(input) => {
                      formik.setFieldValue("jadwal", input);
                    }}
                    inputValue={formik.values.jadwal}
                    isError={!!formik.errors.jadwal}
                  />
                  <FormErrorMessage>
                    {formik.errors.jadwal as string}
                  </FormErrorMessage>
                </FormControl>
              )}

              <FormControl mb={4} isInvalid={!!formik.errors.durasi}>
                <FormLabel>
                  Durasi
                  <RequiredForm />
                </FormLabel>
                <TimePickerModal
                  id="ajukan-lembur"
                  name="durasi"
                  onConfirm={(input) => {
                    formik.setFieldValue("durasi", input);
                  }}
                  inputValue={formik.values.durasi}
                  placeholder="Tentukan Durasi"
                  isError={!!formik.errors.durasi}
                />
                <FormErrorMessage>
                  {formik.errors.durasi as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formik.errors.catatan}>
                <FormLabel>
                  Catatan
                  <RequiredForm />
                </FormLabel>
                <Textarea
                  name="catatan"
                  placeholder="Catatan untuk karyawan"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("catatan", input);
                  }}
                  inputValue={formik.values.catatan}
                />
                <FormErrorMessage>
                  {formik.errors.catatan as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="ajukanLemburForm"
              w={"100%"}
              colorScheme="ap"
              className="btn-ap clicky"
              isLoading={loading}
            >
              Ajukan Lembur
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
