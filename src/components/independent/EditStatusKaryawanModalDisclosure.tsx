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
import useBackOnClose from "../../hooks/useBackOnClose";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import req from "../../lib/req";
import SelectKategoriStatusKaryawan from "../dependent/_Select/SelectKategoriStatusKaryawan";
import DisclosureHeader from "../dependent/DisclosureHeader";
import StringInput from "../dependent/input/StringInput";
import RequiredForm from "../form/RequiredForm";

interface Props extends BoxProps {
  rowData: any;
  children?: ReactNode;
}

export default function EditStatusKaryawanModalDisclosure({
  rowData,
  children,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `edit-status-karyawan-modal-${rowData.id}`,
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
    initialValues: { label: "", kategori: undefined as any },
    validationSchema: yup.object().shape({
      label: yup.string().required("Harus diisi"),
      kategori: yup.object().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        label: values.label,
        kategori_status_id: values.kategori?.id,
      };
      setLoading(true);
      req
        .post("/api/rski/dashboard/pengaturan/status-karyawan", payload)
        .then((r) => {
          if (r?.status === 200) {
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
    formikRef.current.setFieldValue("label", rowData.columnsFormat[0].value);
    formikRef.current.setFieldValue(
      "kategori",
      rowData.columnsFormat[1].original_data
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
              title="Edit Status Karyawan"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="editStatusKaryawanForm" onSubmit={formik.handleSubmit}>
              <FormControl
                isInvalid={formik.errors.label ? true : false}
                mb={4}
              >
                <FormLabel>
                  Nama Status Karyawan
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="label"
                  placeholder="S1 Akuntansi"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("label", input);
                  }}
                  inputValue={formik.values.label}
                />
                <FormErrorMessage>
                  {formik.errors.label as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.label ? true : false}>
                <FormLabel>
                  Kategori
                  <RequiredForm />
                </FormLabel>
                <SelectKategoriStatusKaryawan
                  name="kategori"
                  onConfirm={(input) => {
                    formik.setFieldValue("kategori", input);
                  }}
                  inputValue={formik.values.kategori}
                />
                <FormErrorMessage>
                  {formik.errors.kategori as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              form="editStatusKaryawanForm"
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
