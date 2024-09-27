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
import SelectJenisPenilaian from "../dependent/_Select/SelectJenisPenilaian";
import DisclosureHeader from "../dependent/DisclosureHeader";
import Textarea from "../dependent/input/Textarea";
import RequiredForm from "../form/RequiredForm";

interface Props extends BoxProps {
  rowData: any;
  children?: ReactNode;
}

export default function EditKuisionerModalDisclosure({
  rowData,
  children,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-kuisioner-modal-${rowData.id}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      pertanyaan: undefined as any,
      jenis_penilaian: undefined as any,
    },
    validationSchema: yup.object().shape({
      pertanyaan: yup.string().required("Harus diisi"),
      jenis_penilaian: yup.object().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        pertanyaan: values.pertanyaan,
        jenis_penilaian_id: values.jenis_penilaian.value,
        _method: "patch",
      };
      setLoading(true);
      req
        .post(
          `/api/rski/dashboard/pengaturan/pertanyaan/${rowData.id}`,
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
    formikRef.current.setFieldValue(
      "pertanyaan",
      rowData.columnsFormat[0].value
    );
    formikRef.current.setFieldValue("jenis_penilaian", {
      value: rowData.columnsFormat[2].original_data?.id,
      label: rowData.columnsFormat[2].original_data?.nama,
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
              title="Edit Kuisioner"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="editKuisionerForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={!!formik.errors.pertanyaan}>
                <FormLabel>
                  Pertanyaan
                  <RequiredForm />
                </FormLabel>
                <Textarea
                  name="pertanyaan"
                  placeholder="Pertanyaan untuk jabaatan yang dipilih"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("pertanyaan", input);
                  }}
                  inputValue={formik.values.pertanyaan}
                />
                <FormErrorMessage>
                  {formik.errors.pertanyaan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formik.errors.jenis_penilaian}>
                <FormLabel>
                  Jenis Penilaian
                  <RequiredForm />
                </FormLabel>
                <SelectJenisPenilaian
                  name="jenis_penilaian"
                  onConfirm={(input) => {
                    formik.setFieldValue("jenis_penilaian", input);
                  }}
                  inputValue={formik.values.jenis_penilaian}
                  isError={!!formik.errors.jenis_penilaian}
                />

                <FormErrorMessage>
                  {formik.errors.jenis_penilaian as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              form="editKuisionerForm"
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
