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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import useBackOnClose from "../../hooks/useBackOnClose";
import useLogout from "../../hooks/useLogout";
import { RiLogoutBoxLine } from "@remixicon/react";
import { iconSize } from "../../constant/sizes";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "../dependent/DisclosureHeader";

interface LogoutProps extends ButtonProps {}

export default function LogoutButton({ ...props }: LogoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("profile-logout-confirmation-modal", isOpen, onOpen, onClose);

  const { logout, logoutLoading } = useLogout();

  // SX

  return (
    <>
      <Button
        leftIcon={
          <Icon
            as={RiLogoutBoxLine}
            fontSize={iconSize}
            transform={"rotate(180deg)"}
          />
        }
        colorScheme="red"
        variant={"ghost"}
        size={"lg"}
        onClick={onOpen}
        className="clicky"
        {...props}
      >
        Keluar
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Keluar"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.4}>Apakah anda yakin akan keluar akun?</Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              onClick={backOnClose}
              isDisabled={logoutLoading}
            >
              Tidak
            </Button>
            <Button
              w={"100%"}
              className="clicky"
              colorScheme="red"
              onClick={logout}
              isLoading={logoutLoading}
            >
              Ya
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
