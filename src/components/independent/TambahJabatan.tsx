import {
  Button,
  ButtonProps,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
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
import { RiAddCircleFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";
import req from "../../lib/req";
import { iconSize } from "../../constant/sizes";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "../dependent/DisclosureHeader";
import NumberInput from "../dependent/input/NumberInput";
import StringInput from "../dependent/input/StringInput";
import RequiredForm from "../form/RequiredForm";

interface Props extends ButtonProps {}

export default function TambahJabatan({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-jabatan-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama_jabatan: undefined,
      tunjangan: undefined,
      is_struktural: false,
    },
    validationSchema: yup.object().shape({
      nama_jabatan: yup.string().required("Harus diisi"),
      tunjangan: yup.number().required("Harus diisi"),
      is_struktural: yup.boolean(),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama_jabatan: values.nama_jabatan,
        tunjangan_jabatan: values.tunjangan,
        is_struktural: values.is_struktural ? 1 : 0,
      };
      setLoading(true);
      req
        .post("/api/rski/dashboard/pengaturan/jabatan", payload)
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
        Tambah Jabatan
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
              title="Tambah Jabatan"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="tambahJabatanForm" onSubmit={formik.handleSubmit}>
              <FormControl
                mb={4}
                isInvalid={formik.errors.nama_jabatan ? true : false}
              >
                <FormLabel>
                  Nama Jabatan
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="nama_jabatan"
                  placeholder="Human Resource"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("nama_jabatan", input);
                  }}
                  inputValue={formik.values.nama_jabatan || ""}
                />
                <FormErrorMessage>
                  {formik.errors.nama_jabatan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.tunjangan ? true : false}
              >
                <FormLabel>
                  Tunjangan
                  <RequiredForm />
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pl={4}>
                    <Text>Rp</Text>
                  </InputLeftElement>
                  <NumberInput
                    pl={12}
                    name="tunjangan"
                    placeholder="500.000"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("tunjangan", input);
                    }}
                    inputValue={formik.values.tunjangan}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {formik.errors.tunjangan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.is_struktural ? true : false}
              >
                <Checkbox
                  colorScheme="ap"
                  onChange={(e) => {
                    formik.setFieldValue("is_struktural", e.target.checked);
                  }}
                  isChecked={formik.values.is_struktural}
                >
                  <Text mt={"-3px"}>Jabatan Struktural</Text>
                </Checkbox>
                <FormHelperText mt={1}>
                  Untuk menandai bahwa jabatan ini adalah jabatan struktural.
                </FormHelperText>
                <FormErrorMessage>
                  {formik.errors.is_struktural as string}
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
