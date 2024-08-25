import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Dispatch, useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import ComponentSpinner from "../independent/ComponentSpinner";
import FlexLine from "../independent/FlexLine";
import NotFound from "../independent/NotFound";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import StatusKaryawanBadge from "./StatusKaryawanBadge";

interface ListJenisPenilaianProps {
  isOpen: boolean;
  setJenisPenilaian: Dispatch<any>;
}

const ListJenisPenilaian = ({
  isOpen,
  setJenisPenilaian,
}: ListJenisPenilaianProps) => {
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/get-list-jenis-penilaian`,
    conditions: isOpen,
    dependencies: [isOpen],
  });

  const [jenisPenilaianLocal, setJenisPenilaianLocal] =
    useState<any>(undefined);

  return (
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
            <CContainer gap={2}>
              {data?.map((jp: any, i: number) => (
                <HStack
                  key={i}
                  p={4}
                  borderRadius={8}
                  border={"1px solid"}
                  borderColor={
                    jenisPenilaianLocal?.id === jp?.id
                      ? "p.500"
                      : "var(--divider3)"
                  }
                  bg={
                    jenisPenilaianLocal?.id === jp?.id
                      ? "var(--p500a5) !important"
                      : ""
                  }
                  cursor={"pointer"}
                  transition={"200ms"}
                  className="btn clicky"
                  onClick={() => [setJenisPenilaianLocal(jp)]}
                >
                  <CContainer gap={2}>
                    <Text fontWeight={500}>{jp.nama}</Text>

                    <HStack>
                      <Text opacity={0.6}>Jabatan Penilai</Text>
                      <FlexLine />
                      <Text>{jp?.jabatan_penilais?.nama_jabatan}</Text>
                    </HStack>
                    <HStack>
                      <Text opacity={0.6}>Jabatan Dinilai</Text>
                      <FlexLine />
                      <Text>{jp?.jabatan_dinilais?.nama_jabatan}</Text>
                    </HStack>
                    <HStack>
                      <Text opacity={0.6}>Status Karyawan Dinilai</Text>
                      <FlexLine />
                      <StatusKaryawanBadge data={jp?.status_karyawans} />
                    </HStack>
                  </CContainer>
                </HStack>
              ))}

              <Button
                mt={5}
                w={"100%"}
                className="btn-ap clicky"
                colorScheme="ap"
                isDisabled={!jenisPenilaianLocal}
                onClick={() => {
                  setJenisPenilaian(jenisPenilaianLocal);
                }}
              >
                Konfirmasi & Lanjutkan
              </Button>
            </CContainer>
          )}
        </>
      )}
    </>
  );
};

interface Props {
  user_id_penilaian: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function PenilaianKaryawanModal({
  user_id_penilaian,
  isOpen,
  onOpen,
  onClose,
}: Props) {
  useBackOnClose(
    `penilaian-karyawan-modal-${user_id_penilaian}`,
    isOpen,
    onOpen,
    onClose
  );

  const [jenisPenilaian, setJenisPenilaian] = useState<any>(undefined);

  const { error, notFound, loading, data, setData, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/perusahaan/jenis-penilaian/${jenisPenilaian?.id}`,
    conditions: user_id_penilaian && isOpen && jenisPenilaian,
    dependencies: [user_id_penilaian, jenisPenilaian, isOpen],
  });

  // useEffect(() => {
  //   if (isOpen) {
  //     setData(undefined);
  //     setJenisPenilaian(undefined);
  //   }
  // }, [isOpen, user_id_penilaian, setData]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        backOnClose();
        setData(undefined);
        setJenisPenilaian(undefined);
      }}
      isCentered
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <DisclosureHeader title={"Penilaian"} />
        </ModalHeader>
        <ModalBody pb={6}>
          {!jenisPenilaian && (
            <>
              <Alert
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

              <ListJenisPenilaian
                isOpen={isOpen}
                setJenisPenilaian={setJenisPenilaian}
              />
            </>
          )}

          {jenisPenilaian && (
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
                      {data?.list_pertanyaan?.map(
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
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Center
                                    key={i}
                                    as={Button}
                                    flex={1}
                                    h={"40px"}
                                    px={0}
                                    className="btn-outline"
                                  >
                                    {i + 1}
                                  </Center>
                                ))}
                              </HStack>
                            </CContainer>
                          </HStack>
                        )
                      )}
                    </CContainer>
                  )}
                </>
              )}
            </>
          )}
        </ModalBody>

        {/* <ModalFooter>
          <Button
            w={"100%"}
            className="btn-ap clicky"
            colorScheme="ap"
            isDisabled={!jenisPenilaian}
          >
            Konfirmasi & Lanjutkan
          </Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
}
