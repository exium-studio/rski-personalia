import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
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
import {
  RiArchiveStackFill,
  RiAwardFill,
  RiCalendarCheckFill,
  RiCalendarCloseFill,
  RiCalendarFill,
  RiCalendarScheduleFill,
  RiCircleFill,
  RiCloseCircleFill,
  RiFileChartFill,
  RiGraduationCapFill,
  RiHeartFill,
  RiMarkPenLine,
  RiTimerFill,
  RiUserStarFill,
} from "@remixicon/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useLightDarkColor,
  useWarningAlphaColor,
  useWarningColor,
} from "../../constant/colors";
import dataKaryawanLabel from "../../constant/dataKaryawanLabel";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import useGetUserData from "../../hooks/useGetUserData";
import backOnClose from "../../lib/backOnClose";
import formatDurationShort from "../../lib/formatDurationShort";
import isHasPermissions from "../../lib/isHasPermissions";
import NoData from "../independent/NoData";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import AktifkanNonaktifkanButton from "./AktifkanNonaktifkanButton";
import DetailAktivitasKaryawanModalDisclosure from "./DetailAktivitasKaryawanModalDisclosure";
import DetailCutiKaryawanModalDisclosure from "./DetailCutiKaryawanModalDisclosure";
import DetailDataKaryawan from "./DetailDataKaryawan";
import DetailDiklatKaryawanModalDisclosure from "./DetailDiklatKaryawanModalDisclosure";
import DokumenKaryawanModalDisclosure from "./DetailDokumenKaryawanModalDisclosure";
import DetailJadwalKaryawanModalDisclosure from "./DetailJadwalKaryawanModalDisclosure";
import DetailKeluargaKaryawanModalDisclosure from "./DetailKeluargaKaryawanModalDisclosure";
import DetailLemburKaryawanModalDisclosure from "./DetailLemburKaryawanModalDisclosure";
import DetailPenilaianKaryawanModalDisclosure from "./DetailPenilaianKaryawanModalDisclosure";
import DetailRekamJejakKaryawanModalDisclosure from "./DetailRekamJejakKaryawanModalDisclosure";
import DetailTukarJadwalKaryawanModalDisclosure from "./DetailTukarJadwalKaryawanModalDisclosure";
import DisclosureHeader from "./DisclosureHeader";
import EditKaryawanModal from "./EditKaryawanModal";
import SearchComponent from "./input/SearchComponent";
import ResetPasswordKaryawan from "./ResetPasswordKaryawan";
import Retry from "./Retry";
import RunPenilaianModal from "./RunPenilaianModal";
import StatusAktifBadge from "./StatusAktifBadge";

interface Props {
  id?: string;
  user_id?: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
export default function DetailKaryawanModal({
  id,
  user_id,
  isOpen,
  onOpen,
  onClose,
}: Props) {
  // SX
  const lightDarkColor = useLightDarkColor();
  const warningColor = useWarningColor();
  const warningAlphaColor = useWarningAlphaColor();

  useBackOnClose(
    id || `detail-karyawan-modal-${user_id}`,
    isOpen,
    onOpen,
    onClose
  );

  const initialRef = useRef(null);

  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/karyawan/detail-karyawan-user/${user_id}`,
    dependencies: [isOpen, user_id],
    conditions: !!(isOpen && user_id),
  });
  const [search, setSearch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string[]>([]);
  const userData = useGetUserData();
  const isUserSuperAdmin = userData?.role?.id === 1;

  useEffect(() => {
    const words = search?.split(" ")?.filter((word) => word.length > 0);
    const modifiedWords = words?.reduce((acc: string[], word) => {
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

  const isMedic = data?.kompetensi?.jenis_kompetensi === 1;
  const [emptyDataLabel, setEmptyDataLabel] = useState<any>(undefined);
  const countEmptyValues = useCallback(
    (obj: Record<string, any>): any[] => {
      const nonMedicTerm = [
        "no_str",
        "no_sip",
        "masa_berlaku_str",
        "masa_berlaku_sip",
      ];
      const allowedNullKeys = [
        "gelar_depan",
        "gelar_belakang",
        "masa_kerja",
        "tunjangan_jabatan",
        "tgl_keluar",
        "tgl_diangkat",
        "str",
        "masa_berlaku_str",
        "sip",
        "masa_berlaku_sip",
        "email",
        "riwayat_penyakit",
        "masa_diklat",
        "kompetensi",
        ...(isUserSuperAdmin ? [] : ["role"]),
        ...(isMedic ? [] : nonMedicTerm),
      ];
      let emptyDataLabels: any[] = [];

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (
            !allowedNullKeys.includes(key) &&
            (value === null ||
              value === undefined ||
              value === "" ||
              value?.length === 0)
          ) {
            emptyDataLabels.push(key);
          }
        }
      }

      return emptyDataLabels;
    },
    [isMedic, isUserSuperAdmin]
  );

  useEffect(() => {
    setEmptyDataLabel(undefined);
    if (data) {
      setEmptyDataLabel(countEmptyValues(data));
    }
  }, [data, countEmptyValues]);

  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [49]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={backOnClose}
      initialFocusRef={initialRef}
      size={"full"}
      scrollBehavior={"inside"}
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent borderRadius={12} minH={"calc(100vh - 32px)"}>
        <ModalHeader ref={initialRef}>
          <DisclosureHeader title={"Detail Karyawan"} />
        </ModalHeader>
        <ModalBody px={0}>
          {error && (
            <>
              {notFound && <NoData />}

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
                <CContainer
                  h={"calc(100vh - 70px)"}
                  overflowY={"auto"}
                  className="scrollY"
                >
                  <SimpleGrid
                    columns={[1, null, null, 2]}
                    flex={1}
                    overflowY={"auto"}
                    className="scrollY"
                    mb={responsiveSpacing}
                  >
                    <CContainer
                      overflowY={[null, null, null, "auto"]}
                      className="scrollY"
                      bg={lightDarkColor}
                      px={responsiveSpacing}
                      justify={"space-between"}
                    >
                      <VStack gap={3} borderRadius={12} align={"center"} mb={4}>
                        <Skeleton
                          borderRadius={"full"}
                          w={"200px"}
                          h={"200px"}
                          mx={"auto"}
                        />
                        <Skeleton maxW={"400px"} />
                        <HStack w={"100%"} maxW={"400px"} justify={"center"}>
                          {/* <Skeleton w={"100%"} maxW={"400px"} h={"30px"} /> */}
                          <Skeleton w={"100%"} maxW={"100px"} h={"30px"} />
                          <Skeleton w={"100%"} maxW={"100px"} h={"30px"} />
                        </HStack>
                      </VStack>

                      <Skeleton h={"95px"} flexShrink={0} mb={3} mt={"auto"} />

                      <SimpleGrid gap={3} columns={[1, 2, null, 3]}>
                        <Skeleton h={"95px"} />
                        <Skeleton h={"95px"} />
                        <Skeleton h={"95px"} />
                        <Skeleton h={"95px"} />
                        <Skeleton h={"95px"} />
                        <Skeleton h={"95px"} />
                        <Skeleton h={"95px"} />
                        <Skeleton h={"95px"} />
                        <Skeleton h={"95px"} />
                        <Skeleton h={"95px"} />
                        <Skeleton h={"95px"} />
                        <Skeleton h={"95px"} />
                      </SimpleGrid>
                    </CContainer>

                    <CContainer
                      overflowY={[null, null, null, "auto"]}
                      className="scrollY"
                      bg={lightDarkColor}
                      px={responsiveSpacing}
                      justify={"space-between"}
                      gap={4}
                    >
                      <SimpleGrid columns={[2]} gap={2}>
                        <Skeleton h={"40px"} />
                        <Skeleton h={"40px"} />
                        <Skeleton h={"40px"} />
                        <Skeleton h={"40px"} />
                      </SimpleGrid>

                      <Skeleton flexShrink={0} h={"40px"} />

                      <Skeleton flexShrink={0} h={"50px"} />

                      <Skeleton flexShrink={0} h={"400px"} />
                      <Skeleton flexShrink={0} h={"400px"} />
                      <Skeleton flexShrink={0} h={"400px"} />
                    </CContainer>
                  </SimpleGrid>
                </CContainer>
              )}

              {!loading && (
                <>
                  {data && (
                    <CContainer
                      h={"calc(100vh - 70px)"}
                      overflowY={"auto"}
                      className="scrollY"
                    >
                      <SimpleGrid
                        columns={[1, null, null, 2]}
                        flex={1}
                        overflowY={"auto"}
                        className="scrollY"
                        mb={responsiveSpacing}
                      >
                        <CContainer
                          overflowY={[null, null, null, "auto"]}
                          className="scrollY"
                          bg={lightDarkColor}
                          px={responsiveSpacing}
                          justify={"space-between"}
                        >
                          <VStack
                            gap={responsiveSpacing}
                            borderRadius={12}
                            align={"center"}
                            mb={3}
                          >
                            <Avatar
                              w={"200px"}
                              h={"200px"}
                              size={"xxl"}
                              fontSize={"64px !important"}
                              src={data.user?.foto_profil}
                              name={data.user?.nama}
                            />

                            <VStack gap={1} w={"100%"}>
                              <Text
                                fontWeight={700}
                                fontSize={32}
                                lineHeight={1.3}
                                textAlign={"center"}
                                mb={4}
                              >
                                {`${data?.gelar_depan || ""} ${
                                  data.user?.nama
                                } ${data?.gelar_belakang || ""}`}
                              </Text>

                              {/* Stats Basic */}
                              <Wrap mb={6} justify={"center"} align={"center"}>
                                <StatusAktifBadge
                                  data={data.user?.status_aktif}
                                />
                                <Icon
                                  as={RiCircleFill}
                                  fontSize={8}
                                  opacity={0.2}
                                />
                                <Badge
                                  borderRadius={"full"}
                                  paddingRight={2}
                                  colorScheme={
                                    data?.status_reward_presensi
                                      ? "green"
                                      : "red"
                                  }
                                >
                                  <HStack>
                                    <Text fontSize={12}>
                                      {data?.status_reward_presensi
                                        ? "Reward presensi"
                                        : "Reward presensi"}
                                    </Text>
                                    <Icon
                                      as={
                                        data?.status_reward_presensi
                                          ? RiAwardFill
                                          : RiCloseCircleFill
                                      }
                                      color={
                                        data?.status_reward_presensi
                                          ? "green.400"
                                          : "red.400"
                                      }
                                      fontSize={14}
                                    />
                                  </HStack>
                                </Badge>
                              </Wrap>
                            </VStack>
                          </VStack>

                          {/* Stats Diklat */}
                          <HStack
                            mt={"auto"}
                            bg={"var(--divider)"}
                            p={4}
                            borderRadius={12}
                            w={"100%"}
                            gap={4}
                            align={"stretch"}
                            mb={3}
                          >
                            <VStack flex={1}>
                              <Text
                                textAlign={"center"}
                                fontSize={24}
                                fontWeight={500}
                              >
                                {formatDurationShort(
                                  data?.total_durasi_internal +
                                    data?.total_durasi_eksternal
                                ) || 0}
                              </Text>
                              <Text textAlign={"center"} opacity={0.4}>
                                Total Diklat
                              </Text>
                            </VStack>

                            <Box
                              w={"1px"}
                              flexShrink={0}
                              bg={"var(--divider3)"}
                            />

                            <VStack flex={1}>
                              <Text
                                textAlign={"center"}
                                fontSize={24}
                                fontWeight={500}
                              >
                                {formatDurationShort(
                                  data?.total_durasi_internal
                                ) || 0}
                              </Text>
                              <Text textAlign={"center"} opacity={0.4}>
                                Diklat Internal
                              </Text>
                            </VStack>

                            <VStack flex={1}>
                              <Text
                                textAlign={"center"}
                                fontSize={24}
                                fontWeight={500}
                              >
                                {formatDurationShort(
                                  data?.total_durasi_eksternal
                                ) || 0}
                              </Text>
                              <Text textAlign={"center"} opacity={0.4}>
                                Diklat Eksternal
                              </Text>
                            </VStack>
                          </HStack>

                          {/* Profil Menu */}
                          <SimpleGrid gap={3} columns={[1, 2, null, 3]}>
                            {/* Presensi */}
                            <DetailAktivitasKaryawanModalDisclosure
                              karyawan_id={data.user?.data_karyawan_id}
                              flex={0}
                              role="group"
                            >
                              <VStack
                                cursor={"pointer"}
                                borderRadius={12}
                                justify={"center"}
                                p={4}
                                className="btn-solid clicky"
                                h={"100%"}
                              >
                                <Icon
                                  opacity={0.4}
                                  transition={"200ms"}
                                  _groupHover={{ opacity: 1 }}
                                  as={RiTimerFill}
                                  fontSize={32}
                                />
                                <Text
                                  fontWeight={500}
                                  textAlign={"center"}
                                  lineHeight={1.4}
                                >
                                  Presensi
                                </Text>
                              </VStack>
                            </DetailAktivitasKaryawanModalDisclosure>

                            {/* Jadwal */}
                            <DetailJadwalKaryawanModalDisclosure
                              karyawan_id={data.user?.data_karyawan_id}
                              flexShrink={0}
                              role="group"
                            >
                              <VStack
                                h={"100%"}
                                cursor={"pointer"}
                                borderRadius={12}
                                justify={"center"}
                                p={4}
                                className="btn-solid clicky"
                              >
                                <Icon
                                  opacity={0.4}
                                  as={RiCalendarFill}
                                  fontSize={32}
                                  transition={"200ms"}
                                  _groupHover={{ opacity: 1 }}
                                />
                                <Text
                                  fontWeight={500}
                                  textAlign={"center"}
                                  lineHeight={1.4}
                                >
                                  Jadwal Minggu Ini
                                </Text>
                              </VStack>
                            </DetailJadwalKaryawanModalDisclosure>

                            {/* Rekam Jejak */}
                            <DetailRekamJejakKaryawanModalDisclosure
                              karyawan_id={data.user?.data_karyawan_id}
                              flexShrink={0}
                              role="group"
                            >
                              <VStack
                                h={"100%"}
                                cursor={"pointer"}
                                borderRadius={12}
                                justify={"center"}
                                p={4}
                                className="btn-solid clicky"
                              >
                                <Icon
                                  opacity={0.4}
                                  as={RiFileChartFill}
                                  fontSize={32}
                                  transition={"200ms"}
                                  _groupHover={{ opacity: 1 }}
                                />
                                <Text
                                  fontWeight={500}
                                  textAlign={"center"}
                                  lineHeight={1.4}
                                >
                                  Rekam Jejak
                                </Text>
                              </VStack>
                            </DetailRekamJejakKaryawanModalDisclosure>

                            {/* Data Keluarga */}
                            <DetailKeluargaKaryawanModalDisclosure
                              karyawan_id={data?.user?.data_karyawan_id}
                              flexShrink={0}
                              role="group"
                            >
                              <VStack
                                h={"100%"}
                                cursor={"pointer"}
                                borderRadius={12}
                                justify={"center"}
                                p={4}
                                className="btn-solid clicky"
                                position={"relative"}
                              >
                                {data?.status_keluarga && (
                                  <Icon
                                    as={RiCircleFill}
                                    color={"red.400"}
                                    position={"absolute"}
                                    top={3}
                                    right={3}
                                    fontSize={10}
                                  />
                                )}

                                <Icon
                                  opacity={0.4}
                                  as={RiHeartFill}
                                  fontSize={32}
                                  transition={"200ms"}
                                  _groupHover={{ opacity: 1 }}
                                />
                                <Text
                                  fontWeight={500}
                                  textAlign={"center"}
                                  lineHeight={1.4}
                                >
                                  Data Keluarga
                                </Text>
                              </VStack>
                            </DetailKeluargaKaryawanModalDisclosure>

                            {/* Dokumen */}
                            <DokumenKaryawanModalDisclosure
                              karyawan_id={data.user?.data_karyawan_id}
                              flexShrink={0}
                              role="group"
                            >
                              <VStack
                                h={"100%"}
                                cursor={"pointer"}
                                borderRadius={12}
                                justify={"center"}
                                p={4}
                                className="btn-solid clicky"
                                position={"relative"}
                              >
                                {data?.status_berkas && (
                                  <Icon
                                    as={RiCircleFill}
                                    color={"red.400"}
                                    position={"absolute"}
                                    top={3}
                                    right={3}
                                    fontSize={10}
                                  />
                                )}
                                <Icon
                                  opacity={0.4}
                                  as={RiArchiveStackFill}
                                  fontSize={32}
                                  transition={"200ms"}
                                  _groupHover={{ opacity: 1 }}
                                />
                                <Text
                                  fontWeight={500}
                                  textAlign={"center"}
                                  lineHeight={1.4}
                                >
                                  Dokumen
                                </Text>
                              </VStack>
                            </DokumenKaryawanModalDisclosure>

                            {/* Cuti */}
                            <DetailCutiKaryawanModalDisclosure
                              karyawan_id={data.user?.data_karyawan_id}
                              flexShrink={0}
                              role="group"
                            >
                              <VStack
                                h={"100%"}
                                cursor={"pointer"}
                                borderRadius={12}
                                justify={"center"}
                                p={4}
                                className="btn-solid clicky"
                              >
                                <Icon
                                  opacity={0.4}
                                  as={RiCalendarCloseFill}
                                  fontSize={32}
                                  transition={"200ms"}
                                  _groupHover={{ opacity: 1 }}
                                />
                                <Text
                                  fontWeight={500}
                                  textAlign={"center"}
                                  lineHeight={1.4}
                                >
                                  Cuti
                                </Text>
                              </VStack>
                            </DetailCutiKaryawanModalDisclosure>

                            {/* Tukar Jadwal  */}
                            <DetailTukarJadwalKaryawanModalDisclosure
                              disclosure_id={id}
                              karyawan_id={data.user?.data_karyawan_id}
                              flexShrink={0}
                              role="group"
                            >
                              <VStack
                                h={"100%"}
                                cursor={"pointer"}
                                borderRadius={12}
                                justify={"center"}
                                p={4}
                                className="btn-solid clicky"
                              >
                                <Icon
                                  opacity={0.4}
                                  as={RiCalendarCheckFill}
                                  fontSize={32}
                                  transition={"200ms"}
                                  _groupHover={{ opacity: 1 }}
                                />
                                <Text
                                  fontWeight={500}
                                  textAlign={"center"}
                                  lineHeight={1.4}
                                >
                                  Tukar Jadwal
                                </Text>
                              </VStack>
                            </DetailTukarJadwalKaryawanModalDisclosure>

                            {/* Lembur */}
                            <DetailLemburKaryawanModalDisclosure
                              karyawan_id={data.user?.data_karyawan_id}
                              flexShrink={0}
                              role="group"
                            >
                              <VStack
                                h={"100%"}
                                cursor={"pointer"}
                                borderRadius={12}
                                justify={"center"}
                                p={4}
                                className="btn-solid clicky"
                              >
                                <Icon
                                  opacity={0.4}
                                  as={RiCalendarScheduleFill}
                                  fontSize={32}
                                  transition={"200ms"}
                                  _groupHover={{ opacity: 1 }}
                                />
                                <Text
                                  fontWeight={500}
                                  textAlign={"center"}
                                  lineHeight={1.4}
                                >
                                  Lembur
                                </Text>
                              </VStack>
                            </DetailLemburKaryawanModalDisclosure>

                            {/* Diklat */}
                            <DetailDiklatKaryawanModalDisclosure
                              karyawan_id={data.user?.data_karyawan_id}
                              flexShrink={0}
                              role="group"
                            >
                              <VStack
                                h={"100%"}
                                cursor={"pointer"}
                                borderRadius={12}
                                justify={"center"}
                                p={4}
                                className="btn-solid clicky"
                              >
                                <Icon
                                  opacity={0.4}
                                  as={RiGraduationCapFill}
                                  fontSize={32}
                                  transition={"200ms"}
                                  _groupHover={{ opacity: 1 }}
                                />
                                <Text
                                  fontWeight={500}
                                  textAlign={"center"}
                                  lineHeight={1.4}
                                >
                                  Diklat
                                </Text>
                              </VStack>
                            </DetailDiklatKaryawanModalDisclosure>

                            {/* Penilaian */}
                            <DetailPenilaianKaryawanModalDisclosure
                              karyawan_id={data.user?.data_karyawan_id}
                              flexShrink={0}
                              role="group"
                            >
                              <VStack
                                h={"100%"}
                                cursor={"pointer"}
                                borderRadius={12}
                                justify={"center"}
                                p={4}
                                className="btn-solid clicky"
                              >
                                <Icon
                                  opacity={0.4}
                                  as={RiUserStarFill}
                                  fontSize={32}
                                  transition={"200ms"}
                                  _groupHover={{ opacity: 1 }}
                                />
                                <Text
                                  fontWeight={500}
                                  textAlign={"center"}
                                  lineHeight={1.4}
                                >
                                  Penilaian
                                </Text>
                              </VStack>
                            </DetailPenilaianKaryawanModalDisclosure>
                          </SimpleGrid>
                        </CContainer>

                        <CContainer
                          mt={[5, null, null, 0]}
                          gap={responsiveSpacing}
                          overflowY={[null, null, null, "auto"]}
                          className="scrollY"
                        >
                          <SimpleGrid
                            columns={[2]}
                            gap={2}
                            px={5}
                            position={"sticky"}
                            top={"0"}
                            bg={lightDarkColor}
                            zIndex={2}
                          >
                            <RunPenilaianModal user_id={data.user.id} />

                            {/* Edit */}
                            <PermissionTooltip
                              permission={editPermission}
                              label={!editPermission && "Tidak ada akses"}
                              flex={1}
                              boxProps={{ flex: 1 }}
                            >
                              <Box flex={1}>
                                <EditKaryawanModal
                                  initialData={data}
                                  isDisabled={!editPermission}
                                  flex={1}
                                />
                              </Box>
                            </PermissionTooltip>

                            <PermissionTooltip
                              permission={editPermission}
                              flex={1}
                              boxProps={{ flex: 1 }}
                            >
                              <AktifkanNonaktifkanButton
                                karyawan_id={data.id}
                                data={data?.user?.status_aktif}
                                isDisabled={!editPermission}
                                flex={1}
                                w={"100%"}
                              />
                            </PermissionTooltip>

                            <ResetPasswordKaryawan userData={data.user} />
                          </SimpleGrid>

                          <CContainer px={5}>
                            <SearchComponent
                              icon={RiMarkPenLine}
                              name="search"
                              onChangeSetter={(input) => {
                                setSearch(input);
                              }}
                              inputValue={search}
                              placeholder="highlight data karyawan"
                              tooltipLabel="Cari data karyawan"
                            />
                          </CContainer>

                          <CContainer
                            flex={1}
                            overflowY={"auto"}
                            className="scrollY"
                            bg={lightDarkColor}
                            gap={responsiveSpacing}
                            px={responsiveSpacing}
                          >
                            {/* Empty data */}
                            <>
                              {!emptyDataLabel && <Skeleton h={"50px"} />}

                              {emptyDataLabel && emptyDataLabel.length > 0 && (
                                <Accordion allowMultiple>
                                  <AccordionItem
                                    border={"none"}
                                    borderRadius={8}
                                    overflow={"clip"}
                                    bg={warningAlphaColor}
                                  >
                                    <AccordionButton
                                      w={"100%"}
                                      h={"50px"}
                                      borderRadius={8}
                                      gap={2}
                                      justifyContent={"space-between"}
                                      fontWeight={600}
                                      color={warningColor}
                                      _hover={{ bg: warningAlphaColor }}
                                      // _expanded={{ bg: warningAlphaColor }}
                                    >
                                      <Text mt={"2px"}>
                                        {emptyDataLabel?.length === 0
                                          ? "Data karyawan lengkap"
                                          : `${emptyDataLabel?.length} data masih kosong`}
                                      </Text>
                                      <AccordionIcon />
                                    </AccordionButton>

                                    <AccordionPanel py={4}>
                                      <Wrap
                                        align={"center"}
                                        spacing={responsiveSpacing}
                                      >
                                        {emptyDataLabel?.map(
                                          (key: any, i: number) => (
                                            <HStack key={i}>
                                              <Icon
                                                as={RiCircleFill}
                                                opacity={0.2}
                                                fontSize={8}
                                              />
                                              <Text opacity={0.6}>
                                                {/* @ts-ignore */}
                                                {dataKaryawanLabel[key]}
                                                {/* {key} */}
                                              </Text>
                                            </HStack>
                                          )
                                        )}
                                      </Wrap>
                                    </AccordionPanel>
                                  </AccordionItem>
                                </Accordion>
                              )}
                            </>

                            <DetailDataKaryawan
                              data={data}
                              searchQuery={searchQuery}
                            />
                          </CContainer>
                        </CContainer>
                      </SimpleGrid>
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
