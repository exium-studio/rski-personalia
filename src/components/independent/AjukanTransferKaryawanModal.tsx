import {
  Button,
  ButtonProps,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
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
} from "@chakra-ui/react";
import { RiUserSharedFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef } from "react";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnCloseOld";
import SelectJabatan from "../dependent/_Select/SelectJabatan";
import SelectKaryawan from "../dependent/_Select/SelectKaryawan";
import SelectKelompokGaji from "../dependent/_Select/SelectKelompokGaji";
import SelectTipeTransfer from "../dependent/_Select/SelectTipeTransfer";
import SelectUnitKerja from "../dependent/_Select/SelectUnitKerja";
import DisclosureHeader from "../dependent/DisclosureHeader";
import DatePickerModal from "../dependent/input/DatePickerModal";
import RequiredForm from "../form/RequiredForm";
import Textarea from "../dependent/input/Textarea";
import FileInput from "../dependent/input/FileInput";

interface Props extends ButtonProps {}

export default function AjukanTransferKaryawanModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("ajukan-transfer-karyawan-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      karyawan: undefined,
      tgl_mulai: "",
      tipe: "" as any,
      unit_kerja_tujuan: "" as any,
      jabatan_tujuan: "" as any,
      kelompok_gaji_tujuan: "" as any,
      dokumen: "",
      alasan: "",
      beri_tahu_manajer_direktur: false,
      beri_tahu_karyawan: false,
    },
    validationSchema: yup.object().shape({
      karyawan: yup.string().required("Harus diisi"),
      tgl_mulai: yup.string().required("Harus diisi"),
      tipe: yup.mixed().required("Harus diisi"),
      unit_kerja_tujuan: yup.mixed(),
      jabatan_tujuan: yup.mixed(),
      kelompok_gaji_tujuan: yup.mixed(),
      dokumen: yup.array().min(1, "Harus diisi").required("Harus diisi"),
      alasan: yup.string().required("Harus diisi"),
      beri_tahu_manajer_direktur: yup.boolean(),
      beri_tahu_karyawan: yup.boolean(),
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
        leftIcon={<Icon as={RiUserSharedFill} fontSize={iconSize} />}
        pl={5}
        {...props}
      >
        Transfer Karyawan
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose(onClose);
          formik.resetForm();
        }}
        initialFocusRef={initialRef}
        isCentered
        scrollBehavior="inside"
        size={"full"}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent borderRadius={12} minH={"calc(100vh - 32px)"}>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader
              title={"Transfer Karyawan"}
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody className="scrollY">
            <form id="transferKaryawanForm" onSubmit={formik.handleSubmit}>
              <SimpleGrid columns={[1, 2]} spacingX={4}>
                <FormControl mb={4} isInvalid={!!formik.errors.karyawan}>
                  <FormLabel>
                    Nama Karyawan
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

                <FormControl mb={4} isInvalid={!!formik.errors.tgl_mulai}>
                  <FormLabel>
                    Tanggal Mulai
                    <RequiredForm />
                  </FormLabel>
                  <DatePickerModal
                    id="ajukan-transfer-karyawan-tgl-mulai"
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

                <FormControl mb={4} isInvalid={!!formik.errors.tipe}>
                  <FormLabel>
                    Tipe Transfer
                    <RequiredForm />
                  </FormLabel>
                  <SelectTipeTransfer
                    name="tipe"
                    onConfirm={(input) => {
                      formik.setFieldValue("tipe", input);
                    }}
                    inputValue={formik.values.tipe}
                  />
                  <FormErrorMessage>
                    {formik.errors.tipe as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!formik.errors.unit_kerja_tujuan}
                >
                  <FormLabel>Unit Kerja Tujuan</FormLabel>
                  <SelectUnitKerja
                    name="unit_kerja"
                    onConfirm={(input) => {
                      formik.setFieldValue("unit_kerja", input);
                    }}
                    inputValue={formik.values.unit_kerja_tujuan}
                    placeholder="Pilih Unit Kerja Tujuan"
                    withSearch
                  />
                  <FormHelperText>
                    Kosongkan jika data sama seperti sebelumnya
                  </FormHelperText>
                  <FormErrorMessage>
                    {formik.errors.unit_kerja_tujuan as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl mb={4} isInvalid={!!formik.errors.jabatan_tujuan}>
                  <FormLabel>Jabatan Tujuan</FormLabel>
                  <SelectJabatan
                    name="jabatan"
                    onConfirm={(input) => {
                      formik.setFieldValue("jabatan", input);
                    }}
                    inputValue={formik.values.jabatan_tujuan}
                    placeholder="Pilih Jabatan Tujuan"
                    withSearch
                  />
                  <FormHelperText>
                    Kosongkan jika data sama seperti sebelumnya
                  </FormHelperText>
                  <FormErrorMessage>
                    {formik.errors.jabatan_tujuan as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!formik.errors.kelompok_gaji_tujuan}
                >
                  <FormLabel>Kelompok Gaji Tujuan</FormLabel>
                  <SelectKelompokGaji
                    name="kelompok_gaji"
                    onConfirm={(input) => {
                      formik.setFieldValue("kelompok_gaji", input);
                    }}
                    inputValue={formik.values.kelompok_gaji_tujuan}
                    placeholder="Pilih Kelompok Gaji Tujuan"
                  />
                  <FormHelperText>
                    Kosongkan jika data sama seperti sebelumnya
                  </FormHelperText>
                  <FormErrorMessage>
                    {formik.errors.kelompok_gaji_tujuan as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl mb={4} isInvalid={!!formik.errors.dokumen}>
                  <FormLabel>
                    Dokumen
                    <RequiredForm />
                  </FormLabel>
                  <FileInput
                    name="dokumen"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("dokumne", input);
                    }}
                    inputValue={formik.values.dokumen}
                  />
                  <FormErrorMessage>
                    {formik.errors.dokumen as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={formik.errors.alasan ? true : false}
                >
                  <FormLabel>
                    Alesan
                    <RequiredForm />
                  </FormLabel>
                  <Textarea
                    name="alasan"
                    placeholder="Alasan transfer pegawai"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("alasan", input);
                    }}
                    inputValue={formik.values.alasan}
                  />
                  <FormErrorMessage>
                    {formik.errors.alasan as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl>
                  <Checkbox colorScheme="ap" alignItems={"start"}>
                    <Text mt={"-2px"}>
                      Beritahu Manajer Karyawan dan Direktur Melalui Email
                    </Text>
                  </Checkbox>
                  <FormErrorMessage>
                    {formik.errors.beri_tahu_manajer_direktur as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl>
                  <Checkbox colorScheme="ap">
                    <Text mt={"-2px"}>Beritahu Karyawan Melalui Email</Text>
                  </Checkbox>
                  <FormErrorMessage>
                    {formik.errors.beri_tahu_karyawan as string}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="transferKaryawanForm"
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
