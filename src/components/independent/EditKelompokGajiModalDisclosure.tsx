import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputLeftElement,
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
import DisclosureHeader from "../dependent/DisclosureHeader";
import NumberInput from "../dependent/input/NumberInput";
import StringInput from "../dependent/input/StringInput";
import RequiredForm from "../form/RequiredForm";
interface Props extends BoxProps {
  rowData: any;
  children?: ReactNode;
}

export default function EditKelompokGajiModalDisclosure({
  rowData,
  children,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `edit-kelompok-gaji-modal-${rowData.id}`,
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
      nama_kelompok: "" as any,
      besaran_gaji: undefined as any,
      // tunjangan_jabatan: undefined as any,
    },
    validationSchema: yup.object().shape({
      nama_kelompok: yup.string().required("Harus diisi"),
      besaran_gaji: yup.number().required("Harus diisi"),
      // tunjangan_jabatan: yup.number().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama_kelompok: values.nama_kelompok,
        besaran_gaji: values.besaran_gaji,
        _method: "patch",
      };
      setLoading(true);
      req
        .post(
          `/api/rski/dashboard/pengaturan/kelompok-gaji/${rowData.id}`,
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

  console.log(rowData.originalData?.tunjangan_jabatan);

  useEffect(() => {
    formikRef.current.setFieldValue(
      "nama_kelompok",
      rowData.originalData?.nama_kelompok
    );
    formikRef.current.setFieldValue(
      "besaran_gaji",
      rowData.originalData?.besaran_gaji
    );
    // formikRef.current.setFieldValue(
    //   "tunjangan_jabatan",
    //   rowData.originalData?.tunjangan_jabatan
    // );
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
              title="Edit Kelompok Gaji"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="editKelompokGajiForm" onSubmit={formik.handleSubmit}>
              <FormControl
                mb={4}
                isInvalid={formik.errors.nama_kelompok ? true : false}
              >
                <FormLabel>
                  Nama Kelompok
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="nama_kelompok"
                  placeholder="Human Resource"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("nama_kelompok", input);
                  }}
                  inputValue={formik.values.nama_kelompok}
                />
                <FormErrorMessage>
                  {formik.errors.nama_kelompok as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.besaran_gaji ? true : false}
              >
                <FormLabel>
                  Besaran Gaji
                  <RequiredForm />
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pl={4}>
                    <Text>Rp</Text>
                  </InputLeftElement>
                  <NumberInput
                    pl={12}
                    name="besaran_gaji"
                    placeholder="5.500.000"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("besaran_gaji", input);
                    }}
                    inputValue={formik.values.besaran_gaji}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {formik.errors.besaran_gaji as string}
                </FormErrorMessage>
              </FormControl>

              {/* <FormControl
                isInvalid={formik.errors.tunjangan_jabatan ? true : false}
              >
                <FormLabel>
                  Default Tunjangan Jabatan
                  <RequiredForm />
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pl={4}>
                    <Text>Rp</Text>
                  </InputLeftElement>
                  <NumberInput
                    pl={12}
                    name="tunjangan_jabatan"
                    placeholder="500.000"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("tunjangan_jabatan", input);
                    }}
                    inputValue={formik.values.tunjangan_jabatan}
                  />
                </InputGroup>
                <FormHelperText>
                  Nilai ini otomatis terisi saat tambah karyawan, namun dapat
                  diubah untuk setiap karyawan.
                </FormHelperText>
                <FormErrorMessage>
                  {formik.errors.tunjangan_jabatan as string}
                </FormErrorMessage>
              </FormControl> */}
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              form="editKelompokGajiForm"
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
