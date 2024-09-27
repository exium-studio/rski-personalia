import {
  BoxProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRef } from "react";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";
import PengaturanHakAkses from "../../pages/Pengaturan/PengaturanHakAkses";

interface Props extends BoxProps {
  id?: string;
  role_id: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
export default function DetailKelolaRoleModal({
  id,
  role_id,
  isOpen,
  onOpen,
  onClose,
  ...props
}: Props) {
  useBackOnClose(
    id || `detail-kelola-role-modal-${role_id}`,
    isOpen,
    onOpen,
    onClose
  );
  const initialRef = useRef(null);

  // SX

  return (
    <Modal
      isOpen={isOpen}
      onClose={backOnClose}
      initialFocusRef={initialRef}
      size={"full"}
      scrollBehavior="inside"
      allowPinchZoom
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent borderRadius={12} minH={"calc(100vh - 32px)"}>
        <ModalHeader ref={initialRef}>
          <DisclosureHeader title={"Detail Role - Atur Hak Akses"} />
        </ModalHeader>

        <ModalBody px={0}>
          <CContainer
            overflowY={"auto"}
            className="scrollY"
            borderRadius={12}
            flex={1}
            pb={6}
          >
            <PengaturanHakAkses role_id={role_id} />
          </CContainer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
