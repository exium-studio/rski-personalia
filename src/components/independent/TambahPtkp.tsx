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
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import SelectKategoriTer from "../dependent/_Select/SelectKategoriTer";
import DisclosureHeader from "../dependent/DisclosureHeader";
import RequiredForm from "../form/RequiredForm";
import StringInput from "../dependent/input/StringInput";
import req from "../../lib/req";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import NumberInput from "../dependent/input/NumberInput";

interface Props extends ButtonProps {}

export default function TambahPtkp({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-ter-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      kode_ptkp: "" as any,
      kategori_ter: undefined as any,
      nilai: undefined as any,
    },
    validationSchema: yup.object().shape({
      kode_ptkp: yup.string().required("Harus diisi"),
      kategori_ter: yup.object().required("Harus diisi"),
      nilai: yup.number().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        kode_ptkp: values.kode_ptkp,
        kategori_ter_id: values.kategori_ter.value,
        nilai: values.nilai,
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/ptkp`, payload)
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
        Tambah PTKP
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
              title="Tambah PTKP"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="tambahJabatanForm" onSubmit={formik.handleSubmit}>
              <FormControl
                mb={4}
                isInvalid={formik.errors.kode_ptkp ? true : false}
              >
                <FormLabel>
                  Kode PTKP
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="kode_ptkp"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("kode_ptkp", input);
                  }}
                  inputValue={formik.values.kode_ptkp}
                  placeholder="TK/0"
                />
                <FormErrorMessage>
                  {formik.errors.kode_ptkp as string}
                </FormErrorMessage>
              </FormControl>

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

              <FormControl
                mb={4}
                isInvalid={formik.errors.nilai ? true : false}
              >
                <FormLabel>
                  Nilai PTKP
                  <RequiredForm />
                </FormLabel>
                <NumberInput
                  name="nilai"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("nilai", input);
                  }}
                  inputValue={formik.values.nilai}
                  placeholder="20.000.000"
                />
                <FormErrorMessage>
                  {formik.errors.nilai as string}
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
