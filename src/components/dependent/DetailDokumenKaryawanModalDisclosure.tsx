import {
  Alert,
  AlertDescription,
  AlertIcon,
  Avatar,
  Box,
  BoxProps,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import isHasPermissions from "../../lib/isHasPermissions";
import req from "../../lib/req";
import RequiredForm from "../form/RequiredForm";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import DisclosureHeader from "./DisclosureHeader";
import DokumenFileItem from "./DokumenFileItem";
import SearchComponent from "./input/SearchComponent";
import Textarea from "./input/Textarea";
import Retry from "./Retry";

interface VerifikasiProps {
  data: any;
  selectedDokumen: number[];
}

const VerifikasiButtonModal = ({ data, selectedDokumen }: VerifikasiProps) => {
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

  const [verifikasi, setVerifikasi] = useState<number | undefined>(undefined);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      verifikasi: undefined as number | undefined,
      alasan: "",
    },
    validationSchema: yup.object().shape({
      verifikasi: yup.number().required("Harus diisi"),
      alasan:
        verifikasi === 0 ? yup.string().required("Harus diisi") : yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);

      let payload;

      const payload1 = {
        verifikasi_disetujui: 1,
      };
      const payload2 = {
        verifikasi_ditolak: 1,
        alasan: values.alasan,
      };
      if (values.verifikasi === 1) {
        payload = { berkas_id: selectedDokumen, ...payload1 };
      } else {
        payload = { berkas_id: selectedDokumen, ...payload2 };
      }

      req
        .post(
          `/api/rski/dashboard/karyawan/detail-karyawan-dokumen/${data.id}/verifikasi`,
          payload
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
              e.response.data.message ||
              "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
            position: "bottom-right",
            isClosable: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [49]);

  return (
    <>
      <Box ml={"auto"}>
        <PermissionTooltip permission={editPermission}>
          <Button
            size={"lg"}
            colorScheme="ap"
            className="btn-ap clicky"
            leftIcon={<Icon as={RiVerifiedBadgeFill} fontSize={iconSize} />}
            pl={5}
            isDisabled={
              !editPermission || data?.status_berkas?.status === "Diverifikasi"
            }
            onClick={onOpen}
          >
            Verifikasi
          </Button>
        </PermissionTooltip>
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
        }}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader
              title={"Verifikasi Dokumen"}
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="verifikasiDokumenForm" onSubmit={formik.handleSubmit}>
              <FormControl isInvalid={!!formik.errors.verifikasi}>
                <FormLabel>
                  Verifikasi
                  <RequiredForm />
                </FormLabel>
                <SimpleGrid columns={[1, 2]} gap={2}>
                  <Button
                    w={"100%"}
                    className="btn-outline clicky"
                    colorScheme={formik.values.verifikasi === 1 ? "green" : ""}
                    variant={formik.values.verifikasi === 1 ? "outline" : ""}
                    onClick={() => {
                      formik.setFieldValue("verifikasi", 1);
                      setVerifikasi(1);
                    }}
                  >
                    Disetujui
                  </Button>
                  <Button
                    w={"100%"}
                    className="btn-outline clicky"
                    colorScheme={formik.values.verifikasi === 0 ? "red" : ""}
                    variant={formik.values.verifikasi === 0 ? "outline" : ""}
                    onClick={() => {
                      formik.setFieldValue("verifikasi", 0);
                      setVerifikasi(0);
                    }}
                  >
                    Ditolak
                  </Button>
                </SimpleGrid>
                <FormErrorMessage>
                  {formik.errors.verifikasi as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={!!formik.errors.alasan}>
                <FormLabel opacity={formik.values.verifikasi !== 0 ? 0.4 : 1}>
                  Alasan
                  <RequiredForm />
                </FormLabel>
                <Textarea
                  name="alasan"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("alasan", input);
                  }}
                  inputValue={formik.values.alasan}
                  isDisabled={formik.values.verifikasi !== 0}
                />
                <FormErrorMessage>
                  {formik.errors.alasan as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              w={"100%"}
              className="btn-ap clicky"
              colorScheme="ap"
              isLoading={loading}
              type="submit"
              form="verifikasiDokumenForm"
            >
              Konfirmasi
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

  // States
  // const loading = true;
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/karyawan/detail-karyawan-dokumen/${karyawan_id}`,
    dependencies: [],
    conditions: !!(isOpen && karyawan_id),
  });
  const [search, setSearch] = useState("");
  const fd = data?.data_dokumen?.filter((item: any) => {
    const searchTerm = search?.toLowerCase();

    const matchesSearchTerm = item.nama.toLowerCase().includes(searchTerm);
    const matchesSearchTerm2 = item.nama_file
      .toLowerCase()
      .includes(searchTerm);

    return matchesSearchTerm || matchesSearchTerm2;
  });
  const [selectedDokumen, setSelectedDokumen] = useState<number[]>([]);

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
                          <>
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

                            {/* <VStack align={"stretch"}>
                              <Text fontSize={14} opacity={0.6}>
                                Status Verifikasi
                              </Text>
                              <Text fontWeight={500}>
                                <Tooltip label={data?.alasan}>
                                  <Badge
                                    colorScheme={
                                      data?.status_berkas?.status ===
                                      "Diverifikasi"
                                        ? "green"
                                        : data?.status_berkas?.status ===
                                          "Menunggu"
                                        ? "orange"
                                        : "red"
                                    }
                                    borderRadius={"full"}
                                  >
                                    {data?.status_berkas?.status}
                                  </Badge>
                                </Tooltip>
                              </Text>
                            </VStack> */}

                            <VStack align={"stretch"}>
                              <Text fontSize={14} opacity={0.6}>
                                Terakhir Diverifikasi
                              </Text>
                              <Text fontWeight={500}>
                                {formatDate(
                                  data?.status_berkas?.terakhir_diperbarui
                                )}
                              </Text>
                            </VStack>
                          </>

                          <VerifikasiButtonModal
                            data={data}
                            selectedDokumen={selectedDokumen}
                          />
                        </Wrap>

                        <SearchComponent
                          name="search"
                          onChangeSetter={(input) => {
                            setSearch(input);
                          }}
                          inputValue={search}
                          mb={responsiveSpacing}
                        />

                        {fd?.length === 0 && <NotFound />}

                        {fd?.length > 0 && (
                          <>
                            <Alert
                              status="info"
                              mb={responsiveSpacing}
                              alignItems={"start"}
                              flexShrink={0}
                            >
                              <AlertIcon />
                              <AlertDescription maxW={"100% !important"}>
                                Arahkan mouse pada item dokumen dan cheklist
                                dokumen yang ingin diverifikasi/ditolak
                              </AlertDescription>
                            </Alert>

                            <SimpleGrid
                              columns={[2, 3, null, 4, 5]}
                              gap={3}
                              borderRadius={12}
                            >
                              {fd.map((dokumen: any, i: number) => (
                                <DokumenFileItem
                                  key={i}
                                  data={dokumen}
                                  selectedDokumen={selectedDokumen}
                                  setSelectedDokumen={setSelectedDokumen}
                                  bg={"var(--divider)"}
                                />
                              ))}
                            </SimpleGrid>
                          </>
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
