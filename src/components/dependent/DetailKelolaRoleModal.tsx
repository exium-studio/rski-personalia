import {
  BoxProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import PengaturanKeizinan from "../../pages/Pengaturan/PengaturanKeizinan";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";

interface Props extends BoxProps {
  id?: string;
  role_id: number;
  role_name: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
export default function DetailKelolaRoleModal({
  id,
  role_id,
  role_name,
  isOpen,
  onOpen,
  onClose,
  ...props
}: Props) {
  useEffect(() => {
    if (id && isOpen) {
      if (!role_id) {
        backOnClose();
      }
    }
  }, [id, role_id, isOpen]);

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
          <DisclosureHeader title={"Detail Role - Atur Keizinan"} />
        </ModalHeader>

        <ModalBody px={0}>
          <CContainer
            overflowY={"auto"}
            className="scrollY"
            borderRadius={12}
            flex={1}
            pb={6}
          >
            <PengaturanKeizinan role_id={role_id} role_name={role_name} />
          </CContainer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
