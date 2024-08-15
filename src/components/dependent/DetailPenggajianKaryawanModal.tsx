import {
  Avatar,
  Box,
  Button,
  HStack,
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
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useErrorColor, useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatNumber from "../../lib/formatNumber";
import ComponentSpinner from "../independent/ComponentSpinner";
import FlexLine from "../independent/FlexLine";
import NoData from "../independent/NoData";
import CContainer from "../wrapper/CContainer";
import DetailKaryawanModalDisclosure from "./DetailKaryawanModalDisclosure";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import SearchComponent from "./input/SearchComponent";

interface Props {
  riwayat_id: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function DetailPenggajianKaryawanModal({
  riwayat_id,
  isOpen,
  onOpen,
  onClose,
}: Props) {
  useBackOnClose(
    `detail-penggajian-karyawan-modal-${riwayat_id}`,
    isOpen,
    onOpen,
    onClose
  );
  const initialRef = useRef(null);

  const { error, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `api/rski/dashboard/keuangan/penggajian/detail/${riwayat_id}`,
    dependencies: [],
  });
  const [search, setSearch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string[]>([]);

  useEffect(() => {
    const words = search.split(" ").filter((word) => word.length > 0);
    const modifiedWords = words.reduce((acc: string[], word) => {
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

  const totalPendapatan = (detailGaji: any[]): number => {
    let total: number = 0;

    detailGaji.forEach((item) => {
      if (item.kategori_gaji?.id === 1 || item.kategori_gaji?.id === 2) {
        total += item?.besaran;
      }
    });

    return total;
  };

  const totalPotongan = (detailGaji: any[]): number => {
    let total: number = 0;

    detailGaji.forEach((item) => {
      if (item.kategori_gaji?.id === 3) {
        total += item?.besaran;
      }
    });

    return total;
  };

  // SX
  const lightDarkColor = useLightDarkColor();
  const errorColor = useErrorColor();

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
          <DisclosureHeader title={"Detail Penggajian Karyawan"} />
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
                      h={"calc(100vh - 70px)"}
                      overflowY={"auto"}
                      className="scrollY"
                      gap={responsiveSpacing}
                      mb={responsiveSpacing}
                    >
                      <Wrap
                        spacing={responsiveSpacing}
                        align={"center"}
                        px={responsiveSpacing}
                      >
                        <DetailKaryawanModalDisclosure user_id={data.user.id}>
                          <Avatar
                            size={"md"}
                            w={"55px"}
                            h={"55px"}
                            src={data.user.foto_profil}
                            name={data.user.nama}
                          />
                        </DetailKaryawanModalDisclosure>

                        <VStack align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Nama Karyawan
                          </Text>
                          <Text fontWeight={500}>{data.user.nama}</Text>
                        </VStack>

                        <VStack align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Kelompok Gaji
                          </Text>
                          <Text fontWeight={500}>
                            {data.kelompok_gaji.nama_kelompok}
                          </Text>
                        </VStack>

                        <VStack align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Kode PTKP
                          </Text>
                          <Text fontWeight={500}>{data.ptkp.kode_ptkp} </Text>
                        </VStack>
                      </Wrap>

                      <HStack
                        pr={[0, null, 5]}
                        pl={[0, null, 4]}
                        position={"sticky"}
                        top={"0"}
                        bg={lightDarkColor}
                        zIndex={2}
                      >
                        <SearchComponent
                          name="search"
                          onChangeSetter={(input) => {
                            setSearch(input);
                          }}
                          inputValue={search}
                        />

                        <Button className="btn-ap clicky" colorScheme="ap">
                          Penyesuaian Gaji
                        </Button>
                      </HStack>

                      <CContainer
                        gap={responsiveSpacing}
                        overflowY={"auto"}
                        className="scrollY"
                      >
                        <VStack
                          align={"stretch"}
                          gap={responsiveSpacing}
                          flex={1}
                          overflowY={"auto"}
                          className="scrollY"
                          px={responsiveSpacing}
                        >
                          <VStack align={"stretch"} gap={0}>
                            <VStack
                              align={"stretch"}
                              gap={4}
                              // ref={dataPresensiRef}
                            >
                              <SimpleGrid
                                columns={[1, 2]}
                                gap={responsiveSpacing}
                              >
                                <CContainer
                                  border={"1px solid var(--divider3)"}
                                  borderRadius={12}
                                  overflow={"clip"}
                                >
                                  <HStack px={4} pt={4}>
                                    <Text
                                      fontSize={18}
                                      fontWeight={600}
                                      // color={"green.400"}
                                    >
                                      Pendapatan
                                    </Text>
                                  </HStack>

                                  <CContainer py={2}>
                                    {data.detail_gaji?.map(
                                      (item: any, i: number) => {
                                        const ok =
                                          item?.kategori_gaji?.id === 1 ||
                                          item?.kategori_gaji?.id === 2;

                                        return (
                                          ok && (
                                            <HStack
                                              key={i}
                                              justify={"space-between"}
                                              py={2}
                                              px={4}
                                            >
                                              <Box>
                                                <Highlighter
                                                  highlightClassName="hw"
                                                  unhighlightClassName="uw"
                                                  searchWords={searchQuery}
                                                  autoEscape={true}
                                                  textToHighlight={
                                                    item.nama_detail
                                                  }
                                                />
                                              </Box>
                                              <FlexLine />
                                              <Text
                                                fontWeight={500}
                                                textAlign={"right"}
                                              >
                                                Rp{" "}
                                                {formatNumber(item.besaran) ||
                                                  0}
                                              </Text>
                                            </HStack>
                                          )
                                        );
                                      }
                                    )}
                                  </CContainer>

                                  <HStack
                                    mt={"auto"}
                                    justify={"space-between"}
                                    // bg={"var(--p500a5)"}
                                    color={"green.400"}
                                    p={4}
                                  >
                                    <Box>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Total Pendapatan"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={600} textAlign={"right"}>
                                      Rp{" "}
                                      {formatNumber(
                                        totalPendapatan(data.detail_gaji)
                                      ) || 0}
                                    </Text>
                                  </HStack>
                                </CContainer>

                                <CContainer
                                  border={"1px solid var(--divider3)"}
                                  borderRadius={12}
                                  overflow={"clip"}
                                >
                                  <HStack px={4} pt={4}>
                                    <Text
                                      fontSize={18}
                                      fontWeight={600}
                                      // color={errorColor}
                                    >
                                      Potongan
                                    </Text>
                                  </HStack>

                                  <CContainer py={2}>
                                    {data.detail_gaji?.map(
                                      (item: any, i: number) => {
                                        const ok =
                                          item?.kategori_gaji?.id === 3;

                                        return (
                                          ok && (
                                            <HStack
                                              key={i}
                                              justify={"space-between"}
                                              py={2}
                                              px={4}
                                            >
                                              <Box>
                                                <Highlighter
                                                  highlightClassName="hw"
                                                  unhighlightClassName="uw"
                                                  searchWords={searchQuery}
                                                  autoEscape={true}
                                                  textToHighlight={
                                                    item.nama_detail
                                                  }
                                                />
                                              </Box>
                                              <FlexLine />
                                              <Text
                                                fontWeight={500}
                                                textAlign={"right"}
                                              >
                                                Rp{" "}
                                                {formatNumber(item.besaran) ||
                                                  0}
                                              </Text>
                                            </HStack>
                                          )
                                        );
                                      }
                                    )}
                                  </CContainer>

                                  <HStack
                                    mt={"auto"}
                                    justify={"space-between"}
                                    // bg={"var(--p500a5)"}
                                    color={errorColor}
                                    p={4}
                                  >
                                    <Box>
                                      <Highlighter
                                        highlightClassName="hw"
                                        unhighlightClassName="uw"
                                        searchWords={searchQuery}
                                        autoEscape={true}
                                        textToHighlight={"Total Potongan"}
                                      />
                                    </Box>
                                    <FlexLine />
                                    <Text fontWeight={600} textAlign={"right"}>
                                      Rp{" "}
                                      {formatNumber(
                                        totalPotongan(data.detail_gaji)
                                      ) || 0}
                                    </Text>
                                  </HStack>
                                </CContainer>
                              </SimpleGrid>

                              <CContainer
                                mt={1}
                                ml={"auto"}
                                justify={"space-between"}
                                p={4}
                                px={5}
                                borderRadius={12}
                                w={"fit-content"}
                              >
                                <Text
                                  fontSize={18}
                                  fontWeight={600}
                                  textAlign={"right"}
                                >
                                  Take Home Pay
                                </Text>

                                <FlexLine />

                                <Text
                                  fontSize={28}
                                  fontWeight={600}
                                  textAlign={"right"}
                                >
                                  Rp {formatNumber(data.take_home_pay)}
                                </Text>
                              </CContainer>
                            </VStack>
                          </VStack>
                        </VStack>
                      </CContainer>
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
