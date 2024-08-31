import { Center } from "@chakra-ui/react";
import { useState } from "react";
import useAuth from "../../global/useAuth";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useDataState from "../../hooks/useDataState";
import formatDate from "../../lib/formatDate";
import isHasPermissions from "../../lib/isHasPermissions";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import PertukaranJadwalModal from "./PertukaranJadwalModal";
import Retry from "./Retry";
import StatusVerifikasiBadge2 from "./StatusVerifikasiBadge2";
import TabelFooterConfig from "./TabelFooterConfig";
import VerifikasiModal from "./VerifikasiModal";

interface Props {
  filterConfig?: any;
}

export default function TabelKaryawan({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Config
  const { formattedFilterKaryawan } = useFilterKaryawan();
  const formattedFilterConfig: any = {
    ...formattedFilterKaryawan,
    ...(filterConfig?.status_penukaran?.length > 0 && {
      status_penukaran: filterConfig.status_penukaran.map(
        (sp: any) => sp.value
      ),
    }),
  };

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any>({
      initialData: undefined,
      url: `/api/rski/dashboard/jadwal-karyawan/get-tukar-jadwal?page=${pageConfig}`,
      payload: {
        ...formattedFilterConfig,
      },
      limit: limitConfig,
      dependencies: [
        limitConfig,
        pageConfig,
        formattedFilterKaryawan,
        filterConfig,
      ],
    });

  const { userPermissions } = useAuth();
  const verif1Permission = isHasPermissions(userPermissions, [31]);
  const verif2Permission = isHasPermissions(userPermissions, [32]);

  const formattedHeader = [
    {
      th: "Tanggal Pengajuan",
      isSortable: true,
    },
    {
      th: "Kategori Penukaran",
      isSortable: true,
    },
    {
      th: "Status Penukaran",
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
      th: "Karyawan Pengajuan",
      isSortable: true,
    },
    {
      th: "Karyawan Ditukar",
      isSortable: true,
    },
    {
      th: "Pertukaran Jadwal",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Verif. 1",
      props: {
        position: "sticky",
        right: 0,
        zIndex: 4,
      },
      cProps: {
        justify: "center",
        borderLeft: "1px solid var(--divider3)",
        w: "122px",
      },
    },
    {
      th: "Verif. 2",
      props: {
        position: "sticky",
        right: 0,
        zIndex: 3,
      },
      cProps: {
        justify: "center",
        borderLeft: "1px solid var(--divider3)",
        w: "122px",
      },
    },
  ];
  const formattedData = data?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.created_at,
        td: formatDate(item.created_at),
      },
      {
        value: item.kategori_penukaran.label,
        td: item.kategori_penukaran.label,
      },
      {
        value: item.status_penukaran.label,
        td: <StatusVerifikasiBadge2 data={item.status_penukaran} w={"180px"} />,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.unit_kerja?.nama_unit,
        td: item.unit_kerja?.nama_unit,
      },
      {
        value: item.karyawan_pengajuan.nama,
        td: (
          <AvatarAndNameTableData
            data={{
              id: item.karyawan_pengajuan.id,
              nama: item.karyawan_pengajuan.nama,
              foto_profil: item.karyawan_pengajuan.foto_profil,
            }}
          />
        ),
      },
      {
        value: item.karyawan_ditukar.nama,
        td: (
          <AvatarAndNameTableData
            data={{
              id: item.karyawan_ditukar.id,
              nama: item.karyawan_ditukar.nama,
              foto_profil: item.karyawan_ditukar.foto_profil,
            }}
          />
        ),
      },
      {
        value: item.pertukaran_jadwal,
        td: (
          <PertukaranJadwalModal id={item.id} data={item.pertukaran_jadwal} />
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: "",
        td: item?.status_penukaran?.id === 1 && (
          <PermissionTooltip permission={verif1Permission}>
            <VerifikasiModal
              aria-label={`perubahan-data-verif-1-button-${item.id}"`}
              id={`verifikasi-perubahan-data-modal-${item.id}`}
              submitUrl={`/api/rski/dashboard/jadwal-karyawan/cuti/${item.id}/verifikasi-tahap-1`}
              approvePayloadKey="verifikasi_pertama_disetujui"
              disapprovePayloadKey="verifikasi_pertama_ditolak"
              isDisabled={!verif1Permission}
            />
          </PermissionTooltip>
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
      {
        value: "",
        td: item?.status_penukaran?.id === 2 && (
          <PermissionTooltip permission={verif2Permission}>
            <VerifikasiModal
              aria-label={`perubahan-data-verif-2-button-${item.id}"`}
              id={`verifikasi-perubahan-data-modal-${item.id}`}
              submitUrl={`/api/rski/dashboard/jadwal-karyawan/cuti/${item.id}/verifikasi-tahap-2`}
              approvePayloadKey="verifikasi_kedua_disetujui"
              disapprovePayloadKey="verifikasi_kedua_ditolak"
              isDisabled={!verif2Permission}
            />
          </PermissionTooltip>
        ),
        props: {
          position: "sticky",
          right: 0,
          zIndex: 1,
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
