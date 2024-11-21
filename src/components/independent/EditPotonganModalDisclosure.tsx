import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { ReactNode, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import useBackOnClose from "../../hooks/useBackOnClose";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import req from "../../lib/req";
import SelectJenisPotongan from "../dependent/_Select/SelectJenisPotongan";
import SelectSumberPotongan from "../dependent/_Select/SelectSumberPotongan";
import DisclosureHeader from "../dependent/DisclosureHeader";
import NumberInput from "../dependent/input/NumberInput";
import StringInput from "../dependent/input/StringInput";
import RequiredForm from "../form/RequiredForm";

interface Props extends BoxProps {
  rowData: any;
  children?: ReactNode;
}

export default function EditPotonganModalDisclosure({
  rowData,
  children,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-potongan-modal-${rowData.id}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama_premi: "",
      jenis_premi: undefined as any,
      sumber_potongan: undefined as any,
      besaran_premi: undefined as any,
      minimal_rate: undefined as any,
      maksimal_rate: undefined as any,
    },
    validationSchema: yup.object().shape({
      nama_premi: yup.string().required("Harus diisi"),
      jenis_premi: yup.object().required("Harus diisi"),
      sumber_potongan: yup.object().required("Harus diisi"),
      besaran_premi: yup.number().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama_premi: values.nama_premi,
        jenis_premi: values.jenis_premi.value,
        kategori_potongan_id: values.sumber_potongan.value,
        besaran_premi: values.besaran_premi,
        minimal_rate: values.minimal_rate,
        maksimal_rate: values.maksimal_rate,
        _method: "patch",
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/premi/${rowData.id}`, payload)
        .then((r) => {
          if (r.status === 200) {
            toast({
              status: "success",
              title: r.data.message,
              isClosable: true,
              position: "bottom-right",
            });
            setRt(!rt);
            backOnClose();
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
      "nama_premi",
      rowData.columnsFormat[0].value
    );
    formikRef.current.setFieldValue("jenis_premi", {
      value: rowData.columnsFormat[2].value,
      label: rowData.columnsFormat[2].value ? "Nominal" : "Persentase (%)",
    });
    formikRef.current.setFieldValue("sumber_potongan", {
      value: rowData.columnsFormat[3].original_data.id,
      label: rowData.columnsFormat[3].original_data.label,
    });
    formikRef.current.setFieldValue(
      "besaran_premi",
      rowData.columnsFormat[4].value
    );
    formikRef.current.setFieldValue(
      "minimal_rate",
      rowData.columnsFormat[5]?.value
    );
    formikRef.current.setFieldValue(
      "maksimal_rate",
      rowData.columnsFormat[6]?.value
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
              title="Edit Potongan"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="editPotonganForm" onSubmit={formik.handleSubmit}>
              <FormControl
                mb={4}
                isInvalid={formik.errors.nama_premi ? true : false}
              >
                <FormLabel>
                  Nama Potongan
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="nama_premi"
                  placeholder="Tapera"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("nama_premi", input);
                  }}
                  inputValue={formik.values.nama_premi || ""}
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
                  Sumber Potongan
                  <RequiredForm />
                </FormLabel>
                <SelectSumberPotongan
                  name="sumber_potongan"
                  onConfirm={(input) => {
                    formik.setFieldValue("sumber_potongan", input);
                  }}
                  inputValue={formik.values.sumber_potongan}
                  isError={!!formik.errors.sumber_potongan}
                />
                <FormErrorMessage>
                  {formik.errors.sumber_potongan as string}
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
                <SelectJenisPotongan
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
                mb={4}
                isInvalid={formik.errors.besaran_premi ? true : false}
              >
                <FormLabel>
                  Besaran Potongan
                  <RequiredForm />
                </FormLabel>

                {formik?.values.jenis_premi &&
                formik?.values.jenis_premi?.value === 0 ? (
                  <InputGroup>
                    <InputRightElement pr={4}>
                      <Text>%</Text>
                    </InputRightElement>
                    <Input
                      type="number"
                      pr={12}
                      name="besaran_premi"
                      placeholder="3.5"
                      onChange={formik.handleChange}
                      value={formik.values.besaran_premi || ""}
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
              <>
                <FormControl
                  mb={4}
                  isInvalid={formik.errors.minimal_rate ? true : false}
                >
                  <FormLabel>Minimal Rate</FormLabel>

                  <InputGroup>
                    <InputLeftElement pl={4}>
                      <Text>Rp</Text>
                    </InputLeftElement>
                    <NumberInput
                      isDisabled={formik.values.jenis_premi === undefined}
                      pl={12}
                      name="minimal_rate"
                      placeholder="500.000"
                      onChangeSetter={(input) => {
                        formik.setFieldValue("minimal_rate", input);
                      }}
                      inputValue={formik.values.minimal_rate}
                    />
                  </InputGroup>

                  <FormErrorMessage>
                    {formik.errors.minimal_rate as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={formik.errors.maksimal_rate ? true : false}
                >
                  <FormLabel>Maksimal Rate</FormLabel>

                  <InputGroup>
                    <InputLeftElement pl={4}>
                      <Text>Rp</Text>
                    </InputLeftElement>
                    <NumberInput
                      isDisabled={formik.values.jenis_premi === undefined}
                      pl={12}
                      name="maksimal_rate"
                      placeholder="500.000"
                      onChangeSetter={(input) => {
                        formik.setFieldValue("maksimal_rate", input);
                      }}
                      inputValue={formik.values.maksimal_rate}
                    />
                  </InputGroup>

                  <FormErrorMessage>
                    {formik.errors.maksimal_rate as string}
                  </FormErrorMessage>
                </FormControl>
              </>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              form="editPotonganForm"
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
