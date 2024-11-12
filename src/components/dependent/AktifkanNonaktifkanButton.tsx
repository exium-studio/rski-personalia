import {
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
import { RiShutDownFill } from "@remixicon/react";
import { useState } from "react";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import req from "../../lib/req";
import DisclosureHeader from "./DisclosureHeader";

interface Props extends ButtonProps {
  karyawan_id: number;
  data?: number | boolean;
}
export default function AktifkanNonaktifkanButton({
  karyawan_id,
  data,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    "konfirmasi-aktifkan-nonaktifkan-modal",
    isOpen,
    onOpen,
    onClose
  );

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  function handleToggleAktifkan() {
    setLoading(true);

    req
      .post(`/api/rski/dashboard/karyawan/${karyawan_id}/status-karyawan`)
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
  }

  return (
    <>
      <Button
        flexShrink={0}
        leftIcon={
          <Icon
            as={RiShutDownFill}
            fontSize={iconSize}
            color={data === 2 ? "red.400" : "green.500"}
          />
        }
        className="btn-solid clicky"
        pl={5}
        onClick={onOpen}
        isLoading={loading}
        {...props}
      >
        {data === 2 ? "Non-aktifkan" : "Aktifkan"}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader
              title={data === 2 ? "Non-aktifkan" : "Aktifkan"}
            />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.4}>
              Apakah anda yakin akan{" "}
              {data === 2 ? "menonaktifkan" : "mengaktifkan"} akun ini?
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              onClick={backOnClose}
              isDisabled={loading}
            >
              Tidak
            </Button>
            <Button
              w={"100%"}
              className="btn-ap clicky"
              colorScheme="ap"
              onClick={handleToggleAktifkan}
              isLoading={loading}
            >
              Ya
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
