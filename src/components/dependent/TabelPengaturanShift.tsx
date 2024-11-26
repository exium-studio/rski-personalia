import { Center, Icon, MenuItem, Text } from "@chakra-ui/react";
import { RiDeleteBinLine, RiEditLine, RiHistoryLine } from "@remixicon/react";
import { Interface__SelectOption } from "../../constant/interfaces";
import { iconSize } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
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
import EditShiftModalDisclosure from "../independent/EditShiftModalDisclosure";
import formatTime from "../../lib/formatTime";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import { useEffect, useState } from "react";
import TabelFooterConfig from "./TabelFooterConfig";

interface Props {
  filterConfig?: any;
}

export default function TabelPengaturanShift({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Row Options Config
  const rowOptions = [
    (rowData: any) => {
      return (
        <EditShiftModalDisclosure rowData={rowData}>
          <PermissionTooltip permission={editPermission} placement="left">
            <MenuItem isDisabled={!editPermission}>
              <Text>Edit</Text>
              <Icon as={RiEditLine} fontSize={iconSize} opacity={0.4} />
            </MenuItem>
          </PermissionTooltip>
        </EditShiftModalDisclosure>
      );
    },
    (rowData: any) => {
      return (
        <RestoreDataPengaturanModalDisclosure
          id={rowData.id}
          url="/api/rski/dashboard/pengaturan/shift/restore"
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
          url="/api/rski/dashboard/pengaturan/shift"
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

  useEffect(() => {
    setPageConfig(1);
  }, [filterConfig]);

  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [100]);
  const deletePermission = isHasPermissions(userPermissions, [101]);

  const { error, notFound, loading, data, retry } = useDataState<any[]>({
    initialData: undefined,
    url: "/api/rski/dashboard/pengaturan/shift",
    dependencies: [],
  });

  const fd: any = data?.filter((item: any) => {
    const searchTerm = filterConfig?.search.toLowerCase();
    const isDeletedTerm = filterConfig?.is_deleted?.map(
      (term: Interface__SelectOption) => term.value
    );

    const matchesSearchTerm = item.nama.toLowerCase().includes(searchTerm);

    const matchesUnitKerjaTerm =
      filterConfig.unit_kerja?.length === 0
        ? true
        : filterConfig.unit_kerja.some(
            (unitKerja: { value: number }) =>
              unitKerja.value === item.unit_kerja.id
          );

    const matchesIsDeletedTerm =
      isDeletedTerm?.includes(1) && isDeletedTerm?.includes(0)
        ? true
        : isDeletedTerm?.includes(1)
        ? !!item.deleted_at
        : isDeletedTerm?.includes(0)
        ? !item.deleted_at
        : true;

    return matchesSearchTerm && matchesUnitKerjaTerm && matchesIsDeletedTerm;
  });

  // Calculate the total number of pages
  const totalPage = limitConfig === 0 ? 1 : Math.ceil(fd?.length / limitConfig);

  // Calculate start and end index for the current page
  const startIndex = (pageConfig - 1) * limitConfig;
  const endIndex = limitConfig === 0 ? fd?.length : startIndex + limitConfig;

  const formattedHeader = [
    {
      th: "Nama Shift",
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
      th: "Status Dihapus",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Jam Kerja",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Unit Kerja",
      isSortable: true,
    },
  ];
  const formattedData = fd
    ?.slice(startIndex, endIndex)
    .map((item: any) => ({
      id: item.id,
      columnsFormat: [
        {
          value: item.nama,
          td: item.nama,
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
          original_data: {
            jam_from: item.jam_from,
            jam_to: item.jam_to,
          },
          value: item.jam_from,
          td: `${formatTime(item.jam_from)} - ${formatTime(item.jam_to)}`,
          isTime: true,
          cProps: {
            justify: "center",
          },
        },
        {
          original_data: item?.unit_kerja,
          value: item.unit_kerja?.nama_unit,
          td: item.unit_kerja?.nama_unit,
        },
      ],
    }))
    .filter(Boolean);

  // Pagination data for the footer
  const paginationData = {
    links: {
      first: "",
      last: "",
      prev: null,
      next: null,
    },
    meta: {
      current_page: pageConfig,
      last_page: totalPage,
      per_page: limitConfig,
      total: fd?.length,
    },
  };

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

              <TabelFooterConfig
                limitConfig={limitConfig}
                setLimitConfig={setLimitConfig}
                pageConfig={pageConfig}
                setPageConfig={setPageConfig}
                paginationData={paginationData}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
