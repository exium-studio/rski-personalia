import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputRightElement,
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
import { useFormik } from "formik";
import { ReactNode, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import req from "../../constant/req";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import SelectBoolean from "../dependent/_Select/SelectBoolean";
import DisclosureHeader from "../dependent/DisclosureHeader";
import NumberInput from "../dependent/input/NumberInput";
import StringInput from "../dependent/input/StringInput";
import Textarea from "../dependent/input/Textarea";
import RequiredForm from "../form/RequiredForm";

interface Props extends BoxProps {
  rowData: any;
  children?: ReactNode;
}

export default function EditTipeCutiModalDisclosure({
  rowData,
  children,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `edit-unit-kerja-modal-${rowData.id}`,
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
      nama: "",
      kuota: undefined as any,
      cuti_administratif: undefined as any,
      is_need_requirement: undefined as any,
      keterangan: undefined as any,
    },
    validationSchema: yup.object().shape({
      nama: yup.string().required("Harus diisi"),
      kuota: yup.number().required("Harus diisi"),
      cuti_administratif: yup.object().required("Harus diisi"),
      is_need_requirement: yup.object().required("Harus diisi"),
      keterangan: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama: values.nama,
        kuota: values.kuota,
        cuti_administratif: values.cuti_administratif.value,
        is_need_requirement: values.is_need_requirement.value,
        keterangan: values.keterangan,
        _method: "patch",
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/cuti/${rowData.id}`, payload)
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

  const formikRef = useRef(formik);

  useEffect(() => {
    formikRef.current.setFieldValue("nama", rowData.columnsFormat[0].value);
    formikRef.current.setFieldValue("kuota", rowData.columnsFormat[2].value);
    formikRef.current.setFieldValue("cuti_administratif", {
      value: rowData.columnsFormat[3].value,
      label: rowData.columnsFormat[3].value ? "Ya" : "Tidak",
    });
    formikRef.current.setFieldValue("is_need_requirement", {
      value: rowData.columnsFormat[4].value,
      label: rowData.columnsFormat[4].value ? "Ya" : "Tidak",
    });
    formikRef.current.setFieldValue(
      "keterangan",
      rowData.columnsFormat[5].value
    );
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
              title="Edit Unit Kerja"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="editTipeCutiForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={!!formik.errors.nama}>
                <FormLabel>
                  Nama Cuti
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="nama"
                  placeholder="Cuti Tahunan"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("nama", input);
                  }}
                  inputValue={formik.values.nama}
                />
                <FormErrorMessage>
                  {formik.errors.nama as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.kuota}>
                <FormLabel>
                  Kuota per Tahun (hari)
                  <RequiredForm />
                </FormLabel>

                <InputGroup>
                  <NumberInput
                    name="kuota"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("kuota", input);
                    }}
                    inputValue={formik.values.kuota}
                    placeholder="12"
                    pr={16}
                  />
                  <InputRightElement w={"fit-content"} flexShrink={0} px={4}>
                    <Text>Hari</Text>
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage>
                  {formik.errors.kuota as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={!!formik.errors.cuti_administratif}
              >
                <FormLabel>
                  Dihitung Sebagai Hadir
                  <RequiredForm />
                </FormLabel>

                <SelectBoolean
                  name="cuti_administratif"
                  onConfirm={(input) => {
                    formik.setFieldValue("cuti_administratif", input);
                  }}
                  inputValue={formik.values.cuti_administratif}
                  isError={!!formik.errors.cuti_administratif}
                  placeholder={"Dihitung Sebagai Hadir?"}
                />
                <Text fontSize={"sm"} opacity={0.4} mt={2}>
                  Cuti ini dihitung hadir, sehingga bonus presensi tetap
                  diterima.
                </Text>

                <FormErrorMessage>
                  {formik.errors.cuti_administratif as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={!!formik.errors.is_need_requirement}
              >
                <FormLabel>
                  Perlu Syarat
                  <RequiredForm />
                </FormLabel>

                <SelectBoolean
                  name="is_need_requirement"
                  onConfirm={(input) => {
                    formik.setFieldValue("is_need_requirement", input);
                  }}
                  inputValue={formik.values.is_need_requirement}
                  isError={!!formik.errors.is_need_requirement}
                  placeholder={"Perlu Syarat?"}
                />

                <FormErrorMessage>
                  {formik.errors.is_need_requirement as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formik.errors.keterangan}>
                <FormLabel>
                  Keterangan
                  <RequiredForm />
                </FormLabel>

                <Textarea
                  name="keterangan"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("keterangan", input);
                  }}
                  inputValue={formik.values.keterangan}
                  isError={!!formik.errors.keterangan}
                />

                <FormErrorMessage>
                  {formik.errors.keterangan as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              form="editTipeCutiForm"
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
