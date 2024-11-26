import { Button, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useDataState from "../../hooks/useDataState";
import useGetUserData from "../../hooks/useGetUserData";
import formatDate from "../../lib/formatDate";
import formatDuration from "../../lib/formatDuration";
import formatTime from "../../lib/formatTime";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import VerifikatorBelumDitentukan from "../independent/VerifikatorBelumDitentukan";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import StatusVerifikasiBadge2 from "./StatusVerifikasiBadge2";
import TabelElipsisText from "./TabelElipsisText";
import TabelFooterConfig from "./TabelFooterConfig";
import VerifikasiModal from "./VerifikasiModal";
import VerifikatorName from "./VerifikatorName";

interface Props {
  filterConfig: any;
}

export default function TabelDiklatEksternal({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/perusahaan/get-diklat-eksternal?page=${pageConfig}`,
      payload: {
        ...filterConfig,
      },
      limit: limitConfig,
      dependencies: [limitConfig, pageConfig, filterConfig],
    });

  useEffect(() => {
    setPageConfig(1);
  }, [filterConfig]);

  const userData = useGetUserData();

  const formattedHeader = [
    {
      th: "Nama Acara",
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
      th: "Karyawan Pengajuan",
      isSortable: true,
    },
    {
      th: "Status Verifikasi",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Sertifikat",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Deskripsi",
    },
    // {
    //   th: "Kuota",
    //   isSortable: true,
    //   cProps: {
    //     justify: "center",
    //   },
    // },
    {
      th: "Tanggal Mulai",
      isSortable: true,
    },
    {
      th: "Tanggal Selesai",
      isSortable: true,
    },
    {
      th: "Jam Mulai",
      isSortable: true,
      props: {
        zIndex: 2,
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Jam Selesai",
      isSortable: true,
      props: {
        zIndex: 2,
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Durasi",
      isSortable: true,
    },
    // {
    //   th: "Kategori Acara",
    //   isSortable: true,
    // },
    {
      th: "Tempat",
      isSortable: true,
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
          value: item.nama_diklat,
          td: <TabelElipsisText data={item.nama_diklat} />,
          props: {
            position: "sticky",
            left: 0,
            zIndex: 2,
          },
          cProps: {
            borderRight: "1px solid var(--divider3)",
            w: "243px",
          },
        },
        {
          value: item?.list_peserta?.[0].user.nama,
          td: (
            <AvatarAndNameTableData
              detailKaryawanId={item.id}
              data={{
                id: item?.list_peserta?.[0].user.id,
                nama: item?.list_peserta?.[0].user.nama,
                foto_profil: item?.list_peserta?.[0].user.foto_profil,
              }}
            />
          ),
        },
        {
          value: item.status_diklat.label,
          td: <StatusVerifikasiBadge2 data={item.status_diklat} w={"180px"} />,
        },
        {
          value: item.path,
          td: (
            <Button
              colorScheme="ap"
              variant={"ghost"}
              className="clicky"
              as={Link}
              target="_blank"
              to={item.path}
            >
              Lihat
            </Button>
          ),
          cProps: {
            justify: "center",
          },
        },
        {
          value: item.deskripsi,
          td: <TabelElipsisText data={item.deskripsi} />,
        },
        // {
        //   value: item.kuota,
        //   td: item.kuota,
        //   cProps: { justify: "center" },
        // },
        {
          value: item.tgl_mulai,
          td: formatDate(item.tgl_mulai),
          isDate: true,
        },
        {
          value: item.tgl_selesai,
          td: formatDate(item.tgl_selesai),
          isDate: true,
        },
        {
          value: item.jam_mulai,
          td: formatTime(item.jam_mulai),
          isTime: true,
          cProps: {
            justify: "center",
          },
        },
        {
          value: item.jam_selesai,
          td: formatTime(item.jam_selesai),
          isTime: true,
          cProps: {
            justify: "center",
          },
        },
        {
          value: item.durasi,
          td: formatDuration(item.durasi),
          isTime: true,
        },
        // {
        //   value: item.kategori_diklat?.label,
        //   td: item.kategori_diklat?.label,
        // },
        {
          value: item.lokasi,
          td: item.lokasi,
        },
        {
          value: "",
          td: (
            <>
              {item?.status_diklat?.id === 1 && (
                <>
                  {item?.relasi_verifikasi?.[0]?.id === null &&
                    userData?.id !== 1 && <VerifikatorBelumDitentukan />}

                  {(item?.relasi_verifikasi?.[0]?.id || userData?.id === 1) && (
                    <PermissionTooltip permission={verif1Permission}>
                      <VerifikasiModal
                        aria-label={`diklat-eksternal-verif-1-button-${item.id}`}
                        id={`verifikasi-diklat-eksternal-modal-${item.id}`}
                        submitUrl={`/api/rski/dashboard/perusahaan/diklat/${item.id}/verifikasi-diklat-eksternal-step-1`}
                        approvePayloadKey="verifikasi_pertama_disetujui"
                        disapprovePayloadKey="verifikasi_pertama_ditolak"
                        isDisabled={!verif1Permission}
                      />
                    </PermissionTooltip>
                  )}
                </>
              )}

              {[2, 3, 4, 5].includes(item?.status_diklat?.id) && (
                <VerifikatorName
                  nama={item?.relasi_verifikasi?.[0]?.verifikator?.nama}
                  verification={
                    [2, 4, 5].includes(item?.status_diklat?.id) ? true : false
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
              {item?.relasi_verifikasi?.[1]?.id === null &&
                userData?.id !== 1 && <VerifikatorBelumDitentukan />}

              {(item?.relasi_verifikasi?.[1]?.id || userData?.id === 1) && (
                <>
                  {[1, 3].includes(item?.status_diklat?.id) && (
                    <VerifikatorName
                      nama={item?.relasi_verifikasi?.[1]?.verifikator?.nama}
                      verification={null}
                    />
                  )}

                  {item?.status_diklat?.id === 2 && (
                    <PermissionTooltip permission={verif2Permission}>
                      <VerifikasiModal
                        aria-label={`diklat-eksternal-verif-2-button-${item.id}`}
                        id={`verifikasi-diklat-eksternal-modal-${item.id}`}
                        submitUrl={`/api/rski/dashboard/perusahaan/diklat/${item.id}/verifikasi-diklat-eksternal-step-2`}
                        approvePayloadKey="verifikasi_kedua_disetujui"
                        disapprovePayloadKey="verifikasi_kedua_ditolak"
                        isDisabled={!verif2Permission}
                      />
                    </PermissionTooltip>
                  )}

                  {[4, 5].includes(item?.status_diklat?.id) && (
                    <VerifikatorName
                      nama={item?.relasi_verifikasi?.[1]?.verifikator?.nama}
                      verification={
                        item?.status_diklat?.id === 4 ? true : false
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
          {notFound && isObjectEmpty(filterConfig, ["periode_tahun"]) && (
            <NoData minH={"300px"} />
          )}

          {notFound && !isObjectEmpty(filterConfig, ["periode_tahun"]) && (
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
