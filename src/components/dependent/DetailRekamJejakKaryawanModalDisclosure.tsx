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
import calculateMasaKerjaFromTanggalMasuk from "../../lib/calculateMasaKerjaFromTanggalMasuk";
import formatDate from "../../lib/formatDate";
import NoData from "../independent/NoData";
import Skeleton from "../independent/Skeleton";
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
  // 2 Mutasi Karyawan
  // 3 Promosi Karyawan
  // 4 Feedback

  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/karyawan/detail-karyawan-rekam-jejak/${karyawan_id}`,
    dependencies: [],
    conditions: !!(isOpen && karyawan_id),
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
              <>
                {notFound && <NoData minH={"300px"} />}

                {!notFound && (
                  <Center my={"auto"} minH={"300px"}>
                    <Retry loading={loading} retry={retry} />
                  </Center>
                )}
              </>
            )}
            {!error && (
              <>
                {loading && (
                  <CContainer flex={1} overflowY={"auto"}>
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

                      <VStack align={"stretch"}>
                        <Skeleton w={"100px"} h={"16px"} />
                        <Skeleton w={"100px"} h={"16px"} />
                      </VStack>
                    </Wrap>

                    <CContainer
                      flex={1}
                      px={responsiveSpacing}
                      gap={responsiveSpacing}
                      overflowY={"auto"}
                      className="scrollY"
                    >
                      {Array.from({ length: 10 }).map((_, i) => (
                        <HStack pl={4} gap={8} key={i}>
                          <Skeleton
                            w={"24px"}
                            h={"24px"}
                            borderRadius={"full"}
                          />
                          <Skeleton flex={1} w={"100%"} h={"58.99px"} />
                        </HStack>
                      ))}
                    </CContainer>
                  </CContainer>
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
                            <CContainer flex={1}>
                              <Wrap
                                spacing={responsiveSpacing}
                                mb={responsiveSpacing}
                                align={"center"}
                              >
                                <Skeleton
                                  w={"55px"}
                                  h={"55px"}
                                  borderRadius={"full"}
                                />

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
                              </Wrap>

                              <CContainer
                                flex={1}
                                gap={responsiveSpacing}
                                pb={responsiveSpacing}
                              >
                                <HStack>
                                  <Skeleton h={"40px"} flex={1} />
                                </HStack>

                                <Skeleton flex={1} w={"100%"} />
                              </CContainer>
                            </CContainer>
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
                                  src={data.user?.foto_profil}
                                  name={data.user?.nama}
                                />

                                <VStack align={"stretch"}>
                                  <Text fontSize={14} opacity={0.6}>
                                    Nama Karyawan
                                  </Text>
                                  <Text fontWeight={500}>
                                    {data.user?.nama}
                                  </Text>
                                </VStack>

                                <VStack align={"stretch"}>
                                  <Text fontSize={14} opacity={0.6}>
                                    Tanggal Masuk
                                  </Text>
                                  <Text fontWeight={500}>
                                    {formatDate(data.tgl_masuk_karyawan)}
                                  </Text>
                                </VStack>

                                <VStack align={"stretch"}>
                                  <Text fontSize={14} opacity={0.6}>
                                    Tanggal Keluar
                                  </Text>
                                  <Text fontWeight={500}>
                                    {data.tgl_keluar_karyawan
                                      ? formatDate(data.tgl_keluar_karyawan)
                                      : "-"}
                                  </Text>
                                </VStack>

                                <VStack align={"stretch"}>
                                  <Text fontSize={14} opacity={0.6}>
                                    Masa Kerja
                                  </Text>
                                  <Text fontWeight={500}>
                                    {calculateMasaKerjaFromTanggalMasuk(
                                      data.tgl_masuk_karyawan
                                    )}
                                  </Text>
                                </VStack>
                              </Wrap>

                              <HStack
                                align={"stretch"}
                                h={"20px"}
                                pl={"40px"}
                                position={"absolute"}
                                top={"54px"}
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
                                <Box
                                  id="tutupan"
                                  flex={1}
                                  h={"20px"}
                                  bg={lightDarkColor}
                                />
                              </HStack>

                              <CContainer
                                flex={1}
                                overflowY={"auto"}
                                className="scrollY"
                                pl={"40px"}
                                pr={6}
                                pt={responsiveSpacing}
                              >
                                {data?.list_rekam_jejak.map(
                                  (item: any, i: number) => (
                                    <DetailRekamJejakItem
                                      key={i}
                                      dataList={data.list_rekam_jejak}
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
