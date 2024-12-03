import { Center, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useDataState from "../../hooks/useDataState";
import formatDate from "../../lib/formatDate";
import formatTime from "../../lib/formatTimeOld";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import DetailPresensiKaryawanModal from "./DetailPresensiKaryawanModal";
import JenisKaryawanBadge from "./JenisKaryawanBadge";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";

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
      payload: {
        search: filterConfig.search,
        tgl_mulai: formatDate(filterConfig.tgl_mulai, "short"),
        tgl_selesai: formatDate(filterConfig.tgl_selesai, "short"),
        ...formattedFilterKaryawan,
      },
      limit: limitConfig,
      dependencies: [
        limitConfig,
        pageConfig,
        filterConfig,
        formattedFilterKaryawan,
      ],
    });

  useEffect(() => {
    setPageConfig(1);
  }, [formattedFilterKaryawan, filterConfig]);

  const formattedHeader = [
    {
      th: "Nama",
      isSortable: true,
      props: {
        position: "sticky",
        left: "2px",
        zIndex: 99,
        w: "243px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
    },
    {
      th: "Jenis Karyawan",
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
      th: "Kategori",
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
              fullName: `${item?.gelar_depan || ""} ${item.user?.nama} ${
                item?.gelar_belakang || ""
              }`,
              foto_profil: item.user.foto_profil,
            }}
          />
        ),
        props: {
          position: "sticky",
          left: "2px",
          zIndex: 2,
        },
        cProps: {
          borderRight: "1px solid var(--divider3)",
        },
      },
      {
        value: item.unit_kerja.jenis_karyawan,
        td: (
          <JenisKaryawanBadge
            data={item.unit_kerja.jenis_karyawan}
            w={"120px"}
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
        value: item.kategori_presensi?.label,
        td: item.kategori_presensi?.label,
      },
      {
        value: item.jam_masuk,
        td: `${formatDate(item.jam_masuk, "basicShort")} - ${formatTime(
          item.jam_masuk
        )}`,
        isTime: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.jam_keluar,
        td: `${formatDate(item.jam_keluar, "basicShort")} - ${formatTime(
          item.jam_keluar
        )}`,
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
                  <CustomTableContainer minH="'400px">
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

      <TabelFooterConfig
        limitConfig={limitConfig}
        setLimitConfig={setLimitConfig}
        pageConfig={pageConfig}
        setPageConfig={setPageConfig}
        paginationData={paginationData}
        footer={
          <Text opacity={0.4} textAlign={["left", null, "center"]}>
            Klik row untuk melihat detail presensi
          </Text>
        }
      />
    </>
  );
}
