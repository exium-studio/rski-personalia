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
import req from "../../constant/req";
import { iconSize } from "../../constant/sizes";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnCloseOld";
import useBackOnClose from "../../lib/useBackOnCloseOld";
import DisclosureHeader from "../dependent/DisclosureHeader";
import StringInput from "../dependent/input/StringInput";
import Textarea from "../dependent/input/Textarea";
import RequiredForm from "../form/RequiredForm";

interface Props extends ButtonProps {}

export default function TambahRole({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(isOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { name: "", deskripsi: "" },
    validationSchema: yup.object().shape({
      name: yup.string().required("Harus diisi"),
      deskripsi: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        name: values.name,
        deskripsi: values.deskripsi,
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/role`, payload)
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
              "Maaf terjadi kesalahan pada sistem",
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
        Tambah Role
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose(onClose);
          formik.resetForm();
        }}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader
              title="Tambah Role"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="tambahRoleForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={formik.errors.name ? true : false}>
                <FormLabel>
                  Nama Role
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="name"
                  placeholder="Human Resource"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("name", input);
                  }}
                  inputValue={formik.values.name}
                />
                <FormErrorMessage>
                  {formik.errors.name as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.deskripsi ? true : false}>
                <FormLabel>
                  Deskripsi
                  <RequiredForm />
                </FormLabel>
                <Textarea
                  name="deskripsi"
                  placeholder="Diperuntukan untuk jabatan HR"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("deskripsi", input);
                  }}
                  inputValue={formik.values.deskripsi}
                />
                <FormErrorMessage>
                  {formik.errors.deskripsi as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="tambahRoleForm"
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
