import {
  Alert,
  AlertDescription,
  AlertIcon,
  Avatar,
  Box,
  Button,
  ButtonProps,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
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
import { RiExpandUpDownFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import * as yup from "yup";
import { useErrorColor, useLightDarkColor } from "../../constant/colors";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import req from "../../lib/req";
import RequiredForm from "../form/RequiredForm";
import FlexLine from "../independent/FlexLine";
import NoData from "../independent/NoData";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import DetailKaryawanModalDisclosure from "./DetailKaryawanModalDisclosure";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import DateRangePickerModal from "./input/DateRangePickerModal";
import NumberInput from "./input/NumberInput";
import SearchComponent from "./input/SearchComponent";
import StringInput from "./input/StringInput";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";

interface PenyesuaianProps extends ButtonProps {
  riwayat_id?: number;
}

function PenyesuaianGajiButtonModal({
  riwayat_id,
  ...props
}: PenyesuaianProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `penyesuaian-gaji-modal-${riwayat_id}`,
    isOpen,
    onOpen,
    onClose
  );

  const [simpan, setSimpan] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const { userPermissions } = useAuth();
  const editPermissions = isHasPermissions(userPermissions, [16]);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama_detail: "",
      jenis_penyesuaian: undefined as any,
      besaran: undefined as any,
      date_range: undefined as any,
    },
    validationSchema: yup.object().shape({
      nama_detail: yup.string().required("Harus diisi"),
      jenis_penyesuaian: yup.number().required("Harus diisi"),
      besaran: yup.number().required("Harus diisi"),
      date_range: simpan ? yup.object().required("Harus diisi") : yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama_detail: values.nama_detail,
        besaran: values.besaran,
        bulan_mulai:
          values.date_range && formatDate(values.date_range?.from, "short"),
        bulan_selesai:
          values.date_range && formatDate(values.date_range?.to, "short"),
      };
      setLoading(true);
      let url = "";
      if (values.jenis_penyesuaian === 1) {
        url = `/api/rski/dashboard/keuangan/penggajian/detail/${riwayat_id}/create-penambah-gaji`;
      } else {
        url = `/api/rski/dashboard/keuangan/penggajian/detail/${riwayat_id}/create-pengurang-gaji`;
      }

      req
        .post(url, payload)
        .then((r) => {
          if (r.status === 200) {
            backOnClose();
            toast({
              status: "success",
              title: r.data.message,
              isClosable: true,
              position: "bottom-right",
            });
            setRt(!rt);
          }
        })
        .catch((e) => {
          console.log(e);
          toast({
            status: "error",
            title:
              (typeof e?.response?.data?.message === "string" &&
                (e?.response?.data?.message as string)) ||
              "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
            isClosable: true,
            position: "bottom-right",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <>
      <Button
        leftIcon={<Icon as={RiExpandUpDownFill} fontSize={iconSize} />}
        className="btn-ap clicky"
        colorScheme="ap"
        minW={"fit-content"}
        onClick={onOpen}
        pl={5}
        isDisabled={!editPermissions}
        {...props}
      >
        Penyesuaian Gaji
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
          setSimpan(false);
        }}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader
              title={"Penyesuaian Gaji"}
              onClose={() => {
                formik.resetForm();
                setSimpan(false);
              }}
            />
          </ModalHeader>
          <ModalBody>
            <Alert status="warning" mb={responsiveSpacing} alignItems={"start"}>
              <AlertIcon />
              <AlertDescription maxW={"640px !important"}>
                Tambah Pendapatan menambah gaji bruto, memengaruhi PPh 21.
                Tambah Potongan langsung mengurangi Take Home Pay tanpa
                mempengaruhi pajak.
              </AlertDescription>
            </Alert>
            <form
              id="penyesuaianTakeHomePayForm"
              onSubmit={formik.handleSubmit}
            >
              <FormControl mb={4} isInvalid={!!formik.errors.jenis_penyesuaian}>
                <FormLabel>
                  Jenis Penyesuaian
                  <RequiredForm />
                </FormLabel>
                <HStack>
                  <Button
                    w={"100%"}
                    className="btn-outline clicky"
                    colorScheme={
                      formik.values.jenis_penyesuaian === 1 ? "green" : ""
                    }
                    variant={
                      formik.values.jenis_penyesuaian === 1 ? "outline" : ""
                    }
                    onClick={() => {
                      formik.setFieldValue("jenis_penyesuaian", 1);
                    }}
                  >
                    Tambah Pendapatan
                  </Button>

                  <Button
                    w={"100%"}
                    className="btn-outline clicky"
                    colorScheme={
                      formik.values.jenis_penyesuaian === 2 ? "red" : ""
                    }
                    variant={
                      formik.values.jenis_penyesuaian === 2 ? "outline" : ""
                    }
                    onClick={() => {
                      formik.setFieldValue("jenis_penyesuaian", 2);
                    }}
                  >
                    Tambah Potongan
                  </Button>
                </HStack>
                {formik.values.jenis_penyesuaian === 1 && (
                  <FormHelperText>
                    Tambah Pendapatan akan dikenakan perhitungan PPh21
                  </FormHelperText>
                )}
                {formik.values.jenis_penyesuaian === 2 && (
                  <FormHelperText>
                    Tambah Potongan akan mengurangi Take Home Pay
                  </FormHelperText>
                )}
                <FormErrorMessage>
                  {formik.errors.jenis_penyesuaian as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.nama_detail}>
                <FormLabel>
                  Nama Detail (Keterangan)
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="nama_detail"
                  placeholder={
                    formik.values.jenis_penyesuaian === 1
                      ? "Insentif bulan ini"
                      : formik.values.jenis_penyesuaian === 2
                      ? "Potongan ganti rugi"
                      : "Keterangan"
                  }
                  onChangeSetter={(input) => {
                    formik.setFieldValue("nama_detail", input);
                  }}
                  inputValue={formik.values.nama_detail}
                  isDisabled={!formik.values.jenis_penyesuaian}
                />
                <FormErrorMessage>
                  {formik.errors.nama_detail as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.besaran}>
                <FormLabel>
                  Besaran
                  <RequiredForm />
                </FormLabel>
                <NumberInput
                  name="besaran"
                  placeholder="500.000"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("besaran", input);
                  }}
                  inputValue={formik.values.besaran}
                  isDisabled={!formik.values.jenis_penyesuaian}
                />
                <FormErrorMessage>
                  {formik.errors.besaran as string}
                </FormErrorMessage>
              </FormControl>

              <Checkbox
                colorScheme="ap"
                onChange={(e) => {
                  if (!e.target.checked) {
                    formik.setFieldValue("date_range", undefined);
                  }
                  setSimpan(e.target.checked);
                }}
                isChecked={simpan}
                isDisabled={!formik.values.jenis_penyesuaian}
                mt={4}
              >
                <Text mt={"-2.5px"}>Simpan Penyesuaian pada Karyawan Ini</Text>
              </Checkbox>

              {simpan && (
                <>
                  <FormControl my={4} isInvalid={!!formik.errors.date_range}>
                    <FormLabel>
                      Rentang Tanggal
                      <RequiredForm />
                    </FormLabel>
                    <DateRangePickerModal
                      id="penyesuaian-gaji-date-range-modal"
                      name="date_range"
                      onConfirm={(input) => {
                        formik.setFieldValue("date_range", input);
                      }}
                      inputValue={formik.values.date_range}
                      isError={!!formik.errors.date_range}
                    />
                    <FormErrorMessage>
                      {formik.errors.date_range as string}
                    </FormErrorMessage>
                  </FormControl>
                  <Text opacity={0.4} fontSize={"sm"}>
                    Penyesuaian ini akan disimpan dalam sistem dan diterapkan
                    sesuai dengan periode yang telah ditentukan.
                  </Text>
                </>
              )}
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              w={"100%"}
              className="btn-ap clicky"
              colorScheme="ap"
              type="submit"
              form="penyesuaianTakeHomePayForm"
              isLoading={loading}
            >
              Terapkan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

interface Props {
  id?: string;
  riwayat_id?: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  status_riwayat_gaji: any;
}

export default function DetailPenggajianKaryawanModal({
  id,
  riwayat_id,
  isOpen,
  onOpen,
  onClose,
  status_riwayat_gaji,
}: Props) {
  useBackOnClose(
    id || `detail-penggajian-karyawan-modal-${riwayat_id}`,
    isOpen,
    onOpen,
    onClose
  );

  // const dummy = {
  //   pendapatan: {
  //     pendapatan_tetap: [
  //       {
  //         nama_detail: "Gaji Pokok",
  //         besaran: 100000,
  //       },
  //       {
  //         nama_detail: "Tunjangan Jabatan",
  //         besaran: 100000,
  //       },
  //       {
  //         nama_detail: "Tunjangan Fungsional",
  //         besaran: 100000,
  //       },
  //       {
  //         nama_detail: "Tunjangan Khusus",
  //         besaran: 100000,
  //       },
  //       {
  //         nama_detail: "Tunjangan Lainnya",
  //         besaran: 100000,
  //       },
  //     ],
  //     pendapatan_tambahan: [
  //       {
  //         nama_detail: "Uang Lembur",
  //         besaran: 100000,
  //       },
  //       {
  //         nama_detail: "Uang Makan",
  //         besaran: 100000,
  //       },

  //       // dinamis jika ada
  //       {
  //         nama_detail: "Reward BOR",
  //         besaran: 100000,
  //       },
  //       {
  //         nama_detail: "Reward Absensi",
  //         besaran: 100000,
  //       },
  //       {
  //         nama_detail: "THR",
  //         besaran: 100000,
  //       },

  //       // dinamis ambil dari tabel penyesuaian gaji yang potongan
  //       {
  //         nama_detail: "Penyesuaian Gaji (ambil kolom nama_detail)",
  //         besaran: 100000,
  //       },
  //     ],
  //     total_pendapatan: 1000000,
  //   },
  //   potongan: {
  //     potongan_tetap: [
  //       {
  //         nama_detail: "PPh21",
  //         besaran: 100000,
  //       },

  //       // dinamis sesuai master data potongan (contoh nya ada 3 ini)
  //       {
  //         nama_detail: "BPJS Kesehatan",
  //         besaran: 100000,
  //       },
  //       {
  //         nama_detail: "BPJS Ketenagakerjaan",
  //         besaran: 100000,
  //       },
  //       {
  //         nama_detail: "DPLK",
  //         besaran: 100000,
  //       },
  //     ],
  //     potongan_tambahan: [
  //       // dinamis ambil dari tabel penyesuaian gaji yang potongan
  //       {
  //         nama_detail: "Penyesuaian Gaji (ambil kolom nama_detail)",
  //         besaran: 100000,
  //       },

  //       // dinamis ambil dari tabel tagihan potongan
  //       {
  //         nama_detail: "Tagihan Potongan (ambil kolom nama_detail)",
  //         besaran: 100000,
  //       },
  //     ],
  //     total_potongan: 1000000,
  //   },
  // };

  const initialRef = useRef(null);
  const { error, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `api/rski/dashboard/keuangan/penggajian/detail/${riwayat_id}`,
    dependencies: [],
    conditions: !!(isOpen && riwayat_id),
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
                <CContainer flex={1} px={responsiveSpacing}>
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
                      <Skeleton h={"40px"} flex={0} minW={"280px"} />
                    </HStack>

                    <HStack gap={responsiveSpacing} flex={1} align={"stretch"}>
                      <Skeleton flex={1} w={"100%"} h={"auto"} />
                      <Skeleton flex={1} w={"100%"} h={"auto"} />
                    </HStack>

                    <CContainer gap={2}>
                      <Skeleton w={"120px"} ml={"auto"} />
                      <Skeleton w={"200px"} ml={"auto"} />
                    </CContainer>
                  </CContainer>
                </CContainer>
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
                            {data?.kelompok_gaji?.nama_kelompok}
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

                        <PenyesuaianGajiButtonModal
                          riwayat_id={riwayat_id}
                          isDisabled={status_riwayat_gaji?.id === 2}
                        />
                      </HStack>

                      <CContainer
                        gap={responsiveSpacing}
                        overflowY={"auto"}
                        className="scrollY"
                      >
                        <CContainer
                          gap={responsiveSpacing}
                          flex={1}
                          overflowY={"auto"}
                          className="scrollY"
                          px={responsiveSpacing}
                        >
                          <CContainer>
                            <CContainer
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
                                  px={2}
                                >
                                  <HStack px={4} pt={4}>
                                    <Text
                                      fontSize={18}
                                      fontWeight={600}
                                      mb={4}
                                      // color={"green.400"}
                                    >
                                      Pendapatan
                                    </Text>
                                  </HStack>

                                  {/* Pendapatan Tetap */}
                                  <CContainer py={2}>
                                    <Box px={4} mb={2}>
                                      <Text fontWeight={500}>
                                        Pendapatan Tetap
                                      </Text>
                                    </Box>
                                    {data.pendapatan?.pendapatan_tetap?.map(
                                      (item: any, i: number) => {
                                        return (
                                          <HStack
                                            key={i}
                                            justify={"space-between"}
                                            py={2}
                                            pr={4}
                                            pl={8}
                                          >
                                            <Box>
                                              <Highlighter
                                                highlightClassName="hw"
                                                unhighlightClassName="uw opacity-60"
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
                                              {formatNumber(item.besaran) || 0}
                                            </Text>
                                          </HStack>
                                        );
                                      }
                                    )}
                                  </CContainer>

                                  {/* Pendapatan Tambahan */}
                                  <CContainer py={2}>
                                    <Box px={4} mb={2}>
                                      <Text fontWeight={500}>
                                        Pendapatan Tambahan
                                      </Text>
                                    </Box>
                                    {data.pendapatan?.pendapatan_tambahan?.map(
                                      (item: any, i: number) => {
                                        return (
                                          <HStack
                                            key={i}
                                            justify={"space-between"}
                                            py={2}
                                            pr={4}
                                            pl={8}
                                          >
                                            <Box>
                                              <Highlighter
                                                highlightClassName="hw"
                                                unhighlightClassName="uw opacity-60"
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
                                              {formatNumber(item.besaran) || 0}
                                            </Text>
                                          </HStack>
                                        );
                                      }
                                    )}
                                  </CContainer>

                                  {/* Total Pendapatan */}
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
                                        data.pendapatan?.total_pendapatan
                                      ) || 0}
                                    </Text>
                                  </HStack>
                                </CContainer>

                                <CContainer
                                  border={"1px solid var(--divider3)"}
                                  borderRadius={12}
                                  overflow={"clip"}
                                  px={2}
                                >
                                  <HStack px={4} pt={4}>
                                    <Text
                                      fontSize={18}
                                      fontWeight={600}
                                      mb={4}
                                      // color={errorColor}
                                    >
                                      Potongan
                                    </Text>
                                  </HStack>

                                  {/* Potongan Tetap */}
                                  <CContainer py={2}>
                                    <Box px={4} mb={2}>
                                      <Text fontWeight={500}>
                                        Potongan Tetap
                                      </Text>
                                    </Box>
                                    {data.potongan?.potongan_tetap?.map(
                                      (item: any, i: number) => {
                                        const bpjs =
                                          item?.nama_detail ===
                                          "BPJS Kesehatan";
                                        return (
                                          <>
                                            <HStack
                                              key={i}
                                              justify={"space-between"}
                                              py={2}
                                              pr={4}
                                              pl={8}
                                            >
                                              <Box>
                                                <Highlighter
                                                  highlightClassName="hw"
                                                  unhighlightClassName="uw opacity-60"
                                                  searchWords={searchQuery}
                                                  autoEscape={true}
                                                  textToHighlight={
                                                    item.nama_detail
                                                  }
                                                />
                                              </Box>
                                              {!bpjs && (
                                                <>
                                                  <FlexLine />
                                                  <Text
                                                    fontWeight={500}
                                                    textAlign={"right"}
                                                  >
                                                    Rp{" "}
                                                    {formatNumber(
                                                      item.besaran
                                                    ) || 0}
                                                  </Text>
                                                </>
                                              )}
                                            </HStack>

                                            {bpjs &&
                                              item?.keluarga_terkena_potongan?.map(
                                                (anggota: any, i: number) => (
                                                  <HStack
                                                    key={i}
                                                    justify={"space-between"}
                                                    py={2}
                                                    pr={4}
                                                    pl={12}
                                                  >
                                                    <Box>
                                                      <Highlighter
                                                        highlightClassName="hw"
                                                        unhighlightClassName="uw opacity-60"
                                                        searchWords={
                                                          searchQuery
                                                        }
                                                        autoEscape={true}
                                                        textToHighlight={
                                                          anggota?.hubungan
                                                        }
                                                      />
                                                    </Box>
                                                    <FlexLine />
                                                    <Text
                                                      fontWeight={500}
                                                      textAlign={"right"}
                                                    >
                                                      Rp{" "}
                                                      {formatNumber(
                                                        anggota?.besaran
                                                      ) || 0}
                                                    </Text>
                                                  </HStack>
                                                )
                                              )}
                                          </>
                                        );
                                      }
                                    )}
                                  </CContainer>

                                  {/* Potongan Tambahan */}
                                  <CContainer py={2}>
                                    <Box px={4} mb={2}>
                                      <Text fontWeight={500}>
                                        Potongan Tambahan
                                      </Text>
                                    </Box>
                                    {data.potongan?.potongan_tambahan?.map(
                                      (item: any, i: number) => {
                                        return (
                                          <HStack
                                            key={i}
                                            justify={"space-between"}
                                            py={2}
                                            pr={4}
                                            pl={8}
                                          >
                                            <Box>
                                              <Highlighter
                                                highlightClassName="hw"
                                                unhighlightClassName="uw opacity-60"
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
                                              {formatNumber(item.besaran) || 0}
                                            </Text>
                                          </HStack>
                                        );
                                      }
                                    )}
                                  </CContainer>

                                  {/* Total Potongan */}
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
                                        data.potongan?.total_potongan
                                      ) || 0}
                                    </Text>
                                  </HStack>
                                </CContainer>
                              </SimpleGrid>

                              <CContainer
                                mt={1}
                                justify={"space-between"}
                                borderRadius={12}
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
                            </CContainer>
                          </CContainer>
                        </CContainer>
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
