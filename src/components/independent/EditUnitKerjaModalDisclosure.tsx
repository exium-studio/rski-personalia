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
import SelectJenisKaryawan from "../dependent/_Select/SelectJenisKaryawan";
import DisclosureHeader from "../dependent/DisclosureHeader";
import StringInput from "../dependent/input/StringInput";
import RequiredForm from "../form/RequiredForm";

interface Props extends BoxProps {
  rowData: any;
  children?: ReactNode;
}

export default function EditUnitKerjaModalDisclosure({
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
      nama_unit: "",
      jenis_karyawan: undefined as any,
    },
    validationSchema: yup.object().shape({
      nama_unit: yup.string().required("Harus diisi"),
      jenis_karyawan: yup.object().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama_unit: values.nama_unit,
        jenis_karyawan: values.jenis_karyawan.value,
        _method: "patch",
      };
      setLoading(true);
      req
        .post(
          `/api/rski/dashboard/pengaturan/unit-kerja/${rowData.id}`,
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
      formikRef.current.setFieldValue(
        "nama_unit",
        rowData.columnsFormat[0].value
      );
      formikRef.current.setFieldValue("jenis_karyawan", {
        value: rowData.columnsFormat[2].value,
        label: rowData.columnsFormat[2].value === 1 ? "Shift" : "Non-Shift",
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
              title="Edit Unit Kerja"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="editRoleForm" onSubmit={formik.handleSubmit}>
              <FormControl
                mb={4}
                isInvalid={formik.errors.nama_unit ? true : false}
              >
                <FormLabel>
                  Nama Unit
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="nama_unit"
                  placeholder="Human Resource"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("nama_unit", input);
                  }}
                  inputValue={formik.values.nama_unit}
                />
                <FormErrorMessage>
                  {formik.errors.nama_unit as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.jenis_karyawan ? true : false}
              >
                <FormLabel>
                  Jenis Karyawan
                  <RequiredForm />
                </FormLabel>
                <SelectJenisKaryawan
                  name="jenis_karyawan"
                  onConfirm={(input) => {
                    formik.setFieldValue("jenis_karyawan", input);
                  }}
                  inputValue={formik.values.jenis_karyawan}
                  placeholder="Pilih Jenis Karyawan"
                  isError={!!formik.errors.jenis_karyawan}
                />
                <FormErrorMessage>
                  {formik.errors.jenis_karyawan as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              form="editRoleForm"
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
