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
  VStack,
} from "@chakra-ui/react";
import { RiLogoutBoxLine } from "@remixicon/react";
import DisclosureHeader from "../../components/dependent/DisclosureHeader";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useLightDarkColor } from "../../constant/colors";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useGetUserData from "../../hooks/useGetUserData";
import useLogout from "../../hooks/useLogout";
import backOnClose from "../../lib/backOnClose";

interface LogoutProps extends ButtonProps {}

const LogoutConfirmation = ({ ...props }: LogoutProps) => {
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
};

export default function Profil() {
  // SX
  const lightDarkColor = useLightDarkColor();

  const userData = useGetUserData();

  return (
    <CWrapper pt={0}>
      <VStack gap={0} animation={"flyInFromTop 500ms ease"}>
        <>
          <Box w={"50px"} flex={"1 0 50px"} bg={"#353535"} mx={"auto"} />

          <Box
            flexShrink={0}
            w={"65px"}
            h={"20px"}
            bg={"#353535"}
            mx={"auto"}
            p={1}
            borderRadius={"full"}
          >
            <Box
              w={"100%"}
              h={"100%"}
              bg={lightDarkColor}
              borderRadius={"full"}
            />
          </Box>

          <Box
            flexShrink={0}
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
            flexShrink={0}
            w={"200px"}
            h={"16px"}
            bg={"p.500"}
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
              bg={"p.600"}
              borderRadius={"full"}
              mx={"auto"}
            />
          </Box>
        </>

        <Box m={"auto"} flex={5}>
          <Box position={"relative"}>
            <CContainer
              bg={"p.500"}
              borderRadius={12}
              position={"relative"}
              overflowY={"auto"}
              className="admin-card"
              w={"300px"}
              mb={responsiveSpacing}
              p={1}
              border={"1px solid var(--divider3)"}
            >
              <CContainer flex={"1 1 150px"} gap={responsiveSpacing}>
                <Image
                  src={
                    userData?.foto_profil || "/images/defaultProfilePhoto.webp"
                  }
                  aspectRatio={1}
                  borderRadius={"8px 8px 0 0"}
                  boxSize={"289.61x"}
                />
              </CContainer>

              <CContainer
                p={responsiveSpacing}
                bg={"white"}
                color={"dark"}
                borderRadius={"0 0 8px 8px"}
                border={"1px solid var(--divider3)"}
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
                  src="/logo512.png"
                  position={"absolute"}
                  bottom={-16}
                  right={-16}
                  w={"200px"}
                  opacity={0.1}
                />
              </CContainer>
            </CContainer>

            <Box
              w={"100px"}
              h={"5px"}
              bg={"p.600"}
              position={"absolute"}
              bottom={"0"}
              left={"50%"}
              transform={"translateX(-50%)"}
              zIndex={99}
            ></Box>
          </Box>

          <LogoutConfirmation w={"100%"} mb={"auto"} />
        </Box>
      </VStack>
    </CWrapper>
  );
}
