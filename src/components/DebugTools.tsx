import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  SimpleGrid,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  RiBuilding2Line,
  RiCloudLine,
  RiDatabase2Line,
  RiErrorWarningLine,
  RiMoonLine,
  RiRefreshLine,
  RiSunLine,
  RiTerminalBoxFill,
} from "@remixicon/react";
import { useState } from "react";
import useDebugErrorState from "../global/useDebugErrorState";
import useDebugLoadingState from "../global/useDebugLoadingState";
import useDebugNoDataState from "../global/useDebugNoDataState";
import useBackOnClose from "../hooks/useBackOnClose";
import getLocation from "../lib/getLocation";
import DisclosureHeader from "./dependent/DisclosureHeader";

export default function DebugTools() {
  //! DEBUG
  const { debugLoadingState, setDebugLoadingState } = useDebugLoadingState();
  const { debugErrorState, setDebugErrorState } = useDebugErrorState();
  const { debugNoDataState, setDebugNoDataState } = useDebugNoDataState();

  const { toggleColorMode } = useColorMode();
  const colorMode = useColorModeValue("false", "true");
  const SwitchIcon = useColorModeValue(RiSunLine, RiMoonLine);
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("debug-tools", isOpen, onOpen, onClose);
  function handleOnClose() {
    onClose();
    window.history.back();
  }
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const [lat, setLat] = useState<string | null>(
    localStorage.getItem("officeLat")
  );
  const [lng, setLng] = useState<string | null>(
    localStorage.getItem("officeLng")
  );
  //! DEBUG

  return (
    <>
      <Portal>
        <IconButton
          aria-label="Debug Tools"
          icon={<Icon as={RiTerminalBoxFill} fontSize={24} />}
          borderRadius={"full"}
          colorScheme="ap"
          className="btn-ap"
          position={"fixed"}
          bottom={"100px"}
          right={"8px"}
          zIndex={999999999}
          onClick={onOpen}
          border={"2px solid var(--p600)"}
        />
      </Portal>

      <Modal isOpen={isOpen} onClose={handleOnClose} size={"lg"} isCentered>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title="Debug Tools" />
          </ModalHeader>

          <ModalBody>
            <VStack align={"stretch"}>
              <Text>Test : 3</Text>
              <Text opacity={0.4}>
                Ubah State ada delay 1 detik agar bisa liat transisinya, setelah
                ngubah2 lgsg close aja
              </Text>
              <SimpleGrid columns={[1, 2]} gap={2}>
                <Button
                  rightIcon={<Icon as={RiErrorWarningLine} />}
                  className="btn-outline clicky"
                  onClick={() => {
                    setTimeout(() => {
                      setDebugErrorState(!debugErrorState);
                    }, 1000);
                  }}
                  justifyContent={"space-between"}
                  color={debugErrorState ? "green.400" : "red.400"}
                >
                  {`Error State (${debugErrorState})`}
                </Button>

                <Button
                  rightIcon={<Icon as={RiCloudLine} />}
                  className="btn-outline clicky"
                  onClick={() => {
                    setTimeout(() => {
                      setDebugLoadingState(!debugLoadingState);
                    }, 1000);
                  }}
                  justifyContent={"space-between"}
                  color={debugLoadingState ? "green.400" : "red.400"}
                >
                  {`Loading State (${debugLoadingState})`}
                </Button>

                <Button
                  rightIcon={<Icon as={RiDatabase2Line} />}
                  className="btn-outline clicky"
                  onClick={() => {
                    setTimeout(() => {
                      setDebugNoDataState(!debugNoDataState);
                    }, 1000);
                  }}
                  justifyContent={"space-between"}
                  color={debugNoDataState ? "green.400" : "red.400"}
                >
                  {`No Data State (${debugNoDataState})`}
                </Button>

                <Button
                  rightIcon={<Icon as={SwitchIcon} />}
                  className="btn-outline clicky"
                  onClick={toggleColorMode}
                  justifyContent={"space-between"}
                  color={colorMode === "true" ? "green.400" : "red.400"}
                >
                  {`Dark Mode (${colorMode})`}
                </Button>

                <Button
                  rightIcon={<Icon as={RiRefreshLine} />}
                  className="btn-outline clicky"
                  onClick={() => {
                    window.location.reload();
                  }}
                  justifyContent={"space-between"}
                >
                  Manual Refresh
                </Button>
              </SimpleGrid>

              <HStack mt={4}>
                <Icon as={RiBuilding2Line} />
                <Text fontWeight={600}>Office Center/Location</Text>
              </HStack>

              <VStack
                // p={4}
                // border={"1px solid var(--divider3)"}
                borderRadius={8}
              >
                <FormControl>
                  <FormLabel>Office Latitude</FormLabel>
                  <HStack>
                    <Input
                      placeholder="Office Latitude"
                      onChange={(e) => {
                        setLat(e.target.value);
                      }}
                      value={lat?.toString()}
                    />
                    <Button
                      className="btn-ap clicky"
                      colorScheme="ap"
                      onClick={() => {
                        localStorage.setItem("officeLat", lat as string);
                        toast({
                          status: "success",
                          isClosable: true,
                          title: "Office Latitude set",
                        });
                      }}
                    >
                      Set
                    </Button>
                  </HStack>
                </FormControl>

                <FormControl>
                  <FormLabel>Office Longitude</FormLabel>
                  <HStack>
                    <Input
                      placeholder="Office Longitude"
                      onChange={(e) => {
                        setLng(e.target.value);
                      }}
                      value={lng?.toString()}
                    />
                    <Button
                      className="btn-ap clicky"
                      colorScheme="ap"
                      onClick={() => {
                        localStorage.setItem("officeLng", lat as string);
                        toast({
                          status: "success",
                          isClosable: true,
                          title: "Office Longitude set",
                        });
                      }}
                    >
                      Set
                    </Button>
                  </HStack>
                </FormControl>

                <Button
                  mt={4}
                  className="btn-ap clicky"
                  colorScheme="ap"
                  onClick={() => {
                    setLoading(true);
                    getLocation()
                      .then((myLocation) => {
                        setLat((myLocation.lat + 0.0001).toString());
                        setLng((myLocation.long + 0.0001).toString());
                        localStorage.setItem(
                          "officeLat",
                          (myLocation.lat + 0.0001).toString()
                        );
                        localStorage.setItem(
                          "officeLng",
                          (myLocation.long + 0.0001).toString()
                        );
                        toast({
                          status: "success",
                          isClosable: true,
                          title: "Office Latitude & Longitude set",
                        });
                      })
                      .catch((error) => {
                        console.error("Gagal mendapatkan lokasi:", error);
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }}
                  isLoading={loading}
                  w={"100%"}
                >
                  Set Current Center as Office Center
                </Button>

                <Text
                  opacity={0.4}
                  textAlign={"center"}
                  fontSize={[12, null, 14]}
                >
                  Refresh dulu habis setting office center yak
                </Text>
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              onClick={handleOnClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
