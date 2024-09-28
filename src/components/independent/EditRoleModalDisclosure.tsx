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
import DisclosureHeader from "../dependent/DisclosureHeader";
import StringInput from "../dependent/input/StringInput";
import Textarea from "../dependent/input/Textarea";
import RequiredForm from "../form/RequiredForm";

interface Props extends BoxProps {
  rowData: any;
  children?: ReactNode;
}

export default function EditRoleModalDisclosure({
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
      name: "" as any,
      deskripsi: "" as any,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Harus diisi"),
      deskripsi: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        name: values.name,
        deskripsi: values.deskripsi,
        _method: "patch",
      };
      console.log(payload);
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/role/${rowData.id}`, payload)
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
              title="Edit Role"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="editUnitKerjaForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={formik.errors.name ? true : false}>
                <FormLabel>
                  Nama Role
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="name"
                  placeholder="Human Resource"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("name", input);
                  }}
                  inputValue={formik.values.name}
                />
                <FormErrorMessage>
                  {formik.errors.name as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.deskripsi ? true : false}>
                <FormLabel>
                  Deskripsi
                  <RequiredForm />
                </FormLabel>
                <Textarea
                  name="deskripsi"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("deskripsi", input);
                  }}
                  inputValue={formik.values.deskripsi}
                />

                <FormErrorMessage>
                  {formik.errors.deskripsi as string}
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
