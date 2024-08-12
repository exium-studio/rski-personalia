import {
  Button,
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
  Wrap,
} from "@chakra-ui/react";
import { RiArrowLeftRightLine, RiLoginBoxLine } from "@remixicon/react";
import { useState } from "react";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatTime from "../../lib/formatTime";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import ApprovalStatus from "./StatusApprovalBadge";
import TabelFooterConfig from "./TabelFooterConfig";

interface PertukaranJadwalProps {
  id: number;
  data: any;
}
const PertukaranJadwalModal = ({ id, data }: PertukaranJadwalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`pertukaran-jadwal-modal-${id}`, isOpen, onOpen, onClose);

  return (
    <>
      <Button
        colorScheme="ap"
        variant={"ghost"}
        className="clicky"
        onClick={onOpen}
      >
        Lihat
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        size={"lg"}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Pertukaran Jadwal"} />
          </ModalHeader>
          <ModalBody>
            {data.map((pertukaran: any, i: number) => (
              <Wrap key={i}>
                <CContainer gap={2} flex={1}>
                  <Text opacity={0.4}>
                    {pertukaran.jadwal_karyawan_pengajuan.shift.nama}
                  </Text>
                  <Text>
                    {formatDate(pertukaran.jadwal_karyawan_pengajuan.tgl_mulai)}
                  </Text>

                  <HStack gap={4}>
                    <HStack>
                      <Center borderRadius={"full"} bg={"var(--p500a4)"} p={1}>
                        <Icon as={RiLoginBoxLine} color={"p.500"} />
                      </Center>
                      <Text>
                        {formatTime(
                          pertukaran.jadwal_karyawan_pengajuan.shift.jam_from
                        )}
                      </Text>
                    </HStack>

                    <HStack>
                      <Center borderRadius={"full"} bg={"var(--reda)"} p={1}>
                        <Icon as={RiLoginBoxLine} color={"red.400"} />
                      </Center>
                      <Text>
                        {formatTime(
                          pertukaran.jadwal_karyawan_pengajuan.shift.jam_to
                        )}
                      </Text>
                    </HStack>
                  </HStack>
                </CContainer>

                <Icon
                  as={RiArrowLeftRightLine}
                  color={"p.500"}
                  mx={4}
                  fontSize={20}
                  my={"auto"}
                />

                <CContainer gap={2} flex={1}>
                  <Text opacity={0.4}>
                    {pertukaran.jadwal_karyawan_ditukar.shift.nama}
                  </Text>
                  <Text>
                    {formatDate(pertukaran.jadwal_karyawan_ditukar.tgl_mulai)}
                  </Text>

                  <HStack gap={4}>
                    <HStack>
                      <Center borderRadius={"full"} bg={"var(--p500a4)"} p={1}>
                        <Icon as={RiLoginBoxLine} color={"p.500"} />
                      </Center>
                      <Text>
                        {formatTime(
                          pertukaran.jadwal_karyawan_ditukar.shift.jam_from
                        )}
                      </Text>
                    </HStack>

                    <HStack>
                      <Center borderRadius={"full"} bg={"var(--reda)"} p={1}>
                        <Icon as={RiLoginBoxLine} color={"red.400"} />
                      </Center>
                      <Text>
                        {formatTime(
                          pertukaran.jadwal_karyawan_ditukar.shift.jam_to
                        )}
                      </Text>
                    </HStack>
                  </HStack>
                </CContainer>
              </Wrap>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              onClick={backOnClose}
            >
              Mengerti
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

interface Props {
  filterConfig?: any;
}

export default function TabelKaryawan({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Config
  const { formattedFilterKaryawan } = useFilterKaryawan();
  const formattedFilterConfig: any = {
    ...formattedFilterKaryawan,
    ...(filterConfig?.status_penukaran?.length > 0 && {
      status_penukaran: filterConfig.status_penukaran.map(
        (sp: any) => sp.value
      ),
    }),
  };

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any>({
      initialData: undefined,
      url: `/api/rski/dashboard/jadwal-karyawan/get-tukar-jadwal?page=${pageConfig}`,
      payload: {
        ...formattedFilterConfig,
      },
      limit: limitConfig,
      dependencies: [
        limitConfig,
        pageConfig,
        formattedFilterKaryawan,
        filterConfig,
      ],
    });

  const formattedHeader = [
    {
      th: "Tanggal Pengajuan",
      isSortable: true,
    },
    {
      th: "Kategori Penukaran",
      isSortable: true,
    },
    {
      th: "Status Penukaran",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Unit Kerja",
      isSortable: true,
    },
    {
      th: "Karyawan Pengajuan",
      isSortable: true,
    },
    {
      th: "Karyawan Ditukar",
      isSortable: true,
    },
    {
      th: "Pertukaran Jadwal",
      cProps: {
        justify: "center",
      },
    },
  ];
  const formattedData = data?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.created_at,
        td: formatDate(item.created_at),
      },
      {
        value: item.kategori_penukaran.label,
        td: item.kategori_penukaran.label,
      },
      {
        value: item.status_penukaran.label,
        td: <ApprovalStatus data={item.status_penukaran.id} w={"120px"} />,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.unit_kerja?.nama_unit,
        td: item.unit_kerja?.nama_unit,
      },
      {
        value: item.karyawan_pengajuan.nama,
        td: (
          <AvatarAndNameTableData
            data={{
              id: item.karyawan_pengajuan.id,
              nama: item.karyawan_pengajuan.nama,
              foto_profil: item.karyawan_pengajuan.foto_profil,
            }}
          />
        ),
      },
      {
        value: item.karyawan_ditukar.nama,
        td: (
          <AvatarAndNameTableData
            data={{
              id: item.karyawan_ditukar.id,
              nama: item.karyawan_ditukar.nama,
              foto_profil: item.karyawan_ditukar.foto_profil,
            }}
          />
        ),
      },
      {
        value: item.pertukaran_jadwal,
        td: (
          <PertukaranJadwalModal id={item.id} data={item.pertukaran_jadwal} />
        ),
        cProps: {
          justify: "center",
        },
      },
    ],
  }));

  return (
    <>
      {error && (
        <>
          {notFound && isObjectEmpty(formattedFilterKaryawan) && (
            <NoData minH={"300px"} />
          )}

          {notFound && !isObjectEmpty(formattedFilterKaryawan) && (
            <NotFound minH={"300px"} />
          )}

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
            <>
              <Skeleton minH={"300px"} flex={1} mx={"auto"} />
            </>
          )}
          {!loading && (
            <>
              {!formattedData && <NoData minH={"300px"} />}

              {formattedData && (
                <>
                  <CustomTableContainer>
                    <CustomTable
                      formattedHeader={formattedHeader}
                      formattedData={formattedData}
                    />
                  </CustomTableContainer>
                </>
              )}
            </>
          )}
        </>
      )}

      <TabelFooterConfig
        limitConfig={limitConfig}
        setLimitConfig={setLimitConfig}
        pageConfig={pageConfig}
        setPageConfig={setPageConfig}
        paginationData={paginationData}
      />
    </>
  );
}
