import { Center, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import JenisKaryawanBadge from "./JenisKaryawanBadge";
import Retry from "./Retry";
import SelectStatusKaryawan from "./_Select/SelectStatusKaryawan";
import SearchComponent from "./input/SearchComponent";

interface Props {
  filterConfig?: any;
}

export default function TabelKaryawanDinilai({ filterConfig }: Props) {
  // SX

  const [search, setSearch] = useState("");
  const [statusKaryawan, setStatusKaryawan] = useState<any>(undefined);

  const { error, notFound, loading, data, retry } = useDataState<any[]>({
    initialData: undefined,
    url: `/api/rski/dashboard/perusahaan/get-user-belum-dinilai`,
    payload: {
      ...(statusKaryawan && {
        status_karyawan: statusKaryawan.value,
      }),
    },
    dependencies: [statusKaryawan],
  });

  const fd = data?.filter((item: any) => {
    const searchTerm = search?.toLowerCase();

    const matchesSearchTerm = item?.nama.toLowerCase().includes(searchTerm);

    return matchesSearchTerm;
  });

  const formattedHeader = [
    {
      th: "Nama Unit Kerja",
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
      th: "Jenis Karyawan",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
  ];
  const formattedData = fd?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.nama,
        td: (
          <AvatarAndNameTableData
            data={{
              id: item.id,
              nama: item.nama,
              foto_profil: item.foto_profil,
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
        value: item.jenis_karyawan,
        td: <JenisKaryawanBadge w={"120px"} data={item.jenis_karyawan} />,
        isNumeric: true,
        cProps: {
          justify: "center",
        },
      },
    ],
  }));

  return (
    <>
      {error && (
        <>
          {notFound && <NotFound minH={"300px"} />}

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
              <Skeleton minH={"40px"} mx={"auto"} mb={responsiveSpacing} />
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
                      <HStack mb={responsiveSpacing}>
                        <SearchComponent
                          name="search"
                          onChangeSetter={(input) => {
                            setSearch(input);
                          }}
                          inputValue={search}
                        />

                        <SelectStatusKaryawan
                          name="status_karyawan"
                          onConfirm={(input) => {
                            setStatusKaryawan((ps: any) => ({
                              ...ps,
                              status_karyawan: input,
                            }));
                          }}
                          inputValue={statusKaryawan}
                          maxW={"fit-content"}
                        />
                      </HStack>

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
        </>
      )}
    </>
  );
}
