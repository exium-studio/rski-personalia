import {
  Button,
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
import { RiShutDownLine } from "@remixicon/react";
import { iconSize } from "../../constant/sizes";
import req from "../../constant/req";
import { useState } from "react";
import useRenderTrigger from "../../global/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "./DisclosureHeader";
import useBackOnClose from "../../hooks/useBackOnClose";

interface Props {
  user_id: number;
  data?: number | boolean;
}
export default function AktifkanNonaktifkanButton({ user_id, data }: Props) {
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
    const payload = {
      user_id: user_id,
    };
    req
      .post(`/api/rski/dashboard/karyawan/53/status-karyawan`, payload)
      .then((r) => {
        if (r.status === 200) {
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
            "Maaf terjadi kesalahan pada sistem",
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
            as={RiShutDownLine}
            fontSize={iconSize}
            color={!data ? "p.500" : "red.400"}
          />
        }
        className="btn-outline clicky"
        pl={5}
        onClick={onOpen}
        isLoading={loading}
      >
        {data ? "Non-aktifkan" : "Aktifkan"}
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
            <DisclosureHeader title={data ? "Non-aktifkan" : "Aktifkan"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.4}>
              Apakah anda yakin akan {data ? "menonaktifkan" : "mengaktifkan"}{" "}
              akun ini?
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              onClick={backOnClose}
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
