import { Center, Icon, MenuItem, Text, Tooltip } from "@chakra-ui/react";
import { RiDeleteBinLine, RiEditLine, RiHistoryLine } from "@remixicon/react";
import { Interface__SelectOption } from "../../constant/interfaces";
import { iconSize } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import isObjectEmpty from "../../lib/isObjectEmpty";
import EditKuisionerModalDisclosure from "../independent/EditKuisionerModalDisclosure";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import DeleteDataPengaturanModalDisclosure from "./DeleteDataPengaturanModalDisclosure";
import RestoreDataPengaturanModalDisclosure from "./RestoreDataPengaturanModalDisclosure";
import Retry from "./Retry";
import StatusDihapus from "./StatusDihapus";
import StatusKaryawanBadge from "./StatusKaryawanBadge";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import PermissionTooltip from "../wrapper/PermissionTooltip";

interface Props {
  filterConfig?: any;
}

export default function TabelPengaturanKuisioner({ filterConfig }: Props) {
  // SX

  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [82]);
  const deletePermission = isHasPermissions(userPermissions, [83]);

  // Row Options Config
  const rowOptions = [
    (rowData: any) => {
      return (
        <EditKuisionerModalDisclosure rowData={rowData}>
          <PermissionTooltip permission={editPermission} placement="left">
            <MenuItem isDisabled={!editPermission}>
              <Text>Edit</Text>
              <Icon as={RiEditLine} fontSize={iconSize} opacity={0.4} />
            </MenuItem>
          </PermissionTooltip>
        </EditKuisionerModalDisclosure>
      );
    },
    (rowData: any) => {
      return (
        <RestoreDataPengaturanModalDisclosure
          id={rowData.id}
          url={`/api/rski/dashboard/pengaturan/pertanyaan/restore`}
        >
          <PermissionTooltip permission={editPermission} placement="left">
            <MenuItem
              isDisabled={!rowData.columnsFormat[1].value || !editPermission}
            >
              <Text>Restore</Text>
              <Icon as={RiHistoryLine} fontSize={iconSize} opacity={0.4} />
            </MenuItem>
          </PermissionTooltip>
        </RestoreDataPengaturanModalDisclosure>
      );
    },
    "divider",
    (rowData: any) => {
      return (
        <DeleteDataPengaturanModalDisclosure
          id={rowData.id}
          url={`/api/rski/dashboard/pengaturan/pertanyaan`}
        >
          <PermissionTooltip permission={deletePermission} placement="left">
            <MenuItem
              fontWeight={500}
              isDisabled={rowData.columnsFormat[1].value || !deletePermission}
            >
              <Text color={"red.400"}>Delete</Text>
              <Icon
                color={"red.400"}
                as={RiDeleteBinLine}
                fontSize={iconSize}
              />
            </MenuItem>
          </PermissionTooltip>
        </DeleteDataPengaturanModalDisclosure>
      );
    },
  ];

  const { error, notFound, loading, data, retry } = useDataState<any[]>({
    initialData: undefined,
    url: "/api/rski/dashboard/pengaturan/pertanyaan",
    dependencies: [],
  });

  const fd = data?.filter((item: any) => {
    const searchTerm = filterConfig?.search.toLowerCase();
    const isDeletedTerm = filterConfig?.is_deleted?.map(
      (term: Interface__SelectOption) => term.value
    );
    const jabatanTerm = filterConfig?.jabatan?.map(
      (term: Interface__SelectOption) => term.value
    );

    const matchesSearchTerm = item.pertanyaan
      .toLowerCase()
      .includes(searchTerm);
    const matchesIsDeletedTerm =
      isDeletedTerm?.includes(1) && isDeletedTerm?.includes(0)
        ? true
        : isDeletedTerm?.includes(1)
        ? !!item.deleted_at
        : isDeletedTerm?.includes(0)
        ? !item.deleted_at
        : true;
    const matchesJabatan =
      jabatanTerm && jabatanTerm.length > 0
        ? jabatanTerm?.includes(item.jabatan?.id)
        : true;

    return matchesSearchTerm && matchesIsDeletedTerm && matchesJabatan;
  });

  const formattedHeader = [
    {
      th: "Pertanyaan",
      isSortable: true,
    },
    {
      th: "Status Dihapus",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Jenis Penilaian",
      isSortable: true,
    },
    {
      th: "Status Karyawan Dinilai",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Jabatan Penilai",
      isSortable: true,
    },
    {
      th: "Jabatan Dinilai",
      isSortable: true,
    },
  ];
  const formattedData = fd?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.pertanyaan,
        td: (
          <Tooltip label={item.pertanyaan} openDelay={500} placement="right">
            <Text
              w={"100%"}
              maxW={"300px"}
              overflow={"hidden"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
            >
              {item.pertanyaan}
            </Text>
          </Tooltip>
        ),
        isSortable: true,
      },
      {
        value: item.deleted_at,
        td: item.deleted_at ? <StatusDihapus data={item.deleted_at} /> : "",
        isDate: true,
        cProps: {
          justify: "center",
        },
      },
      {
        original_data: item.jenis_penilaian,
        value: item.jenis_penilaian?.nama,
        td: item.jenis_penilaian?.nama,
      },
      {
        original_data: item.jenis_penilaian?.status_karyawans,
        value: item.jenis_penilaian?.status_karyawans?.id,
        td: (
          <StatusKaryawanBadge
            data={item.jenis_penilaian?.status_karyawans}
            w={"120px"}
          />
        ),
        isNumeric: true,
        cProps: {
          justify: "center",
        },
      },
      {
        original_data: item.jenis_penilaians?.jabatan_penilai,
        value: item.jenis_penilaian?.jabatan_penilais?.nama_jabatan,
        td: item.jenis_penilaian?.jabatan_penilais?.nama_jabatan,
      },
      {
        original_data: item.jenis_penilaian?.jabatan_dinilai,
        value: item.jenis_penilaian?.jabatan_dinilais?.nama_jabatan,
        td: item.jenis_penilaian?.jabatan_dinilais?.nama_jabatan,
      },
    ],
  }));

  return (
    <>
      {error && (
        <>
          {notFound && isObjectEmpty(filterConfig) && <NoData minH={"300px"} />}

          {notFound && !isObjectEmpty(filterConfig) && (
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
                  {fd && fd?.length === 0 && <NotFound minH={"300px"} />}

                  {fd && fd?.length > 0 && (
                    <>
                      <CustomTableContainer>
                        <CustomTable
                          formattedHeader={formattedHeader}
                          formattedData={formattedData}
                          rowOptions={rowOptions}
                        />
                      </CustomTableContainer>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
