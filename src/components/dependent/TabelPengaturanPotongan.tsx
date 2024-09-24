import { Center, Icon, MenuItem, Text, Tooltip } from "@chakra-ui/react";
import { RiDeleteBinLine, RiEditLine, RiHistoryLine } from "@remixicon/react";
import { Interface__SelectOption } from "../../constant/interfaces";
import { iconSize } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import formatNumber from "../../lib/formatNumber";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import DeleteDataPengaturanModalDisclosure from "./DeleteDataPengaturanModalDisclosure";
import RestoreDataPengaturanModalDisclosure from "./RestoreDataPengaturanModalDisclosure";
import Retry from "./Retry";
import StatusDihapus from "./StatusDihapus";
import EditPotonganModalDisclosure from "../independent/EditPotonganModalDisclosure";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import PermissionTooltip from "../wrapper/PermissionTooltip";

interface Props {
  filterConfig?: any;
}

export default function TabelPengaturanPotongan({ filterConfig }: Props) {
  // SX

  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [86]);
  const deletePermission = isHasPermissions(userPermissions, [87]);

  // Row Options Config
  const rowOptions = [
    (rowData: any) => {
      return (
        <EditPotonganModalDisclosure rowData={rowData}>
          <PermissionTooltip permission={editPermission} placement="left">
            <MenuItem isDisabled={!editPermission}>
              <Text>Edit</Text>
              <Icon as={RiEditLine} fontSize={iconSize} opacity={0.4} />
            </MenuItem>
          </PermissionTooltip>
        </EditPotonganModalDisclosure>
      );
    },
    (rowData: any) => {
      return (
        <RestoreDataPengaturanModalDisclosure
          id={rowData.id}
          url="/api/rski/dashboard/pengaturan/premi/restore"
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
          url={`/api/rski/dashboard/pengaturan/premi`}
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
    url: "/api/rski/dashboard/pengaturan/premi",
    dependencies: [],
  });

  const fd = data?.filter((item: any) => {
    const searchTerm = filterConfig?.search.toLowerCase();
    const isDeletedTerm = filterConfig?.is_deleted?.map(
      (term: Interface__SelectOption) => term.value
    );
    const jenisPremiTerm = filterConfig?.jenis_premi?.map(
      (term: Interface__SelectOption) => term.value
    );

    const matchesSearchTerm = item.nama_premi
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
    const matchesjenis_premi =
      jenisPremiTerm && jenisPremiTerm.length > 0
        ? jenisPremiTerm?.includes(item.jenis_premi)
        : true;

    return matchesSearchTerm && matchesIsDeletedTerm && matchesjenis_premi;
  });

  const formattedHeader = [
    {
      th: "Nama Potongan",
      isSortable: true,
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
      th: "Status Dihapus",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Jenis Potongan",
      isSortable: true,
    },
    {
      th: "Sumber Potongan",
      isSortable: true,
    },
    {
      th: "Besaran Premi",
      isSortable: true,
      cProps: {
        justify: "end",
      },
    },
    {
      th: "Minimal Rate",
      isSortable: true,
      cProps: {
        justify: "end",
      },
    },
    {
      th: "Maksimal Rate",
      isSortable: true,
      cProps: {
        justify: "end",
      },
    },
  ];
  const formattedData = fd?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.nama_premi,
        td: (
          <Tooltip label={item.nama_premi}>
            <Text
              maxW={"303px"}
              overflow={"hidden"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
            >
              {item.nama_premi}
            </Text>
          </Tooltip>
        ),
        isSortable: true,
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
        value: item.deleted_at,
        td: item.deleted_at ? <StatusDihapus data={item.deleted_at} /> : "",
        isDate: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.jenis_premi,
        td: item.jenis_premi === 1 ? "Nominal" : "Persentase (%)",
        isNumeric: true,
      },
      {
        original_data: item.kategori_potongan,
        value: item.kategori_potongan.label,
        td: item.kategori_potongan.label,
      },
      {
        value: item.besaran_premi,
        td:
          item.jenis_premi === 1
            ? `Rp ${formatNumber(item.besaran_premi)}`
            : `${item.besaran_premi}%`,
        isNumeric: true,
        cProps: {
          justify: "end",
        },
      },
      {
        value: item.minimal_rate,
        td: item.minimal_rate ? `Rp ${formatNumber(item.minimal_rate)}` : "",
        isNumeric: true,
        cProps: {
          justify: "end",
        },
      },
      {
        value: item.maksimal_rate,
        td: item.maksimal_rate ? `Rp ${formatNumber(item.maksimal_rate)}` : "",
        isNumeric: true,
        cProps: {
          justify: "end",
        },
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
