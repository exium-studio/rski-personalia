import {
  Box,
  Button,
  ButtonProps,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { RiDeleteBinLine, RiSendPlaneFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useBackOnClose from "../../hooks/useBackOnClose";
import useCountdown from "../../hooks/useCountdown";
import useDataState from "../../hooks/useDataState";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import isHasPermissions from "../../lib/isHasPermissions";
import req from "../../lib/req";
import NoData from "../independent/NoData";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import StatusPublikasiPenggajian from "./StatusPublikasiPenggajian";
import TabelDetailPenggajian from "./TabelDetailPenggajian";

interface PublikasiButtonProps extends ButtonProps {
  penggajian_id: number;
  periode: string;
}
const PublikasiButtonModal = ({
  penggajian_id,
  periode,
  ...props
}: PublikasiButtonProps) => {
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
          toast({
            status: "success",
            title: r.data.message,
            position: "bottom-right",
            isClosable: true,
          });
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
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `publikasi-penggajian-modal-${penggajian_id}`,
    isOpen,
    onOpen,
    onClose
  );

  return (
    <>
      <Button onClick={onOpen} isLoading={loading} {...props}>
        Publikasi
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
            <DisclosureHeader
              title={`Publikasi ${formatDate(periode, "periode")}`}
            />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.6}>
              Apakah anda yakin akan publikasi penggajian perode{" "}
              {formatDate(periode, "periode")}
            </Text>
          </ModalBody>
          <ModalFooter>
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
              onClick={publikasiPenggajian}
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

const DeletePenggajian = ({ penggajian_id, status_penggajian }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("delete-penggajian", isOpen, onOpen, onClose);

  const { userPermissions } = useAuth();
  const deletePermissions = isHasPermissions(userPermissions, [15]);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const { countDown } = useCountdown({ initialValue: 5, conditions: isOpen });

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { bor: false },
    validationSchema: yup.object().shape({ bor: yup.boolean() }),
    onSubmit: (values, { resetForm }) => {
      // console.log(values);

      setLoading(true);

      const payload = {
        riwayat_penggajian_id: penggajian_id,
      };

      req
        .post("/api/rski/dashboard/keuangan/delete-gaji", payload)
        .then((r) => {
          if (r.status === 200) {
            setRt(!rt);
            backOnClose();
            backOnClose();
            toast({
              status: "success",
              title: r?.data?.message,
              position: "bottom-right",
              isClosable: true,
            });
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
            position: "bottom-right",
            isClosable: true,
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
        leftIcon={<Icon as={RiDeleteBinLine} fontSize={iconSize} />}
        colorScheme="red"
        variant={"outline"}
        size={"lg"}
        onClick={onOpen}
        className="clicky"
        isLoading={loading}
        isDisabled={!deletePermissions || status_penggajian?.id === 2}
      >
        Delete Penggajian
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
            <DisclosureHeader title={"Penyesuaian Penggajian"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.6}>
              Apakah anda yakin akan menghapus data penggajian ini?
            </Text>
            {/* <Alert status="warning" mb={responsiveSpacing} alignItems={"start"}>
              <AlertIcon />
              <AlertDescription maxW={"640px !important"}>
                Jika terjadi penyesuaian penggajian, maka data penggajian akan
                dihapus dan dihitung ulang.
              </AlertDescription>
            </Alert>
            <FormControl mt={2}>
              <Checkbox
                colorScheme="ap"
                onChange={(e) => {
                  formik.setFieldValue("bor", e.target.checked);
                }}
              >
                <Text mt={"-2.5px"}>Sertakan BOR</Text>
              </Checkbox>
              <FormHelperText>
                Centang Sertakan BOR jika penggajian ini menyertakan BOR
              </FormHelperText>
            </FormControl> */}
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              w={"100%"}
              onClick={backOnClose}
              className="btn-solid clicky"
            >
              Tidak
            </Button>
            <Button
              type="submit"
              onClick={() => {
                formik.submitForm();
              }}
              w={"100%"}
              colorScheme="red"
              className="clicky"
              isLoading={loading}
              isDisabled={countDown !== 0}
            >
              {countDown !== 0 ? `Tunggu ${countDown} detik` : "Ya"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

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
                    h={"55px"}
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

                    <VStack align={"stretch"}>
                      <Skeleton w={"100px"} h={"16px"} />
                      <Skeleton w={"100px"} h={"16px"} />
                    </VStack>

                    <VStack align={"stretch"}>
                      <Skeleton w={"100px"} h={"16px"} />
                      <Skeleton w={"100px"} h={"16px"} />
                    </VStack>

                    <Skeleton w={"120px"} ml={"auto"} />

                    <Skeleton w={"120px"} />
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

                        <VStack align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Dibuat Oleh
                          </Text>
                          <Text>{data?.data_riwayat?.created_by?.nama}</Text>
                        </VStack>

                        <VStack align={"stretch"}>
                          <Text fontSize={14} opacity={0.6}>
                            Dipublikasi Oleh
                          </Text>
                          <Text>
                            {data?.data_riwayat?.status_riwayat_gaji?.id ===
                              1 && !data?.data_riwayat?.submitted_by
                              ? "-"
                              : data?.data_riwayat?.submitted_by?.nama}
                          </Text>
                        </VStack>

                        <HStack ml={"auto"}>
                          <DeletePenggajian
                            penggajian_id={penggajian_id}
                            status_penggajian={
                              data.data_riwayat?.status_riwayat_gaji
                            }
                            isDisabled={
                              data.data_riwayat.status_riwayat_gaji.id === 2
                            }
                          />

                          <PublikasiButtonModal
                            penggajian_id={penggajian_id}
                            periode={data.data_riwayat?.periode}
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
                        </HStack>
                      </Wrap>

                      <TabelDetailPenggajian
                        data={data}
                        status_riwayat_gaji={
                          data?.data_riwayat?.status_riwayat_gaji
                        }
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
  );
}
