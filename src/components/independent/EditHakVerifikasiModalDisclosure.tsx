import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
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
import MultiSelectKaryawanWithUnitKerja from "../dependent/_Select/MultiSelectKaryawanWithUnitKerja";
import SelectKaryawanAllJenisKaryawan from "../dependent/_Select/SelectKaryawanAllJenisKaryawan";
import SelectModulVerifikasi from "../dependent/_Select/SelectModulVerifikasi";
import DisclosureHeader from "../dependent/DisclosureHeader";
import NumberInput from "../dependent/input/NumberInput";
import StringInput from "../dependent/input/StringInput";
import RequiredForm from "../form/RequiredForm";

interface Props extends BoxProps {
  rowData: any;
  children?: ReactNode;
}

export default function EditHakVerifikasiModalDisclosure({
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
      name: "",
      modul: undefined as any,
      order: undefined as any,
      verifikator: undefined as any,
      user_diverifikasi: undefined as any,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Harus diisi"),
      modul: yup.object().required("Harus diisi"),
      order: yup.number().required("Harus diisi"),
      verifikator: yup.object().required("Harus diisi"),
      user_diverifikasi: yup.array().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama: values.name,
        modul_verifikasi: values?.modul?.value,
        order: values?.order,
        verifikator: values?.verifikator?.value,
        user_diverifikasi: values?.user_diverifikasi?.map(
          (user: any) => user?.value
        ),
        _method: "patch",
      };
      setLoading(true);
      req
        .post(
          `/api/rski/dashboard/pengaturan/master-verifikasi/${rowData.id}`,
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
    formikRef.current.setFieldValue("name", rowData.columnsFormat[0].value);
    formikRef.current.setFieldValue("modul", {
      value: rowData.columnsFormat[2].original_data?.id,
      label: rowData.columnsFormat[2].original_data?.label,
    });
    formikRef.current.setFieldValue("order", rowData.columnsFormat[3].value);
    formikRef.current.setFieldValue("verifikator", {
      value: rowData.columnsFormat[4].original_data?.id,
      label: rowData.columnsFormat[4].original_data?.nama,
    });
    formikRef.current.setFieldValue(
      "user_diverifikasi",
      rowData.columnsFormat[5].original_data?.map((user: any) => ({
        value: user.id,
        label: user.nama,
      }))
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
              title="Edit Hak Verifikasi"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="editHakVerifikasiForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={formik.errors.name ? true : false}>
                <FormLabel>
                  Nama Hak Verifikasi
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="name"
                  placeholder="Verifikasi Pak Agung"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("name", input);
                  }}
                  inputValue={formik.values.name}
                />
                <FormErrorMessage>
                  {formik.errors.name as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.modul ? true : false}
              >
                <FormLabel>
                  Hal yang Perlu Diverifikasi (Modul)
                  <RequiredForm />
                </FormLabel>
                <SelectModulVerifikasi
                  name="modul"
                  onConfirm={(input) => {
                    formik.setFieldValue("modul", input);
                  }}
                  inputValue={formik.values.modul}
                />
                <FormErrorMessage>
                  {formik.errors.modul as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.order ? true : false}
              >
                <FormLabel>
                  Level Verifikasi
                  <RequiredForm />
                </FormLabel>
                <NumberInput
                  name="order"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("order", input);
                  }}
                  inputValue={formik.values.order}
                />
                <FormHelperText>
                  Maksimal level verifikasi berdasarkan modul yang dipilih
                </FormHelperText>
                <FormErrorMessage>
                  {formik.errors.order as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.verifikator ? true : false}
              >
                <FormLabel>
                  Verifikator
                  <RequiredForm />
                </FormLabel>
                <SelectKaryawanAllJenisKaryawan
                  name="verifikator"
                  onConfirm={(input) => {
                    formik.setFieldValue("verifikator", input);
                  }}
                  inputValue={formik.values.verifikator}
                />
                <FormErrorMessage>
                  {formik.errors.verifikator as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.user_diverifikasi ? true : false}
              >
                <FormLabel>
                  Karyawan Diverifikasi
                  <RequiredForm />
                </FormLabel>
                <MultiSelectKaryawanWithUnitKerja
                  name="user_diverifikasi"
                  onConfirm={(input) => {
                    formik.setFieldValue("user_diverifikasi", input);
                  }}
                  inputValue={formik.values.user_diverifikasi}
                  optionsDisplay="chip"
                />
                <FormErrorMessage>
                  {formik.errors.user_diverifikasi as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              form="editHakVerifikasiForm"
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
