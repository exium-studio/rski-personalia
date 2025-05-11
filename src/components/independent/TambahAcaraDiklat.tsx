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
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiUser2Fill } from "@remixicon/react";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import req from "../../lib/req";
import SelectKategoriDiklat from "../dependent/_Select/SelectKategoriDiklat";
import DisclosureHeader from "../dependent/DisclosureHeader";
import DateRangePickerModal from "../dependent/input/DateRangePickerModal";
import FileInput from "../dependent/input/FileInput";
import FileInputLarge from "../dependent/input/FileInputLarge";
import NumberInput from "../dependent/input/NumberInput";
import Textarea from "../dependent/input/Textarea";
import TimePickerModal from "../dependent/input/TimePickerModal";
import RequiredForm from "../form/RequiredForm";
import CContainer from "../wrapper/CContainer";
import MultiSelectKaryawanPenerimaWithFilter from "../dependent/_Select/MultiSelectKaryawanWithFilter";

interface Props extends ButtonProps {}

export default function TambahAcaraDiklat({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-acara-diklat-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      gambar: undefined as any,
      whitelist_peserta: undefined as any,
      nama: "",
      kategori: {
        value: 1,
        label: "Internal",
      },
      deskripsi: "",
      kuota: undefined as any,
      lokasi: "",
      tgl_mulai: undefined as any,
      tgl_selesai: undefined as any,
      jam_mulai: undefined as any,
      jam_selesai: undefined as any,
      skp: "" as any,
      dokumen_diklat_1: undefined as any,
      dokumen_diklat_2: undefined as any,
      dokumen_diklat_3: undefined as any,
      dokumen_diklat_4: undefined as any,
      dokumen_diklat_5: undefined as any,
    },
    validationSchema: yup.object().shape({
      gambar: yup.string().required("Harus diisi"),
      whitelist_peserta: yup.array(),
      nama: yup.string().required("Harus diisi"),
      kategori: yup.object().required("Harus diisi"),
      deskripsi: yup.string().required("Harus diisi"),
      kuota: yup.number().required("Harus diisi"),
      lokasi: yup.string().required("Harus diisi"),
      tgl_mulai: yup.string().required("Harus diisi"),
      tgl_selesai: yup.string().required("Harus diisi"),
      jam_mulai: yup.string().required("Harus diisi"),
      jam_selesai: yup.string().required("Harus diisi"),
      skp: yup.string(),
      dokumen_diklat_1: yup.mixed(),
      dokumen_diklat_2: yup.mixed(),
      dokumen_diklat_3: yup.mixed(),
      dokumen_diklat_4: yup.mixed(),
      dokumen_diklat_5: yup.mixed(),
    }),
    onSubmit: (values, { resetForm }) => {
      // console.log(values.whitelist_peserta);
      const payload = new FormData();
      values.whitelist_peserta.forEach((peserta: any) => {
        payload.append("user_id[]", peserta.value);
      });
      payload.append("dokumen", values.gambar);
      payload.append("nama", values.nama);
      payload.append("deskripsi", values.deskripsi);
      payload.append("kuota", values.kuota);
      payload.append("tgl_mulai", formatDate(values.tgl_mulai, "short"));
      payload.append("tgl_selesai", formatDate(values.tgl_selesai, "short"));
      payload.append("jam_mulai", values.jam_mulai);
      payload.append("jam_selesai", values.jam_selesai);
      payload.append("lokasi", values.lokasi);
      payload.append("skp", values.skp);
      if (values.dokumen_diklat_1)
        payload.append("dokumen_diklat_1", values.dokumen_diklat_1);
      if (values.dokumen_diklat_2)
        payload.append("dokumen_diklat_2", values.dokumen_diklat_2);
      if (values.dokumen_diklat_3)
        payload.append("dokumen_diklat_3", values.dokumen_diklat_3);
      if (values.dokumen_diklat_4)
        payload.append("dokumen_diklat_4", values.dokumen_diklat_4);
      if (values.dokumen_diklat_5)
        payload.append("dokumen_diklat_5", values.dokumen_diklat_5);

      setLoading(true);
      req
        .post(`/api/rski/dashboard/perusahaan/diklat`, payload)
        .then((r) => {
          if (r.status === 201) {
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

  const formikRef = useRef(formik);
  useEffect(() => {
    if (formik.values?.whitelist_peserta?.length > 0) {
      formikRef.current.setFieldValue(
        "kuota",
        formik.values?.whitelist_peserta.length
      );
    } else {
      formikRef.current.setFieldValue("kuota", undefined);
    }
  }, [formik.values?.whitelist_peserta]);

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
              <SimpleGrid columns={[1, 2]} spacingX={4} mb={2}>
                <CContainer h={"fit-content"}>
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
                      placeholder="Mendukung .png .jpg .jpeg .svg"
                      // cProps={{ h: "calc(100%)" }}
                      isError={!!formik.errors.gambar}
                    />
                    <FormErrorMessage>
                      {formik.errors.gambar as string}
                    </FormErrorMessage>
                  </FormControl>
                </CContainer>

                <CContainer flex={"1 1"}>
                  <FormControl mb={4} isInvalid={!!formik.errors.nama}>
                    <FormLabel>
                      Nama Diklat
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
                      isDisabled
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
                      // minH={"100%"}
                    />
                    <FormErrorMessage>
                      {formik.errors.deskripsi as string}
                    </FormErrorMessage>
                  </FormControl>
                </CContainer>
              </SimpleGrid>

              <SimpleGrid columns={[1, 2, 3]} spacingX={4}>
                <FormControl
                  mb={4}
                  isInvalid={!!formik.errors.whitelist_peserta}
                >
                  <FormLabel>Whitelist Peserta</FormLabel>
                  <MultiSelectKaryawanPenerimaWithFilter
                    name="whitelist_peserta"
                    optionsDisplay="chip"
                    onConfirm={(input) => {
                      formik.setFieldValue("whitelist_peserta", input);
                    }}
                    inputValue={formik.values.whitelist_peserta}
                  />
                  <FormErrorMessage>
                    {formik.errors.whitelist_peserta as string}
                  </FormErrorMessage>
                </FormControl>

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
                    isDisabled={formik.values?.whitelist_peserta?.length > 0}
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

                {/* Time */}
                <CContainer>
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
                </CContainer>

                <FormControl mb={4} isInvalid={!!formik.errors.skp}>
                  <FormLabel>
                    SKP
                    {/* <RequiredForm /> */}
                  </FormLabel>
                  <Textarea
                    name="skp"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("skp", input);
                    }}
                    inputValue={formik.values.skp}
                    minH={"128px"}
                  />
                  <FormErrorMessage>
                    {formik.errors.skp as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl mb={4} isInvalid={!!formik.errors.lokasi}>
                  <FormLabel>
                    Lokasi
                    <RequiredForm />
                  </FormLabel>
                  <Input
                    name="lokasi"
                    placeholder="Gedung Serba Guna"
                    onChange={formik.handleChange}
                    value={formik.values.lokasi}
                  />
                  <FormErrorMessage>
                    {formik.errors.lokasi as string}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <Text opacity={0.6} my={2}>
                *Unggah dokumen harus urut dari 1, maks. 5 dokumen
              </Text>
              <SimpleGrid columns={[1, 2, 3]} gap={4}>
                <FormControl
                  mb={4}
                  isInvalid={!!formik.errors.dokumen_diklat_1}
                >
                  <FormLabel>Dokumen 1</FormLabel>
                  <FileInput
                    name="dokumen_diklat_1"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("dokumen_diklat_1", input);
                    }}
                    inputValue={formik.values.dokumen_diklat_1}
                    placeholder="Mendukung .png .jpg .jpeg .svg"
                    isError={!!formik.errors.dokumen_diklat_1}
                  />
                  <FormErrorMessage>
                    {formik.errors.dokumen_diklat_1 as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!formik.errors.dokumen_diklat_2}
                  isDisabled={!!!formik.values.dokumen_diklat_1}
                >
                  <FormLabel>Dokumen 2</FormLabel>
                  <FileInput
                    name="dokumen_diklat_2"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("dokumen_diklat_2", input);
                    }}
                    inputValue={formik.values.dokumen_diklat_2}
                    placeholder="Mendukung .png .jpg .jpeg .svg"
                    isError={!!formik.errors.dokumen_diklat_2}
                    isDisabled={!!!formik.values.dokumen_diklat_1}
                  />
                  <FormErrorMessage>
                    {formik.errors.dokumen_diklat_2 as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!formik.errors.dokumen_diklat_3}
                  isDisabled={!!!formik.values.dokumen_diklat_2}
                >
                  <FormLabel>Dokumen 3</FormLabel>
                  <FileInput
                    name="dokumen_diklat_3"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("dokumen_diklat_3", input);
                    }}
                    inputValue={formik.values.dokumen_diklat_3}
                    placeholder="Mendukung .png .jpg .jpeg .svg"
                    isError={!!formik.errors.dokumen_diklat_3}
                    isDisabled={!!!formik.values.dokumen_diklat_2}
                  />
                  <FormErrorMessage>
                    {formik.errors.dokumen_diklat_3 as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!formik.errors.dokumen_diklat_4}
                  isDisabled={!!!formik.values.dokumen_diklat_3}
                >
                  <FormLabel>Dokumen 4</FormLabel>
                  <FileInput
                    name="dokumen_diklat_4"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("dokumen_diklat_4", input);
                    }}
                    inputValue={formik.values.dokumen_diklat_4}
                    placeholder="Mendukung .png .jpg .jpeg .svg"
                    isError={!!formik.errors.dokumen_diklat_4}
                    isDisabled={!!!formik.values.dokumen_diklat_3}
                  />
                  <FormErrorMessage>
                    {formik.errors.dokumen_diklat_4 as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!formik.errors.dokumen_diklat_5}
                  isDisabled={!!!formik.values.dokumen_diklat_4}
                >
                  <FormLabel>Dokumen 5</FormLabel>
                  <FileInput
                    name="dokumen_diklat_5"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("dokumen_diklat_5", input);
                    }}
                    inputValue={formik.values.dokumen_diklat_5}
                    placeholder="Mendukung .png .jpg .jpeg .svg"
                    isError={!!formik.errors.dokumen_diklat_5}
                    isDisabled={!!!formik.values.dokumen_diklat_4}
                  />
                  <FormErrorMessage>
                    {formik.errors.dokumen_diklat_5 as string}
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
                isLoading={loading}
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
