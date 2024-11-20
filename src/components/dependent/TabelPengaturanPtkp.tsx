import { Center, Text } from "@chakra-ui/react";
import useDataState from "../../hooks/useDataState";
import formatNumber from "../../lib/formatNumber";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import Retry from "./Retry";

interface Props {
  filterConfig?: any;
}

export default function TabelPengaturanPtkp({ filterConfig }: Props) {
  // SX

  // Row Options Config
  // const rowOptions = [
  //   (rowData: any) => {
  //     return (
  //       <EditPtkpModalDisclosure rowData={rowData}>
  //         <MenuItem>
  //           <Text>Edit</Text>
  //           <Icon as={RiEditLine} fontSize={iconSize} opacity={0.4} />
  //         </MenuItem>
  //       </EditPtkpModalDisclosure>
  //     );
  //   },
  //   (rowData: any) => {
  //     return (
  //       <RestoreDataPengaturanModalDisclosure
  //         id={rowData.id}
  //         url="/api/rski/dashboard/pengaturan/ptkp/restore"
  //       >
  //         <MenuItem isDisabled={!rowData.columnsFormat[1].value}>
  //           <Text>Restore</Text>
  //           <Icon as={RiHistoryLine} fontSize={iconSize} opacity={0.4} />
  //         </MenuItem>
  //       </RestoreDataPengaturanModalDisclosure>
  //     );
  //   },
  //   "divider",
  //   (rowData: any) => {
  //     return (
  //       <DeleteDataPengaturanModalDisclosure
  //         id={rowData.id}
  //         url="/api/rski/dashboard/pengaturan/ptkp"
  //       >
  //         <MenuItem
  //           fontWeight={500}
  //           isDisabled={rowData.columnsFormat[1].value}
  //         >
  //           <Text color={"red.400"}>Delete</Text>
  //           <Icon color={"red.400"} as={RiDeleteBinLine} fontSize={iconSize} />
  //         </MenuItem>
  //       </DeleteDataPengaturanModalDisclosure>
  //     );
  //   },
  // ];

  const { error, notFound, loading, data, retry } = useDataState<any[]>({
    initialData: undefined,
    url: "/api/rski/dashboard/pengaturan/ptkp",
    dependencies: [],
  });

  const fd = data?.filter((item: any) => {
    const searchTerm = filterConfig?.search.toLowerCase();
    // const isDeletedTerm = filterConfig?.is_deleted?.map(
    //   (term: Interface__SelectOption) => term.value
    // );

    const matchesSearchTerm = item.kode_ptkp.toLowerCase().includes(searchTerm);

    console.log(matchesSearchTerm);
    // const matchesIsDeletedTerm =
    //   isDeletedTerm?.includes(1) && isDeletedTerm?.includes(0)
    //     ? true
    //     : isDeletedTerm?.includes(1)
    //     ? !!item.deleted_at
    //     : isDeletedTerm?.includes(0)
    //     ? !item.deleted_at
    //     : true;

    return matchesSearchTerm;
  });

  const formattedHeader = [
    {
      th: "Kode PTKP",
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
    // {
    //   th: "Status Dihapus",
    //   isSortable: true,
    //   cProps: {
    //     justify: "center",
    //   },
    // },
    {
      th: "Kategori TER",
      isSortable: true,
    },
    {
      th: "Min. Gaji Pokok",
      isSortable: true,
      cProps: {
        justify: "right",
      },
    },
  ];
  const formattedData = fd?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.kode_ptkp,
        td: item.kode_ptkp,
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
      // {
      //   value: item.deleted_at,
      //   td: item.deleted_at ? <StatusDihapus data={item.deleted_at} /> : "",
      //   isDate: true,
      //   cProps: {
      //     justify: "center",
      //   },
      // },
      {
        original_data: item.kategori_ter,
        value: item.kategori_ter?.nama_kategori_ter,
        td: item.kategori_ter?.nama_kategori_ter,
      },
      {
        value: item.nilai,
        td: formatNumber(item.nilai),
        isNumeric: true,
        cProps: {
          justify: "right",
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
                          // rowOptions={rowOptions}
                        />
                      </CustomTableContainer>

                      <Text mt={4}>
                        Data ini sesuai dengan Peraturan Pemerintah (PP) No. 58
                        Tahun 2023
                      </Text>
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
