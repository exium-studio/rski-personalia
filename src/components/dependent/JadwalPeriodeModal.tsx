import {
  Button,
  ButtonProps,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { RiCalendarLine } from "@remixicon/react";
import { Dispatch, useRef } from "react";
import backOnClose from "../../lib/backOnCloseOld";
import useBackOnClose from "../../lib/useBackOnCloseOld";

interface Props extends ButtonProps {
  data: any;
  active: any;
  setActive: Dispatch<any>;
}

export default function JadwalPeriodeModal({
  data,
  active,
  setActive,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(isOpen, onClose);
  const initialRef = useRef(null);

  return (
    <>
      <Button
        className="btn"
        w={"100%"}
        justifyContent={"space-between"}
        borderRadius={8}
        border={"1px solid var(--divider3)"}
        py={2}
        px={4}
        h={"40px"}
        fontWeight={400}
        cursor={"pointer"}
        onClick={onOpen}
        // _focus={{ boxShadow: "0 0 0px 2px var(--p500)" }}
        _focus={{ border: "1px solid var(--p500)", boxShadow: "none" }}
        {...props}
      >
        <Text>{active.label}</Text>

        <Icon as={RiCalendarLine} mb={"2px"} />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose(onClose);
        }}
        initialFocusRef={initialRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader ref={initialRef}>Pilih Periode</ModalHeader>
          <ModalBody pb={6}>
            <VStack align={"stretch"}>
              {data.map((periode: any, i: number) => (
                <HStack
                  px={4}
                  h={"40px"}
                  className="btn-outline clicky"
                  justify={"center"}
                  cursor={"pointer"}
                  borderRadius={8}
                  key={i}
                >
                  <Text>{periode.label}</Text>
                </HStack>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
