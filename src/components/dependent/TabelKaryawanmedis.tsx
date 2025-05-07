import { Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useDataState from "../../hooks/useDataState";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";
import formatDate from "../../lib/formatDate";
import monthDiff from "../../lib/monthDiff";

interface Props {
  filterConfig: any;
}
export default function TabelKaryawanmedis({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/karyawan/get-karyawan-medis?page=${pageConfig}`,
      payload: {
        ...filterConfig,
      },
      limit: limitConfig,
      dependencies: [limitConfig, pageConfig, filterConfig],
    });

  useEffect(() => {
    setPageConfig(1);
  }, [filterConfig]);

  //    {
  //     "id": 2699,
  //     "user": {
  //         "id": 2733,
  //         "nama": "MARDHATILLAH",
  //         "username": "mardhatillah",
  //         "email_verified_at": null,
  //         "data_karyawan_id": 2699,
  //         "foto_profil": null,
  //         "data_completion_step": 0,
  //         "status_aktif": 2,
  //         "tgl_dinonaktifkan": null,
  //         "alasan": null,
  //         "created_at": "2024-09-12T06:41:19.000000Z",
  //         "updated_at": "2024-09-12T06:41:19.000000Z"
  //     },
  //     "role": {
  //         "id": 19,
  //         "name": "Manajer",
  //         "deskripsi": null,
  //         "created_at": null,
  //         "updated_at": null
  //     },
  //     "email": "mardhatillah.bws@gmail.com",
  //     "nik": "20101154",
  //     "nik_ktp": "3311125908770003",
  //     "status_karyawan": {
  //         "id": 1,
  //         "label": "Tetap",
  //         "kategori_status_id": 1,
  //         "deleted_at": null,
  //         "created_at": "2024-08-29T15:10:20.000000Z",
  //         "updated_at": "2024-08-29T15:10:20.000000Z"
  //     },
  //     "tempat_lahir": "JAKARTA",
  //     "tgl_lahir": "19-08-1977",
  //     "no_kk": "3311122408090013",
  //     "alamat": "MANGKUYUDAN RT.02\/04 JL.MEGA PERMAI NO.5, NGABEYAN, KARTASURA, SUKOHARJO",
  //     "gelar_depan": "dr",
  //     "gelar_belakang": "MPH",
  //     "no_hp": "089510610891",
  //     "jenis_kelamin": 0,
  //     "kompetensi": {
  //         "id": 2,
  //         "nama_kompetensi": "Dokter Umum",
  //         "jenis_kompetensi": 1,
  //         "nilai_bor": 120000,
  //         "deleted_at": null,
  //         "created_at": "2024-09-09T20:20:12.000000Z",
  //         "updated_at": null
  //     },
  //     "no_str": "UB00000801709496",
  //     "created_str": "2024-02-02 00:00:00",
  //     "masa_berlaku_str": null,
  //     "no_sip": "33724.57142\/DU\/01\/KS.23.01\/0553\/VII\/2022",
  //     "created_sip": "2022-07-22 00:00:00",
  //     "masa_berlaku_sip": "2027-08-19 00:00:00",
  //     "created_at": "2024-09-12T06:41:19.000000Z",
  //     "updated_at": "2025-04-24T09:27:41.000000Z"
  // }

  // const userData = useGetUserData();

  const formattedHeader = [
    {
      th: "Karyawan",
      isSortable: true,
      props: {
        position: "sticky",
        left: "0",
        zIndex: 99,
        w: "243px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
    },
    {
      th: "No. Induk Karyawan",
      isSortable: true,
    },
    {
      th: "Tanggal Berakhir SIP",
      isSortable: true,
    },
    {
      th: "Masa Berlaku SIP",
      isSortable: true,
      cProps: {
        justifyContent: "center",
      },
    },
    {
      th: "Tanggal Berakhir STR",
      isSortable: true,
    },
    {
      th: "Masa Berlaku STR",
      isSortable: true,
      cProps: {
        justifyContent: "center",
      },
    },
  ];
  const formattedData = data?.map((item: any) => {
    return {
      id: item.id,
      columnsFormat: [
        {
          value: item?.user?.nama,
          td: (
            <AvatarAndNameTableData
              detailKaryawanId={item.id}
              data={{
                id: item?.user?.id,
                nama: item?.user?.nama,
                foto_profil: item?.user?.foto_profil,
              }}
            />
          ),
          props: {
            position: "sticky",
            left: "0",
            w: "243px",
          },
          cProps: {
            borderRight: "1px solid var(--divider3)",
          },
        },
        {
          value: item?.nik,
          td: item?.nik,
          isNumeric: true,
        },
        {
          value: item?.masa_berlaku_sip,
          td: `${formatDate(item?.masa_berlaku_sip)}`,
          isDate: true,
        },
        {
          value: item?.masa_berlaku_sip,
          td: item?.masa_berlaku_sip
            ? `${monthDiff(new Date(), new Date(item?.masa_berlaku_sip))} bulan`
            : "",
          isDate: true,
          cProps: {
            color:
              monthDiff(new Date(), new Date(item?.masa_berlaku_sip)) < 7
                ? "red.400"
                : "",
            justifyContent: "center",
          },
        },
        {
          value: item?.masa_berlaku_str,
          td: `${formatDate(item?.masa_berlaku_str)}`,
          isDate: true,
        },
        {
          value: item?.masa_berlaku_str,
          td: item?.masa_berlaku_str
            ? `${monthDiff(new Date(), new Date(item?.masa_berlaku_str))} bulan`
            : "",
          isDate: true,
          cProps: {
            color:
              monthDiff(new Date(), new Date(item?.masa_berlaku_sip)) < 7
                ? "red.400"
                : "",
            justifyContent: "center",
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
