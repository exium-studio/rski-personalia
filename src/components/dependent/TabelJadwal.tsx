import { Center, HStack } from "@chakra-ui/react";
import { eachDayOfInterval } from "date-fns";
import { useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import formatDate from "../../lib/formatDate";
import NoData from "../independent/NoData";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import TabelJadwalItem from "./JadwalTabelItem";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";
import TerapkanJadwalKaryawanTerpilih from "./TerapkanJadwalKaryawanTerpilih";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NotFound from "../independent/NotFound";

interface Props {
  filterConfig?: any;
}

export default function TabelJadwal({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);

  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: "/api/rski/dashboard/jadwal-karyawan/get-data-jadwal",
    payload: filterConfig,
    limit: limitConfig,
    dependencies: [limitConfig, pageConfig, filterConfig],
  });

  const dateList = eachDayOfInterval({
    start: filterConfig.range_tgl.from,
    end: filterConfig.range_tgl.to,
  });

  const formattedHeader = [
    {
      th: "Nama",
      isSortable: true,
      props: {
        position: "sticky",
        left: 0,
        zIndex: 99,
        w: "180px",
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
      ...(item.list_jadwal?.map((jadwal: any, i: number) => ({
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
      })) || []),
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
              <HStack justify={"space-between"} mt={responsiveSpacing}>
                <Skeleton maxW={"120px"} />
                <Skeleton maxW={"300px"} h={"20px"} />
                <Skeleton maxW={"112px"} />
              </HStack>
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

                  <TabelFooterConfig
                    limitConfig={limitConfig}
                    setLimitConfig={setLimitConfig}
                    pageConfig={pageConfig}
                    setPageConfig={setPageConfig}
                    paginationData={{
                      prev_page_url: "",
                      next_page_url: "",
                      last_page: 1,
                    }}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
