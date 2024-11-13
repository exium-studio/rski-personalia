import {
  Box,
  BoxProps,
  Button,
  Center,
  HStack,
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
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
import SearchComponent from "../dependent/input/SearchComponent";
import NotFound from "./NotFound";
import useScreenWidth from "../../lib/useScreenWidth";

interface Props extends BoxProps {
  children?: any;
}

export default function InboxModalDisclosure({ children, ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("notification-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  // States
  const [deleteLoading, setDeleteloading] = useState<boolean>(false);
  const [rt, setRt] = useState<boolean>(false);
  const [search, setSearch] = useState("");
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
  const fdv = data?.notifikasi_verifikasi?.filter((item: any) => {
    const searchTerm = search?.toLowerCase();

    // console.log(searchTerm, item?.kategori_notifikasi?.label?.toLowerCase());
    // console.log(searchTerm, item?.message?.toLowerCase());

    // Kategori Inbox
    const matches1 = item?.kategori_notifikasi?.label
      ?.toLowerCase()
      ?.includes(searchTerm);
    const matches2 = item?.message?.toLowerCase().includes(searchTerm);

    return matches1 || matches2;
  });
  const fdr = data?.notifikasi_verifikasi?.filter((item: any) => {
    const searchTerm = search?.toLowerCase();

    // Kategori Inbox
    const matches1 = item?.kategori_notifikasi?.label
      ?.toLowerCase()
      ?.includes(searchTerm);
    const matches2 = item?.message?.toLowerCase().includes(searchTerm);

    return matches1 || matches2;
  });

  // Utils
  const toast = useToast();
  const sw = useScreenWidth();

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
            "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
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
            "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
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
    "Diklat Internal": "/perusahaan/diklat",
    "Diklat Eksternal": "/perusahaan/diklat-eksternal",
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
      <Box onClick={onOpen} position={"relative"}>
        {notRedCount ? (
          <Center
            position={"absolute"}
            minW={"20px"}
            px={notRedCount > 99 ? 1 : 0}
            h={"20px"}
            borderRadius={"full"}
            bg={"red.400"}
            color={lightDarkColor}
            top={sw < 768 ? "12px" : -2}
            right={sw < 768 ? "4" : -2}
          >
            <Text fontWeight={550} fontSize={12} color={"white"}>
              {notRedCount > 99 ? "99+" : notRedCount}
            </Text>
          </Center>
        ) : (
          ""
        )}

        {children}
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
                          <Box
                            px={5}
                            pb={6}
                            bg={lightDarkColor}
                            position={"sticky"}
                            top={0}
                            zIndex={3}
                          >
                            <SearchComponent
                              name="search"
                              onChangeSetter={(input) => {
                                setSearch(input);
                              }}
                              inputValue={search}
                            />
                          </Box>

                          {fdv?.length > 0 && (
                            <>
                              <CContainer px={6}>
                                <Text fontWeight={500} mb={2}>
                                  Perlu Verifikasi
                                </Text>
                              </CContainer>
                              {fdv?.map((inbox: any, i: number) => {
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
                                );
                              })}
                            </>
                          )}

                          {fdr?.length > 0 && (
                            <>
                              <CContainer px={6}>
                                <Text
                                  fontWeight={500}
                                  mt={
                                    data?.notifikasi_verifikasi?.length > 0
                                      ? 4
                                      : 0
                                  }
                                  mb={2}
                                >
                                  Reguler
                                </Text>
                              </CContainer>
                              {fdr?.map((inbox: any, i: number) => (
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
                                      label={inbox?.kategori_notifikasi?.label}
                                      openDelay={500}
                                    >
                                      <Text fontWeight={600} w={"fit-content"}>
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
                              ))}
                            </>
                          )}

                          {fdv?.length === 0 && fdr?.length === 0 && (
                            <NotFound minH={"300px"} />
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
