import {
  Button,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useDataState from "../../hooks/useDataState";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";
import CContainer from "../wrapper/CContainer";
import formatDate from "../../lib/formatDate";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "./DisclosureHeader";
import useBackOnClose from "../../hooks/useBackOnClose";
import capFirst from "../../lib/capFirst";
import FlexLine from "../independent/FlexLine";
import formatTime from "../../lib/formatTime";
import formatDuration from "../../lib/formatDuration";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import TabelElipsisText from "./TabelElipsisText";

const DetailData = (props: any) => {
  // Props
  const { penyebab, item } = props;

  // Hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`data-penyebab-${item.id}`, isOpen, onOpen, onClose);

  // States
  const renderer = {
    izin: (
      <CContainer gap={4}>
        <HStack>
          <Text opacity={0.6}>Tanggal izin</Text>
          <FlexLine />
          <Text>{formatDate(item?.data_izin?.tgl_izin)}</Text>
        </HStack>
        <HStack>
          <Text opacity={0.6}>Waktu izin</Text>
          <FlexLine />
          <Text>{formatTime(item?.data_izin?.waktu_izin)}</Text>
        </HStack>
        <HStack>
          <Text opacity={0.6}>Durasi izin</Text>
          <FlexLine />
          <Text>{formatDuration(item?.data_izin?.durasi)}</Text>
        </HStack>
        <HStack>
          <Text opacity={0.6}>Keterangan izin</Text>
          <FlexLine />
          <Text>{item?.data_izin?.keterangan}</Text>
        </HStack>
      </CContainer>
    ),
    cuti: (
      <CContainer gap={4}>
        <HStack>
          <Text opacity={0.6}>Tipe cuti</Text>
          <FlexLine />
          <Text>{item?.data_cuti?.tipe_cuti?.nama}</Text>
        </HStack>
        <HStack>
          <Text opacity={0.6}>Tanggal mulai</Text>
          <FlexLine />
          <Text>{formatDate(item?.data_cuti?.tgl_from)}</Text>
        </HStack>
        <HStack>
          <Text opacity={0.6}>Tanggal selesai</Text>
          <FlexLine />
          <Text>{formatDate(item?.data_cuti?.tgl_to)}</Text>
        </HStack>
        <HStack>
          <Text opacity={0.6}>Keterangan cuti</Text>
          <FlexLine />
          <Text>{item?.data_cuti?.keterangan || item?.data_cuti?.alasan}</Text>
        </HStack>
      </CContainer>
    ),
  };

  return (
    <>
      <Button colorScheme="ap" variant={"ghost"} onClick={onOpen}>
        Lihat
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
            <DisclosureHeader title={"Data Penyebab"} />
          </ModalHeader>

          <ModalBody>{renderer[penyebab as keyof typeof renderer]}</ModalBody>

          <ModalFooter>
            <Button
              className="btn-solid clicky"
              onClick={backOnClose}
              w={"full"}
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
  filterConfig: any;
}
export default function TabelPembatalanReward({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Config
  const { formattedFilterKaryawan } = useFilterKaryawan();

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/presensi/get-data-history-reward?page=${pageConfig}`,
      payload: {
        ...formattedFilterKaryawan,
        ...(filterConfig?.status_cuti?.length > 0 && {
          status_cuti: filterConfig.status_cuti.map((sp: any) => sp.value),
        }),
        ...(filterConfig?.tipe_cuti?.length > 0 && {
          tipe_cuti: filterConfig.tipe_cuti.map((sp: any) => sp.value),
        }),
      },
      limit: limitConfig,
      dependencies: [limitConfig, pageConfig, filterConfig],
    });

  useEffect(() => {
    setPageConfig(1);
  }, [filterConfig]);

  // const userData = useGetUserData();

  const formattedHeader = [
    {
      th: "Karyawan",
      isSortable: true,
      props: {
        position: "sticky",
        left: "0",
        zIndex: 99,
        w: "243px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
    },
    {
      th: "No. Induk Karyawan",
      isSortable: true,
    },
    {
      th: "Unit Kerja",
      isSortable: true,
    },
    {
      th: "Tanggal Pembatalan",
      isSortable: true,
    },
    {
      th: "Penyebab",
      isSortable: true,
    },
    {
      th: "Data Penyebab",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Keterangan",
    },
  ];
  const formattedData = data?.map((item: any) => {
    return {
      id: item.id,
      columnsFormat: [
        {
          value: item?.user?.nama,
          td: (
            <AvatarAndNameTableData
              detailKaryawanId={item.id}
              data={{
                id: item?.user?.id,
                nama: item?.user?.nama,
                foto_profil: item?.user?.foto_profil?.path,
              }}
            />
          ),
          props: {
            position: "sticky",
            left: "0",
            w: "243px",
          },
          cProps: {
            borderRight: "1px solid var(--divider3)",
          },
        },
        {
          value: item?.nik,
          td: item?.nik,
        },
        {
          value: formatDate(item?.tgl_pembatalan),
          td: formatDate(item?.tgl_pembatalan),
        },
        {
          value: item?.unit_kerja?.nama_unit,
          td: item?.unit_kerja?.nama_unit,
        },
        {
          value: capFirst(item?.tipe_pembatalan),
          td: capFirst(item?.tipe_pembatalan),
        },
        {
          value: "",
          td: <DetailData penyebab={item?.tipe_pembatalan} item={item} />,
          cProps: {
            justify: "center",
          },
        },
        {
          value: item?.keterangan,
          td: <TabelElipsisText data={item?.keterangan} />,
        },
      ],
    };
  });

  return (
    <>
      {error && (
        <>
          {notFound && isObjectEmpty(filterConfig, ["periode_tahun"]) && (
            <NoData minH={"300px"} />
          )}

          {notFound && !isObjectEmpty(filterConfig, ["periode_tahun"]) && (
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
