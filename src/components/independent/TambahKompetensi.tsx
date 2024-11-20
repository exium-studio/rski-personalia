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
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import SelectJenisKompetensi from "../dependent/_Select/SelectJenisKompetensi";
import DisclosureHeader from "../dependent/DisclosureHeader";
import NumberInput from "../dependent/input/NumberInput";
import RequiredForm from "../form/RequiredForm";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import req from "../../lib/req";

interface Props extends ButtonProps {}

export default function TambahKompetensi({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-kompetensi-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama_kompetensi: "" as any,
      jenis_kompetensi: "" as any,
      // total_tunjangan: undefined,
      nilai_bor: undefined,
    },
    validationSchema: yup.object().shape({
      nama_kompetensi: yup.string().required("Harus diisi"),
      jenis_kompetensi: yup.object().required("Harus diisi"),
      // total_tunjangan: yup.number().required("Harus diisi"),
      nilai_bor: yup.number().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama_kompetensi: values.nama_kompetensi,
        jenis_kompetensi: values.jenis_kompetensi.value,
        // tunjangan_kompetensi: values.total_tunjangan,
        nilai_bor: values.nilai_bor,
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/kompetensi`, payload)
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
        Tambah Profesi
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
              title="Tambah Profesi"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="tambahJabatanForm" onSubmit={formik.handleSubmit}>
              <FormControl
                mb={4}
                isInvalid={formik.errors.nama_kompetensi ? true : false}
              >
                <FormLabel>
                  Nama Profesi
                  <RequiredForm />
                </FormLabel>
                <Input
                  name="nama_kompetensi"
                  placeholder="Ortopedi"
                  onChange={formik.handleChange}
                  value={formik.values.nama_kompetensi}
                />
                <FormErrorMessage>
                  {formik.errors.nama_kompetensi as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.jenis_kompetensi ? true : false}
              >
                <FormLabel>
                  Jenis Profesi
                  <RequiredForm />
                </FormLabel>
                <SelectJenisKompetensi
                  name="jenis_kompetensi"
                  onConfirm={(input) => {
                    formik.setFieldValue("jenis_kompetensi", input);
                  }}
                  inputValue={formik.values.jenis_kompetensi}
                  isError={!!formik.errors.jenis_kompetensi}
                />
                <FormErrorMessage>
                  {formik.errors.jenis_kompetensi as string}
                </FormErrorMessage>
              </FormControl>

              {/* <FormControl
                mb={4}
                isInvalid={formik.errors.total_tunjangan ? true : false}
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
                    name="total_tunjangan"
                    placeholder="500.000"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("total_tunjangan", input);
                    }}
                    inputValue={formik.values.total_tunjangan}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {formik.errors.total_tunjangan as string}
                </FormErrorMessage>
              </FormControl> */}

              <FormControl isInvalid={formik.errors.nilai_bor ? true : false}>
                <FormLabel>
                  Nilai BOR
                  <RequiredForm />
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pl={4}>
                    <Text>Rp</Text>
                  </InputLeftElement>
                  <NumberInput
                    pl={12}
                    name="nilai_bor"
                    placeholder="500.000"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("nilai_bor", input);
                    }}
                    inputValue={formik.values.nilai_bor}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {formik.errors.nilai_bor as string}
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
