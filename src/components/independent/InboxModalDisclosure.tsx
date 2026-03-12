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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import { useLightDarkColor } from "../../constant/colors";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import req from "../../lib/req";
import useScreenWidth from "../../lib/useScreenWidth";
import DisclosureHeader from "../dependent/DisclosureHeader";
import SearchComponent from "../dependent/input/SearchComponent";
import Retry from "../dependent/Retry";
import CContainer from "../wrapper/CContainer";
import NoData from "./NoData";
import NotFound from "./NotFound";
import Skeleton from "./Skeleton";

function InboxRow({ index, style, data }: any) {
  const item = data.items[index];

  const isVerification = data.type === "verification";
  const setRt = data.setRt;

  const toast = useToast();

  const [loading, setLoading] = useState<boolean>();

  function tandaiBaca(notif_id: number) {
    setLoading(true);

    req
      .get(`/api/rski/dashboard/notifikasi/${notif_id}`)
      .then((r) => {
        if (r?.status === 200) {
          setRt((ps: boolean) => !ps);
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

  return (
    <CContainer
      gap={4}
      style={style}
      px={6}
      py={3}
      cursor={"pointer"}
      _hover={{ bg: "var(--divider)" }}
      transition={"200ms"}
    >
      <CContainer gap={1}>
        <Tooltip label={item?.kategori_notifikasi?.label} openDelay={200}>
          <HStack>
            <Text fontWeight={600} w={"fit-content"} noOfLines={1}>
              {item?.kategori_notifikasi?.label}
            </Text>

            {!item?.is_read && (
              <Box
                flexShrink={0}
                rounded={"full"}
                w={"6px"}
                h={"6px"}
                bg={"red.400"}
              />
            )}
          </HStack>
        </Tooltip>

        <Tooltip label={item?.message} openDelay={200}>
          <Text fontSize={14} opacity={0.6} noOfLines={2}>
            {item?.message}
          </Text>
        </Tooltip>
      </CContainer>

      <HStack wrap={"wrap"} justify={"end"} mt={"auto"}>
        <Text fontSize={12} opacity={0.4} mr={"auto"}>
          {formatDate(item?.created_at)}
        </Text>

        {!item?.is_read && (
          <Button
            onClick={() => {
              tandaiBaca(item.id);
            }}
            className={"btn"}
            isLoading={loading}
            variant={"outline"}
            size={"sm"}
          >
            Tandai Baca
          </Button>
        )}

        {isVerification && (
          <Link to={data.links[item?.kategori_notifikasi?.label]}>
            <Button variant={"outline"} size={"sm"} className={"btn"}>
              Lihat
            </Button>
          </Link>
        )}
      </HStack>
    </CContainer>
  );
}

interface Props extends BoxProps {
  children?: any;
}
export default function InboxModalDisclosure({ children }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("notification-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  // States
  const [deleteLoading, setDeleteloading] = useState<boolean>(false);
  const [rt, setRt] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/notifikasi`,
    dependencies: [rt],
    noRt: true,
  });
  const [notRedCount, setNotReadCount] = useState<number | undefined>(
    undefined,
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
  const fdr = data?.notifikasi_reguler?.filter((item: any) => {
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

  function deleteNotif() {
    setDeleteloading(true);

    req
      .delete(`/api/rski/dashboard/notifikasi/delete-read-notifikasi`)
      .then((r) => {
        if (r?.status === 200) {
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

  const ITEM_SIZE = 144;

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

          <ModalBody px={0}>
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
                {loading && !data && (
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
                  </>
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

                      <Tabs isLazy variant={"line"} colorScheme={"p"}>
                        <TabList w={"full"} px={6} mb={2}>
                          {fdv?.length > 0 && (
                            <Tab w={"full"} fontWeight={500}>
                              Perlu Verifikasi ({fdv.length})
                            </Tab>
                          )}
                          {fdr?.length > 0 && (
                            <Tab w={"full"} fontWeight={500}>
                              Reguler ({fdr.length})
                            </Tab>
                          )}
                        </TabList>

                        <TabPanels pt={0}>
                          {fdv?.length > 0 && (
                            <TabPanel p={0}>
                              <List
                                height={Math.min(400, fdv.length * ITEM_SIZE)}
                                itemCount={fdv.length}
                                itemSize={ITEM_SIZE}
                                width="100%"
                                itemData={{
                                  items: fdv,
                                  type: "verification",
                                  links: verificationLinks,
                                  setRt: setRt,
                                }}
                              >
                                {InboxRow}
                              </List>
                            </TabPanel>
                          )}

                          {fdr?.length > 0 && (
                            <TabPanel p={0}>
                              <List
                                height={Math.min(400, fdr.length * ITEM_SIZE)}
                                itemCount={fdr.length}
                                itemSize={ITEM_SIZE}
                                width="100%"
                                itemData={{
                                  items: fdr,
                                  type: "regular",
                                  links: verificationLinks,
                                  setRt: setRt,
                                }}
                              >
                                {InboxRow}
                              </List>
                            </TabPanel>
                          )}
                        </TabPanels>

                        {fdv?.length === 0 && fdr?.length === 0 && (
                          <NotFound minH="300px" />
                        )}
                      </Tabs>
                    </CContainer>
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
