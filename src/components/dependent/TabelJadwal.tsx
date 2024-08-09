import { Center } from "@chakra-ui/react";
import { eachDayOfInterval } from "date-fns";
import { useState } from "react";
import useDataState from "../../hooks/useDataState";
import formatDate from "../../lib/formatDate";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import TabelJadwalItem from "./JadwalTabelItem";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";
import TerapkanJadwalKaryawanTerpilih from "./TerapkanJadwalKaryawanTerpilih";
import useFilterKaryawan from "../../global/useFilterKaryawan";

interface Props {
  filterConfig?: any;
}

export default function TabelJadwal({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Karyawan Config
  const { formattedFilterKaryawan } = useFilterKaryawan();

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any>({
      initialData: undefined,
      url: `/api/rski/dashboard/jadwal-karyawan/get-data-jadwal?page=${pageConfig}`,
      payload: { ...filterConfig, ...formattedFilterKaryawan },
      limit: limitConfig,
      dependencies: [
        limitConfig,
        pageConfig,
        filterConfig,
        formattedFilterKaryawan,
      ],
    });

  const dateList = eachDayOfInterval({
    start: filterConfig.tgl_mulai,
    end: filterConfig.tgl_selesai,
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
    ...dateList.map((date) => ({
      th: formatDate(date, "longShort"),
    })),
  ];
  const formattedData = data?.map((item: any, rowIndex: number) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.user.nama,
        td: (
          <AvatarAndNameTableData
            data={{
              id: item.user.id,
              nama: item.user.nama,
              foto_profil: item.user.foto_profil,
              unit_kerja: item.unit_kerja,
            }}
          />
        ),
        props: {
          position: "sticky",
          left: 0,
          zIndex: 2,
        },
        cProps: {
          h: "92px",
          borderRight: "1px solid var(--divider3)",
        },
      },
      ...(item.list_jadwal?.map((jadwal: any, i: number) => {
        return {
          value: jadwal?.label,
          td:
            jadwal !== null ? (
              <TabelJadwalItem
                data={item}
                jadwal={jadwal}
                tgl={dateList[i]}
                index={i}
                rowIndex={rowIndex}
              />
            ) : (
              // "-"
              <TerapkanJadwalKaryawanTerpilih
                data={item}
                tgl={dateList[i]}
                index={i}
                rowIndex={rowIndex}
              />
            ),
          cProps: {
            align: "stretch",
            h: "92px",
            p: "6px",
          },
        };
      }) || []),
    ],
  }));

  return (
    <>
      {error && (
        <>
          {notFound && isObjectEmpty(filterConfig) && <NoData minH={"300px"} />}

          {notFound && !isObjectEmpty(filterConfig) && (
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
              {(!data || (data && data.length === 0)) && (
                <NoData minH={"300px"} />
              )}

              {(data || (data && data.length > 0)) && (
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

      {!error && (
        <TabelFooterConfig
          limitConfig={limitConfig}
          setLimitConfig={setLimitConfig}
          pageConfig={pageConfig}
          setPageConfig={setPageConfig}
          paginationData={paginationData}
        />
      )}
    </>
  );
}
