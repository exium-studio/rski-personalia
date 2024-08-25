import { Center, Text, useDisclosure } from "@chakra-ui/react";
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
import PenilaianKaryawanModal from "./PenilaianKaryawanModal";
import Retry from "./Retry";

interface Props {
  filterConfig?: any;
}

export default function TabelKaryawanDinilai({ filterConfig }: Props) {
  // SX

  const { error, notFound, loading, data, retry } = useDataState<any[]>({
    initialData: undefined,
    url: `/api/rski/dashboard/perusahaan/get-user-belum-dinilai`,
    payload: {
      ...(filterConfig?.jabatan?.length > 0 && {
        jabatan: filterConfig?.jabatan.map((sp: any) => sp.value),
      }),
      ...(filterConfig?.status_karyawan?.length > 0 && {
        status_cuti: filterConfig?.status_karyawan.map((sp: any) => sp.value),
      }),
    },
    dependencies: [filterConfig],
  });

  const fd = data?.filter((item: any) => {
    const searchTerm = filterConfig?.search?.toLowerCase();

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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const user_id_penilaian = parseInt(
    localStorage.getItem("user_id_penilaian") as string
  );

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
              {/* <Skeleton minH={"40px"} mx={"auto"} mb={responsiveSpacing} /> */}
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
                          onRowClick={(row) => {
                            localStorage.setItem("user_id_penilaian", row.id);
                            onOpen();
                          }}
                        />
                      </CustomTableContainer>

                      <Text
                        opacity={0.4}
                        mt={responsiveSpacing}
                        textAlign={"center"}
                        mx={"auto"}
                      >
                        Klik row untuk menilai karyawan yang dipilih
                      </Text>

                      <PenilaianKaryawanModal
                        user_id_penilaian={user_id_penilaian}
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
