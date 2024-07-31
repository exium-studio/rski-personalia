import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { RiAddLine } from "@remixicon/react";
import { useRef } from "react";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "../dependent/DisclosureHeader";
import FormDashboardBuatPengumuman from "../form/Dashboard/FormDashboardBuatPengumuman";

export default function DashboardBuatPengumumanModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  useBackOnClose("buat-pengumuman-modal", isOpen, onOpen, onClose);

  return (
    <>
      <Button
        size={"sm"}
        leftIcon={<Icon as={RiAddLine} fontSize={iconSize} />}
        pl={2}
        className="btn-apa clicky"
        color={"p.500"}
        onClick={onOpen}
      >
        Buat Pengumuman
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
        }}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title="Buat Pengumuman" />
          </ModalHeader>

          <ModalBody>
            <FormDashboardBuatPengumuman forwardRef={initialRef} />
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              form="buatPengumumanForm"
              w={"100%"}
              colorScheme="ap"
              className="btn-ap clicky"
            >
              Buat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
