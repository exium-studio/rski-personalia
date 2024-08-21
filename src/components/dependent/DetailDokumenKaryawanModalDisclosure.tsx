import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Center,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { RiVerifiedBadgeFill } from "@remixicon/react";
import { useRef, useState } from "react";
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
import useRenderTrigger from "../../hooks/useRenderTrigger";
import req from "../../lib/req";

interface VerifikasiProps {
  data: any;
}

const VerifikasiButtonModal = ({ data }: VerifikasiProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `verifikasi-dokumen-karyawan-${data.id}`,
    isOpen,
    onOpen,
    onClose
  );

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  function verifikasiDokumen() {
    setLoading(true);

    req
      .post(
        `/api/rski/dashboard/karyawan/detail-karyawan-dokumen/${data.user.data_karyawan_id}/verifikasi`
      )
      .then((r) => {
        if (r.status === 200) {
          toast({
            status: "success",
            title: r.data.message,
            position: "bottom-right",
            isClosable: true,
          });
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

    //TODO api verifikasi dokumen
  }

  return (
    <>
      <Button
        ml={"auto"}
        size={"lg"}
        colorScheme="ap"
        className="btn-ap clicky"
        leftIcon={<Icon as={RiVerifiedBadgeFill} fontSize={iconSize} />}
        pl={5}
        isDisabled={data.status_verifikasi_berkas}
        onClick={onOpen}
      >
        Verifikasi
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Verfikasi Dokumen"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.6}>
              Apakah anda yakin untuk verifikasi dokumen karyawan ini?
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              onClick={backOnClose}
              isDisabled={loading}
            >
              Tidak
            </Button>
            <Button
              w={"100%"}
              className="btn-ap clicky"
              colorScheme="ap"
              onClick={verifikasiDokumen}
              isLoading={loading}
            >
              Ya
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

interface Props extends BoxProps {
  karyawan_id: number;
  children?: any;
}
export default function DetailDokumenKaryawanModalDisclosure({
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

  // const loading = true;
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
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
                  <CContainer
                    flex={1}
                    overflowY={"auto"}
                    pb={responsiveSpacing}
                  >
                    <Wrap
                      spacing={responsiveSpacing}
                      mb={8}
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
                        {Array.from({ length: 12 }).map((_, i) => (
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
                          mb={8}
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

                          <VerifikasiButtonModal data={data} />
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
