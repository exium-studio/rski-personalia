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
import DisclosureHeader from "../dependent/DisclosureHeader";
import DatePickerModal from "../dependent/input/DatePickerModal";
import StringInput from "../dependent/input/StringInput";
import RequiredForm from "../form/RequiredForm";
import formatDate from "../../lib/formatDate";

interface Props extends BoxProps {
  rowData: any;
  children?: ReactNode;
}

export default function EditHariLiburModalDisclosure({
  rowData,
  children,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `edit-hari-libur-modal-${rowData.id}`,
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
      tanggal: undefined as any,
    },
    validationSchema: yup.object().shape({
      nama: yup.string().required("Harus diisi"),
      tanggal: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama: values.nama,
        tanggal: formatDate(values.tanggal, "short"),
        _method: "patch",
      };
      console.log(payload);
      setLoading(true);
      req
        .post(
          `/api/rski/dashboard/pengaturan/hari-libur/${rowData.id}`,
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
    formikRef.current.setFieldValue("nama", rowData.columnsFormat[0].value);
    formikRef.current.setFieldValue("tanggal", rowData.columnsFormat[2].value);
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
            <form id="editUnitKerjaForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={!!formik.errors.nama}>
                <FormLabel>
                  Nama Unit
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="nama"
                  placeholder="Human Resource"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("nama", input);
                  }}
                  inputValue={formik.values.nama}
                />
                <FormErrorMessage>
                  {formik.errors.nama as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formik.errors.tanggal}>
                <FormLabel>
                  Jenis Karyawan
                  <RequiredForm />
                </FormLabel>
                <DatePickerModal
                  id="edit-hari-libur"
                  name="tanggal"
                  onConfirm={(input) => {
                    formik.setFieldValue("tanggal", input);
                  }}
                  inputValue={new Date(formik.values.tanggal)}
                  isError={!!formik.errors.tanggal}
                />

                <FormErrorMessage>
                  {formik.errors.tanggal as string}
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
