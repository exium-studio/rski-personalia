import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  BoxProps,
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
  Portal,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { ReactNode, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import useBackOnClose from "../../hooks/useBackOnClose";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import req from "../../lib/req";
import SelectHubunganKeluarga from "../dependent/_Select/SelectHubunganKeluarga";
import SelectPendidikan from "../dependent/_Select/SelectPendidikan";
import SelectStatusHidup from "../dependent/_Select/SelectStatusHidup";
import DisclosureHeader from "../dependent/DisclosureHeader";
import StringInput from "../dependent/input/StringInput";
import RequiredForm from "../form/RequiredForm";
import DatePickerModal from "../dependent/input/DatePickerModal";
import formatDate from "../../lib/formatDate";
import SelectGoldar from "../dependent/_Select/SelectGoldar";
import SelectGender from "../dependent/_Select/SelectGender";
import SelectAgama from "../dependent/_Select/SelectAgama";

interface Props extends BoxProps {
  idKaryawan: number;
  rowData: any;
  children?: ReactNode;
}

export default function EditAnggotaKeluargaModalDisclosure({
  idKaryawan,
  rowData,
  children,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `edit-anggota-keluarga-modal-${rowData.id}`,
    isOpen,
    onOpen,
    onClose
  );

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();
  const bodyElement = document.querySelector("body");
  const bodyRef = useRef(bodyElement);

  const data = rowData?.originalData;

  // {
  //   nama_keluarga: "",
  //   hubungan: undefined as any,
  //   jenis_kelamin: undefined as any,
  //   agama: undefined as any,
  //   goldar: undefined as any,
  //   status_hidup: undefined as any,
  //   tempat_lahir: "",
  //   tgl_lahir: undefined as any,
  //   pendidikan_terakhir: undefined as any,
  //   pekerjaan: "",
  //   no_hp: "",
  //   email: "",
  //   no_rm: "",
  //   is_bpjs: false,
  //   is_menikah: undefined as any,
  // }
  const initialValues = {
    nama_keluarga: data?.nama_keluarga,
    hubungan: {
      value: data?.hubungan,
      label: data?.hubungan,
    },
    status_hidup: {
      value: data?.status_hidup,
      label: data?.status_hidup ? "Aktif" : "Tidak Aktif",
    },
    jenis_kelamin: data?.jenis_kelamin
      ? { value: 1, label: "Laki - laki" }
      : { value: 0, label: "Perempuan" },
    tempat_lahir: data?.tempat_lahir,
    tgl_lahir: new Date(data?.tgl_lahir),
    pendidikan_terakhir: {
      value: data?.pendidikan_terakhir?.id,
      label: data?.pendidikan_terakhir?.label,
    },
    agama: data?.agama
      ? {
          value: data?.agama?.id,
          label: data?.agama?.label,
        }
      : (undefined as any),
    goldar: data?.kategori_darah
      ? {
          value: data?.kategori_darah?.id,
          label: data?.kategori_darah?.label,
        }
      : (undefined as any),
    pekerjaan: data?.pekerjaan,
    no_hp: data?.no_hp,
    email: data?.email || "",
    no_rm: data?.no_rm || "",
    is_bpjs: data.is_bpjs,
    is_menikah: data.is_menikah,
  };

  const formik = useFormik({
    validateOnChange: false,
    initialValues,
    validationSchema: yup.object().shape({
      nama_keluarga: yup.string().required("Harus diisi"),
      hubungan: yup.object().required("Harus diisi"),
      status_hidup: yup.object().required("Harus diisi"),
      jenis_kelamin: yup.object().required("Harus diisi"),
      tempat_lahir: yup.string().required("Harus diisi"),
      tgl_lahir: yup.string().required("Harus diisi"),
      pendidikan_terakhir: yup.object().required("Harus diisi"),
      agama: yup.object(),
      goldar: yup.object(),
      pekerjaan: yup.string(),
      no_hp: yup.string(),
      email: yup.string(),
      no_rm: yup.string(),
      is_bpjs: yup.boolean(),
      is_menikah: yup.boolean(),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama_keluarga: values.nama_keluarga,
        hubungan: values.hubungan?.value,
        status_hidup: values.status_hidup?.value,
        jenis_kelamin: values.jenis_kelamin?.value,
        tempat_lahir: values.tempat_lahir,
        tgl_lahir: formatDate(values.tgl_lahir, "short2"),
        pendidikan_terakhir: values.pendidikan_terakhir?.value,
        agama: values.agama?.value || null,
        goldar: values.goldar?.value || null,
        pekerjaan: values.pekerjaan || null,
        no_hp: values.no_hp || null,
        email: values.email || null,
        no_rm: values.no_rm || null,
        is_bpjs: values.is_bpjs,
        is_menikah: values.is_menikah,
        // _method: "patch",
      };
      console.log(payload);
      setLoading(true);
      req
        .post(
          `/api/rski/dashboard/karyawan/detail-karyawan-keluarga/${idKaryawan}/update-keluarga/${rowData.id}`,
          payload
        )
        .then((r) => {
          if (r?.status === 200) {
            toast({
              status: "success",
              title: r.data.message,
              isClosable: true,
              position: "bottom-right",
            });
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

  const formikRef = useRef(formik);
  // const rowDataRef = useRef(rowData);

  useEffect(() => {
    formikRef.current.setFieldValue("name", rowData.columnsFormat[0].value);
    formikRef.current.setFieldValue(
      "deskripsi",
      rowData.columnsFormat[1].value || ""
    );
  }, [isOpen, rowData, formikRef]);

  return (
    <>
      <Box onClick={onOpen} {...props}>
        {children}
      </Box>

      <Portal containerRef={bodyRef}>
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
                title="Edit Anggota Keluarga"
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
                  perubahan data keluarga karyawan tidak akan berpengaruh
                  terhadap data penggajian bulan ini.
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

                <FormControl mb={4} isInvalid={!!formik.errors.goldar}>
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

                <FormControl mb={4} isInvalid={!!formik.errors.pekerjaan}>
                  <FormLabel>Pekerjaan </FormLabel>
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
      </Portal>
    </>
  );
}
