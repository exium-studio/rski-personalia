import {
  Avatar,
  Box,
  BoxProps,
  Center,
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
import TabelDetailPenilaianKaryawan from "./TabelDetailPenilaianKaryawan";

interface Props extends BoxProps {
  karyawan_id: number;
  children?: any;
}
export default function DetailPenilaianKaryawanModalDisclosure({
  karyawan_id,
  children,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useBackOnClose(
    `penilaian-karyawan-modal-${karyawan_id}`,
    isOpen,
    onOpen,
    onClose
  );
  const initialRef = useRef(null);

  // const loading = true;
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/karyawan/detail-karyawan-feedback-penilaian/${karyawan_id}`,
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
            <DisclosureHeader title={"Penilaian Karyawan"} />
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

                      <Skeleton w={"140px"} h={"48px"} ml={"auto"} />
                    </Wrap>

                    <CContainer
                      flex={1}
                      gap={responsiveSpacing}
                      overflowY={"auto"}
                      className="scrollY"
                      px={responsiveSpacing}
                    >
                      <Skeleton w={"100%"} flex={1} />
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
                              Jabatan
                            </Text>
                            <Text fontWeight={500}>
                              {data.jabatan?.nama_jabatan}
                            </Text>
                          </VStack>

                          {/* <VerifikasiButtonModal data={data} /> */}
                        </Wrap>

                        <TabelDetailPenilaianKaryawan
                          data={data?.list_penilaian}
                        />

                        {/* <SearchComponent
                          name="search"
                          onChangeSetter={(input) => {
                            setSearch(input);
                          }}
                          inputValue={search}
                          mb={responsiveSpacing}
                        />

                        {fd?.length === 0 && <NotFound />}

                        {fd?.length > 0 && (
                          <SimpleGrid
                            columns={[2, 3, null, 4, 5]}
                            gap={3}
                            borderRadius={12}
                          >
                            {fd.map((dokumen: any, i: number) => (
                              <DokumenFileItem
                                key={i}
                                data={dokumen}
                                bg={"var(--divider)"}
                              />
                            ))}
                          </SimpleGrid>
                        )} */}
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
