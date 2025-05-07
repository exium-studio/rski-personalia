import {
  Button,
  Icon,
  IconButton,
  IconButtonProps,
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
import { RiEditLine } from "@remixicon/react";
import { useState } from "react";
import { useLightDarkColor } from "../../constant/colors";
import useBackOnClose from "../../hooks/useBackOnClose";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import req from "../../lib/req";
import DisclosureHeader from "../dependent/DisclosureHeader";
import FileInputLarge from "../dependent/input/FileInputLarge";
import { useFormik } from "formik";
import * as yup from "yup";

interface Props extends IconButtonProps {
  data: any;
}
const EditAvatar = (props: Props) => {
  // Props
  const { data, ...restProps } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-avatar-${data?.id}`, isOpen, onOpen, onClose);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { foto_profil: "" },
    validationSchema: yup
      .object()
      .shape({ foto_profil: yup.mixed().required("Harus diisi") }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);

      const url = `/api/rski/dashboard/karyawan/upload-photo-profile/${data.id}`;

      const payload = new FormData();
      payload.append("foto_profil", values.foto_profil);
      req
        .post(url, payload)
        .then((r) => {
          if (r.status === 200) {
            setRt(!rt);
            backOnClose();
            toast({
              status: "success",
              title: r?.data?.message,
              position: "bottom-right",
              isClosable: true,
            });
          } else {
            toast({
              status: "error",
              title:
                "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
              isClosable: true,
              position: "bottom-right",
            });
          }
        })
        .catch((e) => {
          console.error(e);
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
          backOnClose();
          setLoading(false);
        });
    },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { rt, setRt } = useRenderTrigger();
  const toast = useToast();

  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <>
      <IconButton
        icon={<Icon as={RiEditLine} fontSize={20} color={lightDarkColor} />}
        onClick={onOpen}
        position={"absolute"}
        bottom={2}
        right={2}
        borderRadius={"full"}
        className="btn-ap clicky"
        {...restProps}
      />

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Edit Foto Profil"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.4} textAlign={"center"} mb={2}>
              Gunakan foto 1:1 untuk hasil maksimal
            </Text>
            <form id="edit-avatar-form" onSubmit={formik.handleSubmit}>
              <FileInputLarge
                onChangeSetter={(input) => {
                  formik.setFieldValue("foto_profil", input);
                }}
                inputValue={formik.values.foto_profil}
                name="avatar"
                accept="image/*"
                placeholder="Pilih Foto Profil"
                initialFilepath={data.foto_profil}
              />
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="edit-avatar-form"
              w={"full"}
              colorScheme="ap"
              className="clicky"
              isLoading={loading}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditAvatar;
