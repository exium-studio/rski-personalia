import {
  Button,
  ButtonGroup,
  ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useErrorAlphaColor } from "../../constant/colors";
import useBackOnClose from "../../lib/useBackOnCloseOld";
import DeletePermanentWarning from "../independent/DeletePermanentWarning";
import DisclosureHeader from "./DisclosureHeader";

interface Props extends ButtonProps {
  data: any;
  noUseBackOnClose?: boolean;
}

export default function DeleteJadwalModal({
  data,
  noUseBackOnClose,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const backOnCloseHook = useBackOnClose;
  if (!noUseBackOnClose) {
    backOnCloseHook(isOpen, onClose);
  }
  const handleOnClose = () => {
    onClose();
    if (!noUseBackOnClose) {
      window.history.back();
    }
  };
  const initialRef = useRef(null);

  // SX
  const errorAlphaColor = useErrorAlphaColor();

  return (
    <>
      <Button
        w={"100%"}
        className="clicky"
        colorScheme="red"
        variant={"ghost"}
        onClick={onOpen}
        bg={errorAlphaColor}
        {...props}
      >
        Hapus
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleOnClose}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title="Hapus Jadwal" />
          </ModalHeader>
          <ModalBody>
            <VStack w={"100%"} align={"stretch"}>
              <Text opacity={0.4}>
                Apakah anda yakin menghapus jadwal untuk karyawan ini?
              </Text>

              <DeletePermanentWarning mb={2} mt={4} />

              <ButtonGroup w={"100%"}>
                <Button
                  w={"50%"}
                  className="btn-solid clicky"
                  onClick={handleOnClose}
                  // isDisabled={loadingDelete}
                >
                  Tidak
                </Button>
                <Button
                  w={"50%"}
                  className="clicky"
                  colorScheme="red"
                  // isLoading={loadingDelete}
                  // onClick={deleteJadwal}
                >
                  Ya
                </Button>
              </ButtonGroup>
            </VStack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
