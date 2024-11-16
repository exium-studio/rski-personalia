import {
  Button,
  ButtonProps,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { RiAddLine } from "@remixicon/react";
import { useRef, useState } from "react";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "../dependent/DisclosureHeader";
import FormDashboardBuatPengumuman from "../form/Dashboard/FormDashboardBuatPengumuman";

interface Props extends ButtonProps {}

export default function DashboardBuatPengumumanModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  useBackOnClose("buat-pengumuman-modal", isOpen, onOpen, onClose);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <IconButton
        aria-label="tambah pengumuman"
        icon={<Icon as={RiAddLine} fontSize={iconSize} />}
        className="btn-ap clicky"
        colorScheme="ap"
        onClick={onOpen}
        {...props}
      />

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
            <FormDashboardBuatPengumuman
              forwardRef={initialRef}
              setLoading={setLoading}
            />
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
              Buat Pengumuman
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
