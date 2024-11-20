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
  Text,
  useDisclosure,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { ReactNode, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import req from "../../lib/req";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "../dependent/DisclosureHeader";
import StringInput from "../dependent/input/StringInput";
import TimePickerModal from "../dependent/input/TimePickerModal";
import RequiredForm from "../form/RequiredForm";
import SelectUnitKerja from "../dependent/_Select/SelectUnitKerja";

interface Props extends BoxProps {
  rowData: any;
  children?: ReactNode;
}

export default function EditShiftModalDisclosure({
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
      jam_from: undefined as any,
      jam_to: undefined as any,
      unit_kerja: undefined as any,
    },
    validationSchema: yup.object().shape({
      nama: yup.string().required("Harus diisi"),
      jam_from: yup.string().required("Harus diisi"),
      jam_to: yup.string().required("Harus diisi"),
      unit_kerja: yup.object().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama: values.nama,
        jam_from: values.jam_from,
        jam_to: values.jam_to,
        unit_kerja_id: values.unit_kerja.value,
        _method: "patch",
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/shift/${rowData.id}`, payload)
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
    formikRef.current.setFieldValue("nama", rowData.columnsFormat[0].value);
    formikRef.current.setFieldValue(
      "jam_from",
      rowData.columnsFormat[2].original_data.jam_from
    );
    formikRef.current.setFieldValue(
      "jam_to",
      rowData.columnsFormat[2].original_data.jam_to
    );
    formikRef.current.setFieldValue("unit_kerja", {
      value: rowData.columnsFormat[3].original_data.id,
      label: rowData.columnsFormat[3].original_data.nama_unit,
    });
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
              title="Edit Jam Kerja Shift"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="editUnitKerjaForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={formik.errors.nama ? true : false}>
                <FormLabel>
                  Nama Shift
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="nama"
                  placeholder="Pagi 1"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("nama", input);
                  }}
                  inputValue={formik.values.nama}
                />
                <FormErrorMessage>
                  {formik.errors.nama as string}
                </FormErrorMessage>
              </FormControl>

              <FormLabel>
                Jam Kerja
                <RequiredForm />
              </FormLabel>

              <Wrap spacing={4} mb={4}>
                <FormControl flex={"1 1"} isInvalid={!!formik.errors.jam_from}>
                  <TimePickerModal
                    id="tambah-shift-jam-from-modal"
                    name="jam_from"
                    onConfirm={(input) => {
                      formik.setFieldValue("jam_from", input);
                    }}
                    inputValue={formik.values?.jam_from}
                  />

                  <FormErrorMessage>
                    {formik.errors.jam_from as string}
                  </FormErrorMessage>
                </FormControl>

                <Text mt={"5px"} textAlign={"center"}>
                  -
                </Text>

                <FormControl flex={"1 1"} isInvalid={!!formik.errors.jam_to}>
                  <TimePickerModal
                    id="tambah-shift-jam-to-modal"
                    name="jam_to"
                    onConfirm={(input) => {
                      formik.setFieldValue("jam_to", input);
                    }}
                    inputValue={formik.values?.jam_to}
                  />

                  <FormErrorMessage>
                    {formik.errors.jam_to as string}
                  </FormErrorMessage>
                </FormControl>
              </Wrap>

              <FormControl isInvalid={formik.errors.unit_kerja ? true : false}>
                <FormLabel>
                  Unit Kerja
                  <RequiredForm />
                </FormLabel>
                <SelectUnitKerja
                  name="unit_kerja"
                  onConfirm={(input) => {
                    formik.setFieldValue("unit_kerja", input);
                  }}
                  inputValue={formik.values.unit_kerja}
                  isError={!!formik.errors.unit_kerja}
                />
                <FormErrorMessage>
                  {formik.errors.unit_kerja as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              form="editUnitKerjaForm"
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
