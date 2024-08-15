import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { RiArrowRightSLine } from "@remixicon/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import JenisKaryawanBadge from "../../components/dependent/JenisKaryawanBadge";
import ImageView from "../../components/dependent/ImageView";
import ComponentSpinner from "../../components/independent/ComponentSpinner";
import FlexLine from "../../components/independent/FlexLine";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useBodyColor } from "../../constant/colors";
import { responsiveSpacing, responsiveSpacing2 } from "../../constant/sizes";
import formatDate from "../../lib/formatDate";
import formatTime from "../../lib/formatTimeOld";
export default function DetailPelaporanKaryawan() {
  const dummyBerkasFoto = [
    "/reza.jpg",
    "/reza.jpg",
    "/reza.jpg",
    "/reza.jpg",
    "/reza.jpg",
    "/reza.jpg",
    "/reza.jpg",
  ];
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
      nama_unit: "Informatika",
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
    berkas_foto: dummyBerkasFoto,
    created_at: "2024-05-30T10:27:14.000000Z",
    updated_at: "2024-05-30T10:27:14.000000Z",
  };

  const [data] = useState<any | null>(dummy);
  const [loading] = useState<boolean>(false);

  // SX
  const bodyColor = useBodyColor();

  return (
    <CWrapper>
      <Global
        styles={{
          ".chakra-modal__content-container": {
            padding: "0 !important",
          },
        }}
      />

      {loading && <ComponentSpinner minH={"300px"} flex={1} />}

      <VStack spacing={responsiveSpacing} align={"stretch"}>
        {!loading && data && (
          <>
            <Wrap flex={"1 1 0"} spacing={responsiveSpacing}>
              <CContainer
                p={responsiveSpacing}
                flex={"1 1 400px"}
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
                flex={"1 1 350px"}
                bg={bodyColor}
                borderRadius={12}
              >
                <VStack align={"stretch"} gap={0}>
                  <Text fontSize={20} fontWeight={600} mb={4}>
                    Data Laporan
                  </Text>

                  <VStack align={"stretch"} gap={4}>
                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Pelapor</Text>
                      <FlexLine />
                      <HStack>
                        {/* <SmallLink to="#">Detail</SmallLink> */}
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.user.nama}
                        </Text>
                      </HStack>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Tanggal</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {formatDate(data.jadwal.jam_from)}
                      </Text>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Lokasi</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        Semarang
                      </Text>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Waktu</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {formatTime(data.jadwal.jam_from)}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CContainer>
            </Wrap>

            <CContainer
              p={responsiveSpacing}
              flex={"1 0 0"}
              bg={bodyColor}
              borderRadius={12}
            >
              <Wrap spacing={responsiveSpacing2}>
                <Box maxW={"300px"}>
                  <Text fontSize={20} fontWeight={600} mb={4}>
                    Kronologi
                  </Text>

                  <Text>
                    Et deserunt consequat labore labore esse ullamco id proident
                    non officia. Velit nisi ad dolore velit aute. Est minim aute
                    cillum eiusmod. Esse veniam adipisicing ad est ut aliquip
                    aliqua culpa veniam adipisicing nostrud consequat cillum
                    irure. Labore consequat nostrud minim incididunt duis sit
                    occaecat culpa nostrud. Cupidatat consequat ad est nostrud
                    enim pariatur. Elit quis irure adipisicing consectetur
                    officia exercitation.
                  </Text>
                </Box>

                <Box flex={1}>
                  <Text fontSize={20} fontWeight={600} mb={4}>
                    Berkas Foto
                  </Text>

                  <SimpleGrid
                    columns={[1, 2, 3, null, 4]}
                    gap={responsiveSpacing}
                  >
                    {data.berkas_foto.map((foto: any, i: number) => (
                      <ImageView
                        key={i}
                        initialSrc={foto}
                        index={i}
                        data={data.berkas_foto}
                      />
                    ))}
                  </SimpleGrid>
                </Box>
              </Wrap>
            </CContainer>
          </>
        )}
      </VStack>
    </CWrapper>
  );
}
