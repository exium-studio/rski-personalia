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
  useDisclosure,
} from "@chakra-ui/react";
import { RiWalletFill } from "@remixicon/react";
import { useRef, useState } from "react";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "../dependent/DisclosureHeader";
import FormBuatTagihan from "../form/Tagihan/FormBuatTagihan";

interface Props extends ButtonProps {}

export default function TambahTagihan({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  useBackOnClose("buat-pengumuman-modal", isOpen, onOpen, onClose);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <Button
        leftIcon={<Icon as={RiWalletFill} fontSize={iconSize} />}
        pl={5}
        className="btn-ap clicky"
        colorScheme="ap"
        onClick={onOpen}
        {...props}
      >
        Buat Tagihan
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title="Buat Tagihan" />
          </ModalHeader>

          <ModalBody>
            <FormBuatTagihan forwardRef={initialRef} setLoading={setLoading} />
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              form="buatPengumumanForm"
              w={"100%"}
              colorScheme="ap"
              className="btn-ap clicky"
              isLoading={loading}
            >
              Buat Tagihan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
