import {
  Button,
  Center,
  Icon,
  MenuItem,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { RiEditLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { iconSize } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useTransferKaryawanTableColumnsConfig from "../../global/useTransferKaryawanTableColumnsConfig";
import useDataState from "../../hooks/useDataState";
import formatDate from "../../lib/formatDate";
import isHasPermissions from "../../lib/isHasPermissions";
import isObjectEmpty from "../../lib/isObjectEmpty";
import EditTransferKaryawanModalDisclosure from "../independent/EditTransferKaryawanModalDisclosure";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";
import isDatePassed from "../../lib/isDatePassed";

interface Props {
  filterConfig?: any;
}

export default function TabelTransferKaryawan({ filterConfig }: Props) {
  // Permissions
  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [132]);

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

  useEffect(() => {
    setPageConfig(1);
  }, [formattedFilterKaryawan, filterConfig]);

  // Row Options Config
  const rowOptions = [
    (rowData: any) => {
      return (
        <EditTransferKaryawanModalDisclosure rowData={rowData}>
          <PermissionTooltip permission={editPermission}>
            <MenuItem
              isDisabled={
                !editPermission || isDatePassed(rowData.columnsFormat[4].value)
              }
            >
              <Text>Edit</Text>
              <Icon as={RiEditLine} fontSize={iconSize} opacity={0.4} />
            </MenuItem>
          </PermissionTooltip>
        </EditTransferKaryawanModalDisclosure>
      );
    },
  ];

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
      th: "Kelompok Gaji Asal",
      isSortable: true,
    },
    {
      th: "Kelompok Gaji Tujuan",
      isSortable: true,
    },
    {
      th: "Hak Akses (Role) Asal",
      isSortable: true,
    },
    {
      th: "Hak Akses (Role) Tujuan",
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
        original_data: item.user,
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
        value: item.nik,
        td: item.nik,
        isNumeric: true,
      },
      {
        value: item.kategori_transfer?.label,
        original_data: item.kategori_transfer,
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
        original_data: item.unit_kerja_asal,
        td: item.unit_kerja_asal?.nama_unit,
      },
      {
        value: item.unit_kerja_tujuan?.nama_unit,
        original_data: item.unit_kerja_tujuan,
        td: item.unit_kerja_tujuan?.nama_unit,
      },
      {
        value: item.jabatan_asal?.nama_jabatan,
        original_data: item.jabatan_asal,
        td: item.jabatan_asal?.nama_jabatan,
      },
      {
        value: item.jabatan_tujuan?.nama_jabatan,
        original_data: item.jabatan_tujuan,
        td: item.jabatan_tujuan?.nama_jabatan,
      },
      {
        value: item.kelompok_gaji_asal?.nama_kelompok,
        original_data: item.kelompok_gaji_asal,
        td: item.kelompok_gaji_asal?.nama_kelompok,
      },
      {
        value: item.kelompok_gaji_tujuan?.nama_kelompok,
        original_data: item.kelompok_gaji_tujuan,
        td: item.kelompok_gaji_tujuan?.nama_kelompok,
      },
      {
        value: item.role_asal?.name,
        original_data: item.role_asal,
        td: item.role_asal?.name,
      },
      {
        value: item.role_tujuan?.name,
        original_data: item.role_tujuan,
        td: item.role_tujuan?.name,
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
        value: item.dokumen,
        original_data: item.dokumen,
        td: (
          <Button
            colorScheme="ap"
            variant={"ghost"}
            className="clicky"
            as={Link}
            to={`${item.dokumen}`}
            target="_blank"
          >
            Lihat
          </Button>
        ),
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
              {(!data || (data && data.length === 0)) && (
                <NoData minH={"300px"} />
              )}

              {(data || (data && data.length > 0)) && (
                <>
                  <CustomTableContainer>
                    <CustomTable
                      formattedHeader={formattedHeader}
                      formattedData={formattedData}
                      rowOptions={rowOptions}
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
