import { Center, Icon, MenuItem, Text, useDisclosure } from "@chakra-ui/react";
import { RiEditLine, RiHistoryLine } from "@remixicon/react";
import { dummyKelolaRole } from "../../const/dummy";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import EditRoleModalDisclosure from "../independent/EditUnitKerjaModalDisclosure";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import DetailKelolaRoleModal from "./DetailKelolaRoleModal";
import RestoreDataPengaturanModalDisclosure from "./RestoreDataPengaturanModalDisclosure";
import Retry from "./Retry";
import TabelElipsisText from "./TabelElipsisText";

interface Props {
  filterConfig?: any;
}

export default function TabelPengaturanKelolaRole({ filterConfig }: Props) {
  // Row Options Config
  const rowOptions = [
    (rowData: any) => {
      return (
        <EditRoleModalDisclosure rowData={rowData}>
          <MenuItem>
            <Text>Edit</Text>
            <Icon as={RiEditLine} fontSize={iconSize} opacity={0.4} />
          </MenuItem>
        </EditRoleModalDisclosure>
      );
    },
    (rowData: any) => {
      return (
        <RestoreDataPengaturanModalDisclosure
          id={rowData.id}
          url={`/api/rski/dashboard/pengaturan/role/restore`}
        >
          <MenuItem isDisabled={!rowData.columnsFormat[1]?.value}>
            <Text>Restore</Text>
            <Icon as={RiHistoryLine} fontSize={iconSize} opacity={0.4} />
          </MenuItem>
        </RestoreDataPengaturanModalDisclosure>
      );
    },
    // "divider",
    // (rowData: any) => {
    //   return (
    //     <DeleteDataPengaturanModalDisclosure
    //       id={rowData.id}
    //       url={`/api/rski/dashboard/pengaturan/role`}
    //     >
    //       <MenuItem
    //         fontWeight={500}
    //         isDisabled={rowData.columnsFormat[1]?.value}
    //       >
    //         <Text color={"red.400"}>Delete</Text>
    //         <Icon color={"red.400"} as={RiDeleteBinLine} fontSize={iconSize} />
    //       </MenuItem>
    //     </DeleteDataPengaturanModalDisclosure>
    //   );
    // },
  ];

  // Disclosure Config
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { error, notFound, loading, data, retry } = useDataState<any[]>({
    initialData: dummyKelolaRole,
    url: "/api/rski/dashboard/pengaturan/role",
    dependencies: [],
  });

  const fd = data?.filter((item: any) => {
    const searchTerm = filterConfig.search.toLowerCase();

    const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm);

    return matchesSearchTerm;
  });

  const formattedHeader = [
    {
      th: "Nama Role",
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
    // {
    //   th: "Status Dihapus",
    //   isSortable: true,
    //   cProps: {
    //     justify: "center",
    //   },
    // },
    {
      th: "Deskripsi",
      isSortable: true,
    },
  ];
  const formattedData = fd?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.name,
        td: item.name,
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
        value: item.deskripsi,
        td: <TabelElipsisText data={item.deskripsi} />,
      },
    ],
  }));

  const role_id = parseInt(localStorage.getItem("role_id") as string);

  return (
    <>
      {error && (
        <>
          {notFound && <NotFound />}

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
                          onRowClick={(rowData) => {
                            localStorage.setItem("role_id", rowData.id);
                            onOpen();
                          }}
                          rowOptions={rowOptions}
                        />
                      </CustomTableContainer>

                      <Text
                        opacity={0.4}
                        mt={responsiveSpacing}
                        textAlign={"center"}
                        mx={"auto"}
                      >
                        Klik row untuk melihat detail role/permissions nya
                      </Text>

                      <DetailKelolaRoleModal
                        id="atur-keizinan-modal"
                        role_id={role_id}
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                      />
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
