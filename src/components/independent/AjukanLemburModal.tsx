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
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { RiCalendarScheduleFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef } from "react";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import backOnClose from "../../lib/backOnCloseOld";
import useBackOnClose from "../../lib/useBackOnCloseOld";
import SelectKaryawan from "../dependent/_Select/SelectKaryawan";
import SelectKompensasi from "../dependent/_Select/SelectKompensasi";
import SelectShift from "../dependent/_Select/SelectShift";
import SelectTipeCuti from "../dependent/_Select/SelectTipeCuti";
import DisclosureHeader from "../dependent/DisclosureHeader";
import DatePickerModal from "../dependent/input/DatePickerModal";
import TimePickerModal from "../dependent/input/TimePickerModal";
import RequiredForm from "../form/RequiredForm";
import Textarea from "../dependent/input/Textarea";

interface Props extends ButtonProps {}

export default function AjukanLemburModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(isOpen, onClose);
  const initialRef = useRef(null);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      karyawan: undefined,
      tgl_pengajuan: undefined,
      shift: undefined,
      kompensasi: undefined,
      tipe: undefined,
      durasi: undefined,
      catatan: "",
    },
    validationSchema: yup.object().shape({
      karyawan: yup.object().required("Harus diisi"),
      tgl_pengajuan: yup.string().required("Harus diisi"),
      shift: yup.object().required("Harus diisi"),
      kompensasi: yup.object().required("Harus diisi"),
      tipe: yup.object().required("Harus diisi"),
      durasi: yup.string().required("Harus diisi"),
      catatan: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);
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
          backOnClose(onClose);
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

              <FormControl mb={4} isInvalid={!!formik.errors.shift}>
                <FormLabel>
                  Shift
                  <RequiredForm />
                </FormLabel>
                <SelectShift
                  name="shift"
                  placeholder="Pilih Jadwal"
                  onConfirm={(input) => {
                    formik.setFieldValue("shift", input);
                  }}
                  inputValue={formik.values.shift}
                  isError={!!formik.errors.shift}
                />
                <FormErrorMessage>
                  {formik.errors.shift as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.kompensasi}>
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
              </FormControl>

              <SimpleGrid columns={[1, 2]} gap={4}>
                <FormControl mb={4} isInvalid={!!formik.errors.tipe}>
                  <FormLabel>
                    Tipe
                    <RequiredForm />
                  </FormLabel>
                  <SelectTipeCuti
                    name="tipe"
                    onConfirm={(input) => {
                      formik.setFieldValue("tipe", input);
                    }}
                    inputValue={formik.values.tipe}
                    isError={!!formik.errors.tipe}
                  />
                  <FormErrorMessage>
                    {formik.errors.tipe as string}
                  </FormErrorMessage>
                </FormControl>

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
                    isError={!!formik.errors.durasi}
                  />
                  <FormErrorMessage>
                    {formik.errors.durasi as string}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>

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
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
