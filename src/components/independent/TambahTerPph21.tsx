import {
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormHelperText,
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
  useToast,
  Wrap,
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
import SelectKategoriTer from "../dependent/_Select/SelectKategoriTer";
import DisclosureHeader from "../dependent/DisclosureHeader";
import NumberInput from "../dependent/input/NumberInput";
import RequiredForm from "../form/RequiredForm";

interface Props extends ButtonProps {}

export default function TambahTerPph21({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-ter-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      kategori_ter: undefined as any,
      // ptkp: undefined as any,
      from_ter: undefined,
      to_ter: undefined,
      percentage: undefined,
    },
    validationSchema: yup.object().shape({
      kategori_ter: yup.object().required("Harus diisi"),
      // ptkp: yup.object().required("Harus diisi"),
      from_ter: yup.number().required("Harus diisi"),
      to_ter: yup.number().required("Harus diisi"),
      percentage: yup.number().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        kategori_ter_id: values.kategori_ter?.value,
        // ptkp_id: values.ptkp?.value,
        from_ter: values.from_ter,
        to_ter: values.to_ter,
        percentage: values.percentage,
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/pph-21`, payload)
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
            <form id="tambahTerPph21Form" onSubmit={formik.handleSubmit}>
              <FormControl
                mb={4}
                isInvalid={formik.errors.kategori_ter ? true : false}
              >
                <FormLabel>
                  Kategori TER
                  <RequiredForm />
                </FormLabel>
                <SelectKategoriTer
                  name="kategori_ter"
                  onConfirm={(input) => {
                    formik.setFieldValue("kategori_ter", input);
                  }}
                  inputValue={formik.values.kategori_ter}
                  isError={!!formik.errors.kategori_ter}
                />
                <FormErrorMessage>
                  {formik.errors.kategori_ter as string}
                </FormErrorMessage>
              </FormControl>

              {/* <FormControl mb={4} isInvalid={formik.errors.ptkp ? true : false}>
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
                  isError={!!formik.errors.ptkp}
                />
                <FormErrorMessage>
                  {formik.errors.ptkp as string}
                </FormErrorMessage>
              </FormControl> */}

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
                  <Input
                    type="number"
                    pr={12}
                    name="percentage"
                    placeholder="3.5"
                    onChange={formik.handleChange}
                    value={formik.values.percentage}
                  />
                </InputGroup>
                <FormHelperText opacity={0.4}>
                  Pecahan desimal harus pakai titik
                </FormHelperText>
                <FormErrorMessage>
                  {formik.errors.percentage as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="tambahTerPph21Form"
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
