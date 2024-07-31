import {
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
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
  Wrap,
} from "@chakra-ui/react";
import { RiAddCircleFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef } from "react";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import SelectPtkp from "../dependent/_Select/SelectPtkp";
import DisclosureHeader from "../dependent/DisclosureHeader";
import NumberInput from "../dependent/input/NumberInput";
import RequiredForm from "../form/RequiredForm";

interface Props extends ButtonProps {}

export default function TambahTerPph21({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-ter-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      // kategori_ter: "" as any,
      ptkp: "" as any,
      from_ter: undefined,
      to_ter: undefined,
      percentage: undefined,
    },
    validationSchema: yup.object().shape({
      // kategori_ter: yup.string().required("Harus diisi"),
      ptkp: yup.number().required("Harus diisi"),
      from_ter: yup.number().required("Harus diisi"),
      to_ter: yup.number().required("Harus diisi"),
      percentage: yup.number().required("Harus diisi"),
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
        Tambah TER pph21
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
              title="Tambah TER pph21"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="tambahJabatanForm" onSubmit={formik.handleSubmit}>
              {/* <FormControl
                mb={4}
                isInvalid={formik.errors.kategori_ter ? true : false}
              >
                <FormLabel>
                  Kategori TER
                  <RequiredForm />
                </FormLabel>
                <SelectKategoriTer
                  name="kategori_ter"
                  formik={formik}
                  placeholder="Pilih Kategori TER"
                  initialSelected={formik.values.kategori_ter}
                  noUseBackOnClose
                  noSearch
                />
                <FormErrorMessage>
                  {formik.errors.kategori_ter as string}
                </FormErrorMessage>
              </FormControl> */}

              <FormControl mb={4} isInvalid={formik.errors.ptkp ? true : false}>
                <FormLabel>
                  PTKP
                  <RequiredForm />
                </FormLabel>
                <SelectPtkp
                  name="ptkp"
                  onConfirm={(input) => {
                    formik.setFieldValue("ptkp", input);
                  }}
                  inputValue={formik.values.ptkp}
                />
                <FormErrorMessage>
                  {formik.errors.ptkp as string}
                </FormErrorMessage>
              </FormControl>

              <FormLabel>
                Penghasilan Bruto Bulanan
                <RequiredForm />
              </FormLabel>
              <Wrap spacing={4} mb={4}>
                <FormControl
                  flex={"1 1"}
                  isInvalid={formik.errors.from_ter ? true : false}
                >
                  <InputGroup>
                    <InputLeftElement pl={4}>
                      <Text>Rp</Text>
                    </InputLeftElement>
                    <NumberInput
                      pl={12}
                      name="from_ter"
                      placeholder="500.000"
                      onChangeSetter={(input) => {
                        formik.setFieldValue("from_ter", input);
                      }}
                      inputValue={formik.values.from_ter}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {formik.errors.from_ter as string}
                  </FormErrorMessage>
                </FormControl>

                <Text mt={"5px"} textAlign={"center"}>
                  -
                </Text>

                <FormControl
                  flex={"1 1"}
                  isInvalid={formik.errors.to_ter ? true : false}
                >
                  <InputGroup>
                    <InputLeftElement pl={4}>
                      <Text>Rp</Text>
                    </InputLeftElement>
                    <NumberInput
                      pl={12}
                      name="to_ter"
                      placeholder="500.000"
                      onChangeSetter={(input) => {
                        formik.setFieldValue("to_ter", input);
                      }}
                      inputValue={formik.values.to_ter}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {formik.errors.to_ter as string}
                  </FormErrorMessage>
                </FormControl>
              </Wrap>

              <FormControl
                flex={"1 1"}
                isInvalid={formik.errors.percentage ? true : false}
              >
                <FormLabel>
                  Rate TER
                  <RequiredForm />
                </FormLabel>
                <InputGroup>
                  <InputRightElement pr={4}>
                    <Text>%</Text>
                  </InputRightElement>
                  <NumberInput
                    pr={12}
                    name="percentage"
                    placeholder="500.000"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("percentage", input);
                    }}
                    inputValue={formik.values.percentage}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {formik.errors.percentage as string}
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
