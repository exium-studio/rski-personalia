import { Center, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { dummyRiwayatCuti } from "../../const/dummy";
import { responsiveSpacing } from "../../constant/sizes";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useDataState from "../../hooks/useDataState";
import NoData from "../independent/NoData";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import BooleanBadge from "./BooleanBadge";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";

interface Props {
  filterConfig: any;
}

export default function TabelCuti({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Config
  const { filterKaryawan } = useFilterKaryawan();

  const { error, loading, data, retry } = useDataState<any[]>({
    initialData: dummyRiwayatCuti,
    url: "",
    payload: {
      filterConfig: filterConfig,
    },
    limit: limitConfig,
    dependencies: [limitConfig, pageConfig, filterKaryawan],
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
    {
      th: "Status Cuti",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Tipe Cuti",
      isSortable: true,
    },
    {
      th: "Durasi",
      isSortable: true,
    },
    {
      th: "Unit Kerja",
      isSortable: true,
    },
  ];
  const formattedData = data?.map((item: any) => ({
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
        value: item.status_cuti,
        td: (
          <BooleanBadge
            data={item.status_cuti}
            trueValue="Aktif"
            falseValue="Tidak Aktif"
            w={"120px"}
          />
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.tipe_cuti.nama,
        td: item.tipe_cuti.nama,
      },
      {
        value: item.durasi,
        td: `${item.durasi} hari`,
        isNumeric: true,
      },
      {
        value: item.unit_kerja.nama_unit,
        td: item.unit_kerja.nama_unit,
        isNumeric: true,
      },
    ],
  }));

  return (
    <>
      {error && (
        <Center my={"auto"} minH={"300px"}>
          <Retry loading={loading} retry={retry} />
        </Center>
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
              {!formattedData && <NoData minH={"300px"} />}

              {formattedData && (
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
