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

  const initialValues = {
    nama_keluarga: data?.nama_keluarga,
    hubungan: {
      value: data?.hubungan,
      label: data?.hubungan,
    },
    status_hidup: {
      value: data?.status_hidup,
      label: data?.status_hidup ? "Hidup" : "Meninggal",
    },
    pendidikan_terakhir: {
      value: data?.pendidikan_terakhir?.id,
      label: data?.pendidikan_terakhir?.label,
    },
    pekerjaan: data?.pekerjaan,
    no_hp: data?.no_hp,
    email: data?.email || "",
    is_bpjs: data.is_bpjs,
  };

  const formik = useFormik({
    validateOnChange: false,
    initialValues,
    validationSchema: yup.object().shape({
      nama_keluarga: yup.string().required("Harus diisi"),
      hubungan: yup.object().required("Harus diisi"),
      status_hidup: yup.object().required("Harus diisi"),
      pendidikan_terakhir: yup.object().required("Harus diisi"),
      pekerjaan: yup.string().required("Harus diisi"),
      no_hp: yup.string().required("Harus diisi"),
      email: yup.string(),
      is_bpjs: yup.boolean(),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama_keluarga: values.nama_keluarga,
        hubungan: values.hubungan.value,
        status_hidup: values.status_hidup.value,
        pendidikan_terakhir: values.pendidikan_terakhir.value,
        pekerjaan: values.pekerjaan,
        no_hp: values.no_hp,
        email: values.email,
        is_bpjs: values.is_bpjs,
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
          if (r.status === 200) {
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
                  />
                  <FormErrorMessage>
                    {formik.errors.status_hidup as string}
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
                  />
                  <FormErrorMessage>
                    {formik.errors.pendidikan_terakhir as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl mb={4} isInvalid={!!formik.errors.pekerjaan}>
                  <FormLabel>
                    Pekerjaan
                    <RequiredForm />
                  </FormLabel>
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
                  <FormLabel>
                    No.Telp
                    <RequiredForm />
                  </FormLabel>
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
