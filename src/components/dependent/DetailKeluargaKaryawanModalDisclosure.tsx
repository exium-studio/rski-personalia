import {
  Avatar,
  Badge,
  Box,
  BoxProps,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
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
  Tooltip,
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
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import DisclosureHeader from "./DisclosureHeader";
import Textarea from "./input/Textarea";
import Retry from "./Retry";
import TabelDetailKeluargaKaryawan from "./TabelDetailKeluargaKaryawan";

interface VerifikasiProps {
  data: any;
}

const VerifikasiButtonModal = ({ data }: VerifikasiProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `verifikasi-keluarga-karyawan-${data.id}`,
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
        payload = payload1;
      } else {
        payload = payload2;
      }
      req
        .post(
          `/api/rski/dashboard/karyawan/detail-karyawan-keluarga/${data.user.data_karyawan_id}/verifikasi`,
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
              !editPermission ||
              data?.status_keluarga?.status === "Diverifikasi"
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
                <FormLabel>
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
export default function DetailKeluargaKaryawanModalDisclosure({
  karyawan_id,
  children,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useBackOnClose(
    `detail-keluarga-karyawan-modal-${karyawan_id}`,
    isOpen,
    onOpen,
    onClose
  );
  const initialRef = useRef(null);
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/karyawan/detail-karyawan-keluarga/${karyawan_id}`,
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
            <DisclosureHeader title={"Detail Keluarga Karyawan"} />
          </ModalHeader>
          <ModalBody>
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

                      <VStack align={"stretch"}>
                        <Skeleton w={"100px"} h={"16px"} />
                        <Skeleton w={"100px"} h={"16px"} />
                      </VStack>

                      <VStack align={"stretch"}>
                        <Skeleton w={"100px"} h={"16px"} />
                        <Skeleton w={"100px"} h={"16px"} />
                      </VStack>

                      <Skeleton h={"50px"} w={"100px"} ml={"auto"} />
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
                            name={data.user.nama}
                          />

                          <VStack align={"stretch"}>
                            <Text fontSize={14} opacity={0.6}>
                              Nama Karyawan
                            </Text>
                            <Text fontWeight={500}>{data.user.nama}</Text>
                          </VStack>

                          <VStack align={"stretch"}>
                            <Text fontSize={14} opacity={0.6}>
                              Jumlah Keluarga
                            </Text>
                            <Text fontWeight={500}>
                              {data.jumlah_keluarga || 0}
                            </Text>
                          </VStack>

                          <VStack align={"stretch"}>
                            <Text fontSize={14} opacity={0.6}>
                              Status Verifikasi
                            </Text>
                            <Text fontWeight={500}>
                              <Tooltip label={data?.status_keluarga?.alasan}>
                                <Badge
                                  colorScheme={
                                    data?.status_keluarga?.status ===
                                    "Diverifikasi"
                                      ? "green"
                                      : data?.status_keluarga?.status ===
                                        "Menunggu"
                                      ? "orange"
                                      : "red"
                                  }
                                  borderRadius={"full"}
                                >
                                  {data?.status_keluarga?.status}
                                </Badge>
                              </Tooltip>
                            </Text>
                          </VStack>

                          <VStack align={"stretch"}>
                            <Text fontSize={14} opacity={0.6}>
                              Terakhir Diverifikasi
                            </Text>
                            <Text fontWeight={500}>
                              {formatDate(
                                data?.status_keluarga?.terakhir_diperbarui
                              )}
                            </Text>
                          </VStack>

                          <VerifikasiButtonModal data={data} />
                        </Wrap>

                        <TabelDetailKeluargaKaryawan
                          idKaryawan={data.user.data_karyawan_id}
                          data={data.data_keluarga}
                        />
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
