import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { RiArrowRightSLine, RiUserUnfollowFill } from "@remixicon/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import JenisKaryawanBadge from "../../components/dependent/JenisKaryawanBadge";
import ComponentSpinner from "../../components/independent/ComponentSpinner";
import FlexLine from "../../components/independent/FlexLine";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useBodyColor } from "../../constant/colors";
import { responsiveSpacing, responsiveSpacing2 } from "../../constant/sizes";
import formatDate from "../../lib/formatDate";
import formatDuration from "../../lib/formatDuration";
import formatTime from "../../lib/formatTimeOld";

export default function DetailPresensi() {
  const dummy = {
    id: 1,
    user: {
      id: 1,
      nama: "Very Very Long Name",
      username: "olgaP",
      email_verified_at: null,
      role_id: null,
      foto_profil: null,
      data_completion_step: 1,
      created_at: "2024-05-30T10:26:58.000000Z",
      updated_at: "2024-05-30T10:26:58.000000Z",
    },
    unit_kerja: {
      id: 2,
      nama_unit: "TIK",
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
    foto_masuk: null,
    foto_keluar: null,
    absensi: "Izin",
    kategori: "Terlambat",
    created_at: "2024-05-30T10:27:14.000000Z",
    updated_at: "2024-05-30T10:27:14.000000Z",
  };

  const [data] = useState<any | null>(dummy);
  const [loading] = useState<boolean>(false);

  // SX
  const bodyColor = useBodyColor();
  const dataPresensiRef = useRef<HTMLDivElement>(null);

  return (
    <CWrapper>
      {loading && <ComponentSpinner minH={"300px"} flex={1} />}

      <VStack spacing={responsiveSpacing} align={"stretch"}>
        {!loading && data && (
          <>
            <SimpleGrid columns={[1, 2]} spacing={responsiveSpacing}>
              <CContainer
                p={responsiveSpacing}
                bg={bodyColor}
                borderRadius={12}
              >
                <Button
                  className="btn-clear clicky"
                  w={"fit-content"}
                  h={"fit-content"}
                  color={"p.500"}
                  ml={"auto"}
                  size={"sm"}
                  as={Link}
                  to={`/karyawan/${data.id}`}
                  rightIcon={<Icon as={RiArrowRightSLine} fontSize={20} />}
                  pr={3}
                >
                  Detail
                </Button>

                <HStack flex={1} gap={responsiveSpacing} mb={"20px"}>
                  <Avatar
                    w={"130px"}
                    h={"130px"}
                    size={"xl"}
                    src={data.user.foto_profil}
                    name={data.user.nama}
                  />

                  <Box>
                    <Text fontWeight={600} fontSize={22} mb={2}>
                      {data.user.nama}
                    </Text>
                    <Text mb={4} opacity={0.6} fontSize={14}>
                      {data.unit_kerja.nama_unit}
                    </Text>
                    <JenisKaryawanBadge data={data.unit_kerja.jenis_karyawan} />
                  </Box>
                </HStack>
              </CContainer>

              <CContainer
                p={responsiveSpacing}
                bg={bodyColor}
                borderRadius={12}
              >
                <VStack align={"stretch"} gap={0}>
                  <Text fontSize={20} fontWeight={600} mb={4}>
                    Data Jadwal
                  </Text>

                  <VStack align={"stretch"} gap={4}>
                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Label</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {data.jadwal.nama}
                      </Text>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Tanggal Masuk</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {formatDate(data.jadwal.jam_from)}
                      </Text>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Jadwal Masuk</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {formatTime(data.jadwal.jam_from)}
                      </Text>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Jadwal Keluar</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {formatTime(data.jadwal.jam_to)}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CContainer>
            </SimpleGrid>

            <CContainer
              p={responsiveSpacing}
              flex={"1 0 0"}
              bg={bodyColor}
              borderRadius={12}
            >
              <Wrap spacing={responsiveSpacing2}>
                <Box w={"100%"} maxW={"300px"}>
                  <Text fontSize={20} fontWeight={600} mb={4}>
                    Foto Presensi
                  </Text>

                  {data.foto ? (
                    <Image
                      objectFit={"cover"}
                      aspectRatio={3 / 4}
                      maxH={dataPresensiRef?.current?.offsetHeight || "344px"}
                      w={"100%"}
                      src={data.foto}
                      borderRadius={6}
                    />
                  ) : (
                    <VStack
                      aspectRatio={3 / 4}
                      maxH={dataPresensiRef?.current?.offsetHeight || "344px"}
                      w={"100%"}
                      overflow={"clip"}
                      justify={"center"}
                      bg={"var(--divider)"}
                      borderRadius={8}
                      p={responsiveSpacing}
                    >
                      <Icon
                        as={RiUserUnfollowFill}
                        fontSize={240}
                        opacity={0.2}
                      />
                    </VStack>
                  )}
                </Box>

                <Box flex={1}>
                  <Text fontSize={20} fontWeight={600} mb={4}>
                    Data Presensi
                  </Text>

                  <VStack align={"stretch"} gap={4} ref={dataPresensiRef}>
                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Presensi Masuk</Text>
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
                      <Text opacity={0.6}>Tanggal Masuk</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {formatDate(data.jam_masuk)}
                      </Text>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Tanggal Keluar</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {formatDate(data.jam_keluar)}
                      </Text>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Durasi Kerja</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {formatDuration(data.durasi)}
                      </Text>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Kategori</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {data.kategori || "-"}
                      </Text>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Absen</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {data.absensi || "-"}
                      </Text>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Latitude</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {data.lat || "-"}
                      </Text>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Longitude</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {data.long || "-"}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </Wrap>
            </CContainer>
          </>
        )}
      </VStack>
    </CWrapper>
  );
}
