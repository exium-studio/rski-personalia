import { Center, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useDataState from "../../hooks/useDataState";
import formatDate from "../../lib/formatDate";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import DetailPenggajianModal from "./DetailPenggajianModal";
import Retry from "./Retry";
import StatusPublikasiPenggajian from "./StatusPublikasiPenggajian";
import TabelFooterConfig from "./TabelFooterConfig";
interface Props {
  filterConfig: any;
}

export default function TabelRiwayatPenggajian({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Karyawan Detail Disclosure
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/keuangan/get-penggajian?page=${pageConfig}`,
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
      th: "Periode",
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
      th: "Status Penggajian",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Pembaruan Terakhir",
      isSortable: true,
    },
    {
      th: "Karyawan Digaji",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Dibuat",
      isSortable: true,
    },
  ];
  const formattedData = data?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.periode,
        td: formatDate(item.periode, "periode"),
        isDate: true,
        props: {
          position: "sticky",
          left: 0,
          zIndex: 2,
          w: "243px",
        },
        cProps: {
          borderRight: "1px solid var(--divider3)",
        },
      },
      {
        value: item.status_riwayat_gaji.label,
        td: (
          <StatusPublikasiPenggajian
            w={"150px"}
            data={item.status_riwayat_gaji}
          />
        ),
        isNumeric: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.updated_at,
        td: formatDate(item.updated_at),
        isDate: true,
      },
      {
        value: item.karyawan_digaji,
        td: item.karyawan_digaji,
        isNumeric: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.created_at,
        td: formatDate(item.created_at),
        isDate: true,
      },
    ],
  }));

  const penggajian_id = parseInt(
    localStorage.getItem("penggajian_id") as string
  );

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
                      onRowClick={(row) => {
                        localStorage.setItem("penggajian_id", row.id);
                        onOpen();
                      }}
                    />
                  </CustomTableContainer>

                  <DetailPenggajianModal
                    penggajian_id={penggajian_id}
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                  />
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
        footer={
          <Text opacity={0.4} textAlign={["left", null, "center"]}>
            Klik row untuk melihat detail laporan penggajian
          </Text>
        }
      />
    </>
  );
}
