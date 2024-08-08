import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import backOnClose from "../../lib/backOnClose";

interface Props {
  isOpen: boolean;
}

export default function PleaseWaitModal({ isOpen }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={backOnClose}
      isCentered
      blockScrollOnMount={false}
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay bg={"#191919dd"} />
      <ModalContent bg={"transparent"} backdropFilter={"none"} border={"none"}>
        <ModalBody
          py={6}
          aspectRatio={1}
          justifyContent={"center"}
          color={"white"}
        >
          <Spinner
            w={"120px"}
            h={"120px"}
            mx={"auto"}
            mb={6}
            borderWidth={"4px"}
          />
          <Text textAlign={"center"} fontSize={20}>
            Mohon tunggu sebentar, proses ini mungkin memerlukan beberapa saat
            untuk selesai.
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
