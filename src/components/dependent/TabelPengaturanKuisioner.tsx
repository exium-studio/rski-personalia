import {
  Center,
  HStack,
  Icon,
  MenuItem,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { RiDeleteBinLine, RiEditLine, RiHistoryLine } from "@remixicon/react";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import { Interface__SelectOption } from "../../constant/interfaces";
import useDataState from "../../hooks/useDataState";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import StatusDihapus from "./StatusDihapus";
import isObjectEmpty from "../../lib/isObjectEmpty";

interface Props {
  filterConfig?: any;
}

export default function TabelPengaturanKuisioner({ filterConfig }: Props) {
  // SX

  // Row Options Config
  const rowOptions = [
    (rowData: any) => {
      return (
        <MenuItem>
          <Text>Edit</Text>
          <Icon as={RiEditLine} fontSize={iconSize} opacity={0.4} />
        </MenuItem>
      );
    },
    (rowData: any) => {
      return (
        <MenuItem isDisabled={!rowData.columnsFormat[1].value}>
          <Text>Restore</Text>
          <Icon as={RiHistoryLine} fontSize={iconSize} opacity={0.4} />
        </MenuItem>
      );
    },
    "divider",
    (rowData: any) => {
      return (
        <MenuItem fontWeight={500} isDisabled={rowData.columnsFormat[1].value}>
          <Text color={"red.400"}>Delete</Text>
          <Icon color={"red.400"} as={RiDeleteBinLine} fontSize={iconSize} />
        </MenuItem>
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
      th: "Jabatan",
      isSortable: true,
    },
  ];
  const formattedData = fd?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.pertanyaan,
        td: (
          <Tooltip label={item.pertanyaan}>
            <Text
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
        cProps: {
          justify: "center",
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
        value: item.jabatan?.nama_jabatan,
        td: item.jabatan?.nama_jabatan,
      },
    ],
  }));

  return (
    <>
      {error && (
        <>
          {notFound && <NoData minH={"400px"} />}

          {notFound && !isObjectEmpty(filterConfig) && (
            <NotFound minH={"400px"} />
          )}

          {!notFound && (
            <Center my={"auto"} minH={"400px"}>
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
              <HStack justify={"space-between"} mt={responsiveSpacing}>
                <Skeleton maxW={"120px"} />
                <Skeleton maxW={"300px"} h={"20px"} />
                <Skeleton maxW={"112px"} />
              </HStack>
            </>
          )}
          {!loading && (
            <>
              {!formattedData && <NoData minH={"400px"} />}

              {formattedData && (
                <>
                  {fd && fd?.length === 0 && <NotFound minH={"400px"} />}

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
