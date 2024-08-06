import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  HStack,
  Icon,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { RiArrowRightSLine } from "@remixicon/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import JenisKaryawanBadge from "../../components/dependent/JenisKaryawanBadge";
import ComponentSpinner from "../../components/independent/ComponentSpinner";
import FlexLine from "../../components/independent/FlexLine";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useBodyColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import formatNumber from "../../lib/formatNumber";

export default function DetailPenggajian() {
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
    kelompok_gaji: {
      id: 19,
      nama_kelompok: "Y",
      besaran_gaji: 3202572,
      created_at: "2023-11-08T13:41:16.000000Z",
      updated_at: "2024-05-22T13:41:16.000000Z",
    },
    ptkp: {
      id: 7,
      kode_ptkp: "K/2",
      kategori_ter_id: 2,
      created_at: "2024-06-06T23:48:34.000000Z",
      updated_at: "2024-06-06T23:48:34.000000Z",
    },
    npwp: "75485344",
    reward: 500000,
    tunjangan_jabatan: 6350127,
    tunjangan_fungsional: 1602565,
    tunjangan_khusus: 2193815,
    tunjangan_lainnya: 2205493,
    uang_lembur: 974476,
    uang_makan: 1467478,
    premi: 1000000,
    pph21: 600000,
    take_home_pay: 12000000,
    no_rekening: "300652572",
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
                    Data Penggajian
                  </Text>

                  <VStack align={"stretch"} gap={4}>
                    {/* <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Unit Kerja</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {data.unit_kerja.nama_unit}
                      </Text>
                    </HStack> */}

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Kelompok Gaji</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {data.kelompok_gaji.nama_kelompok}
                      </Text>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>NPWP</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {data.npwp}
                      </Text>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>No. Rekening</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {data.no_rekening}
                      </Text>
                    </HStack>

                    <HStack justify={"space-between"}>
                      <Text opacity={0.6}>Kode PTKP</Text>
                      <FlexLine />
                      <Text fontWeight={500} textAlign={"right"}>
                        {data.ptkp.kode_ptkp}
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
              <Text fontSize={20} fontWeight={600} mb={4}>
                Rincian Penggajian
              </Text>

              <VStack align={"stretch"} gap={4} ref={dataPresensiRef}>
                <HStack justify={"space-between"}>
                  <Text opacity={0.6}>Gaji Pokok</Text>
                  <FlexLine />
                  <Text fontWeight={500} textAlign={"right"}>
                    Rp {formatNumber(data.kelompok_gaji.besaran_gaji)}
                  </Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text opacity={0.6}>Reward (Presensi & BOR)</Text>
                  <FlexLine />
                  <Text fontWeight={500} textAlign={"right"}>
                    Rp {formatNumber(data.reward)}
                  </Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text opacity={0.6}>Tunjangan Jabatan</Text>
                  <FlexLine />
                  <Text fontWeight={500} textAlign={"right"}>
                    Rp {formatNumber(data.tunjangan_jabatan)}
                  </Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text opacity={0.6}>Tunjangan Fungsional</Text>
                  <FlexLine />
                  <Text fontWeight={500} textAlign={"right"}>
                    Rp {formatNumber(data.tunjangan_fungsional)}
                  </Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text opacity={0.6}>Tunjangan Khusus</Text>
                  <FlexLine />
                  <Text fontWeight={500} textAlign={"right"}>
                    Rp {formatNumber(data.tunjangan_khusus)}
                  </Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text opacity={0.6}>Uang Lembur</Text>
                  <FlexLine />
                  <Text fontWeight={500} textAlign={"right"}>
                    Rp {formatNumber(data.uang_lembur)}
                  </Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text opacity={0.6}>Uang Makan</Text>
                  <FlexLine />
                  <Text fontWeight={500} textAlign={"right"}>
                    Rp {formatNumber(data.uang_makan)}
                  </Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text opacity={0.6}>Premi</Text>
                  <FlexLine />
                  <Text fontWeight={500} textAlign={"right"}>
                    - Rp {formatNumber(data.premi)}
                  </Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text opacity={0.6}>PPh21</Text>
                  <FlexLine />
                  <Text fontWeight={500} textAlign={"right"}>
                    - Rp {formatNumber(data.pph21)}
                  </Text>
                </HStack>

                <HStack
                  justify={"space-between"}
                  borderTop={"1px solid var(--divider3)"}
                  pt={4}
                  mt={1}
                >
                  <Text fontSize={20} opacity={0.6}>
                    Take Home Pay
                  </Text>
                  <FlexLine />
                  <Text fontSize={20} fontWeight={500} textAlign={"right"}>
                    Rp {formatNumber(data.take_home_pay)}
                  </Text>
                </HStack>
              </VStack>
            </CContainer>

            <ButtonGroup ml={"auto"}>
              <Button colorScheme="red" variant={"outline"} className="clicky">
                Ditolak
              </Button>
              <Button colorScheme="ap" className="btn-ap clicky">
                Disetujui
              </Button>
            </ButtonGroup>
          </>
        )}
      </VStack>
    </CWrapper>
  );
}
