import { Center } from "@chakra-ui/react";
import { useState } from "react";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useDataState from "../../hooks/useDataState";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import StatusPermintaanCutiBadge from "./StatusPermintaanCutiBadge";
import TabelFooterConfig from "./TabelFooterConfig";
import VerifikasiModal from "./VerifikasiModal";
import formatDate from "../../lib/formatDate";

interface Props {
  filterConfig: any;
}

export default function TabelCuti({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Config
  const { formattedFilterKaryawan } = useFilterKaryawan();

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/jadwal-karyawan/get-cuti?page=${pageConfig}`,
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
        w: "243px",
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
      th: "Tanggal Mulai",
      isSortable: true,
    },
    {
      th: "Tanggal Selesai",
      isSortable: true,
    },
    {
      th: "Durasi",
      isSortable: true,
      cProps: {
        justify: "end",
      },
    },
    {
      th: "Unit Kerja",
      isSortable: true,
    },
    {
      th: "Verif. 1",
      props: {
        position: "sticky",
        right: 0,
        zIndex: 3,
      },
      cProps: {
        justify: "center",
        borderLeft: "1px solid var(--divider3)",
      },
    },
    {
      th: "Verif. 2",
      props: {
        position: "sticky",
        right: 0,
        zIndex: 2,
      },
      cProps: {
        justify: "center",
        borderLeft: "1px solid var(--divider3)",
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
        value: item.status_cuti,
        td: <StatusPermintaanCutiBadge data={item.status_cuti} w={"180px"} />,
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
        td: formatDate(item?.tgl_from),
        isDate: true,
      },
      {
        value: item.durasi,
        td: formatDate(item?.tgl_to),
        isDate: true,
        cProps: {
          justify: "end",
        },
      },
      {
        value: item.durasi,
        td: `${item.durasi} hari`,
        isNumeric: true,
        cProps: {
          justify: "end",
        },
      },
      {
        value: item.unit_kerja.nama_unit,
        td: item.unit_kerja.nama_unit,
        isNumeric: true,
      },
      {
        value: "",
        td: (
          <VerifikasiModal
            aria-label={`perubahan-data-verif-1-button-${item.id}"`}
            id={`verifikasi-perubahan-data-modal-${item.id}`}
            submitUrl={`/api/rski/dashboard/jadwal-karyawan/cuti/${item.id}/verifikasi-tahap-1`}
            approvePayloadKey="verifikasi_pertama_disetujui"
            disapprovePayloadKey="verifikasi_pertama_ditolak"
            isDisabled={item?.status_cuti?.id !== 1}
          />
        ),
        props: {
          position: "sticky",
          right: 0,
          zIndex: 3,
        },
        cProps: {
          justify: "center",
          borderLeft: "1px solid var(--divider3)",
        },
      },
      {
        value: "",
        td: (
          <VerifikasiModal
            aria-label={`perubahan-data-verif-2-button-${item.id}"`}
            id={`verifikasi-perubahan-data-modal-${item.id}`}
            submitUrl={`/api/rski/dashboard/jadwal-karyawan/cuti/${item.id}/verifikasi-tahap-2`}
            approvePayloadKey="verifikasi_kedua_disetujui"
            disapprovePayloadKey="verifikasi_kedua_ditolak"
            isDisabled={item?.status_cuti?.id !== 4}
          />
        ),
        props: {
          position: "sticky",
          right: 0,
          zIndex: 2,
        },
        cProps: {
          justify: "center",
          borderLeft: "1px solid var(--divider3)",
        },
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
