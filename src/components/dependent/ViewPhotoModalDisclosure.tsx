import {
  Box,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "./DisclosureHeader";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  src?: string;
}

export default function ViewPhotoModalDisclosure({ children, src }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`view-photo-${src}`, isOpen, onOpen, onClose);

  return (
    <>
      <Box
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        cursor={"pointer"}
      >
        {children}
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
        size={"full"}
      >
        <ModalOverlay />
        <ModalContent
          bg={"transparent !important"}
          border={"none"}
          backdropFilter={"none"}
          minH={"calc(100vh - 32px)"}
          onClick={backOnClose}
        >
          <ModalHeader>
            <DisclosureHeader title={""} />
          </ModalHeader>
          <ModalBody>
            <Image
              src={src}
              w={"50%"}
              m={"auto"}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
