import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useBackOnClose from "../../lib/useBackOnCloseOld";
import { useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AlertOutsidePresenceRadius({ isOpen, onClose }: Props) {
  useBackOnClose(isOpen, onClose);
  const handleOnClose = () => {
    onClose();
    window.history.back();
  };
  const initialRef = useRef(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleOnClose}
      isCentered
      size={"sm"}
      initialFocusRef={initialRef}
    >
      <ModalOverlay />

      <ModalContent>
        <ModalCloseButton />
        <ModalBody pt={6} ref={initialRef}>
          <Image
            src="/vectors/outsideRadius.png"
            boxSize={"250px"}
            objectFit={"contain"}
            mx={"auto"}
          />

          <Text
            textAlign={"center"}
            fontWeight={600}
            fontSize={[22, null, 24]}
            mb={2}
            lineHeight={8}
          >
            Anda berada di luar area kehadiran
          </Text>
          <Text textAlign={"center"} opacity={0.6} maxW={"300px"} mx={"auto"}>
            Maaf, sepertinya Anda berada di luar area absen. Untuk melanjutkan,
            silakan lakukan dengan izin.
          </Text>
        </ModalBody>
        <ModalFooter gap={4}>
          <Button
            colorScheme="ap"
            className="btn-ap clicky"
            w={"100%"}
            as={Link}
            to={""}
          >
            Izin Sekarang
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
