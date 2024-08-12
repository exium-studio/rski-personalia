import {
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { RiUser2Fill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef } from "react";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import SelectKategoriDiklat from "../dependent/_Select/SelectKategoriDiklat";
import DisclosureHeader from "../dependent/DisclosureHeader";
import DateRangePickerModal from "../dependent/input/DateRangePickerModal";
import FileInputLarge from "../dependent/input/FileInputLarge";
import NumberInput from "../dependent/input/NumberInput";
import Textarea from "../dependent/input/Textarea";
import TimePickerModal from "../dependent/input/TimePickerModal";
import RequiredForm from "../form/RequiredForm";
import CContainer from "../wrapper/CContainer";

interface Props extends ButtonProps {}

export default function TambahAcaraDiklat({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-acara-diklat-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      gambar: "",
      nama: "",
      kategori: undefined,
      deskripsi: "",
      kuota: undefined,
      tempat: "",
      tgl_mulai: undefined,
      tgl_selesai: undefined,
      jam_mulai: undefined,
      jam_selesai: undefined,
    },
    validationSchema: yup.object().shape({
      gambar: yup.string().required("Harus diisi"),
      nama: yup.string().required("Harus diisi"),
      kategori: yup.object().required("Harus diisi"),
      deskripsi: yup.string().required("Harus diisi"),
      kuota: yup.number().required("Harus diisi"),
      tempat: yup.string().required("Harus diisi"),
      tgl_mulai: yup.string().required("Harus diisi"),
      tgl_selesai: yup.string().required("Harus diisi"),
      jam_mulai: yup.string().required("Harus diisi"),
      jam_selesai: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);

      //TODO api tambah cuti
    },
  });

  return (
    <>
      <Button
        className="btn-ap clicky"
        colorScheme="ap"
        onClick={onOpen}
        leftIcon={<Icon as={RiUser2Fill} fontSize={iconSize} />}
        pl={5}
        {...props}
      >
        Buat Acara Diklat
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          formik.resetForm();
          backOnClose();
        }}
        initialFocusRef={initialRef}
        scrollBehavior="inside"
        size={"full"}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent minH={"calc(100vh - 32px)"} borderRadius={12}>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader
              title="Buat Acara Diklat"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody className="scrollY">
            <form id="tambahAcaraDiklatForm" onSubmit={formik.handleSubmit}>
              <SimpleGrid columns={[1, 2]} spacingX={4} mb={8}>
                <FormControl
                  flex={"1 1"}
                  mb={4}
                  isInvalid={!!formik.errors.gambar}
                >
                  <FormLabel>
                    Gambar Thumbnail
                    <RequiredForm />
                  </FormLabel>
                  <FileInputLarge
                    name="gambar"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("gambar", input);
                    }}
                    inputValue={formik.values.gambar}
                    cProps={{ h: "100%" }}
                  />
                  <FormErrorMessage>
                    {formik.errors.gambar as string}
                  </FormErrorMessage>
                </FormControl>

                <CContainer flex={"1 1"} gap={4}>
                  <FormControl mb={4} isInvalid={!!formik.errors.nama}>
                    <FormLabel>
                      Nama Acara
                      <RequiredForm />
                    </FormLabel>
                    <Input
                      name="nama"
                      placeholder="Pendidikan & Latihan"
                      onChange={formik.handleChange}
                      value={formik.values.nama}
                    />
                    <FormErrorMessage>
                      {formik.errors.nama as string}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl mb={4} isInvalid={!!formik.errors.kategori}>
                    <FormLabel>
                      Kategori
                      <RequiredForm />
                    </FormLabel>
                    <SelectKategoriDiklat
                      name="kategori"
                      onConfirm={(input) => {
                        formik.setFieldValue("kategori", input);
                      }}
                      inputValue={formik.values.kategori}
                      isError={!!formik.errors.kategori}
                    />
                    <FormErrorMessage>
                      {formik.errors.kategori as string}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl mb={4} isInvalid={!!formik.errors.deskripsi}>
                    <FormLabel>
                      Deskripsi
                      <RequiredForm />
                    </FormLabel>
                    <Textarea
                      name="deskripsi"
                      onChangeSetter={(input) => {
                        formik.setFieldValue("deskripsi", input);
                      }}
                      inputValue={formik.values.deskripsi}
                      minH={"100%"}
                    />
                    <FormErrorMessage>
                      {formik.errors.deskripsi as string}
                    </FormErrorMessage>
                  </FormControl>
                </CContainer>
              </SimpleGrid>

              <SimpleGrid columns={[1, 2, 3]} spacingX={4}>
                <FormControl mb={4} isInvalid={!!formik.errors.kuota}>
                  <FormLabel>
                    Kuota Peserta
                    <RequiredForm />
                  </FormLabel>
                  <NumberInput
                    name="kuota"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("kuota", input);
                    }}
                    inputValue={formik.values.kuota}
                  />
                  <FormErrorMessage>
                    {formik.errors.kuota as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={
                    !!(formik.errors.tgl_mulai && formik.errors.tgl_selesai)
                  }
                >
                  <FormLabel>
                    Rentang Tanggal
                    <RequiredForm />
                  </FormLabel>
                  <DateRangePickerModal
                    id="date-range-tambah-diklat"
                    name="range_tgl"
                    onConfirm={(input) => {
                      if (input) {
                        formik.setFieldValue("tgl_mulai", input.from);
                        formik.setFieldValue("tgl_selesai", input.to);
                      }
                    }}
                    inputValue={
                      formik.values.tgl_mulai && formik.values.tgl_selesai
                        ? {
                            from: formik.values.tgl_mulai,
                            to: formik.values.tgl_selesai,
                          }
                        : undefined
                    }
                    isError={
                      !!(formik.errors.tgl_mulai || formik.errors.tgl_selesai)
                    }
                  />
                  <FormErrorMessage>
                    {
                      (formik.errors.tgl_mulai ||
                        formik.errors.tgl_selesai) as string
                    }
                  </FormErrorMessage>
                </FormControl>

                <FormControl mb={4} isInvalid={!!formik.errors.tempat}>
                  <FormLabel>
                    Lokasi
                    <RequiredForm />
                  </FormLabel>
                  <Input
                    name="tempat"
                    placeholder="Gedung Serba Guna"
                    onChange={formik.handleChange}
                    value={formik.values.tempat}
                  />
                  <FormErrorMessage>
                    {formik.errors.tempat as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl mb={4} isInvalid={!!formik.errors.jam_mulai}>
                  <FormLabel>
                    Jam Mulai
                    <RequiredForm />
                  </FormLabel>

                  <TimePickerModal
                    id="tambah-acara-diklat"
                    name="jam_mulai"
                    onConfirm={(input) => {
                      formik.setFieldValue("jam_mulai", input);
                    }}
                    inputValue={formik.values.jam_mulai}
                    isError={!!formik.errors.jam_mulai}
                  />
                  <FormErrorMessage>
                    {formik.errors.jam_mulai as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl mb={4} isInvalid={!!formik.errors.jam_selesai}>
                  <FormLabel>
                    Jam Selesai
                    <RequiredForm />
                  </FormLabel>

                  <TimePickerModal
                    id="tambah-acara-diklat"
                    name="jam_selesai"
                    onConfirm={(input) => {
                      formik.setFieldValue("jam_selesai", input);
                    }}
                    inputValue={formik.values.jam_selesai}
                    isError={!!formik.errors.jam_selesai}
                  />
                  <FormErrorMessage>
                    {formik.errors.jam_selesai as string}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>
            </form>

            <CContainer mt={"auto"}>
              <Button
                mt={4}
                mb={6}
                type="submit"
                form="tambahAcaraDiklatForm"
                className="btn-ap clicky"
                colorScheme="ap"
                w={"100%"}
                flexShrink={0}
              >
                Buat Acara Diklat
              </Button>
            </CContainer>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
