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
  useToast,
} from "@chakra-ui/react";
import { RiMailDownloadLine } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import { useLightDarkColor } from "../../constant/colors";
import req from "../../constant/req";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import timeSince from "../../lib/timeSince";
import DisclosureHeader from "../dependent/DisclosureHeader";
import Retry from "../dependent/Retry";
import CContainer from "../wrapper/CContainer";
import NoData from "./NoData";
import Skeleton from "./Skeleton";

interface Props extends IconButtonProps {}

export default function NotificationModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("notification-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [rt, setRt] = useState<boolean>(false);

  const { error, notFound, loading, setLoading, data, retry } =
    useDataState<any>({
      initialData: undefined,
      url: `/api/rski/dashboard/notifikasi`,
      dependencies: [rt],
      noRt: true,
    });

  const [notRedCount, setNotReadCount] = useState<number | undefined>(
    undefined
  );
  useEffect(() => {
    if (data) {
      let count = 0;
      data.forEach((notif: any) => {
        if (notif.is_read === 0) {
          count++;
        }
      });
      setNotReadCount(count);
    }
  }, [data]);

  const [deleteLoading, setDeleteloading] = useState<boolean>(false);
  const toast = useToast();

  function tandaiBaca(notif_id: number) {
    setLoading(true);

    req
      .get(`/api/rski/dashboard/notifikasi/${notif_id}`)
      .then((r) => {
        if (r.status === 200) {
          setRt(!rt);
        }
      })
      .catch((e) => {
        console.log(e);
        toast({
          status: "error",
          title:
            e.response.data.message || "Maaf terjadi kesalahan pada sistem",
          position: "bottom-right",
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function deleteNotif() {
    setDeleteloading(true);

    req
      .delete(`/api/rski/dashboard/notifikasi/delete-read-notifikasi`)
      .then((r) => {
        if (r.status === 200) {
          setRt(!rt);
        }
      })
      .catch((e) => {
        console.log(e);
        toast({
          status: "error",
          title:
            e.response.data.message || "Maaf terjadi kesalahan pada sistem",
          position: "bottom-right",
          isClosable: true,
        });
      })
      .finally(() => {
        setDeleteloading(false);
      });
  }

  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <>
      <Box position={"relative"}>
        {notRedCount && (
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
              {notRedCount}
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
            <DisclosureHeader
              title={"Inbox"}
              addition={
                <Text opacity={0.4} fontWeight={400} ml={2} mr={"auto"}>
                  Klik untuk tandai sudah dibaca
                </Text>
              }
            />
          </ModalHeader>
          <ModalBody className="scrollY" px={0}>
            {error && (
              <>
                {notFound && <NoData minH={"300px"} />}

                {!notFound && (
                  <Box my={"auto"}>
                    <Retry loading={loading} retry={retry} />
                  </Box>
                )}
              </>
            )}

            {!error && (
              <>
                {loading && (
                  <>
                    <Skeleton
                      minH={"500px"}
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
                          {data.map((inbox: any, i: number) => (
                            <HStack
                              onClick={() => {
                                tandaiBaca(inbox.id);
                              }}
                              align={"start"}
                              key={i}
                              px={6}
                              py={4}
                              cursor={"pointer"}
                              _hover={{ bg: "var(--divider)" }}
                              transition={"200ms"}
                              borderBottom={
                                i !== data.length - 1
                                  ? "1px solid var(--divider)"
                                  : ""
                              }
                            >
                              <CContainer gap={1}>
                                <Text fontWeight={600}>
                                  {inbox.kategori_notifikasi?.label}
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
            {!error && (
              <Button
                w={"100%"}
                className="btn-solid clicky"
                onClick={deleteNotif}
                isLoading={deleteLoading}
              >
                Hapus Semua yang Sudah Dibaca
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
