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
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiMailDownloadLine } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import { useLightDarkColor } from "../../constant/colors";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import req from "../../lib/req";
import DisclosureHeader from "../dependent/DisclosureHeader";
import Retry from "../dependent/Retry";
import CContainer from "../wrapper/CContainer";
import NoData from "./NoData";
import Skeleton from "./Skeleton";
import { Link } from "react-router-dom";

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
      data?.notifikasi_verifikasi?.forEach((notif: any) => {
        if (notif.is_read === 0) {
          count++;
        }
      });
      data?.notifikasi_reguler?.forEach((notif: any) => {
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
            (typeof e?.response?.data?.message === "string" &&
              (e?.response?.data?.message as string)) ||
            "Maaf terjadi kesalahan pada sistem",
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
            (typeof e?.response?.data?.message === "string" &&
              (e?.response?.data?.message as string)) ||
            "Maaf terjadi kesalahan pada sistem",
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

  const verificationLinks = {
    Cuti: "/jadwal/cuti",
    "Tukar Jadwal": "/jadwal/penukaran-jadwal",
    Lembur: "/jadwal/lembur",
    "Event & Diklat": "/jadwal/diklat-eksternal",
    Dokumen: "/karyawan",
    Perizinan: "/jadwal/izin",
    "Perubahan Data": "/karyawan/perubahan-data-karyawan",
    "Data Keluarga Karyawan": "/karyawan",
    // Koperasi: "",
    // Laporan: "",
    // "Slip Gajiku": "",
    // Feedback: "",
  };

  return (
    <>
      <Box position={"relative"}>
        {notRedCount ? (
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
        ) : (
          ""
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
                          {data?.notifikasi_verifikasi?.length > 0 && (
                            <>
                              <CContainer px={6}>
                                <Text fontWeight={500} mb={2}>
                                  Perlu Verifikasi
                                </Text>
                              </CContainer>
                              {data?.notifikasi_verifikasi?.map(
                                (inbox: any, i: number) => {
                                  // @ts-ignore

                                  return (
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
                                      as={Link}
                                      to={
                                        // @ts-ignore
                                        verificationLinks[
                                          inbox?.kategori_notifikasi?.label
                                        ]
                                      }
                                    >
                                      <CContainer gap={1}>
                                        <Tooltip
                                          label={
                                            inbox?.kategori_notifikasi?.label
                                          }
                                          openDelay={500}
                                        >
                                          <Text
                                            fontWeight={600}
                                            w={"fit-content"}
                                          >
                                            {inbox?.kategori_notifikasi?.label}
                                          </Text>
                                        </Tooltip>

                                        <Text
                                          fontSize={14}
                                          // noOfLines={1}
                                          opacity={0.6}
                                        >
                                          {inbox?.message}
                                        </Text>

                                        <Text
                                          fontSize={12}
                                          opacity={0.4}
                                          pt={2}
                                        >
                                          {formatDate(inbox?.created_at)}
                                        </Text>
                                      </CContainer>

                                      {!inbox?.is_read && (
                                        <Box
                                          w={"6px"}
                                          h={"6px"}
                                          borderRadius={"full"}
                                          bg={"red.400"}
                                        />
                                      )}
                                    </HStack>
                                  );
                                }
                              )}
                            </>
                          )}

                          {data?.notifikasi_reguler?.length > 0 && (
                            <>
                              <CContainer px={6}>
                                <Text fontWeight={500} mt={4} mb={2}>
                                  Reguler
                                </Text>
                              </CContainer>
                              {data?.notifikasi_reguler?.map(
                                (inbox: any, i: number) => (
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
                                      <Tooltip
                                        label={
                                          inbox?.kategori_notifikasi?.label
                                        }
                                        openDelay={500}
                                      >
                                        <Text
                                          fontWeight={600}
                                          w={"fit-content"}
                                        >
                                          {inbox?.kategori_notifikasi?.label}
                                        </Text>
                                      </Tooltip>

                                      <Text
                                        fontSize={14}
                                        // noOfLines={1}
                                        opacity={0.6}
                                      >
                                        {inbox?.message}
                                      </Text>

                                      <Text fontSize={12} opacity={0.4} pt={2}>
                                        {formatDate(inbox?.created_at)}
                                      </Text>
                                    </CContainer>

                                    {!inbox?.is_read && (
                                      <Box
                                        w={"6px"}
                                        h={"6px"}
                                        borderRadius={"full"}
                                        bg={"red.400"}
                                      />
                                    )}
                                  </HStack>
                                )
                              )}
                            </>
                          )}
                        </CContainer>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              onClick={deleteNotif}
              isLoading={deleteLoading}
              isDisabled={error || loading}
            >
              Hapus Semua yang Sudah Dibaca
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
