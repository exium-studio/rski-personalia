import {
  Box,
  Button,
  ButtonProps,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiLogoutBoxLine } from "@remixicon/react";
import { useNavigate } from "react-router-dom";
import { removeCookie } from "typescript-cookie";
import DisclosureHeader from "../../components/dependent/DisclosureHeader";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import {
  useDarkLightColor,
  useErrorAlphaColor,
  useLightDarkColor,
} from "../../constant/colors";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useGetUserData from "../../hooks/useGetUserData";
import backOnClose from "../../lib/backOnClose";

interface LogoutProps extends ButtonProps {}

const LogoutConfirmation = ({ ...props }: LogoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("profile-logout-confirmation-modal", isOpen, onOpen, onClose);
  const navigate = useNavigate();

  // SX
  const errorAlphaColor = useErrorAlphaColor();

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
        bg={errorAlphaColor}
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
            >
              Tidak
            </Button>
            <Button
              w={"100%"}
              className="clicky"
              colorScheme="red"
              onClick={() => {
                removeCookie("__auth_token");
                navigate("/");
              }}
            >
              Ya
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default function Profil() {
  // SX
  const lightDarkColor = useLightDarkColor();
  const darkLightColor = useDarkLightColor();

  const userData = useGetUserData();

  return (
    <CWrapper pt={0}>
      <Box w={"50px"} flex={1} bg={darkLightColor} mx={"auto"} />
      <Box
        w={"65px"}
        h={"20px"}
        bg={darkLightColor}
        mx={"auto"}
        p={1}
        borderRadius={"full"}
      >
        <Box w={"100%"} h={"100%"} bg={lightDarkColor} borderRadius={"full"} />
      </Box>

      <Box
        mt={"-5px"}
        mb={"-10px"}
        w={"16px"}
        h={"30px"}
        bg={"gray"}
        mx={"auto"}
        borderRadius={"2px"}
        zIndex={3}
      />

      <Box
        w={"200px"}
        h={"16px"}
        bg={lightDarkColor}
        mx={"auto"}
        p={1}
        borderRadius={"100px 100px 0 0"}
        border={"1px solid var(--divider3)"}
        borderBottom={"none !important"}
        zIndex={2}
        mb={"-2px"}
      >
        <Box
          mt={"2px"}
          w={"50px"}
          h={"8px"}
          bg={darkLightColor}
          borderRadius={"full"}
          opacity={0.1}
          mx={"auto"}
        />
      </Box>
      <Box m={"auto"} flex={3}>
        <CContainer
          bg={lightDarkColor}
          borderRadius={12}
          position={"relative"}
          overflowY={"auto"}
          className="scrollY admin-card"
          w={"300px"}
          mb={responsiveSpacing}
          p={2}
          border={"1px solid var(--divider3)"}
        >
          <CContainer flex={"1 1 150px"} gap={responsiveSpacing}>
            <Image
              src={userData?.foto_profil || "/images/defaultProfilePhoto.webp"}
              aspectRatio={1}
              borderRadius={"8px 8px 0 0"}
              boxSize={"281.63px"}
            />
          </CContainer>

          <CContainer
            p={responsiveSpacing}
            bg={"p.500"}
            color={"white"}
            borderRadius={"0 0 8px 8px"}
            position={"relative"}
            overflow={"clip"}
          >
            <Text fontWeight={600} fontSize={20}>
              {userData.nama}
            </Text>

            <Text opacity={0.4}>{userData.role.name}</Text>

            <HStack align={"end"} mt={12}>
              <Text fontSize={14}>{userData?.email}</Text>
            </HStack>

            <Image
              src="/images/logoWhite.svg"
              position={"absolute"}
              bottom={-5}
              right={-5}
              w={"150px"}
              opacity={0.1}
            />
          </CContainer>
        </CContainer>

        <LogoutConfirmation w={"100%"} mb={"auto"} />
      </Box>
    </CWrapper>
  );
}
