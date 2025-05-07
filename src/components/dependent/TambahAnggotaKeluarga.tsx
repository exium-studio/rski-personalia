import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import useBackOnClose from "../../hooks/useBackOnClose";
import { useState } from "react";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import { useFormik } from "formik";
import * as yup from "yup";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "./DisclosureHeader";
import RequiredForm from "../form/RequiredForm";
import StringInput from "./input/StringInput";
import SelectHubunganKeluarga from "./_Select/SelectHubunganKeluarga";
import SelectStatusHidup from "./_Select/SelectStatusHidup";
import SelectPendidikan from "./_Select/SelectPendidikan";
import req from "../../lib/req";
import useGetUserData from "../../hooks/useGetUserData";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import DatePickerModal from "./input/DatePickerModal";
import formatDate from "../../lib/formatDate";
import SelectGender from "./_Select/SelectGender";
import SelectAgama from "./_Select/SelectAgama";
import SelectGoldar from "./_Select/SelectGoldar";

export default function TambahAnggotaKeluarga({ idKaryawan }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `tambah-anggota-keluarga-${idKaryawan}`,
    isOpen,
    onOpen,
    onClose
  );
  const userData = useGetUserData();
  const isSuperAdmin = userData?.id === 1;

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama_keluarga: "",
      hubungan: undefined as any,
      jenis_kelamin: undefined as any,
      agama: undefined as any,
      goldar: undefined as any,
      status_hidup: undefined as any,
      tempat_lahir: "",
      tgl_lahir: undefined as any,
      pendidikan_terakhir: undefined as any,
      pekerjaan: "",
      no_hp: "",
      email: "",
      no_rm: "",
      is_bpjs: false,
      is_menikah: false,
    },
    validationSchema: yup.object().shape({
      nama_keluarga: yup.string().required("Harus diisi"),
      hubungan: yup.object().required("Harus diisi"),
      jenis_kelamin: yup.object().required("Harus diisi"),
      agama: yup.object(),
      goldar: yup.object(),
      status_hidup: yup.object().required("Harus diisi"),
      tempat_lahir: yup.string().required("Harus diisi"),
      tgl_lahir: yup.string().required("Harus diisi"),
      pendidikan_terakhir: yup.object().required("Harus diisi"),
      pekerjaan: yup.string(),
      no_hp: yup.string(),
      email: yup.string(),
      no_rm: yup.string(),
      is_bpjs: yup.boolean(),
      is_menikah: yup.boolean(),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);

      const url = `/api/rski/dashboard/karyawan/detail-karyawan-keluarga/${idKaryawan}/create-keluarga`;
      const payload = {
        nama_keluarga: values.nama_keluarga,
        hubungan: values.hubungan?.value,
        pendidikan_terakhir: values.pendidikan_terakhir?.value,
        status_hidup: values.status_hidup.value,
        pekerjaan: values.pekerjaan,
        no_hp: values.no_hp,
        email: values.email,
        is_bpjs: values.is_bpjs,
        tgl_lahir: formatDate(values.tgl_lahir, "short2"),
        is_menikah: values.is_menikah,
      };

      req
        .post(url, payload)
        .then((r) => {
          if (r.status === 201) {
            setRt(!rt);
            backOnClose();
            toast({
              status: "success",
              title: r?.data?.message,
              position: "bottom-right",
              isClosable: true,
            });
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
            position: "bottom-right",
            isClosable: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <>
      <PermissionTooltip permission={isSuperAdmin}>
        <Button
          flexShrink={0}
          colorScheme="ap"
          variant={"outline"}
          className="clicky"
          onClick={onOpen}
          isDisabled={!isSuperAdmin}
        >
          Tambah Anggota
        </Button>
      </PermissionTooltip>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
        }}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader
              title="Tambah Anggota Keluarga"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <Alert mb={4} status="warning" alignItems={"start"}>
              <AlertIcon />
              <AlertDescription>
                Ketika penggajian bulan ini sudah dijalankan, maka segala
                perubahan data keluarga karyawan tidak akan berpengaruh terhadap
                data penggajian bulan ini.
              </AlertDescription>
            </Alert>

            <form id="keluargaForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={!!formik.errors.nama_keluarga}>
                <FormLabel>
                  Nama Keluarga
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="nama_keluarga"
                  placeholder="Yeli Kurniawan"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("nama_keluarga", input);
                  }}
                  inputValue={formik.values.nama_keluarga}
                />
                <FormErrorMessage>
                  {formik.errors.nama_keluarga as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.hubungan}>
                <FormLabel>
                  Hubungan
                  <RequiredForm />
                </FormLabel>
                <SelectHubunganKeluarga
                  name="hubungan"
                  onConfirm={(input) => {
                    formik.setFieldValue("hubungan", input);
                  }}
                  inputValue={formik.values.hubungan}
                  isError={!!formik.errors.hubungan}
                />
                <FormErrorMessage>
                  {formik.errors.hubungan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.jenis_kelamin}>
                <FormLabel>
                  Jenis Kelamin
                  <RequiredForm />
                </FormLabel>
                <SelectGender
                  name="jenis_kelamin"
                  onConfirm={(input) => {
                    formik.setFieldValue("jenis_kelamin", input);
                  }}
                  inputValue={formik.values.jenis_kelamin}
                  isError={!!formik.errors.jenis_kelamin}
                />
                <FormErrorMessage>
                  {formik.errors.hubungan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.agama}>
                <FormLabel>Agama</FormLabel>
                <SelectAgama
                  name="agama"
                  onConfirm={(input) => {
                    formik.setFieldValue("agama", input);
                  }}
                  inputValue={formik.values.agama}
                  isError={!!formik.errors.agama}
                />
                <FormErrorMessage>
                  {formik.errors.hubungan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.agama}>
                <FormLabel>Golongan Darah</FormLabel>
                <SelectGoldar
                  name="goldar"
                  onConfirm={(input) => {
                    formik.setFieldValue("goldar", input);
                  }}
                  inputValue={formik.values.goldar}
                  isError={!!formik.errors.goldar}
                />
                <FormErrorMessage>
                  {formik.errors.hubungan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.status_hidup}>
                <FormLabel>
                  Status Hidup
                  <RequiredForm />
                </FormLabel>
                <SelectStatusHidup
                  name="status_hidup"
                  onConfirm={(input) => {
                    formik.setFieldValue("status_hidup", input);
                  }}
                  inputValue={formik.values.status_hidup}
                  isError={!!formik.errors.status_hidup}
                />
                <FormErrorMessage>
                  {formik.errors.status_hidup as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.tempat_lahir}>
                <FormLabel>
                  Tempat Lahir
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="tempat_lahir"
                  placeholder="Surakarta"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("tempat_lahir", input);
                  }}
                  inputValue={formik.values.tempat_lahir}
                />
                <FormErrorMessage>
                  {formik.errors.nama_keluarga as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.tgl_lahir}>
                <FormLabel>
                  Tanggal Lahir
                  <RequiredForm />
                </FormLabel>
                <DatePickerModal
                  id={`date-picker-tambah-keluarga-${idKaryawan}`}
                  name="tgl_lahir"
                  onConfirm={(input) => {
                    formik.setFieldValue("tgl_lahir", input);
                  }}
                  inputValue={formik.values.tgl_lahir}
                  isError={!!formik.errors.tgl_lahir}
                />
                <FormErrorMessage>
                  {formik.errors.tgl_lahir as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={!!formik.errors.pendidikan_terakhir}
              >
                <FormLabel>
                  Pendidikan Terakhir
                  <RequiredForm />
                </FormLabel>
                <SelectPendidikan
                  name="pendidikan_terakhir"
                  onConfirm={(input) => {
                    formik.setFieldValue("pendidikan_terakhir", input);
                  }}
                  inputValue={formik.values.pendidikan_terakhir}
                  isError={!!formik.errors.pendidikan_terakhir}
                />
                <FormErrorMessage>
                  {formik.errors.pendidikan_terakhir as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.pekerjaan}>
                <FormLabel>Pekerjaan</FormLabel>
                <StringInput
                  name="pekerjaan"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("pekerjaan", input);
                  }}
                  inputValue={formik.values.pekerjaan}
                  placeholder="Dokter"
                />
                <FormErrorMessage>
                  {formik.errors.pekerjaan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.no_hp}>
                <FormLabel>No.Telp</FormLabel>
                <StringInput
                  name="no_hp"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("no_hp", input);
                  }}
                  inputValue={formik.values.no_hp}
                  placeholder="08**********"
                />
                <FormErrorMessage>
                  {formik.errors.no_hp as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.email}>
                <FormLabel>Email</FormLabel>
                <StringInput
                  name="email"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("email", input);
                  }}
                  inputValue={formik.values.email}
                  placeholder="example@email.com"
                />
                <FormErrorMessage>
                  {formik.errors.email as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.no_rm}>
                <FormLabel>No. Rekam Medis</FormLabel>
                <StringInput
                  name="no_rm"
                  placeholder="3301*******"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("no_rm", input);
                  }}
                  inputValue={formik.values.no_rm}
                />
                <FormErrorMessage>
                  {formik.errors.nama_keluarga as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formik.errors.is_menikah} mb={4}>
                {/* <FormLabel>
                Tanggungan BPJS
                 <RequiredForm />
              </FormLabel> */}

                <Checkbox
                  colorScheme="ap"
                  onChange={(e) => {
                    formik.setFieldValue("is_menikah", e.target.checked);
                  }}
                  isChecked={formik.values.is_menikah}
                >
                  <Text mt={"-2.5px"}>Sudah Menikah</Text>
                </Checkbox>

                <FormErrorMessage>
                  {formik.errors.is_menikah as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={!!formik.errors.is_bpjs}>
                <Checkbox
                  colorScheme="ap"
                  isChecked={formik.values.is_bpjs}
                  onChange={(e) => {
                    formik.setFieldValue("is_bpjs", e.target.checked);
                  }}
                >
                  <Text mt={"-3px"}>Tanggungan BPJS</Text>
                </Checkbox>
                <FormErrorMessage>
                  {formik.errors.is_bpjs as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              form="keluargaForm"
              className="btn-ap clicky"
              colorScheme="ap"
              w={"100%"}
              isLoading={loading}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
