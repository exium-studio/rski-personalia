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
import { useRef, useState } from "react";
import * as yup from "yup";
import req from "../../constant/req";
import { iconSize } from "../../constant/sizes";
import useRenderTrigger from "../../global/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import SelectJadwalKaryawan from "../dependent/_Select/SelectJadwalKaryawan";
import SelectKaryawan from "../dependent/_Select/SelectKaryawan";
import DisclosureHeader from "../dependent/DisclosureHeader";
import DatePickerModal from "../dependent/input/DatePickerModal";
import Textarea from "../dependent/input/Textarea";
import TimePickerModal from "../dependent/input/TimePickerModal";
import RequiredForm from "../form/RequiredForm";
import formatDate from "../../lib/formatDate";

interface Props extends ButtonProps {}

export default function AjukanLemburModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("ajukan-lembur-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      karyawan: undefined as any,
      tgl_pengajuan: undefined as any,
      jadwal: undefined as any,
      // kompensasi: undefined as any,
      durasi: undefined as any,
      catatan: "",
    },
    validationSchema: yup.object().shape({
      karyawan: yup.object().required("Harus diisi"),
      tgl_pengajuan: yup.string().required("Harus diisi"),
      jadwal: yup.object().required("Harus diisi"),
      // kompensasi: yup.object().required("Harus diisi"),
      durasi: yup.string().required("Harus diisi"),
      catatan: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        tgl_pengajuan: formatDate(values.tgl_pengajuan, "short"),
        user_id: values.karyawan.value,
        jadwal_id: values.jadwal.value,
        // kompensasi_lembur_id: values.kompensasi.value,
        durasi: values.durasi,
        catatan: values.catatan,
        // status_lembur_id: 1,
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
              <FormControl mb={4} isInvalid={!!formik.errors.tgl_pengajuan}>
                <FormLabel>
                  Tanggal Pengajuan
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

              <FormControl mb={4} isInvalid={!!formik.errors.karyawan}>
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

              <FormControl mb={4} isInvalid={!!formik.errors.jadwal}>
                <FormLabel>
                  Jadwal
                  <RequiredForm />
                </FormLabel>
                <SelectJadwalKaryawan
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

              {/* <FormControl mb={4} isInvalid={!!formik.errors.kompensasi}>
                <FormLabel>
                  Kompensasi
                  <RequiredForm />
                </FormLabel>
                <SelectKompensasi
                  name="kompensasi"
                  onConfirm={(input) => {
                    formik.setFieldValue("kompensasi", input);
                  }}
                  inputValue={formik.values.kompensasi}
                />
                <FormErrorMessage>
                  {formik.errors.kompensasi as string}
                </FormErrorMessage>
              </FormControl> */}

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
