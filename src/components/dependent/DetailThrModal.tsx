import {
  Box,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { RiSendPlaneFill } from "@remixicon/react";
import { useRef } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import ComponentSpinner from "../independent/ComponentSpinner";
import NoData from "../independent/NoData";
import CContainer from "../wrapper/CContainer";
import BooleanBadge from "./BooleanBadge";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import TabelDetailThr from "./TabelDetailThr";

interface Props {
  thr_id: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function DetailThrModal({
  thr_id,
  isOpen,
  onOpen,
  onClose,
}: Props) {
  useBackOnClose(`detail-thr-modal-${thr_id}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const dummy = {
    data_riwayat: {
      id: 3,
      periode: "2024-07-01",
      karyawan_verifikasi: 361,
      status_riwayat_gaji: 0,
      update_terakhir: "2024-07-06T13:04:47.000000Z",
    },
    data_penggajian: [
      {
        id: 5,
        user: {
          id: 2,
          nama: "User 0",
          username: "username0",
          role_id: null,
          foto_profil: null,
          status_akun: 1,
          data_completion_step: 0,
          created_at: "2024-07-06 10:04:37",
          updated_at: "2024-07-06 10:04:37",
        },
        unit_kerja: {
          id: 18,
          nama_unit: "Kebersihan",
          jenis_karyawan: 1,
          deleted_at: null,
          created_at: "2023-11-09 10:04:37",
          updated_at: "2024-07-06 10:04:37",
        },
        kelompok_gaji: {
          id: 10,
          nama_kelompok: "Kelompok Gaji J",
          besaran_gaji: 7950315,
          deleted_at: null,
          created_at: "2023-11-23 10:04:37",
          updated_at: "2024-07-06 10:04:37",
        },
        take_home_pay: 9469015,
        status_penggajian: 1,
      },
      {
        id: 6,
        user: {
          id: 3,
          nama: "User 1",
          username: "username1",
          role_id: null,
          foto_profil: null,
          status_akun: 1,
          data_completion_step: 0,
          created_at: "2024-07-06 10:04:38",
          updated_at: "2024-07-06 10:04:38",
        },
        unit_kerja: {
          id: 17,
          nama_unit: "Psikiatri",
          jenis_karyawan: 0,
          deleted_at: null,
          created_at: "2024-06-06 10:04:37",
          updated_at: "2024-07-06 10:04:37",
        },
        kelompok_gaji: {
          id: 4,
          nama_kelompok: "Kelompok Gaji D",
          besaran_gaji: 5307936,
          deleted_at: null,
          created_at: "2023-10-07 10:04:37",
          updated_at: "2024-07-06 10:04:37",
        },
        take_home_pay: 6674661,
        status_penggajian: 0,
      },
      {
        id: 7,
        user: {
          id: 4,
          nama: "User 2",
          username: "username2",
          role_id: null,
          foto_profil: null,
          status_akun: 1,
          data_completion_step: 0,
          created_at: "2024-07-06 10:04:38",
          updated_at: "2024-07-06 10:04:38",
        },
        unit_kerja: {
          id: 13,
          nama_unit: "Pendidikan dan Pelatihan",
          jenis_karyawan: 1,
          deleted_at: null,
          created_at: "2024-06-10 10:04:37",
          updated_at: "2024-07-06 10:04:37",
        },
        kelompok_gaji: {
          id: 21,
          nama_kelompok: "Kelompok Gaji U",
          besaran_gaji: 9126962,
          deleted_at: null,
          created_at: "2024-03-05 10:04:37",
          updated_at: "2024-07-06 10:04:37",
        },
        take_home_pay: 10211356,
        status_penggajian: 0,
      },
    ],
  };

  const { error, loading, data, retry } = useDataState<any>({
    initialData: dummy,
    url: "",
    dependencies: [],
  });

  // SX

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
          <DisclosureHeader title={"Detail THR"} />
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
                      overflowY={"auto"}
                      className="scrollY"
                      borderRadius={12}
                      flex={1}
                      px={6}
                      pb={6}
                    >
                      <Wrap
                        spacing={responsiveSpacing}
                        mb={responsiveSpacing}
                        align={"center"}
                      >
                        <VStack align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Periode
                          </Text>
                          <Text fontWeight={500}>
                            {formatDate(data.data_riwayat.periode, "periode")}
                          </Text>
                        </VStack>

                        <VStack align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Pembaruan Terakhir
                          </Text>
                          <Text fontWeight={500}>
                            {formatDate(data.data_riwayat.update_terakhir)}
                          </Text>
                        </VStack>

                        <VStack align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Karyawan Digaji
                          </Text>
                          <Text fontWeight={500}>
                            {formatNumber(
                              data.data_riwayat.karyawan_verifikasi
                            )}
                          </Text>
                        </VStack>

                        <VStack align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Status Penggajian
                          </Text>
                          <BooleanBadge
                            w={"150px"}
                            data={data.data_riwayat.status_riwayat_gaji}
                            trueValue="Dipublikasi"
                            falseValue="Belum Dipublikasi"
                          />
                        </VStack>

                        <Button
                          ml={"auto"}
                          size={"lg"}
                          colorScheme="ap"
                          className="btn-ap clicky"
                          leftIcon={
                            <Icon as={RiSendPlaneFill} fontSize={iconSize} />
                          }
                          pl={5}
                          isDisabled={!data.data_riwayat.status_riwayat_gaji}
                        >
                          Publikasi
                        </Button>
                      </Wrap>

                      <TabelDetailThr data={data} />
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
