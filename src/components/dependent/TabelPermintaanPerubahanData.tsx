import { Box, Center, Text, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import dataKaryawanLabel from "../../constant/dataKaryawanLabel";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useDataState from "../../hooks/useDataState";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import VerifikatorBelumDitentukan from "../independent/VerifikatorBelumDitentukan";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import PerubahanDataRender from "./PerubahanDataRender";
import Retry from "./Retry";
import StatusApprovalBadge from "./StatusVerifikasiBadge";
import TabelFooterConfig from "./TabelFooterConfig";
import VerifikasiModal from "./VerifikasiModal";
import useGetUserData from "../../hooks/useGetUserData";
import VerifikatorName from "./VerifikatorName";
import formatDate from "../../lib/formatDate";

interface Props {
  filterConfig: any;
}

export default function TabelPermintaanPerubahanData({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Config
  const { formattedFilterKaryawan } = useFilterKaryawan();

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any>({
      initialData: undefined,
      url: `/api/rski/dashboard/karyawan/riwayat-perubahan/get-riwayat-perubahan-karyawan?page=${pageConfig}`,
      payload: {
        ...formattedFilterKaryawan,
        ...(filterConfig?.status_verifikasi?.length > 0 && {
          status_verifikasi: filterConfig.status_verifikasi.map(
            (sp: any) => sp.value
          ),
        }),
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
      th: "Status Verifikasi",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Tanggal Pengajuan",
      isSortable: true,
    },
    {
      th: "Kolom",
      isSortable: true,
    },
    {
      th: "Data Original",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Data Pengajuan",
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
        w: "122px",
      },
    },
  ];
  const formattedData = data?.map((item: any, i: number) => {
    const verif1Permission =
      item?.relasi_verifikasi?.[0]?.verifikator?.id === userData?.id ||
      userData?.id === 1;

    return {
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
            left: 0,
            zIndex: 2,
          },
          cProps: {
            borderRight: "1px solid var(--divider3)",
          },
        },
        {
          value: item?.status_perubahan?.id,
          td: (
            <Tooltip
              label={
                item?.alasan && (
                  <>
                    <Text>Alasan Ditolak</Text>

                    <Text opacity={0.4} mt={2}>
                      {item?.alasan}
                    </Text>
                  </>
                )
              }
              placement="right"
            >
              <Box>
                <StatusApprovalBadge
                  data={item?.status_perubahan}
                  w={"120px"}
                />
              </Box>
            </Tooltip>
          ),
          isNumeric: true,
          cProps: {
            justify: "center",
          },
        },
        {
          value: item.created_at,
          td: formatDate(item.created_at),
        },
        {
          value: item.kolom,
          //@ts-ignore
          td: dataKaryawanLabel[item.kolom] || "Invalid",
        },
        {
          value: item.data,
          td: (
            <PerubahanDataRender
              column={item?.kolom?.toLowerCase()}
              data={item.original_data}
            />
          ),
          cProps: {
            justify: "center",
          },
        },
        {
          value: item.data,
          td: (
            <PerubahanDataRender
              column={item?.kolom?.toLowerCase()}
              data={item.updated_data}
              index={i}
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
              {item?.status_perubahan?.id === 1 && (
                <>
                  {item?.relasi_verifikasi?.[0]?.id === null &&
                    userData?.id !== 1 && <VerifikatorBelumDitentukan />}

                  {(item?.relasi_verifikasi?.[0]?.id || userData?.id === 1) && (
                    <PermissionTooltip permission={verif1Permission}>
                      <VerifikasiModal
                        aria-label={`peruibahan-data-verif-1-button-${item.id}`}
                        id={`verifikasi-peruibahan-data-modal-${item.id}`}
                        submitUrl={`/api/rski/dashboard/karyawan/riwayat-perubahan/verifikasi-data/${item.id}`}
                        // approvePayloadKey="verifikasi_pertama_disetujui"
                        // disapprovePayloadKey="verifikasi_pertama_ditolak"
                        isDisabled={!verif1Permission}
                      />
                    </PermissionTooltip>
                  )}
                </>
              )}

              {[2, 3].includes(item?.status_perubahan?.id) && (
                <VerifikatorName
                  nama={item?.relasi_verifikasi?.[0]?.verifikator?.nama}
                  verification={
                    [2].includes(item?.status_perubahan?.id) ? true : false
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
              {(!data || (data && data.length === 0)) && (
                <NoData minH={"300px"} />
              )}

              {(data || (data && data.length > 0)) && (
                <>
                  <CustomTableContainer>
                    <CustomTable
                      formattedHeader={formattedHeader}
                      formattedData={formattedData}
                      // onRowClick={() => {
                      //   onOpen();
                      // }}
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
