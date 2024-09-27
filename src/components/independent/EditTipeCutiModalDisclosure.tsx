import {
  Box,
  BoxProps,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
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
import useBackOnClose from "../../hooks/useBackOnClose";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import req from "../../lib/req";
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
      cuti_administratif: yup.number(),
      is_need_requirement: yup.number(),
      keterangan: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama: values.nama,
        kuota: values.kuota,
        cuti_administratif: values.cuti_administratif,
        is_need_requirement: values.is_need_requirement,
        keterangan: values.keterangan,
        _method: "patch",
      };

      // console.log(payload);

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
    // console.log(rowData.columnsFormat[4].value);

    formikRef.current.setFieldValue("nama", rowData.columnsFormat[0].value);
    formikRef.current.setFieldValue("kuota", rowData.columnsFormat[2].value);
    formikRef.current.setFieldValue(
      "cuti_administratif",
      rowData.columnsFormat[3].value
    );
    formikRef.current.setFieldValue(
      "is_need_requirement",
      rowData.columnsFormat[4].value
    );
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
              title="Edit Tipe Cuti"
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

              <FormControl mb={4} isInvalid={!!formik.errors.keterangan}>
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

              <FormControl
                mb={4}
                isInvalid={!!formik.errors.cuti_administratif}
              >
                <Checkbox
                  colorScheme="ap"
                  onChange={(e) => {
                    if (e.target.checked) {
                      formik.setFieldValue("cuti_administratif", 1);
                    } else {
                      formik.setFieldValue("cuti_administratif", 0);
                    }
                  }}
                  isChecked={formik.values.cuti_administratif}
                >
                  <Text mt={"-2.5px"}>Dihitung sebagai hadir</Text>
                </Checkbox>
                <FormHelperText mt={2}>
                  Cuti ini dihitung hadir, jadi bonus presensi tidak dibatalkan.
                </FormHelperText>

                <FormErrorMessage>
                  {formik.errors.cuti_administratif as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formik.errors.is_need_requirement}>
                <Checkbox
                  colorScheme="ap"
                  onChange={(e) => {
                    if (e.target.checked) {
                      console.log("kontol");
                      formik.setFieldValue("is_need_requirement", 1);
                    } else {
                      formik.setFieldValue("is_need_requirement", 0);
                    }
                  }}
                  isChecked={formik.values.is_need_requirement}
                >
                  <Text mt={"-2.5px"}>Perlu Syarat</Text>
                </Checkbox>
                <FormHelperText mt={2}>
                  Untuk menandai bahwa cuti ini memerlukan syarat. Syarat dapat
                  ditulis pada form keterangan di atas.
                </FormHelperText>

                <FormErrorMessage>
                  {formik.errors.is_need_requirement as string}
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
