import { Center, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useTransferKaryawanTableColumnsConfig from "../../global/useTransferKaryawanTableColumnsConfig";
import useDataState from "../../hooks/useDataState";
import formatDate from "../../lib/formatDate";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";

interface Props {
  filterConfig?: any;
}

export default function TabelTransferKaryawan({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Config
  const { formattedFilterKaryawan } = useFilterKaryawan();
  // Columns Config
  const { columnsConfig } = useTransferKaryawanTableColumnsConfig();

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any>({
      initialData: undefined,
      url: `/api/rski/dashboard/karyawan/transfer/get-data-trasnfer?page=${pageConfig}`,
      payload: {
        ...formattedFilterKaryawan,
        ...(filterConfig?.kategori_transfer?.length > 0 && {
          kategori_transfer: filterConfig.kategori_transfer.map(
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
      th: "No. Induk Karyawan",
      isSortable: true,
    },
    {
      th: "Kategori Transfer",
      isSortable: true,
    },
    {
      th: "Tanggal Pengajuan",
      isSortable: true,
    },
    {
      th: "Tanggal Mulai",
      isSortable: true,
    },
    {
      th: "Unit Kerja Asal",
      isSortable: true,
    },
    {
      th: "Unit Kerja Tujuan",
      isSortable: true,
    },
    {
      th: "Jabatan Asal",
      isSortable: true,
    },
    {
      th: "Jabatan Tujuan",
      isSortable: true,
    },
    {
      th: "Alasan",
    },
    {
      th: "Dokumen",
      isSortable: true,
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
        value: item.nik,
        td: item.nik,
        isNumeric: true,
      },
      {
        value: item.kategori_transfer?.label,
        td: item.kategori_transfer?.label,
      },
      {
        value: item.created_at,
        td: formatDate(item.created_at),
      },
      {
        value: item.tgl_mulai,
        td: formatDate(item.tgl_mulai),
      },
      {
        value: item.unit_kerja_asal?.nama_unit,
        td: item.unit_kerja_asal?.nama_unit,
      },
      {
        value: item.unit_kerja_tujuan?.nama_unit,
        td: item.unit_kerja_tujuan?.nama_unit,
      },
      {
        value: item.jabatan_asal?.nama_jabatan,
        td: item.jabatan_asal?.nama_jabatan,
      },
      {
        value: item.jabatan_tujuan?.nama_jabatan,
        td: item.jabatan_tujuan?.nama_jabatan,
      },
      {
        value: item.alasan,
        td: (
          <Tooltip label={item.alasan}>
            <Text
              maxW={"200px"}
              overflow={"hidden"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
            >
              {item.alasan}
            </Text>
          </Tooltip>
        ),
      },
      {
        value: "-",
        td: "-",
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
              {/* <HStack justify={"space-between"} mt={responsiveSpacing}>
                <Skeleton maxW={"120px"} />
                <Skeleton maxW={"300px"} h={"20px"} />
                <Skeleton maxW={"112px"} />
              </HStack> */}
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
                      columnsConfig={columnsConfig}
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
