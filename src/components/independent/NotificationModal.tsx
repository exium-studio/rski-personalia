import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  IconButton,
  IconButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiMailDownloadLine } from "@remixicon/react";
import { useRef } from "react";
import { useLightDarkColor } from "../../constant/colors";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "../dependent/DisclosureHeader";
import CContainer from "../wrapper/CContainer";
import timeSince from "../../lib/timeSince";
import Retry from "../dependent/Retry";
import NoData from "./NoData";
import Skeleton from "./Skeleton";

interface Props extends IconButtonProps {}

export default function NotificationModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("notification-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const dummy = {
    total_baru: 2,
    inboxes: [
      {
        id: 1,
        is_read: false,
        kategori: {
          id: 3,
          label: "Permintaan Tukar Jadwal",
          link: "/beranda/tukar-jadwal?tabindex=1",
        },
        sender: {
          // User Interface
          id: 1,
          nama: "Jolitos Kurniawan",
          foto_profil: "/images/gear5.jpg",
        },
        message: "Jolitos Kurniawan ingin tukar jadwal dengan Sulenq Wazawsky",
        created_at: "2024-07-11",
      },
      {
        id: 3,
        is_read: false,
        kategori: {
          id: 5,
          label: "Permintaan Perubahan Data Personal",
          link: "/beranda/event-diklat",
        },
        sender: {
          id: 1,
          nama: "Jolitos Kurniawan",
          foto_profil: "/images/gear5.jpg",
        },
        message: "Kepala ruang mejadwalkan lembur untuk Anda",
        created_at: "2024-07-4",
      },
      {
        id: 4,
        is_read: true,
        kategori: {
          id: 5,
          label: "Pengumuman",
          link: "/beranda/pengumuman",
        },
        sender: {
          id: 1,
          nama: "Jolitos Kurniawan",
          foto_profil: "/images/gear5.jpg",
        },
        message: "Ada pengumuman baru, segera dicek ya",
        created_at: "2024-07-4",
      },
      {
        id: 5,
        is_read: true,
        kategori: {
          id: 3,
          label: "Pengajuan Tukar Jadwal",
          link: "/beranda/tukar-jadwal?tabindex=0",
        },
        sender: {
          // User Interface
          id: 1,
          nama: "Jolitos Kurniawan",
          foto_profil: "/images/gear5.jpg",
        },
        message: "Tukar jadwal anda sudah disetujui manajer",
        created_at: "2024-07-1",
      },
    ],
  };
  const { error, loading, data, retry } = useDataState<any>({
    initialData: dummy,
    url: "",
    dependencies: [],
  });

  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <>
      <Box position={"relative"}>
        {data?.total_baru && (
          <Center
            position={"absolute"}
            w={"20px"}
            h={"20px"}
            borderRadius={"full"}
            bg={"red.400"}
            color={lightDarkColor}
            top={-2}
            right={-2}
          >
            <Text fontWeight={550} fontSize={12}>
              {data.total_baru}
            </Text>
          </Center>
        )}

        <IconButton
          icon={<Icon as={RiMailDownloadLine} mb={"2px"} fontSize={18} />}
          className="btn-solid clicky"
          onClick={onOpen}
          {...props}
        />
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        size={"lg"}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent borderRadius={12}>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title={"Inbox"} />
          </ModalHeader>
          <ModalBody className="scrollY" px={0}>
            {error && (
              <Box my={"auto"}>
                <Retry loading={loading} retry={retry} />
              </Box>
            )}

            {!error && (
              <>
                {loading && (
                  <>
                    <Skeleton
                      minH={"300px"}
                      flex={1}
                      mx={"auto"}
                      borderRadius={0}
                    />
                  </>
                )}

                {!loading && (
                  <>
                    {(!data || (data && data.length === 0)) && (
                      <NoData label="Tidak Ada Inbox" />
                    )}
                    {(data || (data && data.length > 0)) && (
                      <>
                        <CContainer>
                          {data.inboxes.map((inbox: any, i: number) => (
                            <HStack
                              align={"start"}
                              key={i}
                              px={6}
                              py={4}
                              cursor={"pointer"}
                              _hover={{ bg: "var(--divider)" }}
                              transition={"200ms"}
                              borderBottom={
                                i !== data.inboxes.length - 1
                                  ? "1px solid var(--divider)"
                                  : ""
                              }
                            >
                              <CContainer gap={1}>
                                <Text fontWeight={600}>
                                  {inbox.kategori.label}
                                </Text>
                                <Text fontSize={14} noOfLines={1} opacity={0.6}>
                                  {inbox.message}
                                </Text>
                                <Text fontSize={12} opacity={0.4} pt={2}>
                                  {timeSince(inbox.created_at)}
                                </Text>
                              </CContainer>

                              {!inbox.is_read && (
                                <Box
                                  w={"6px"}
                                  h={"6px"}
                                  borderRadius={"full"}
                                  bg={"red.400"}
                                />
                              )}
                            </HStack>
                          ))}
                        </CContainer>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button w={"100%"} className="btn-solid clicky">
              Hapus Semua yang Sudah Dibaca
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
