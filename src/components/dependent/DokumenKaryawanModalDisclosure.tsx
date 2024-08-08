import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { RiVerifiedBadgeFill } from "@remixicon/react";
import { useRef } from "react";
import { dummyDokumens } from "../../const/dummy";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import BooleanBadge from "./BooleanBadge";
import DisclosureHeader from "./DisclosureHeader";
import DokumenFileItem from "./DokumenFileItem";
import Retry from "./Retry";

interface Props extends BoxProps {
  karyawan_id: number;
  children?: any;
}
export default function DokumenKaryawanModalDisclosure({
  karyawan_id,
  children,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useBackOnClose(
    `dokumen-karyawan-modal-${karyawan_id}`,
    isOpen,
    onOpen,
    onClose
  );
  const initialRef = useRef(null);

  const dummy = {
    user: {
      id: 4,
      nama: "Jolitos Kurniawan",
      username: "jolitozzz",
      email_verified_at: null,
      role_id: null,
      foto_profil: null,
      data_completion_step: 1,
      status_akun: 0,
      created_at: "2024-06-08T03:43:48.000000Z",
      updated_at: "2024-06-08T03:43:48.000000Z",
    },
    data_karyawan: {
      id: 3,
      user_id: 4,
      email: "user2@example.com",
      no_rm: 4911794,
      no_manulife: 509624,
      tgl_masuk: "2022-05-13",
      tgl_keluar: "2023-03-22",
      unit_kerja_id: 14,
      jabatan_id: 2,
      kompetensi_id: 6,
      tunjangan_jabatan: 7308539,
      tunjangan_fungsional: 2746210,
      tunjangan_khusus: 2309345,
      tunjangan_lainnya: 1806428,
      uang_makan: 1300797,
      uang_lembur: 1161239,
      nik: "1093205",
      nik_ktp: "76679",
      gelar_depan: "apt.",
      tempat_lahir: "Majalengka",
      tgl_lahir: "1941-07-23",
      alamat:
        "missing impossible coach amount welcome here night trail diameter nervous graph outline shinning perfectly try refer classroom climb burn spider grabbed waste little provide",
      no_hp: "349403291",
      no_bpjsksh: "372032221",
      no_bpjsktk: "326998911",
      tgl_diangkat: "2023-03-22",
      masa_kerja: 59,
      npwp: "494721295",
      no_rekening: "256558441",
      jenis_kelamin: "L",
      agama: "Islam",
      golongan_darah: "O+",
      tinggi_badan: 196,
      berat_badan: 67,
      no_ijazah: "IJ/VII/328061598",
      tahun_lulus: 1951,
      no_kk: "259583723",
      status_karyawan: "Tetap",
      kelompok_gaji_id: 4,
      no_str: "STR/01/RA/398754",
      masa_berlaku_str: "2024-03-23",
      no_sip: "212274",
      masa_berlaku_sip: "2024-03-23",
      ptkp_id: 8,
      tgl_berakhir_pks: "2023-03-22",
      masa_diklat: 3,
      created_at: "2024-06-08T03:43:48.000000Z",
      updated_at: "2024-06-08T03:43:48.000000Z",
      users: {
        id: 4,
        nama: "User 2",
        username: "username2",
        email_verified_at: null,
        role_id: null,
        foto_profil: null,
        data_completion_step: 1,
        status_akun: 0,
        created_at: "2024-06-08T03:43:48.000000Z",
        updated_at: "2024-06-08T03:43:48.000000Z",
      },
    },
    jumlah_dokumen: 4,
    data_dokumen: dummyDokumens,
  };

  // const loading = true;
  const { error, loading, data, retry } = useDataState<any>({
    initialData: dummy,
    url: `/api/rski/dashboard/karyawan/detail-karyawan-dokumen/${karyawan_id}`,
    dependencies: [],
    conditions: !!(isOpen && karyawan_id),
  });

  // SX

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
            <DisclosureHeader title={"Dokumen Karyawan"} />
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
                  <CContainer
                    flex={1}
                    overflowY={"auto"}
                    pb={responsiveSpacing}
                  >
                    <Wrap
                      spacing={responsiveSpacing}
                      mb={responsiveSpacing}
                      align={"center"}
                      px={responsiveSpacing}
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

                      <Skeleton w={"140px"} h={"48px"} ml={"auto"} />
                    </Wrap>

                    <CContainer
                      flex={1}
                      gap={responsiveSpacing}
                      overflowY={"auto"}
                      className="scrollY"
                      px={responsiveSpacing}
                    >
                      <SimpleGrid
                        columns={[2, 3, null, 4, 5]}
                        gap={3}
                        borderRadius={12}
                      >
                        {Array.from({ length: 10 }).map((_, i) => (
                          <Skeleton
                            key={i}
                            w={"100%"}
                            h={"168.43px"}
                            borderRadius={12}
                          />
                        ))}
                      </SimpleGrid>
                    </CContainer>
                  </CContainer>
                )}

                {!loading && (
                  <>
                    {(!data || (data && data.length === 0)) && <NoData />}

                    {(data || (data && data.length > 0)) && (
                      <CContainer
                        overflowY={"auto"}
                        className="scrollY"
                        borderRadius={12}
                        flex={1}
                        px={responsiveSpacing}
                        pb={responsiveSpacing}
                      >
                        <Wrap
                          spacing={responsiveSpacing}
                          mb={responsiveSpacing}
                          align={"center"}
                        >
                          <Avatar
                            size={"lg"}
                            src={data.user.foto_profil}
                            name={data.user.nama}
                            w={"55px"}
                            h={"55px"}
                          />

                          <VStack align={"stretch"}>
                            <Text fontSize={14} opacity={0.6}>
                              Nama Karyawan
                            </Text>
                            <Text fontWeight={500}>{data.user.nama}</Text>
                          </VStack>

                          <VStack align={"stretch"}>
                            <Text fontSize={14} opacity={0.6}>
                              Jumlah Dokumen
                            </Text>
                            <Text fontWeight={500}>
                              {data.jumlah_dokumen || 0}
                            </Text>
                          </VStack>
                          <VStack align={"stretch"}>
                            <Text fontSize={14} opacity={0.6}>
                              Status Verifikasi
                            </Text>
                            <Text fontWeight={500}>
                              <BooleanBadge
                                data={data.status_verifikasi_berkas}
                                trueValue="Diverifikasi"
                                falseValue="Belum Diverifikasi"
                              />
                            </Text>
                          </VStack>

                          <Button
                            ml={"auto"}
                            size={"lg"}
                            colorScheme="ap"
                            className="btn-ap clcicky"
                            leftIcon={
                              <Icon
                                as={RiVerifiedBadgeFill}
                                fontSize={iconSize}
                              />
                            }
                            pl={5}
                            isDisabled={data.status_verifikasi_berkas}
                          >
                            Verifikasi
                          </Button>
                        </Wrap>

                        {data && data.data_dokumen.length === 0 && <NotFound />}

                        {(data || (data && data.data_dokumen.length) > 0) && (
                          <SimpleGrid
                            columns={[2, 3, null, 4, 5]}
                            gap={3}
                            borderRadius={12}
                          >
                            {data.data_dokumen.map(
                              (dokumen: any, i: number) => (
                                <DokumenFileItem
                                  key={i}
                                  data={dokumen}
                                  bg={"var(--divider)"}
                                />
                              )
                            )}
                          </SimpleGrid>
                        )}
                      </CContainer>
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
