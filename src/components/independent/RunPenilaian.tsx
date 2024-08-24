import {
  Button,
  ButtonProps,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { RiChatCheckFill } from "@remixicon/react";
import { useRef } from "react";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "../dependent/DisclosureHeader";
import TabelKaryawanDinilai from "../dependent/TabelKaryawanDinilai";

interface Props extends ButtonProps {}

export default function RunPenilaian({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("run-penilaian-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  return (
    <>
      <Button
        className="btn-ap clicky"
        colorScheme="ap"
        onClick={onOpen}
        leftIcon={<Icon as={RiChatCheckFill} fontSize={iconSize} />}
        pl={5}
        {...props}
      >
        Run Penilaian
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
        }}
        initialFocusRef={initialRef}
        isCentered
        blockScrollOnMount={false}
        size={"full"}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent borderRadius={12} minH={"calc(100vh - 32px)"}>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title="Run Penilaian Karyawan" />
          </ModalHeader>
          <ModalBody pb={6}>
            <TabelKaryawanDinilai />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
