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
import { responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import NoData from "../independent/NoData";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import TabelDetailJadwalKaryawan from "./TabelDetailJadwalKaryawan";

interface Props extends BoxProps {
  karyawan_id: number;
  children?: any;
}
export default function DetailJadwalKaryawanModalDisclosure({
  karyawan_id,
  children,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useBackOnClose(
    `detail-jadwal-karyawan-modal-${karyawan_id}`,
    isOpen,
    onOpen,
    onClose
  );
  const initialRef = useRef(null);
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/karyawan/detail-karyawan-jadwal/${karyawan_id}`,
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
        cursor={"pointer"}
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
            <DisclosureHeader title={"Detail Jadwal Karyawan"} />
          </ModalHeader>
          <ModalBody overflowY={"auto"}>
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
                  <CContainer flex={1}>
                    <Wrap
                      spacing={responsiveSpacing}
                      mb={responsiveSpacing}
                      align={"center"}
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

                {!loading && (
                  <>
                    {(!data || (data && data.length === 0)) && <NoData />}

                    {(data || (data && data.length > 0)) && (
                      <CContainer
                        overflowY={"auto"}
                        overflowX={"clip"}
                        className="scrollY"
                        borderRadius={12}
                        flex={1}
                        pb={6}
                      >
                        <Wrap
                          spacing={responsiveSpacing}
                          mb={responsiveSpacing}
                          align={"center"}
                        >
                          <Avatar
                            size={"md"}
                            w={"55px"}
                            h={"55px"}
                            src={data.user.foto_profil}
                            name={data.user?.nama}
                          />

                          <VStack align={"stretch"}>
                            <Text fontSize={14} opacity={0.6}>
                              Nama Karyawan
                            </Text>
                            <Text fontWeight={500}>{data.user?.nama}</Text>
                          </VStack>

                          <VStack align={"stretch"}>
                            <Text fontSize={14} opacity={0.6}>
                              Unit Kerja
                            </Text>
                            <Text fontWeight={500}>
                              {data.unit_kerja?.nama_unit}
                            </Text>
                          </VStack>
                        </Wrap>

                        <TabelDetailJadwalKaryawan data={data.list_jadwal} />
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
