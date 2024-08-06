import {
  Avatar,
  Box,
  BoxProps,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatMasaKerja from "../../lib/formatMasaKerja";
import ComponentSpinner from "../independent/ComponentSpinner";
import NoData from "../independent/NoData";
import CContainer from "../wrapper/CContainer";
import DetailRekamJejakItem from "./DetailRekamJejakItem";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";

interface Props extends BoxProps {
  karyawan_id: number;
  children?: any;
}
export default function DetailRekamJejakKaryawanModalDisclosure({
  karyawan_id,
  children,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useBackOnClose(
    `detail-rekam-jejak-karyawan-modal-${karyawan_id}`,
    isOpen,
    onOpen,
    onClose
  );
  const initialRef = useRef(null);
  // 1 Perubahan Data
  // 2 Mutasi Pegawai
  // 3 Promosi Pegawai
  // 4 Feedback

  const dummyRekamJejak = [
    {
      user_id: 1,
      kategori: {
        id: 1,
        label: "Pembaruan Data",
      },
      content: {
        id: 1,
        kolom: "tgl_lahir",
        original_data: "2001-11-01",
        updated_data: "2001-11-05",
        status_perubahan: true,
        created_at: "2024-07-10",
        updated_at: "2024-07-11",
      },
      created_at: "2023-05-02",
    },
    {
      user_id: 1,
      kategori: {
        id: 2,
        label: "Mutasi Pegawai",
      },
      content: {
        id: 1,
        user: {
          id: 1,
          nama: "Olga Parks",
          username: "olgaP",
          email_verified_at: null,
          role_id: null,
          foto_profil: null,
          data_completion_step: 1,
          created_at: "2024-05-25T07:43:42.000000Z",
          updated_at: "2024-05-25T07:43:42.000000Z",
          data_karyawans: null,
        },
        tgl_mulai: "2024-09-15 00:00:00",
        nik: "9819287",
        unit_kerja_asal: {
          id: 12,
          nama_unit: "Rawat Inap",
          jenis_karyawan: 0,
          created_at: "2023-12-19T07:43:42.000000Z",
          updated_at: "2024-05-25T07:43:42.000000Z",
        },
        unit_kerja_tujuan: {
          id: 4,
          nama_unit: "Penyakit Dalam",
          jenis_karyawan: 1,
          created_at: "2024-04-17T07:43:42.000000Z",
          updated_at: "2024-05-25T07:43:42.000000Z",
        },
        jabatan_asal: {
          id: 10,
          nama_jabatan: "Tenaga Medis Darurat",
          is_struktural: 0,
          tunjangan: 502110,
          created_at: "2023-10-18T07:43:42.000000Z",
          updated_at: "2024-05-25T07:43:42.000000Z",
        },
        jabatan_tujuan: {
          id: 9,
          nama_jabatan: "Staf Tata Usaha",
          is_struktural: 1,
          tunjangan: 935671,
          created_at: "2024-03-16T07:43:42.000000Z",
          updated_at: "2024-05-25T07:43:42.000000Z",
        },
        kelompok_gaji_tujuan: {
          id: 1,
          nama_kelompok: "A",
        },
        kategori: { id: 1, label: "Promosi" },
        alasan:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos rerum unde, culpa corporis impedit id sequi in tenetur laboriosam odit provident vel temporibus fugiat excepturi ex eum at? Rem, totam!",
        dokumen: null,
        beri_tahu_manajer_direktur: true,
        beri_tahu_karyawan: true,
        created_at: "2024-05-25T07:43:59.000000Z",
        updated_at: "2024-05-25T07:43:59.000000Z",
      },
      created_at: "2024-07-21",
    },
    {
      user_id: 1,
      kategori: {
        id: 1,
        label: "Pembaruan Data",
      },
      content: {
        id: 2,
        kolom: "foto_profil",
        original_data: "https://bit.ly/dan-abramov",
        updated_data: "/images/gear5.jpg",
        status_perubahan: false,
        created_at: "2024-07-22",
        updated_at: "2024-07-23",
      },
      created_at: "2024-07-22",
    },
  ];

  const dummy = {
    nama: "Jolitos Kurniawan",
    foto_profil: "https://bit.ly/dan-abramov",
    jumlah_keluarga: 4,
    tgl_masuk: new Date(),
    tgl_keluar: null,
    masa_kerja: 27,
    rekam_jejak: dummyRekamJejak,
  };

  const { error, loading, data, retry } = useDataState<any>({
    initialData: dummy,
    url: "",
    dependencies: [],
  });

  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <>
      <Box
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        {...props}
      >
        {children}
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        size={"full"}
        scrollBehavior="inside"
        allowPinchZoom
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent borderRadius={12} minH={"calc(100vh - 32px)"}>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title={"Detail Rekam Jejak Karyawan"} />
          </ModalHeader>
          <ModalBody mb={6} className="scrollY" px={0}>
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
                      <>
                        <CContainer
                          flex={1}
                          overflowY={"auto"}
                          borderRadius={12}
                        >
                          {loading && (
                            <ComponentSpinner minH={"300px"} flex={1} />
                          )}

                          {!loading && data && (
                            <CContainer
                              overflowY={"auto"}
                              position={"relative"}
                            >
                              <Wrap
                                px={6}
                                align={"center"}
                                spacing={responsiveSpacing}
                                // mb={responsiveSpacing}
                              >
                                <Avatar
                                  size={"md"}
                                  w={"55px"}
                                  h={"55px"}
                                  src={data.foto_profil}
                                  name={data.nama}
                                />

                                <VStack align={"stretch"}>
                                  <Text fontSize={14} opacity={0.6}>
                                    Nama Karyawan
                                  </Text>
                                  <Text fontWeight={500}>{data.nama}</Text>
                                </VStack>

                                <VStack align={"stretch"}>
                                  <Text fontSize={14} opacity={0.6}>
                                    Tanggal Masuk
                                  </Text>
                                  <Text fontWeight={500}>
                                    {formatDate(data.tgl_masuk)}
                                  </Text>
                                </VStack>

                                <VStack align={"stretch"}>
                                  <Text fontSize={14} opacity={0.6}>
                                    Tanggal Keluar
                                  </Text>
                                  <Text fontWeight={500}>
                                    {formatDate(data.tgl_keluar)}
                                  </Text>
                                </VStack>

                                <VStack align={"stretch"}>
                                  <Text fontSize={14} opacity={0.6}>
                                    Masa Kerja
                                  </Text>
                                  <Text fontWeight={500}>
                                    {formatMasaKerja(data.masa_kerja)}
                                  </Text>
                                </VStack>
                              </Wrap>

                              <HStack
                                align={"stretch"}
                                h={"20px"}
                                pl={"36px"}
                                position={"absolute"}
                                top={"60px"}
                                right={0}
                                w={"100%"}
                                zIndex={2}
                              >
                                <Center w={"24px"}>
                                  <Box
                                    w={"1px"}
                                    h={"20px"}
                                    bg={"var(--divider3)"}
                                  />
                                </Center>
                                <Box flex={1} bg={lightDarkColor} />
                              </HStack>

                              <CContainer
                                flex={1}
                                overflowY={"auto"}
                                className="scrollY"
                                pl={"36px"}
                                pr={6}
                                pt={responsiveSpacing}
                              >
                                {data.rekam_jejak.map(
                                  (item: any, i: number) => (
                                    <DetailRekamJejakItem
                                      key={i}
                                      dataList={data.rekam_jejak}
                                      data={item}
                                      index={i}
                                    />
                                  )
                                )}
                              </CContainer>
                            </CContainer>
                          )}
                        </CContainer>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
