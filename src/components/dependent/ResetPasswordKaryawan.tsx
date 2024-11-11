import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ButtonProps,
  Icon,
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
import { RiLock2Fill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";
import { responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import req from "../../lib/req";
import DisclosureHeader from "./DisclosureHeader";
import PasswordInput from "./input/PasswordInput";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import useGetUserData from "../../hooks/useGetUserData";

interface Props extends ButtonProps {
  userData: any;
}

export default function ResetPasswordKaryawan({ userData, ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `konfirmasi-reset-password-${userData}`,
    isOpen,
    onOpen,
    onClose
  );

  const isUserSuperAdmin = useGetUserData()?.role?.id === 1;

  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { password: "1234" },
    validationSchema: yup
      .object()
      .shape({ password: yup?.string().required("Harus diisi") }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);

      const payload = {
        user_id: userData?.id,
        password: values.password,
      };

      req
        .post(`/api/rski/dashboard/karyawan/reset-credentials`, payload)
        .then((r) => {
          if (r.status === 200) {
            backOnClose();
            toast({
              status: "success",
              title: r?.data?.message,
              position: "bottom-right",
              isClosable: true,
            });
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
            position: "bottom-right",
            isClosable: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  const inputPasswordRef = useRef<HTMLInputElement>(null);

  function copyPassword() {
    if (inputPasswordRef) {
      const password = inputPasswordRef?.current?.value;

      if (password) {
        navigator.clipboard
          .writeText(password)
          .then(() => {
            toast({
              status: "success",
              title: "Password berhasil disalin",
              isClosable: true,
              position: "bottom-right",
            });
          })
          .catch((err) => {
            toast({
              status: "error",
              title: "Password gagal disalin",
              isClosable: true,
              position: "bottom-right",
            });
          });
      } else {
        toast({
          status: "warning",
          title: "Password belum diisi",
          isClosable: true,
          position: "bottom-right",
        });
      }
    }
  }

  return (
    <>
      <PermissionTooltip permission={isUserSuperAdmin} boxProps={{ w: "100%" }}>
        <Button
          w={"100%"}
          className="btn-solid clicky"
          leftIcon={<Icon as={RiLock2Fill} mb={"2px"} color={"blue.400"} />}
          onClick={onOpen}
          isDisabled={!isUserSuperAdmin}
          {...props}
        >
          Reset Password
        </Button>
      </PermissionTooltip>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Reset Password Karyawan"} />
          </ModalHeader>
          <ModalBody>
            <Alert status="warning" mb={responsiveSpacing} alignItems={"start"}>
              <AlertIcon />
              <AlertDescription maxW={"640px !important"}>
                Pastikan anda ingat/copy password baru karyawan.
              </AlertDescription>
            </Alert>

            <Text mb={4} opacity={0.4}>
              Apakah anda yakin akan reset password karyawan{" "}
              <b>{userData?.nama}</b> ?
            </Text>

            <PasswordInput
              fRef={inputPasswordRef}
              name="password"
              onChangeSetter={(input) => {
                formik.setFieldValue("password", input);
              }}
              inputValue={formik.values.password}
            />
            <Text fontSize={"sm"} opacity={0.4} mt={1}>
              Input password baru karyawan di input diatas
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              w={"100%"}
              onClick={copyPassword}
              className="btn-solid clicky"
              isDisabled={!formik.values.password || loading}
            >
              Copy Password
            </Button>
            <Button
              w={"100%"}
              onClick={formik.submitForm}
              colorScheme="ap"
              className="btn-ap clicky"
              isLoading={loading}
            >
              Konfirmasi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
