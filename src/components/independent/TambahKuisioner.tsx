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
} from "@chakra-ui/react";
import { RiAddCircleFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef } from "react";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import SelectJabatan from "../dependent/_Select/SelectJabatan";
import DisclosureHeader from "../dependent/DisclosureHeader";
import Textarea from "../dependent/input/Textarea";
import RequiredForm from "../form/RequiredForm";

interface Props extends ButtonProps {}

export default function TambahKuisioner({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-kuisioner-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      pertanyaan: "" as any,
      jabatan: undefined,
    },
    validationSchema: yup.object().shape({
      pertanyaan: yup.string().required("Harus diisi"),
      jabatan: yup.number().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      //TODO api tambah kelompok gaji
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
            <form id="tambahJabatanForm" onSubmit={formik.handleSubmit}>
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

              <FormControl isInvalid={!!formik.errors.jabatan}>
                <FormLabel>
                  Jabatan
                  <RequiredForm />
                </FormLabel>
                <SelectJabatan
                  name="jabatan"
                  onConfirm={(input) => {
                    formik.setFieldValue("jabatan", input);
                  }}
                  inputValue={formik.values.jabatan}
                />
                <FormErrorMessage>
                  {formik.errors.jabatan as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="tambahJabatanForm"
              className="btn-ap clicky"
              colorScheme="ap"
              w={"100%"}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
