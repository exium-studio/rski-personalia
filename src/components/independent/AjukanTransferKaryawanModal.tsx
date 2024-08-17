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
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiUserSharedFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";
import req from "../../constant/req";
import { iconSize } from "../../constant/sizes";
import useRenderTrigger from "../../global/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnCloseOld";
import SelectJabatan from "../dependent/_Select/SelectJabatan";
import SelectKaryawan from "../dependent/_Select/SelectKaryawan";
import SelectKelompokGaji from "../dependent/_Select/SelectKelompokGaji";
import SelectRole from "../dependent/_Select/SelectRole";
import SelectTipeTransfer from "../dependent/_Select/SelectTipeTransfer";
import SelectUnitKerja from "../dependent/_Select/SelectUnitKerja";
import DisclosureHeader from "../dependent/DisclosureHeader";
import DatePickerModal from "../dependent/input/DatePickerModal";
import FileInput from "../dependent/input/FileInput";
import Textarea from "../dependent/input/Textarea";
import PleaseWaitModal from "../dependent/PleaseWaitModal";
import RequiredForm from "../form/RequiredForm";
import CContainer from "../wrapper/CContainer";

interface Props extends ButtonProps {}

export default function AjukanTransferKaryawanModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("ajukan-transfer-karyawan-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      karyawan: undefined as any,
      tgl_mulai: "",
      kategori_transfer: undefined as any,
      unit_kerja_tujuan: undefined as any,
      jabatan_tujuan: undefined as any,
      kelompok_gaji_tujuan: undefined as any,
      role_tujuan: undefined as any,
      dokumen: undefined as any,
      alasan: "",
      beri_tahu_manajer_direktur: false,
      beri_tahu_karyawan: false,
    },
    validationSchema: yup.object().shape({
      karyawan: yup.object().required("Harus diisi"),
      tgl_mulai: yup.string().required("Harus diisi"),
      kategori_transfer: yup.object().required("Harus diisi"),
      unit_kerja_tujuan: yup.object(),
      jabatan_tujuan: yup.object(),
      kelompok_gaji_tujuan: yup.object(),
      role_tujuan: yup.object(),
      dokumen: yup.mixed().required("Harus diisi"),
      alasan: yup.string().required("Harus diisi"),
      beri_tahu_manajer_direktur: yup.boolean(),
      beri_tahu_karyawan: yup.boolean(),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = new FormData();
      payload.append("user_id", values.karyawan?.value);
      payload.append("tgl_mulai", new Date(values.tgl_mulai).toISOString());
      payload.append("kategori_transfer_id", values.kategori_transfer?.value);
      if (values.unit_kerja_tujuan?.value !== undefined) {
        payload.append("unit_kerja_tujuan", values.unit_kerja_tujuan?.value);
      }
      if (values.jabatan_tujuan?.value !== undefined) {
        payload.append("jabatan_tujuan", values.jabatan_tujuan?.value);
      }
      if (values.kelompok_gaji_tujuan?.value !== undefined) {
        payload.append(
          "kelompok_gaji_tujuan",
          values.kelompok_gaji_tujuan?.value
        );
      }
      if (values.role_tujuan?.value !== undefined) {
        payload.append("role_tujuan", values.role_tujuan?.value);
      }

      payload.append("alasan", values.alasan);
      payload.append("dokumen", values.dokumen);

      setLoading(true);
      req
        .post(`/api/rski/dashboard/karyawan/transfer`, payload)
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
          <ModalBody className="scrollY" pb={6}>
            <form id="transferKaryawanForm" onSubmit={formik.handleSubmit}>
              <SimpleGrid columns={[1, 2]} spacingX={4}>
                <FormControl mb={4} isInvalid={!!formik.errors.karyawan}>
                  <FormLabel>
                    Pegawai
                    <RequiredForm />
                  </FormLabel>
                  <SelectKaryawan
                    name="karyawan"
                    onConfirm={(input) => {
                      formik.setFieldValue("karyawan", input);
                    }}
                    inputValue={formik.values.karyawan}
                    isError={!!formik.errors.karyawan}
                    withSearch
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

                <FormControl
                  mb={4}
                  isInvalid={!!formik.errors.kategori_transfer}
                >
                  <FormLabel>
                    Kategori Transfer
                    <RequiredForm />
                  </FormLabel>
                  <SelectTipeTransfer
                    name="kategori_transfer"
                    onConfirm={(input) => {
                      formik.setFieldValue("kategori_transfer", input);
                    }}
                    inputValue={formik.values.kategori_transfer}
                    isError={!!formik.errors.kategori_transfer}
                  />
                  <FormErrorMessage>
                    {formik.errors.kategori_transfer as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!formik.errors.unit_kerja_tujuan}
                >
                  <FormLabel>Unit Kerja Tujuan</FormLabel>
                  <SelectUnitKerja
                    name="unit_kerja_tujuan"
                    onConfirm={(input) => {
                      formik.setFieldValue("unit_kerja_tujuan", input);
                    }}
                    inputValue={formik.values.unit_kerja_tujuan}
                    placeholder="Pilih Unit Kerja Tujuan"
                    isError={!!formik.errors.unit_kerja_tujuan}
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
                    name="jabatan_tujuan"
                    onConfirm={(input) => {
                      formik.setFieldValue("jabatan_tujuan", input);
                    }}
                    inputValue={formik.values.jabatan_tujuan}
                    placeholder="Pilih Jabatan Tujuan"
                    isError={!!formik.errors.jabatan_tujuan}
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
                    name="kelompok_gaji_tujuan"
                    onConfirm={(input) => {
                      formik.setFieldValue("kelompok_gaji_tujuan", input);
                    }}
                    inputValue={formik.values.kelompok_gaji_tujuan}
                    placeholder="Pilih Kelompok Gaji Tujuan"
                    isError={!!formik.errors.kelompok_gaji_tujuan}
                  />
                  <FormHelperText>
                    Kosongkan jika data sama seperti sebelumnya
                  </FormHelperText>
                  <FormErrorMessage>
                    {formik.errors.kelompok_gaji_tujuan as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl mb={4} isInvalid={!!formik.errors.role_tujuan}>
                  <FormLabel>Role Tujuan</FormLabel>
                  <SelectRole
                    name="role_tujuan"
                    onConfirm={(input) => {
                      formik.setFieldValue("role_tujuan", input);
                    }}
                    inputValue={formik.values.role_tujuan}
                    placeholder="Pilih Role Tujuan"
                    isError={!!formik.errors.role_tujuan}
                  />
                  <FormHelperText>
                    Kosongkan jika data sama seperti sebelumnya
                  </FormHelperText>
                  <FormErrorMessage>
                    {formik.errors.role_tujuan as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl mb={4} isInvalid={!!formik.errors.dokumen}>
                  <FormLabel>
                    Dokumen (maks. 10 MB)
                    <RequiredForm />
                  </FormLabel>
                  <FileInput
                    name="dokumen"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("dokumen", input);
                    }}
                    inputValue={formik.values.dokumen}
                    isError={!!formik.errors.dokumen}
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

                <CContainer gap={4} pt={8}>
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
                </CContainer>
              </SimpleGrid>
            </form>

            <Button
              mt={4}
              flexShrink={0}
              type="submit"
              form="transferKaryawanForm"
              w={"100%"}
              colorScheme="ap"
              className="btn-ap clicky"
            >
              Transfer Pegawai
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <PleaseWaitModal isOpen={loading} />
    </>
  );
}
