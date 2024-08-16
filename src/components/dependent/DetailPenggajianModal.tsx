import {
  Box,
  Button,
  ButtonProps,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { RiSendPlaneFill } from "@remixicon/react";
import { useRef, useState } from "react";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import NoData from "../independent/NoData";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import StatusPublikasiPenggajian from "./StatusPublikasiPenggajian";
import TabelDetailPenggajian from "./TabelDetailPenggajian";
import req from "../../constant/req";
import useRenderTrigger from "../../global/useRenderTrigger";

interface PublikasiButtonProps extends ButtonProps {}

function PublikasiButtonModal({ ...props }: PublikasiButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  function publikasiPenggajian() {
    setLoading(true);
    req
      .post("/api/rski/dashboard/keuangan/publikasi-penggajian")
      .then((r) => {
        if (r.status === 200) {
          setRt(!rt);
          backOnClose();
        }
      })
      .catch((e) => {
        console.log(e);
        toast({
          status: "error",
          title:
            e.response.data.message || "Maaf terjadi kesalahan pada sistem",
          position: "bottom-right",
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Button onClick={publikasiPenggajian} isLoading={loading} {...props}>
      Publikasi
    </Button>
  );
}

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
                <CContainer flex={1} px={responsiveSpacing}>
                  <Wrap
                    spacing={responsiveSpacing}
                    mb={responsiveSpacing}
                    align={"center"}
                  >
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

                    <VStack align={"stretch"}>
                      <Skeleton w={"100px"} h={"16px"} />
                      <Skeleton w={"100px"} h={"16px"} />
                    </VStack>

                    <Skeleton w={"120px"} ml={"auto"} />
                  </Wrap>

                  <CContainer
                    flex={1}
                    gap={responsiveSpacing}
                    pb={responsiveSpacing}
                  >
                    <HStack>
                      <Skeleton h={"40px"} flex={1} />
                      <Skeleton h={"40px"} flex={0} minW={"140px"} />
                      <Skeleton h={"40px"} flex={0} minW={"140px"} />
                    </HStack>

                    <Skeleton flex={1} w={"100%"} />
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

                        <PublikasiButtonModal
                          ml={"auto"}
                          size={"lg"}
                          colorScheme="ap"
                          className="btn-ap clicky"
                          leftIcon={
                            <Icon as={RiSendPlaneFill} fontSize={iconSize} />
                          }
                          pl={5}
                          isDisabled={
                            data.data_riwayat.status_riwayat_gaji.id === 2
                          }
                        />
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
