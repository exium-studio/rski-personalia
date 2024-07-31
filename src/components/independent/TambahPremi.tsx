import {
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiAddCircleFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef } from "react";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import SelectJenisPremi from "../dependent/_Select/SelectJenisPotongan";
import DisclosureHeader from "../dependent/DisclosureHeader";
import NumberInput from "../dependent/input/NumberInput";
import RequiredForm from "../form/RequiredForm";

interface Props extends ButtonProps {}

export default function TambahPremi({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-premi=modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama_premi: "",
      jenis_premi: undefined as any,
      besaran_premi: undefined,
    },
    validationSchema: yup.object().shape({
      nama_premi: yup.string().required("Harus diisi"),
      jenis_premi: yup.object().required("Harus diisi"),
      besaran_premi: yup.number().required("Harus diisi"),
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
        Tambah Potongan
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
              title="Tambah Potongan"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="tambahJabatanForm" onSubmit={formik.handleSubmit}>
              <FormControl
                mb={4}
                isInvalid={formik.errors.nama_premi ? true : false}
              >
                <FormLabel>
                  Nama Potongan
                  <RequiredForm />
                </FormLabel>
                <Input
                  name="nama_premi"
                  placeholder="Tapera"
                  onChange={formik.handleChange}
                  value={formik.values.nama_premi}
                />
                <FormErrorMessage>
                  {formik.errors.nama_premi as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.jenis_premi ? true : false}
              >
                <FormLabel>
                  Jenis Potongan
                  <RequiredForm />
                </FormLabel>
                <SelectJenisPremi
                  name="jenis_premi"
                  onConfirm={(input) => {
                    formik.setFieldValue("jenis_premi", input);
                  }}
                  inputValue={formik.values.jenis_premi}
                  isError={!!formik.errors.jenis_premi}
                />
                <FormErrorMessage>
                  {formik.errors.jenis_premi as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.besaran_premi ? true : false}
              >
                <FormLabel>
                  Besaran Potongan
                  <RequiredForm />
                </FormLabel>

                {formik?.values.jenis_premi &&
                formik?.values.jenis_premi?.value === 2 ? (
                  <InputGroup>
                    <InputRightElement pr={4}>
                      <Text>%</Text>
                    </InputRightElement>
                    <NumberInput
                      pr={12}
                      name="besaran_premi"
                      placeholder="500.000"
                      onChangeSetter={(input) => {
                        formik.setFieldValue("besaran_premi", input);
                      }}
                      inputValue={formik.values.besaran_premi}
                    />
                  </InputGroup>
                ) : (
                  <InputGroup>
                    <InputLeftElement pl={4}>
                      <Text>Rp</Text>
                    </InputLeftElement>
                    <NumberInput
                      isDisabled={formik.values.jenis_premi === undefined}
                      pl={12}
                      name="besaran_premi"
                      placeholder="500.000"
                      onChangeSetter={(input) => {
                        formik.setFieldValue("besaran_premi", input);
                      }}
                      inputValue={formik.values.besaran_premi}
                    />
                  </InputGroup>
                )}
                <FormErrorMessage>
                  {formik.errors.besaran_premi as string}
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
