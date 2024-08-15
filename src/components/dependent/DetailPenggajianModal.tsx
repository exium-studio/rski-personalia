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
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import ComponentSpinner from "../independent/ComponentSpinner";
import NoData from "../independent/NoData";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import StatusPublikasiPenggajian from "./StatusPublikasiPenggajian";
import TabelDetailPenggajian from "./TabelDetailPenggajian";

interface Props {
  id?: string;
  penggajian_id: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function DetailPenggajianModal({
  id,
  penggajian_id,
  isOpen,
  onOpen,
  onClose,
}: Props) {
  useBackOnClose(
    id || `detail-penggajian-modal-${penggajian_id}`,
    isOpen,
    onOpen,
    onClose
  );
  const initialRef = useRef(null);

  const { error, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/keuangan/penggajian/${penggajian_id}`,
    dependencies: [],
    conditions: !!(isOpen && penggajian_id),
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
          <DisclosureHeader title={"Detail Penggajian"} />
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
                            {formatDate(data.data_riwayat.pembaruan_terakhir)}
                          </Text>
                        </VStack>

                        <VStack align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Karyawan Digaji
                          </Text>
                          <Text fontWeight={500}>
                            {formatNumber(data.data_riwayat.karyawan_digaji)}
                          </Text>
                        </VStack>

                        <VStack align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Status Penggajian
                          </Text>
                          <StatusPublikasiPenggajian
                            data={data.data_riwayat?.status_riwayat_gaji}
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

                      <TabelDetailPenggajian data={data} />
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
