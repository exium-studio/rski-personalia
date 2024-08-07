import { Center, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import useDataState from "../../hooks/useDataState";
import formatTime from "../../lib/formatTime";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import BooleanBadge from "./BooleanBadge";
import CustomTable from "./CustomTable";
import DetailPresensiKaryawanModal from "./DetailPresensiKaryawanModal";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";
import useFilterKaryawan from "../../global/useFilterKaryawan";
interface Props {
  filterConfig?: any;
}

export default function TabelPresensi({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Presensi Detail Disclosure Config
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Filter Karyawan Config
  const { formattedFilterKaryawan } = useFilterKaryawan();

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any>({
      initialData: undefined,
      url: `/api/rski/dashboard/presensi/get-data-presensi?page=${pageConfig}`,
      payload: { ...filterConfig, ...formattedFilterKaryawan },
      limit: limitConfig,
      dependencies: [
        limitConfig,
        pageConfig,
        filterConfig,
        formattedFilterKaryawan,
      ],
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
      th: "Jenis Pegawai",
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
      th: "Presensi Masuk",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Presensi keluar",
      isSortable: true,
      cProps: {
        justify: "center",
      },
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
        value: item.unit_kerja.jenis_karyawan,
        td: (
          <BooleanBadge
            w={"120px"}
            data={item.unit_kerja.jenis_karyawan}
            colorScheme={item.unit_kerja.jenis_karyawan ? "cyan" : "orange"}
            trueValue="Shift"
            falseValue="Non-Shift"
          />
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.unit_kerja.nama_unit,
        td: item.unit_kerja.nama_unit,
      },
      {
        value: item.jam_masuk,
        td: formatTime(item.jam_masuk),
        isTime: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.jam_keluar,
        td: formatTime(item.jam_keluar),
        isTime: true,
        cProps: {
          justify: "center",
        },
      },
    ],
  }));

  const presensi_id = parseInt(localStorage.getItem("presensi_id") as string);

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
              {!formattedData && <NoData minH={"300px"} />}

              {formattedData && (
                <>
                  <CustomTableContainer>
                    <CustomTable
                      formattedHeader={formattedHeader}
                      formattedData={formattedData}
                      onRowClick={(row) => {
                        localStorage.setItem("presensi_id", row.id);
                        onOpen();
                      }}
                      // columnsConfig={columnsConfig}
                    />
                  </CustomTableContainer>

                  <DetailPresensiKaryawanModal
                    presensi_id={presensi_id}
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

      {!error && (
        <TabelFooterConfig
          limitConfig={limitConfig}
          setLimitConfig={setLimitConfig}
          pageConfig={pageConfig}
          setPageConfig={setPageConfig}
          paginationData={paginationData}
          footer={
            <Text opacity={0.4}>Klik row untuk melihat detail presensi</Text>
          }
        />
      )}
    </>
  );
}
