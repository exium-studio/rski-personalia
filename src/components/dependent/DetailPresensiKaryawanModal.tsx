import {
  Avatar,
  Box,
  Center,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  Tooltip,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { RiLoginBoxLine, RiLogoutBoxLine } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useErrorColor, useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatDuration from "../../lib/formatDuration";
import formatTime from "../../lib/formatTime";
import ComponentSpinner from "../independent/ComponentSpinner";
import FlexLine from "../independent/FlexLine";
import NoData from "../independent/NoData";
import CContainer from "../wrapper/CContainer";
import DetailKaryawanModalDisclosure from "./DetailKaryawanModalDisclosure";
import DisclosureHeader from "./DisclosureHeader";
import SearchComponent from "./input/SearchComponent";
import JenisKaryawanBadge from "./JenisKaryawanBadge";
import LokasiPresensi from "./LokasiPresensi";
import Retry from "./Retry";

interface Props {
  presensi_id: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
export default function DetailPresensiKaryawanModal({
  presensi_id,
  isOpen,
  onOpen,
  onClose,
}: Props) {
  useBackOnClose(
    `detail-presensi-karyawan-modal-${presensi_id}`,
    isOpen,
    onOpen,
    onClose
  );
  const initialRef = useRef(null);

  const dummy = {
    id: 1,
    user: {
      id: 1,
      nama: "Very Very Long Name",
      username: "olgaP",
      email_verified_at: null,
      role_id: null,
      foto_profil: null,
      status_aktif: true,
      data_completion_step: 1,
      created_at: "2024-05-30T10:26:58.000000Z",
      updated_at: "2024-05-30T10:26:58.000000Z",
    },
    unit_kerja: {
      id: 2,
      nama_unit: "Dokter Bedah Neurologi",
      jenis_karyawan: 1,
      created_at: "2024-04-04T03:18:23.000000Z",
      updated_at: "2024-05-07T03:18:23.000000Z",
    },
    jadwal: {
      id: 1,
      nama: "Pagi",
      jam_from: "2024-01-01 06:00:00",
      jam_to: "2024-01-01 15:00:00",
      created_at: "2024-05-30T10:26:59.000000Z",
      updated_at: "2024-05-30T10:26:59.000000Z",
    },
    jam_masuk: "2024-05-06 06:14:14",
    jam_keluar: "2024-05-06 13:27:14",
    durasi: 8 * 3600 + 348,
    lat: "33.749358",
    long: "-84.38842",
    foto_masuk: "/reza.jpg",
    foto_keluar: "/images/gear5.jpg",
    absensi: "Izin",
    kategori: "Terlambat",
    created_at: "2024-05-30T10:27:14.000000Z",
    updated_at: "2024-05-30T10:27:14.000000Z",
  };

  const { error, loading, data, retry } = useDataState<any>({
    initialData: dummy,
    url: "",
    dependencies: [presensi_id],
  });

  const [search, setSearch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string[]>([]);

  useEffect(() => {
    const words = search.split(" ").filter((word) => word.length > 0);
    const modifiedWords = words.reduce((acc: string[], word) => {
      acc.push(word);
      if (word.toLowerCase() === "nomor") {
        acc.push("no.");
      } else if (word.toLowerCase() === "nik") {
        acc.push("no. induk karyawan");
      }
      return acc;
    }, []);
    setSearchQuery(modifiedWords);
  }, [search]);

  // SX
  const lightDarkColor = useLightDarkColor();
  const errorColor = useErrorColor();

  return (
    <Modal
      isOpen={isOpen}
      onClose={backOnClose}
      initialFocusRef={initialRef}
      size={"full"}
      scrollBehavior="inside"
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent borderRadius={12} minH={"calc(100vh - 32px)"}>
        <ModalHeader ref={initialRef}>
          <DisclosureHeader title={"Detail Presensi Karyawan"} />
        </ModalHeader>
        <ModalBody px={0}>
          {error && (
            <Box my={"auto"}>
              <Retry loading={loading} retry={retry} />
            </Box>
          )}
          {!error && (
            <>
              {loading && (
                <>
                  <ComponentSpinner />
                </>
              )}
              {!loading && (
                <>
                  {(!data || (data && data.length === 0)) && <NoData />}

                  {(data || (data && data.length > 0)) && (
                    <CContainer
                      h={"calc(100vh - 70px)"}
                      overflowY={"auto"}
                      className="scrollY"
                      gap={8}
                      mb={responsiveSpacing}
                    >
                      <Wrap
                        spacing={responsiveSpacing}
                        align={"center"}
                        px={responsiveSpacing}
                      >
                        <DetailKaryawanModalDisclosure user_id={data.user.id}>
                          <Avatar
                            size={"md"}
                            w={"55px"}
                            h={"55px"}
                            src={data.user.foto_profil}
                            name={data.user.nama}
                          />
                        </DetailKaryawanModalDisclosure>

                        <VStack align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Nama Karyawan
                          </Text>
                          <Text fontWeight={500}>{data.user.nama}</Text>
                        </VStack>

                        <VStack align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Unit Kerja
                          </Text>
                          <Text fontWeight={500}>
                            {data.unit_kerja.nama_unit}
                          </Text>
                        </VStack>

                        <VStack align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Jenis Pegawai
                          </Text>
                          <Text fontWeight={500}>
                            <JenisKaryawanBadge
                              data={data.unit_kerja.jenis_karyawan}
                            />
                          </Text>
                        </VStack>
                      </Wrap>

                      <CContainer
                        gap={responsiveSpacing}
                        overflowY={"auto"}
                        className="scrollY"
                      >
                        <SimpleGrid columns={[1, 2]} overflowY={"auto"}>
                          <CContainer
                            gap={responsiveSpacing}
                            overflowY={"auto"}
                            className="scrollY"
                            px={responsiveSpacing}
                            h={"100%"}
                          >
                            <Box flex={"1 1 200px"}>
                              <Text fontSize={20} fontWeight={600} mb={4}>
                                Lokasi Presensi
                              </Text>

                              <LokasiPresensi
                                center={{ lat: data.lat, lng: data.long }}
                                officeCenter={{
                                  lat: data.lat,
                                  lng: data.long,
                                }}
                                presence_radius={100}
                              />
                            </Box>
                          </CContainer>

                          <CContainer overflowY={"auto"} h={"100%"}>
                            <HStack
                              px={[0, null, 4]}
                              position={"sticky"}
                              top={"0"}
                              bg={lightDarkColor}
                              zIndex={2}
                              pb={responsiveSpacing}
                            >
                              <SearchComponent
                                name="search"
                                onChangeSetter={(input) => {
                                  setSearch(input);
                                }}
                                inputValue={search}
                              />
                            </HStack>

                            <CContainer
                              gap={responsiveSpacing}
                              overflowY={"auto"}
                              className="scrollY"
                              px={responsiveSpacing}
                            >
                              <Box>
                                <Text fontSize={20} fontWeight={600} mb={4}>
                                  Data Jadwal
                                </Text>

                                <CContainer gap={4}>
                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Label"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {data.jadwal.nama}
                                    </Text>
                                  </HStack>

                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Jadwal Tanggal Masuk"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatDate(
                                        data.jadwal.jam_from,
                                        "short"
                                      )}
                                    </Text>
                                  </HStack>

                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Jadwal Jam Masuk"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatTime(data.jadwal.jam_from)}
                                    </Text>
                                  </HStack>

                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Jadwal Jam Keluar"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatTime(data.jadwal.jam_to)}
                                    </Text>
                                  </HStack>
                                </CContainer>
                              </Box>

                              <Box>
                                <Text fontSize={20} fontWeight={600} mb={4}>
                                  Data Presensi
                                </Text>

                                <CContainer gap={4}>
                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Presensi Masuk"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatTime(data.jam_masuk)}
                                    </Text>
                                  </HStack>

                                  <HStack justify={"space-between"}>
                                    <Text opacity={0.6}>Presensi Keluar</Text>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatTime(data.jam_keluar)}
                                    </Text>
                                  </HStack>

                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Tanggal Masuk"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatDate(data.jam_masuk, "short")}
                                    </Text>
                                  </HStack>

                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Tanggal Keluar "}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatDate(data.jam_keluar, "short")}
                                    </Text>
                                  </HStack>

                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Durasi Kerja"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatDuration(data.durasi)}
                                    </Text>
                                  </HStack>

                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Kategori Presensi"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {data.kategori || "-"}
                                    </Text>
                                  </HStack>

                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Latitude"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {data.lat || "-"}
                                    </Text>
                                  </HStack>

                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Longitude"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {data.long || "-"}
                                    </Text>
                                  </HStack>
                                </CContainer>
                              </Box>

                              <Box>
                                <Text fontSize={20} fontWeight={600} mb={4}>
                                  Foto Presensi
                                </Text>

                                <SimpleGrid
                                  columns={[1, 2]}
                                  gap={responsiveSpacing}
                                >
                                  <Box position={"relative"} flex={"1 1 200px"}>
                                    <Tooltip
                                      label={"Foto Presensi Masuk"}
                                      placement="right"
                                    >
                                      <Center
                                        p={2}
                                        bg={"p.500"}
                                        position={"absolute"}
                                        borderRadius={"12px 0px 20px 0"}
                                        top={0}
                                        left={0}
                                      >
                                        <Icon
                                          as={RiLoginBoxLine}
                                          fontSize={20}
                                          color={lightDarkColor}
                                        />
                                      </Center>
                                    </Tooltip>
                                    <Image
                                      src={
                                        data.foto_masuk ||
                                        "/images/defaultProfilePhoto.webp"
                                      }
                                      borderRadius={12}
                                      aspectRatio={1}
                                      objectFit={"cover"}
                                    />
                                  </Box>

                                  <Box position={"relative"} flex={"1 1 200px"}>
                                    <Tooltip
                                      label={"Foto Presensi Keluar"}
                                      placement="right"
                                    >
                                      <Center
                                        p={2}
                                        bg={errorColor}
                                        position={"absolute"}
                                        borderRadius={"12px 0px 20px 0"}
                                        top={0}
                                        left={0}
                                      >
                                        <Icon
                                          as={RiLogoutBoxLine}
                                          fontSize={20}
                                          color={lightDarkColor}
                                          transform={"rotate(180deg)"}
                                        />
                                      </Center>
                                    </Tooltip>
                                    <Image
                                      src={
                                        data.foto_keluar ||
                                        "/images/defaultProfilePhoto.webp"
                                      }
                                      borderRadius={12}
                                      aspectRatio={1}
                                      objectFit={"cover"}
                                    />
                                  </Box>
                                </SimpleGrid>
                              </Box>
                            </CContainer>
                          </CContainer>
                        </SimpleGrid>
                      </CContainer>
                    </CContainer>
                  )}
                </>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
