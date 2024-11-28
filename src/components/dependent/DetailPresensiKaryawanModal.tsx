import {
  Avatar,
  Box,
  HStack,
  Icon,
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
import { RiMapPin2Fill, RiMarkPenLine, RiUserFill } from "@remixicon/react";
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
import formatTimeOld from "../../lib/formatTimeOld";
import FlexLine from "../independent/FlexLine";
import Img from "../independent/Img";
import NoData from "../independent/NoData";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";
import SearchComponent from "./input/SearchComponent";
import JenisKaryawanBadge from "./JenisKaryawanBadge";
import LokasiPresensi from "./LokasiPresensi";
import Retry from "./Retry";
import useScreenWidth from "../../lib/useScreenWidth";

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
  const sw = useScreenWidth();

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
                <CContainer flex={1} px={6} pb={6}>
                  <Wrap
                    spacing={responsiveSpacing}
                    mb={responsiveSpacing}
                    align={"center"}
                  >
                    <Skeleton w={"55px"} h={"55px"} borderRadius={"full"} />

                    <VStack align={"stretch"}>
                      <Skeleton w={"100px"} h={"16px"} />
                      <Skeleton w={"100px"} h={"16px"} />
                    </VStack>

                    <VStack align={"stretch"}>
                      <Skeleton w={"100px"} h={"16px"} />
                      <Skeleton w={"100px"} h={"16px"} />
                    </VStack>

                    <VStack align={"stretch"}>
                      <Skeleton w={"100px"} h={"16px"} />
                      <Skeleton w={"100px"} h={"16px"} />
                    </VStack>
                  </Wrap>

                  <SimpleGrid
                    flex={1}
                    columns={sw < 1000 ? 1 : 2}
                    gap={responsiveSpacing}
                  >
                    <SimpleGrid columns={[1, 2]} gap={responsiveSpacing}>
                      <Skeleton h={"100%"} />
                      <Skeleton h={"100%"} />
                      <Skeleton h={"100%"} />
                      <Skeleton h={"100%"} />
                    </SimpleGrid>

                    <Skeleton h={"100%"} />
                  </SimpleGrid>
                </CContainer>
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
                        <Avatar
                          size={"md"}
                          w={"55px"}
                          h={"55px"}
                          src={data.user?.foto_profil}
                          name={data.user?.nama}
                        />

                        <VStack gap={1} align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Nama Karyawan
                          </Text>
                          <Text fontWeight={500}>{data.user?.nama}</Text>
                        </VStack>

                        <VStack gap={1} align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Unit Kerja
                          </Text>
                          <Text fontWeight={500}>
                            {data.unit_kerja?.nama_unit}
                          </Text>
                        </VStack>

                        <VStack gap={1} align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Jenis Karyawan
                          </Text>
                          <Text fontWeight={500}>
                            <JenisKaryawanBadge
                              data={data.unit_kerja?.jenis_karyawan}
                            />
                          </Text>
                        </VStack>
                      </Wrap>

                      <CContainer
                        gap={responsiveSpacing}
                        overflowY={"auto"}
                        className="scrollY"
                      >
                        <SimpleGrid
                          columns={sw < 1000 ? 1 : 2}
                          overflowY={sw < 1000 ? "visible" : "auto"}
                        >
                          <CContainer
                            gap={responsiveSpacing}
                            overflowY={"auto"}
                            className="scrollY"
                            px={responsiveSpacing}
                          >
                            {/* Lokasi Presensi */}
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
                                      lat: data?.data_presensi?.lat_masuk || 0,
                                      lng: data?.data_presensi?.long_masuk || 0,
                                    }}
                                    officeCenter={{
                                      lat:
                                        data?.data_presensi?.lokasi_kantor
                                          ?.lat || 0,
                                      lng:
                                        data?.data_presensi?.lokasi_kantor
                                          ?.long || 0,
                                    }}
                                    presence_radius={
                                      data?.data_presensi?.lokasi_kantor?.radius
                                    }
                                  />
                                  <Text opacity={0.6} mt={2}>
                                    Lokasi Presensi Masuk
                                  </Text>
                                </Box>

                                <Box position={"relative"}>
                                  {data?.data_presensi?.lat_keluar &&
                                  data?.data_presensi?.long_keluar ? (
                                    <LokasiPresensi
                                      center={{
                                        lat:
                                          data?.data_presensi?.lat_keluar || 0,
                                        lng:
                                          data?.data_presensi?.long_keluar || 0,
                                      }}
                                      officeCenter={{
                                        lat:
                                          data?.data_presensi?.lokasi_kantor
                                            ?.lat || 0,
                                        lng:
                                          data?.data_presensi?.lokasi_kantor
                                            ?.long || 0,
                                      }}
                                      presence_radius={
                                        data?.data_presensi?.lokasi_kantor
                                          ?.radius
                                      }
                                    />
                                  ) : (
                                    <VStack
                                      justify={"center"}
                                      aspectRatio={1}
                                      bg={"var(--divider)"}
                                      opacity={0.4}
                                      borderRadius={12}
                                    >
                                      <Icon as={RiMapPin2Fill} fontSize={48} />
                                      <Text w={"200px"} textAlign={"center"}>
                                        Belum ada data presensi keluar
                                      </Text>
                                    </VStack>
                                  )}

                                  <Text opacity={0.6} mt={2}>
                                    Lokasi Presensi Keluar
                                  </Text>
                                </Box>
                              </SimpleGrid>
                            </Box>

                            {/* Foto Presensi */}
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
                                    initialSrc={
                                      data?.data_presensi?.foto_masuk?.path
                                    }
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
                                  {data?.data_presensi?.foto_keluar?.path ? (
                                    <Img
                                      initialSrc={
                                        data?.data_presensi?.foto_keluar?.path
                                      }
                                      fallbackSrc="/images/defaultProfilePhoto.webp"
                                      borderRadius={12}
                                      aspectRatio={1}
                                      objectFit={"cover"}
                                    />
                                  ) : (
                                    <VStack
                                      justify={"center"}
                                      aspectRatio={1}
                                      bg={"var(--divider)"}
                                      opacity={0.4}
                                      borderRadius={12}
                                    >
                                      <Icon as={RiUserFill} fontSize={48} />
                                      <Text w={"200px"} textAlign={"center"}>
                                        Belum ada data presensi keluar
                                      </Text>
                                    </VStack>
                                  )}

                                  <Text opacity={0.6} mt={2}>
                                    Foto Presensi Keluar
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
                                icon={RiMarkPenLine}
                                name="search"
                                placeholder="highlight data presensi"
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
                                        textToHighlight={"Nama (Label)"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {data?.unit_kerja?.jenis_karyawan === 1
                                        ? data?.data_presensi?.jadwal_shift
                                            ?.shift?.nama
                                        : data?.data_presensi?.jadwal_non_shift
                                            ?.nama}
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
                                        data?.unit_kerja?.jenis_karyawan === 1
                                          ? data?.data_presensi?.jadwal_shift
                                              ?.tgl_mulai
                                          : data?.data_presensi?.created_at
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
                                        data?.unit_kerja?.jenis_karyawan === 1
                                          ? data?.data_presensi?.jadwal_shift
                                              ?.tgl_selesai
                                          : data?.data_presensi?.updated_at
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
                                      {formatTime(
                                        data?.unit_kerja?.jenis_karyawan === 1
                                          ? data?.data_presensi?.jadwal_shift
                                              ?.shift?.jam_from
                                          : data?.data_presensi
                                              ?.jadwal_non_shift?.jam_from
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
                                        textToHighlight={"Jadwal Jam Keluar"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatTime(
                                        data?.unit_kerja?.jenis_karyawan === 1
                                          ? data?.data_presensi?.jadwal_shift
                                              ?.shift?.jam_to
                                          : data?.data_presensi
                                              ?.jadwal_non_shift?.jam_to
                                      )}
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
                                      {formatTimeOld(
                                        data?.data_presensi?.jam_masuk
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
                                        textToHighlight={"Presensi Keluar"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatTimeOld(
                                        data?.data_presensi?.jam_keluar
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
                                        textToHighlight={"Tanggal Masuk"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatDate(
                                        data?.data_presensi?.jam_masuk
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
                                        textToHighlight={"Tanggal Keluar "}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatDate(
                                        data?.data_presensi?.jam_keluar
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
                                        textToHighlight={"Durasi Kerja"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {formatDuration(
                                        data?.data_presensi?.durasi
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
                                        textToHighlight={"Kategori Presensi"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {data?.data_presensi?.kategori_presensi
                                        ?.label || "Invalid"}
                                    </Text>
                                  </HStack>

                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Latitude Masuk"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {data?.data_presensi?.lat_masuk}
                                    </Text>
                                  </HStack>

                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Longitude Masuk"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {data?.data_presensi?.long_masuk}
                                    </Text>
                                  </HStack>

                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Latitude Keluar"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {data?.data_presensi?.lat_keluar}
                                    </Text>
                                  </HStack>

                                  <HStack justify={"space-between"}>
                                    <Box opacity={0.6}>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Longitude Keluar"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={500} textAlign={"right"}>
                                      {data?.data_presensi?.long_keluar}
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
