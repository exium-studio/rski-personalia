import {
  Avatar,
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  StackProps,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiArrowDownSLine, RiLogoutBoxLine } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useGetUserData from "../../hooks/useGetUserData";
import useLogout from "../../hooks/useLogout";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "../dependent/DisclosureHeader";

const LogoutConfirmation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("logout-confirmation-modal", isOpen, onOpen, onClose);

  const { logout, logoutLoading } = useLogout();

  return (
    <>
      <MenuItem fontWeight={500} onClick={onOpen}>
        <Text color={"red.400"}>Keluar</Text>
        <Icon
          as={RiLogoutBoxLine}
          fontSize={iconSize}
          color={"red.400"}
          transform={"rotate(180deg)"}
        />
      </MenuItem>

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
};

interface Props extends StackProps {}

export default function AdminMiniProfile({ ...props }: Props) {
  const userData: any = useGetUserData();
  // console.log(userData);

  const [menuButtonW, setMenuButtonW] = useState<number | undefined>();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (menuButtonRef.current) {
      setMenuButtonW(menuButtonRef.current.offsetWidth);
    }
  }, [menuButtonRef]);

  return (
    <Menu>
      <MenuButton>
        <HStack
          p={2}
          pr={4}
          pl={3}
          borderRadius={8}
          ref={menuButtonRef}
          className="btn-solid"
          {...props}
        >
          <Icon as={RiArrowDownSLine} fontSize={iconSize} />

          <Text maxW={"100px"} className="noofline-1" whiteSpace={"nowrap"}>
            {userData?.nama || "Admin"}
          </Text>

          <Avatar
            src={userData?.foto_profil || ""}
            name={userData?.nama || "Admin"}
            size={"xs"}
          />
        </HStack>
      </MenuButton>

      <Portal>
        <MenuList zIndex={999} minW={menuButtonW}>
          <LogoutConfirmation />
        </MenuList>
      </Portal>
    </Menu>
  );
}
