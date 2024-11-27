import { Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useDataState from "../../hooks/useDataState";
import useGetUserData from "../../hooks/useGetUserData";
import formatDate from "../../lib/formatDate";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import VerifikatorBelumDitentukan from "../independent/VerifikatorBelumDitentukan";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import PertukaranJadwalModal from "./PertukaranJadwalModal";
import Retry from "./Retry";
import StatusTukarJadwalApprovalKaryawanBadge from "./StatusTukarJadwalApprovalKaryawanBadge";
import StatusVerifikasiBadge2 from "./StatusVerifikasiBadge2";
import TabelFooterConfig from "./TabelFooterConfig";
import VerifikasiModal from "./VerifikasiModal";
import VerifikatorName from "./VerifikatorName";

interface Props {
  filterConfig?: any;
}

export default function TabelTUkarJadwal({ filterConfig }: Props) {
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

  useEffect(() => {
    setPageConfig(1);
  }, [formattedFilterKaryawan, filterConfig]);

  const userData = useGetUserData();

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
      th: "Persetujuan Karyawan",
      isSortable: true,
      cProps: {
        justify: "center",
      },
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
        w: "122px",
      },
      cProps: {
        justify: "center",
        borderLeft: "1px solid var(--divider3)",
        borderRight: "1px solid var(--divider3)",
        w: "122px",
      },
    },
    {
      th: "Verif. 2",
      props: {
        // position: "sticky",
        right: 0,
        zIndex: 3,
        w: "122px",
      },
      cProps: {
        justify: "center",
        // borderLeft: "1px solid var(--divider3)",
        w: "122px",
      },
    },
  ];
  const formattedData = data?.map((item: any) => {
    const verif1Permission =
      item?.relasi_verifikasi?.[0]?.verifikator?.id === userData?.id ||
      userData?.id === 1;
    const verif2Permission =
      item?.relasi_verifikasi?.[1]?.verifikator?.id === userData?.id ||
      userData?.id === 1;

    return {
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
          value: item.acc_user_ditukar,
          td: (
            <StatusTukarJadwalApprovalKaryawanBadge
              data={item.acc_user_ditukar}
              w={"120px"}
            />
          ),
          cProps: {
            justify: "center",
          },
        },
        {
          value: item.acc_user_ditukar,
          td: (
            <StatusVerifikasiBadge2 data={item.status_penukaran} w={"180px"} />
          ),
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
              detailKaryawanId={item.id}
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
              detailKaryawanId={item.id}
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
            <PertukaranJadwalModal
              id={item.id}
              userPengajuan={item.karyawan_pengajuan}
              userDitukar={item.karyawan_ditukar}
              data={item.pertukaran_jadwal}
            />
          ),
          cProps: {
            justify: "center",
          },
        },
        {
          value: "",
          td: (
            <>
              {item?.status_penukaran?.id === 1 && (
                <>
                  {item?.relasi_verifikasi_pengajuan?.[0]?.id === null &&
                    userData?.id !== 1 && <VerifikatorBelumDitentukan />}

                  {[1, 3].includes(item?.acc_user_ditukar) && (
                    <VerifikatorName
                      nama={
                        item?.relasi_verifikasi_pengajuan?.[1]?.verifikator
                          ?.nama
                      }
                      verification={null}
                    />
                  )}

                  {(item?.relasi_verifikasi_pengajuan?.[0]?.id ||
                    userData?.id === 1) &&
                    item?.acc_user_ditukar === 2 && (
                      <PermissionTooltip permission={verif1Permission}>
                        <VerifikasiModal
                          aria-label={`tukar-jadwal-verif-1-button-${item.id}`}
                          id={`verifikasi-tukar-jadwal-modal-${item.id}`}
                          submitUrl={`/api/rski/dashboard/jadwal-karyawan/tukar-jadwal/${item.id}/verifikasi-step-1`}
                          approvePayloadKey="verifikasi_pertama_disetujui"
                          disapprovePayloadKey="verifikasi_pertama_ditolak"
                          isDisabled={!verif1Permission}
                        />
                      </PermissionTooltip>
                    )}
                </>
              )}

              {[2, 3, 4, 5].includes(item?.status_penukaran?.id) && (
                <VerifikatorName
                  nama={
                    item?.relasi_verifikasi_pengajuan?.[0]?.verifikator?.nama
                  }
                  verification={
                    [2, 4, 5].includes(item?.status_penukaran?.id)
                      ? true
                      : false
                  }
                />
              )}
            </>
          ),
          props: {
            position: "sticky",
            right: 0,
            zIndex: 2,
          },
          cProps: {
            justify: "center",
            borderLeft: "1px solid var(--divider3)",
            borderRight: "1px solid var(--divider3)",
          },
        },
        {
          value: "",
          td: (
            <>
              {item?.relasi_verifikasi_pengajuan?.[1]?.id === null &&
                userData?.id !== 1 && <VerifikatorBelumDitentukan />}

              {(item?.relasi_verifikasi_pengajuan?.[1]?.id ||
                userData?.id === 1) && (
                <>
                  {[1, 3].includes(item?.status_penukaran?.id) && (
                    <VerifikatorName
                      nama={
                        item?.relasi_verifikasi_pengajuan?.[1]?.verifikator
                          ?.nama
                      }
                      verification={null}
                    />
                  )}

                  {item?.status_penukaran?.id === 2 && (
                    <PermissionTooltip permission={verif2Permission}>
                      <VerifikasiModal
                        aria-label={`tukar-jadwal-verif-2-button-${item.id}`}
                        id={`verifikasi-tukar-jadwal-modal-${item.id}`}
                        submitUrl={`/api/rski/dashboard/jadwal-karyawan/tukar-jadwal/${item.id}/verifikasi-step-2`}
                        approvePayloadKey="verifikasi_kedua_disetujui"
                        disapprovePayloadKey="verifikasi_kedua_ditolak"
                        isDisabled={!verif2Permission}
                      />
                    </PermissionTooltip>
                  )}

                  {[4, 5].includes(item?.status_penukaran?.id) && (
                    <VerifikatorName
                      nama={
                        item?.relasi_verifikasi_pengajuan?.[1]?.verifikator
                          ?.nama
                      }
                      verification={
                        item?.status_penukaran?.id === 4 ? true : false
                      }
                    />
                  )}
                </>
              )}
            </>
          ),
          props: {
            // position: "sticky",
            right: 0,
            zIndex: 1,
          },
          cProps: {
            justify: "center",
            // borderLeft: "1px solid var(--divider3)",
          },
        },
      ],
    };
  });

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
