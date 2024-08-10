import { Center, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useDataState from "../../hooks/useDataState";
import formatDate from "../../lib/formatDate";
import formatDurationShort from "../../lib/formatDurationShort";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import StatusLemburBadge from "./StatusLemburBadge";
import TabelFooterConfig from "./TabelFooterConfig";

interface Props {
  filterConfig?: any;
}

export default function TabelLembur({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Config
  const { formattedFilterKaryawan } = useFilterKaryawan();

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/jadwal-karyawan/get-lembur?page=${pageConfig}`,
      payload: {
        ...formattedFilterKaryawan,
        ...filterConfig,
      },
      limit: limitConfig,
      dependencies: [limitConfig, pageConfig, formattedFilterKaryawan],
    });

  const formattedHeader = [
    {
      th: "Nama",
      isSortable: true,
      props: {
        position: "sticky",
        left: 0,
        zIndex: 99,
        w: "243px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
    },
    {
      th: "Status Lembur",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Tanggal Pengajuan",
      isSortable: true,
    },
    {
      th: "Durasi",
      isSortable: true,
    },
    {
      th: "Catatan",
    },
  ];
  const formattedData = data?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.user.nama,
        td: (
          <AvatarAndNameTableData
            detailKaryawanId={`detail-karyawan-modal-${item.id}-${item.user.id}`}
            data={{
              id: item.user.id,
              nama: item.user.nama,
              foto_profil: item.user.foto_profil,
            }}
          />
        ),
        props: {
          position: "sticky",
          left: 0,
          zIndex: 2,
        },
        cProps: {
          borderRight: "1px solid var(--divider3)",
        },
      },
      {
        value: item.status_lembur?.label,
        td: <StatusLemburBadge data={item.status_lembur} w={"120px"} />,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.tgl_pengajuan,
        td: formatDate(item.tgl_pengajuan),
        isDate: true,
      },
      {
        value: item.durasi,
        td: formatDurationShort(item.durasi),
        isNumeric: true,
      },
      {
        value: item.catatan,
        td: (
          <Tooltip label={item.catatan} openDelay={500}>
            <Text
              maxW={"300px"}
              overflow={"hidden"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
            >
              {item.catatan}
            </Text>
          </Tooltip>
        ),
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
