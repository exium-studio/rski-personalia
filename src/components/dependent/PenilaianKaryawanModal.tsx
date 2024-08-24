import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "./DisclosureHeader";
import useDataState from "../../hooks/useDataState";
import useBackOnClose from "../../hooks/useBackOnClose";

interface Props {
  user_id_penilaian: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function PenilaianKaryawanModal({
  user_id_penilaian,
  isOpen,
  onOpen,
  onClose,
}: Props) {
  useBackOnClose(
    `penilaian-karyawan-modal-${user_id_penilaian}`,
    isOpen,
    onOpen,
    onClose
  );
  const { error, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: ``,
    dependencies: [],
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={backOnClose}
      isCentered
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <DisclosureHeader title={"Penilaian"} />
        </ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
