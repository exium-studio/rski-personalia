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
  useToast,
} from "@chakra-ui/react";
import { RiUser2Fill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
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
import FileInputLarge from "../dependent/input/FileInputLarge";
import Textarea from "../dependent/input/Textarea";
import TimePickerModal from "../dependent/input/TimePickerModal";
import RequiredForm from "../form/RequiredForm";
import CContainer from "../wrapper/CContainer";
import SelectKaryawanAllJenisKaryawan from "../dependent/_Select/SelectKaryawanAllJenisKaryawan";

interface Props extends ButtonProps {}

export default function TambahAcaraDiklatEksternal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-acara-diklat-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      user: undefined as any,
      nama: "",
      kategori: {
        value: 2,
        label: "Eksternal",
      },
      deskripsi: "",
      dokumen: undefined as any,
      // kuota: undefined as any,
      lokasi: "",
      tgl_mulai: undefined as any,
      tgl_selesai: undefined as any,
      jam_mulai: undefined as any,
      jam_selesai: undefined as any,
      skp: "" as any,
    },
    validationSchema: yup.object().shape({
      user: yup.object().required("Harus diisi"),
      dokumen: yup.string().required("Harus diisi"),
      nama: yup.string().required("Harus diisi"),
      kategori: yup.object().required("Harus diisi"),
      deskripsi: yup.string().required("Harus diisi"),
      // kuota: yup.number().required("Harus diisi"),
      lokasi: yup.string().required("Harus diisi"),
      tgl_mulai: yup.string().required("Harus diisi"),
      tgl_selesai: yup.string().required("Harus diisi"),
      jam_mulai: yup.string().required("Harus diisi"),
      jam_selesai: yup.string().required("Harus diisi"),
      skp: yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = new FormData();
      payload.append("user_id", values.user?.value);
      payload.append("dokumen", values.dokumen);
      payload.append("nama", values.nama);
      payload.append("deskripsi", values.deskripsi);
      // payload.append("kuota", values.kuota);
      payload.append("tgl_mulai", formatDate(values.tgl_mulai, "short"));
      payload.append("tgl_selesai", formatDate(values.tgl_selesai, "short"));
      payload.append("jam_mulai", values.jam_mulai);
      payload.append("jam_selesai", values.jam_selesai);
      payload.append("lokasi", values.lokasi);
      payload.append("skp", values.skp);

      setLoading(true);
      req
        .post(`/api/rski/dashboard/perusahaan/diklat-eksternal-user`, payload)
        .then((r) => {
          if (r.status === 201) {
            toast({
              status: "success",
              title: r.data.message,
              isClosable: true,
              position: "bottom-right",
            });
            resetForm();
            backOnClose();
            setRt(!rt);
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
        Tambah Data
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
              title="Tambah Data Diklat"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody className="scrollY">
            <form id="tambahAcaraDiklatForm" onSubmit={formik.handleSubmit}>
              <SimpleGrid columns={[1, 2]} spacingX={4} mb={8}>
                <CContainer flex={"1 1"}>
                  <FormControl mb={4} isInvalid={!!formik.errors.user}>
                    <FormLabel>
                      Karyawan
                      <RequiredForm />
                    </FormLabel>
                    <SelectKaryawanAllJenisKaryawan
                      name="user"
                      onConfirm={(input) => {
                        formik.setFieldValue("user", input);
                      }}
                      inputValue={formik.values.user}
                    />
                    <FormErrorMessage>
                      {formik.errors.user as string}
                    </FormErrorMessage>
                  </FormControl>

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
                      minH={"100%"}
                    />
                    <FormErrorMessage>
                      {formik.errors.deskripsi as string}
                    </FormErrorMessage>
                  </FormControl>
                </CContainer>

                <FormControl
                  flex={"1 1"}
                  mb={4}
                  isInvalid={!!formik.errors.dokumen}
                >
                  <FormLabel>
                    Sertifikat
                    <RequiredForm />
                  </FormLabel>
                  <FileInputLarge
                    name="dokumen"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("dokumen", input);
                    }}
                    inputValue={formik.values.dokumen}
                    isError={!!formik.errors.dokumen}
                    h={"100% !important"}
                    cProps={{ h: "100% !important", flex: "1" }}
                  />
                  <FormErrorMessage>
                    {formik.errors.dokumen as string}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={[1, 2, 3]} spacingX={4}>
                {/* <FormControl mb={4} isInvalid={!!formik.errors.kuota}>
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
                </FormControl> */}

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
                Tambahkan Data
              </Button>
            </CContainer>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
