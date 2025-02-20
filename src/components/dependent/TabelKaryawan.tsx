import { Center, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Interface__DetailKaryawan } from "../../constant/interfaces";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useKaryawanTableColumnsConfig from "../../global/useKaryawanTableColumnsConfig";
import useDataState from "../../hooks/useDataState";
import calculateMasaKerjaFromTanggalMasuk from "../../lib/calculateMasaKerjaFromTanggalMasuk";
import formatDate from "../../lib/formatDate";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import DetailKaryawanModal from "./DetailKaryawanModal";
import Retry from "./Retry";
import StatusAktifBadge from "./StatusAktifBadge";
import StatusKaryawanBadge from "./StatusKaryawanBadge";
import TabelFooterConfig from "./TabelFooterConfig";

export default function TabelKaryawan() {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Karyawan Detail Disclosure
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Filter Config
  const { formattedFilterKaryawan } = useFilterKaryawan();
  // Columns Config
  const { columnsConfig } = useKaryawanTableColumnsConfig();

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<Interface__DetailKaryawan[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/karyawan/get-data-karyawan?page=${pageConfig}`,
      payload: {
        ...formattedFilterKaryawan,
      },
      limit: limitConfig,
      dependencies: [limitConfig, pageConfig, formattedFilterKaryawan],
    });

  useEffect(() => {
    setPageConfig(1);
  }, [formattedFilterKaryawan]);

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
      th: "Status Aktif",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "No. Induk Karyawan",
      isSortable: true,
    },
    {
      th: "Status Karyawan",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "No. Rekam Medis",
      isSortable: true,
    },
    {
      th: "Unit Kerja",
      isSortable: true,
    },
    {
      th: "Agama",
      isSortable: true,
    },
    {
      th: "Jenis Kelamin",
      isSortable: true,
    },
    {
      th: "Jabatan",
      isSortable: true,
    },
    {
      th: "Pendidikan Terakhir",
      isSortable: true,
    },
    {
      th: "Email",
      isSortable: true,
    },
    {
      th: "Ayah",
      isSortable: true,
    },
    {
      th: "Ibu",
      isSortable: true,
    },
    {
      th: "Jumlah Keluarga",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Tanggal Masuk",
      isSortable: true,
    },
    {
      th: "Tanggal Keluar",
      isSortable: true,
    },
    {
      th: "Masa Kerja",
      isSortable: true,
    },
    // {
    //   th: "Promosi",
    // },
    // {
    //   th: "Mutasi",
    // },
  ];
  const formattedData = data?.map((item: Interface__DetailKaryawan) => ({
    id: item?.user.id,
    columnsFormat: [
      {
        value: item?.user.nama,
        td: (
          <AvatarAndNameTableData
            noDetail
            data={{
              id: item?.user.id,
              nama: item?.user.nama,
              fullName: `${item?.gelar_depan || ""} ${item?.user?.nama} ${
                item?.gelar_belakang || ""
              }`,
              foto_profil: item?.user.foto_profil,
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
      }, // 0
      {
        value: item?.user.status_aktif,
        td: <StatusAktifBadge data={item?.user.status_aktif} w={"120px"} />,
        cProps: {
          justify: "center",
        },
      }, // 1
      {
        value: item?.nik,
        td: item?.nik,
        isNumeric: true,
      }, // 2
      {
        value: item?.status_karyawan?.label,
        td: <StatusKaryawanBadge w={"120px"} data={item?.status_karyawan} />,
        cProps: {
          justify: "center",
        },
      }, // 3
      {
        value: item?.no_rm,
        td: item?.no_rm,
        isNumeric: true,
      }, // 4
      {
        value: item?.unit_kerja?.nama_unit,
        td: item?.unit_kerja?.nama_unit,
      }, // 5
      {
        value: item?.agama?.label,
        td: item?.agama?.label,
      }, // 6
      {
        value: item?.jenis_kelamin,
        td:
          item?.jenis_kelamin === 1
            ? "Laki - laki"
            : item?.jenis_kelamin === 0
            ? "Perempuan"
            : "",
        isNumeric: true,
      }, // 7
      {
        value: item?.jabatan?.nama_jabatan,
        td: item?.jabatan?.nama_jabatan,
      }, // 8
      {
        value: item?.pendidikan_terakhir?.label,
        td: item?.pendidikan_terakhir?.label,
      }, // 9
      {
        value: item?.email,
        td: item?.email,
      }, // 10
      {
        value: item?.ayah,
        td: item?.ayah,
      }, // 11
      {
        value: item?.ibu,
        td: item?.ibu,
      }, // 12
      {
        value: item?.jumlah_keluarga,
        td: item?.jumlah_keluarga,
        cProps: {
          justify: "center",
        },
      }, // 13
      {
        value: item?.tgl_masuk,
        td: formatDate(item?.tgl_masuk),
        isDate: true,
      }, // 14
      {
        value: item?.tgl_keluar,
        td: formatDate(item?.tgl_keluar),
        isDate: true,
      }, // 15
      {
        value: item?.tgl_masuk,
        td: calculateMasaKerjaFromTanggalMasuk(item?.tgl_masuk as string),
      }, // 16
      // {
      //   value: "-",
      //   td: "-",
      // }, // 17
      // {
      //   value: "-",
      //   td: "-",
      // }, // 18
    ],
  }));

  const user_id = parseInt(localStorage.getItem("user_id") as string);

  const render = {
    error: (
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
    ),
    loading: (
      <>
        <Skeleton minH={"300px"} flex={1} mx={"auto"} />
      </>
    ),
    loaded: (
      <>
        {!formattedData && <NoData minH={"300px"} />}

        {formattedData && (
          <>
            <CustomTableContainer>
              <CustomTable
                formattedHeader={formattedHeader}
                formattedData={formattedData}
                onRowClick={(row) => {
                  localStorage.setItem("user_id", row.id);
                  onOpen();
                }}
                columnsConfig={columnsConfig}
                // batchActions={rowOptions}
                // rowOptions={rowOptions}
              />
            </CustomTableContainer>

            <DetailKaryawanModal
              id={`detail-karyawan-by-row-click`}
              user_id={user_id}
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
            />
          </>
        )}
      </>
    ),
    notFound: <NotFound />,
  };

  return (
    <>
      {loading && render.loading}

      {!loading && (
        <>
          {error && render.error}

          {/* {error && notFound && render.notFound} */}

          {!error && render.loaded}
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
            Klik row untuk melihat detail karyawan
          </Text>
        }
      />
    </>
  );
}
