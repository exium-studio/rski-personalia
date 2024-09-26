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
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiAddCircleFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";
import req from "../../lib/req";
import { iconSize } from "../../constant/sizes";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import SelectJenisPenilaian from "../dependent/_Select/SelectJenisPenilaian";
import DisclosureHeader from "../dependent/DisclosureHeader";
import Textarea from "../dependent/input/Textarea";
import RequiredForm from "../form/RequiredForm";

interface Props extends ButtonProps {}

export default function TambahKuisioner({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-kuisioner-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      pertanyaan: "" as any,
      jenis_penilaian: undefined as any,
    },
    validationSchema: yup.object().shape({
      pertanyaan: yup.string().required("Harus diisi"),
      jenis_penilaian: yup.object().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        pertanyaan: values.pertanyaan,
        jenis_penilaian_id: values?.jenis_penilaian?.value,
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/pertanyaan`, payload)
        .then((r) => {
          if (r.status === 200) {
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
        Tambah Kuisioner
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
        }}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader
              title="Tambah Kuisioner"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="tambahKuisionerForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={!!formik.errors.pertanyaan}>
                <FormLabel>
                  Pertanyaan
                  <RequiredForm />
                </FormLabel>
                <Textarea
                  name="pertanyaan"
                  placeholder={"Pertanyaan untuk jabatan yang dipilih"}
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
              form="tambahKuisionerForm"
              className="btn-ap clicky"
              colorScheme="ap"
              w={"100%"}
              isLoading={loading}
            >
              Tambahkan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
