import {
  Avatar,
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatDuration from "../../lib/formatDuration";
import formatTime from "../../lib/formatTime";
import ComponentSpinner from "../independent/ComponentSpinner";
import FlexLine from "../independent/FlexLine";
import Img from "../independent/Img";
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

  const { error, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/presensi/data-presensi/${presensi_id}`,
    dependencies: [isOpen, presensi_id],
    conditions: !!(isOpen && presensi_id),
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
                  <ComponentSpinner m={"auto"} />
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

                        <VStack gap={1} align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Nama Karyawan
                          </Text>
                          <Text fontWeight={500}>{data.user.nama}</Text>
                        </VStack>

                        <VStack gap={1} align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Unit Kerja
                          </Text>
                          <Text fontWeight={500}>
                            {data.unit_kerja.nama_unit}
                          </Text>
                        </VStack>

                        <VStack gap={1} align={"stretch"}>
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
                          >
                            <Box>
                              <Text fontSize={20} fontWeight={600} mb={4}>
                                Lokasi Presensi
                              </Text>
                              <SimpleGrid
                                columns={[1, 2]}
                                gap={responsiveSpacing}
                              >
                                <Box position={"relative"}>
                                  <LokasiPresensi
                                    center={{
                                      lat: data.lat_masuk || 0,
                                      lng: data.long_masuk || 0,
                                    }}
                                    officeCenter={{
                                      lat: data.lat_masuk || 0,
                                      lng: data.long_masuk || 0,
                                    }}
                                    presence_radius={100}
                                  />
                                  <Text opacity={0.6} mt={2}>
                                    Lokasi Presensi Masuk
                                  </Text>
                                </Box>

                                <Box position={"relative"}>
                                  <LokasiPresensi
                                    center={{
                                      lat: data.lat_keluar || 0,
                                      lng: data.long_keluar || 0,
                                    }}
                                    officeCenter={{
                                      lat: data.lat_keluar || 0,
                                      lng: data.long_keluar || 0,
                                    }}
                                    presence_radius={100}
                                  />
                                  <Text opacity={0.6} mt={2}>
                                    Lokasi Presensi Keluar
                                  </Text>
                                </Box>
                              </SimpleGrid>
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
                                  <Img
                                    initialSrc={data.foto_masuk.path}
                                    fallbackSrc="/images/defaultProfilePhoto.webp"
                                    borderRadius={12}
                                    aspectRatio={1}
                                    objectFit={"cover"}
                                  />
                                  <Text opacity={0.6} mt={2}>
                                    Foto Presensi Masuk
                                  </Text>
                                </Box>

                                <Box position={"relative"} flex={"1 1 200px"}>
                                  <Img
                                    initialSrc={data.foto_keluar.path}
                                    fallbackSrc="/images/defaultProfilePhoto.webp"
                                    borderRadius={12}
                                    aspectRatio={1}
                                    objectFit={"cover"}
                                  />
                                  <Text opacity={0.6} mt={2}>
                                    Foto Presensi Masuk
                                  </Text>
                                </Box>
                              </SimpleGrid>
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
                                        textToHighlight={"Jadwal Tanggal Mulai"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatDate(
                                        data.jadwal.tgl_mulai,
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
                                        textToHighlight={
                                          "Jadwal Tanggal Selesai"
                                        }
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatDate(
                                        data.jadwal.tgl_selesai,
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
