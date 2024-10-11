import {
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiAddCircleFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useGetUserData from "../../hooks/useGetUserData";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import req from "../../lib/req";
import DisclosureHeader from "../dependent/DisclosureHeader";
import FileInput from "../dependent/input/FileInput";
import StringInput from "../dependent/input/StringInput";
import Textarea from "../dependent/input/Textarea";
import RequiredForm from "../form/RequiredForm";

interface Props extends ButtonProps {}

export default function TambahMateri({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-kelompok-gaji-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);
  const userData = useGetUserData();

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      judul: "",
      deskripsi: "",
      dokumen_materi_1: "",
      dokumen_materi_2: "",
      dokumen_materi_3: "",
    },
    validationSchema: yup.object().shape({
      judul: yup.string().required("Harus diisi"),
      deskripsi: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);

      const url = `api/rski/dashboard/pengaturan/materi-pelatihan`;
      const payload = new FormData();
      payload.append("user_id", userData?.id);
      payload.append("judul", values.judul);
      payload.append("deskripsi", values.deskripsi);
      payload.append(`dokumen_materi_1`, values?.dokumen_materi_1);
      payload.append(`dokumen_materi_2`, values?.dokumen_materi_2);
      payload.append(`dokumen_materi_3`, values?.dokumen_materi_3);

      req
        .post(url, payload)
        .then((r) => {
          if (r.status === 201) {
            setRt(!rt);
            backOnClose();
            toast({
              status: "success",
              title: r?.data?.message,
              position: "bottom-right",
              isClosable: true,
            });
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
            position: "bottom-right",
            isClosable: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  // console.log(formik.values);

  return (
    <>
      <Button
        className="btn-ap clicky"
        colorScheme="ap"
        onClick={onOpen}
        leftIcon={<Icon as={RiAddCircleFill} fontSize={iconSize} />}
        pl={5}
        {...props}
      >
        Tambah Materi
      </Button>

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
              title="Tambah Materi"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody pb={6}>
            <form id="materiForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={!!formik.errors.judul}>
                <FormLabel>
                  Judul
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="judul"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("judul", input);
                  }}
                  inputValue={formik.values.judul}
                  placeholder="Materi Diklat"
                />
                <FormErrorMessage>
                  {formik.errors.judul as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.deskripsi}>
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
                  placeholder="Materi Diklat"
                />
                <FormErrorMessage>
                  {formik.errors.deskripsi as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.dokumen_materi_1}>
                <FormLabel>Dokumen 1</FormLabel>
                <FileInput
                  name="dokumen_materi_1"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("dokumen_materi_1", input);
                  }}
                  inputValue={formik.values.dokumen_materi_1}
                  accept=".pdf, pptx, docx"
                />
                <FormErrorMessage>
                  {formik.errors.dokumen_materi_1 as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.dokumen_materi_2}>
                <FormLabel>Dokumen 2</FormLabel>
                <FileInput
                  name="dokumen_materi_2"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("dokumen_materi_2", input);
                  }}
                  inputValue={formik.values.dokumen_materi_2}
                  accept=".pdf, pptx, docx"
                />
                <FormErrorMessage>
                  {formik.errors.dokumen_materi_2 as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={6} isInvalid={!!formik.errors.dokumen_materi_3}>
                <FormLabel>Dokumen 3</FormLabel>
                <FileInput
                  name="dokumen_materi_3"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("dokumen_materi_3", input);
                  }}
                  inputValue={formik.values.dokumen_materi_3}
                  accept=".pdf, pptx, docx"
                />
                <FormErrorMessage>
                  {formik.errors.dokumen_materi_3 as string}
                </FormErrorMessage>
              </FormControl>
            </form>

            <Button
              mt={2}
              type="submit"
              form="materiForm"
              className="btn-ap clicky"
              colorScheme="ap"
              w={"100%"}
              isLoading={loading}
            >
              Tambahkan
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
