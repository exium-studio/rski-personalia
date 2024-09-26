import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ButtonProps,
  Center,
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
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import req from "../../lib/req";
import ComponentSpinner from "../independent/ComponentSpinner";
import FlexLine from "../independent/FlexLine";
import NotFound from "../independent/NotFound";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import StatusKaryawanBadge from "./StatusKaryawanBadge";
import { RiStarFill } from "@remixicon/react";
import NoData from "../independent/NoData";

interface ListPertanyaanModalProps extends ButtonProps {
  user_id: number;
  jenisPenilaian: any;
}

const ListPertanyaanModal = ({
  user_id,
  jenisPenilaian,
  ...props
}: ListPertanyaanModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`pertanyaan-modal-${user_id}`, isOpen, onOpen, onClose);

  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/perusahaan/jenis-penilaian/${jenisPenilaian?.id}`,
    conditions: user_id && isOpen && jenisPenilaian,
    dependencies: [user_id, jenisPenilaian, isOpen],
  });

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      answers: [] as any[],
    },
    validationSchema: yup.object().shape({
      answers: yup.array().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoadingSubmit(true);

      const pj = data?.list_pertanyaan?.map((p: any, i: number) => ({
        pertanyaan: p.pertanyaan,
        jawaban: values.answers[i],
      }));

      const payload = {
        jenis_penilaian_id: jenisPenilaian?.id,
        user_dinilai: user_id,
        pertanyaan_jawaban: JSON.stringify(pj),
        total_pertanyaan: data?.jumlah_pertanyaan,
        rata_rata: countRange(values.answers),
      };

      req
        .post(`/api/rski/dashboard/perusahaan/penilaian`, payload)
        .then((r) => {
          if (r.status === 201) {
            toast({
              status: "success",
              title: r?.data?.message,
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
              (typeof e?.response?.data?.message === "string" &&
                (e?.response?.data?.message as string)) ||
              "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
            position: "bottom-right",
            isClosable: true,
          });
        })
        .finally(() => {
          setLoadingSubmit(false);
        });
    },
  });

  function handleNilai(index: number, nilai: number) {
    if (nilai) {
      const newPenilaian = [...formik.values.answers];
      newPenilaian[index] = nilai;
      formik.setFieldValue("answers", newPenilaian);
    }
  }

  const isAnsweredAll = (answers: any[], jumlahPertanyaan: number): boolean => {
    for (let i = 0; i < jumlahPertanyaan; i++) {
      if (!answers[i]) {
        return false;
      }
    }
    return true;
  };

  const countRange = (answers: number[]): number => {
    if (answers.length === 0) return 0;

    const sum = answers.reduce((acc, current) => acc + current, 0);
    const average = sum / answers.length;

    return average;
  };

  return (
    <>
      <Button
        w={"100%"}
        className="btn-ap clicky"
        colorScheme="ap"
        onClick={onOpen}
        {...props}
      >
        Konfirmasi & Lanjutkan
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
            <DisclosureHeader title={"Penilaian"} />
          </ModalHeader>
          <ModalBody pb={6}>
            <CContainer gap={4}>
              {loading && <ComponentSpinner />}

              {!loading && (
                <>
                  {error && (
                    <>
                      {notFound && <NotFound />}

                      {!notFound && (
                        <Center>
                          <Retry loading={loading} retry={retry} />
                        </Center>
                      )}
                    </>
                  )}

                  {!error && (
                    <>
                      {data?.list_pertanyaan?.length === 0 && (
                        <NoData minH={"300px"} />
                      )}

                      {data?.list_pertanyaan?.length > 0 &&
                        data?.list_pertanyaan?.map(
                          (pertanyaan: any, i: number) => (
                            <HStack key={i} align={"start"}>
                              <Text mr={1} w={"30px"}>
                                {i + 1}.
                              </Text>
                              <CContainer gap={1}>
                                <HStack align={"start"}>
                                  <Text>{pertanyaan.pertanyaan}</Text>
                                </HStack>

                                <HStack justify={"space-between"}>
                                  {Array.from({ length: 5 }).map(
                                    (_, iNilai) => (
                                      <Center
                                        key={iNilai}
                                        as={Button}
                                        flex={1}
                                        h={"40px"}
                                        px={0}
                                        className="btn-outline"
                                        onClick={() => {
                                          handleNilai(i, iNilai + 1);
                                        }}
                                        border={"1px solid"}
                                        borderColor={
                                          formik.values.answers[i] ===
                                          iNilai + 1
                                            ? "p.500"
                                            : "var(--divider)"
                                        }
                                      >
                                        {iNilai + 1}
                                      </Center>
                                    )
                                  )}
                                </HStack>
                              </CContainer>
                            </HStack>
                          )
                        )}
                    </>
                  )}
                </>
              )}

              <Button
                mt={6}
                colorScheme="ap"
                className="btn-ap clicky"
                w={"100%"}
                isDisabled={
                  !isAnsweredAll(formik.values.answers, data?.jumlah_pertanyaan)
                }
                onClick={() => {
                  formik.submitForm();
                }}
                isLoading={loadingSubmit}
              >
                Kirim
              </Button>
            </CContainer>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

interface Props extends ButtonProps {
  user_id: number;
}

export default function RunPenilaianModal({ user_id, ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useBackOnClose(
    `penilaian-karyawan-modal-${user_id}`,
    isOpen,
    onOpen,
    onClose
  );

  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/get-list-jenis-penilaian`,
    conditions: isOpen,
    dependencies: [isOpen],
  });

  const [jenisPenilaian, setJenisPenilaian] = useState<any>(undefined);

  return (
    <>
      <Button
        flexShrink={0}
        leftIcon={<Icon as={RiStarFill} color={"orange.400"} />}
        pl={5}
        className="btn-solid clicky"
        flex={1}
        onClick={onOpen}
        {...props}
      >
        Run Penilaian
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
        }}
        isCentered
        scrollBehavior="inside"
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Pilih Jenis Penilaian"} />
          </ModalHeader>
          <ModalBody className="scrollY">
            <Alert
              flexShrink={0}
              status="warning"
              alignItems={"start"}
              mb={responsiveSpacing}
            >
              <AlertIcon />
              <AlertDescription>
                Pilih jenis penilaian karyawan kemudian klik Konfirmasi &
                Lanjutkan.
              </AlertDescription>
            </Alert>

            <>
              {loading && <ComponentSpinner />}

              {!loading && (
                <>
                  {error && (
                    <>
                      {notFound && <NotFound />}

                      {!notFound && (
                        <Center>
                          <Retry loading={loading} retry={retry} />
                        </Center>
                      )}
                    </>
                  )}

                  {!error && (
                    <CContainer gap={4}>
                      {data?.map((jp: any, i: number) => (
                        <HStack
                          key={i}
                          p={4}
                          borderRadius={8}
                          border={"1px solid"}
                          borderColor={
                            jenisPenilaian?.id === jp?.id
                              ? "p.500"
                              : "var(--divider3)"
                          }
                          bg={
                            jenisPenilaian?.id === jp?.id
                              ? "var(--p500a5) !important"
                              : ""
                          }
                          cursor={"pointer"}
                          transition={"200ms"}
                          className="btn clicky"
                          onClick={() => [setJenisPenilaian(jp)]}
                        >
                          <CContainer gap={4}>
                            <Text fontWeight={500}>{jp.nama}</Text>

                            <HStack>
                              <Text opacity={0.6}>Jabatan Penilai</Text>
                              <FlexLine />
                              <Text>{jp?.jabatan_penilai?.nama_jabatan}</Text>
                            </HStack>
                            <HStack>
                              <Text opacity={0.6}>Jabatan Dinilai</Text>
                              <FlexLine />
                              <Text>{jp?.jabatan_dinilai?.nama_jabatan}</Text>
                            </HStack>
                            <HStack>
                              <Text opacity={0.6}>Status Karyawan Dinilai</Text>
                              <FlexLine />
                              <StatusKaryawanBadge data={jp?.status_karyawan} />
                            </HStack>
                          </CContainer>
                        </HStack>
                      ))}
                    </CContainer>
                  )}
                </>
              )}
            </>
          </ModalBody>

          <ModalFooter>
            <ListPertanyaanModal
              user_id={user_id}
              jenisPenilaian={jenisPenilaian}
              isDisabled={!jenisPenilaian}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
