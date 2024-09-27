import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { ReactNode, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import req from "../../lib/req";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import SelectJabatan from "../dependent/_Select/SelectJabatan";
import SelectStatusKaryawan from "../dependent/_Select/SelectStatusKaryawan";
import DisclosureHeader from "../dependent/DisclosureHeader";
import StringInput from "../dependent/input/StringInput";
import RequiredForm from "../form/RequiredForm";

interface Props extends BoxProps {
  rowData: any;
  children?: ReactNode;
}

export default function EditJenisPenilaianModalDisclosure({
  rowData,
  children,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `edit-jenis-penilaian-modal-${rowData.id}`,
    isOpen,
    onOpen,
    onClose
  );
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama: "" as any,
      status_karyawan: "" as any,
      jabatan_penilai: undefined as any,
      jabatan_dinilai: undefined as any,
    },
    validationSchema: yup.object().shape({
      nama: yup.string().required("Harus diisi"),
      status_karyawan: yup.object().required("Harus diisi"),
      jabatan_penilai: yup.object().required("Harus diisi"),
      jabatan_dinilai: yup.object().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama: values.nama,
        status_karyawan_id: values.status_karyawan.value,
        jabatan_penilai: values.jabatan_penilai.value,
        jabatan_dinilai: values.jabatan_dinilai.value,
        _method: "patch",
      };
      setLoading(true);
      req
        .post(
          `/api/rski/dashboard/perusahaan/jenis-penilaian/${rowData.id}`,
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

  useEffect(() => {
    if (isOpen) {
      formikRef.current.setFieldValue("nama", rowData.columnsFormat[0]?.value);
      formikRef.current.setFieldValue("status_karyawan", {
        value: rowData.columnsFormat[2]?.value,
        label: rowData.columnsFormat[2]?.original_data?.label,
      });
      formikRef.current.setFieldValue("jabatan_penilai", {
        value: rowData.columnsFormat[3]?.original_data?.id,
        label: rowData.columnsFormat[3]?.original_data?.nama_jabatan,
      });
      formikRef.current.setFieldValue("jabatan_dinilai", {
        value: rowData.columnsFormat[4]?.original_data?.id,
        label: rowData.columnsFormat[4]?.original_data?.nama_jabatan,
      });
    }
  }, [isOpen, rowData, formikRef]);

  return (
    <>
      <Box onClick={onOpen} {...props}>
        {children}
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
        }}
        initialFocusRef={initialRef}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader
              title="Edit Jenis Penilaian"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="editJabatanForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={!!formik.errors.nama}>
                <FormLabel>
                  Nama
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="nama"
                  placeholder="Penilaian Karyawan Tetap"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("nama", input);
                  }}
                  inputValue={formik.values.nama}
                />
                <FormErrorMessage>
                  {formik.errors.nama as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.status_karyawan}>
                <FormLabel>
                  Status Karyawan Dinilai
                  <RequiredForm />
                </FormLabel>
                <SelectStatusKaryawan
                  name="status_karyawan"
                  onConfirm={(input) => {
                    formik.setFieldValue("status_karyawan", input);
                  }}
                  inputValue={formik.values.status_karyawan}
                  isError={!!formik.errors.status_karyawan}
                />
                <FormErrorMessage>
                  {formik.errors.status_karyawan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.jabatan_penilai}>
                <FormLabel>
                  Jabatan Penilai
                  <RequiredForm />
                </FormLabel>
                <SelectJabatan
                  name="jabatan_penilai"
                  onConfirm={(input) => {
                    formik.setFieldValue("jabatan_penilai", input);
                  }}
                  inputValue={formik.values.jabatan_penilai}
                  isError={!!formik.errors.jabatan_penilai}
                />
                <FormErrorMessage>
                  {formik.errors.jabatan_penilai as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formik.errors.jabatan_dinilai}>
                <FormLabel>
                  Jabatan Dinilai
                  <RequiredForm />
                </FormLabel>
                <SelectJabatan
                  name="jabatan_dinilai"
                  onConfirm={(input) => {
                    formik.setFieldValue("jabatan_dinilai", input);
                  }}
                  inputValue={formik.values.jabatan_dinilai}
                  isError={!!formik.errors.jabatan_dinilai}
                />
                <FormErrorMessage>
                  {formik.errors.jabatan_dinilai as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              form="editJabatanForm"
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
