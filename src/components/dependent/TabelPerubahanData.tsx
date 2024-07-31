import { Center, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import perubahanDataKolom from "../../constant/perubahanDataKolom";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useDataState from "../../hooks/useDataState";
import NoData from "../independent/NoData";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import BooleanBadge from "./BooleanBadge";
import CustomTable from "./CustomTable";
import PerubahanDataRender from "./PerubahanDataRender";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";

export default function TabelVerifikasiData() {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Config
  const { filterKaryawan } = useFilterKaryawan();

  const dummy = [
    {
      user_id: 1,
      user: {
        id: 1,
        nama: "User 1",
        username: "username1",
        email_verified_at: null,
        role_id: null,
        foto_profil: null,
        data_completion_step: 1,
        status_akun: 0,
        created_at: "2024-06-11T04:39:19.000000Z",
        updated_at: "2024-06-11T04:39:19.000000Z",
      },
      content: {
        id: 1,
        kolom: "tgl_lahir",
        original_data: "2001-11-01",
        updated_data: "2001-11-05",
        status_perubahan: true,
        created_at: "2024-07-10",
        updated_at: "2024-07-11",
      },
      created_at: "2023-05-02",
    },
    {
      user_id: 2,
      user: {
        id: 2,
        nama: "User 2",
        username: "username2",
        email_verified_at: null,
        role_id: null,
        foto_profil: null,
        data_completion_step: 1,
        status_akun: 0,
        created_at: "2024-06-11T04:39:19.000000Z",
        updated_at: "2024-06-11T04:39:19.000000Z",
      },
      content: {
        id: 2,
        kolom: "foto_profil",
        original_data: "https://bit.ly/dan-abramov",
        updated_data: "/images/gear5.jpg",
        status_perubahan: false,
        created_at: "2024-07-22",
        updated_at: "2024-07-23",
      },
      created_at: "2024-07-22",
    },
  ];

  const { error, loading, data, retry } = useDataState<any>({
    initialData: dummy,
    url: "",
    payload: filterKaryawan,
    dependencies: [],
  });

  const formattedHeader = [
    {
      th: "Nama",
      isSortable: true,
      props: {
        position: "sticky",
        left: 0,
        zIndex: 99,
        w: "180px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
    },
    {
      th: "Status Verifikasi",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Kolom",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Data Original",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Data Pengajuan",
      cProps: {
        justify: "center",
      },
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
        value: item.content.status_perubahan,
        td: (
          <BooleanBadge
            w={"150px"}
            data={item.content.status_perubahan}
            trueValue="Diverifikasi"
            falseValue="Verifikasi Ditolak"
            nullValue="Menunggu"
          />
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.content.status_perubahan,
        //@ts-ignore
        td: perubahanDataKolom[item.content.kolom],

        cProps: {
          justify: "center",
        },
      },
      {
        value: item.data,
        td: (
          <PerubahanDataRender
            column={item.content.kolom}
            data={item.content.original_data}
          />
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.data,
        td: (
          <PerubahanDataRender
            column={item.content.kolom}
            data={item.content.updated_data}
          />
        ),
        cProps: {
          justify: "center",
        },
      },
    ],
  }));

  return (
    <>
      {error && (
        <Center my={"auto"} minH={"400px"}>
          <Retry loading={loading} retry={retry} />
        </Center>
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
              {(!data || (data && data.length === 0)) && (
                <NoData minH={"400px"} />
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
                    />
                  </CustomTableContainer>

                  <TabelFooterConfig
                    limitConfig={limitConfig}
                    setLimitConfig={setLimitConfig}
                    pageConfig={pageConfig}
                    setPageConfig={setPageConfig}
                    paginationData={{
                      prev_page_url: "",
                      next_page_url: "",
                      last_page: 1,
                    }}
                    // footer={
                    //   <Text opacity={0.4}>
                    //     Klik row untuk melihat detail karyawan
                    //   </Text>
                    // }
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
