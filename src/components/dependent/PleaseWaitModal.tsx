import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import backOnClose from "../../lib/backOnClose";
import SpinnerKeren from "../independent/SpinnerKeren";

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
          {/* <Spinner
            w={"120px"}
            h={"120px"}
            mx={"auto"}
            mb={6}
            borderWidth={"4px"}
          /> */}
          <SpinnerKeren
            color="p.500"
            trackColor="transparent"
            thickness={"6px"}
            mx={"auto"}
            size={"100px"}
            mb={6}
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
