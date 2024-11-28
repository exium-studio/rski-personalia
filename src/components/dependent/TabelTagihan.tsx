import { Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useDataState from "../../hooks/useDataState";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import StatusTagihanBadge from "./StatusTagihanBadge";
import TabelFooterConfig from "./TabelFooterConfig";

interface Props {
  filterConfig: any;
}

export default function TabelTagihan({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: "/api/rski/dashboard/keuangan/get-tagihan-potongan",
      payload: {
        ...filterConfig,
      },
      limit: limitConfig,
      dependencies: [limitConfig, pageConfig, filterConfig],
    });

  useEffect(() => {
    setPageConfig(1);
  }, [filterConfig]);

  const formattedHeader = [
    {
      th: "Nama",
      isSortable: true,
      props: {
        position: "sticky",
        left: 0,
        zIndex: 3,
        w: "243px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
    },
    {
      th: "Status Tagihan",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Kategori Tagihan",
      isSortable: true,
    },
    {
      th: "Periode Mulai",
      isSortable: true,
    },
    {
      th: "Periode Selesai",
      isSortable: true,
    },
    {
      th: "Tagihan per Bulan",
      isSortable: true,
    },
    {
      th: "Tenor",
      isSortable: true,
    },
    {
      th: "Sisa Tagihan",
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
            detailKaryawanId={item.id}
            data={{
              id: item.user.id,
              nama: item.user.nama,
              fullName: `${item?.gelar_depan || ""} ${item.user?.nama} ${
                item?.gelar_belakang || ""
              }`,
              foto_profil: item.user.foto_profil,
            }}
          />
        ),
        props: {
          position: "sticky",
          left: "0",
          zIndex: 2,
        },
        cProps: {
          borderRight: "1px solid var(--divider3)",
        },
      }, // 0
      {
        value: item.status_tagihan?.label,
        td: <StatusTagihanBadge data={item.status_tagihan} w={"140px"} />,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.kategori_tagihan?.label,
        td: item.kategori_tagihan?.label,
      },
      {
        value: item.bulan_mulai,
        td: formatDate(item.bulan_mulai, "periode"),
      },
      {
        value: item.bulan_selesai,
        td: formatDate(item.bulan_selesai, "periode"),
      },
      {
        value: item.besaran,
        td: `Rp ${formatNumber(item.besaran || 0)}`,
      },
      {
        value: item.tenor,
        td: `${formatNumber(item.tenor || 0)} bulan`,
      },
      {
        value: item.sisa_tagihan,
        td: `Rp ${formatNumber(item.sisa_tagihan || 0)}`,
      },
    ],
  }));

  return (
    <>
      {error && (
        <>
          {notFound && isObjectEmpty(filterConfig, ["tahun"]) && (
            <NoData minH={"300px"} />
          )}

          {notFound && !isObjectEmpty(filterConfig, ["tahun"]) && (
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
                      initialSortOrder="desc"
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
