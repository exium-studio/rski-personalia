import { Button, Center, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import formatDate from "../../lib/formatDate";
import NoData from "../independent/NoData";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";
import ViewPhotoModalDisclosure from "./ViewPhotoModalDisclosure";

interface Props {
  filterConfig: any;
}

export default function TabelPelaporanKaryawan({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);

  const dummy = [
    {
      pelapor: {
        id: 3,
        nama: "Jolitos Kurniawan",
        username: "username1",
        email_verified_at: null,
        role_id: null,
        foto_profil: "https://bit.ly/dan-abramov",
        data_completion_step: 1,
        status_aktif: 1,
        created_at: "2024-06-06T23:48:35.000000Z",
        updated_at: "2024-06-06T23:48:35.000000Z",
        roles: [
          {
            id: 3,
            name: "Admin",
            deskripsi:
              "satellites native some bottle blanket extra continued young married lost far great door short quick example tin teeth variety shadow does line met these",
            guard_name: "web",
            created_at: "2024-04-19T23:48:34.000000Z",
            updated_at: "2024-06-06T23:48:34.000000Z",
            pivot: {
              model_type: "App\\Models\\User",
              model_id: 3,
              role_id: 3,
            },
          },
        ],
      },
      pelaku: "Jolitos Kurniawan",
      tgl_kejadian: "2024-01-04",
      lokasi: "Parkiran Gedung C",
      kronologi: "lorem ipsum",
      upload_foto: "/images/gear5.jpg",
    },
  ];

  const { error, loading, data, retry } = useDataState<any[]>({
    initialData: dummy,
    url: "",
    payload: {
      filterConfig: filterConfig,
    },
    limit: limitConfig,
    dependencies: [limitConfig, pageConfig, filterConfig],
  });

  const formattedHeader = [
    {
      th: "Pelapor",
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
      th: "Pelaku",
      isSortable: true,
    },
    {
      th: "Tanggal Kejadian",
    },
    {
      th: "Lokasi",
      isSortable: true,
    },
    {
      th: "Kronologi",
      isSortable: true,
    },
    {
      th: "Foto",
      cProps: {
        justify: "center",
      },
    },
  ];
  const formattedData = data?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.pelapor.nama,
        td: (
          <AvatarAndNameTableData
            data={{
              id: item.pelapor.id,
              nama: item.pelapor.nama,
              foto_profil: item.pelapor.foto_profil,
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
        value: item.pelaku,
        td: item.pelaku,
      },
      {
        value: item.tgl_kejadian,
        td: formatDate(item.tgl_kejadian),
        isDate: true,
      },
      {
        value: item.lokasi,
        td: item.lokasi,
      },
      {
        value: item.kronologi,
        td: item.kronologi,
      },
      {
        value: item.upload_foto,
        td: (
          <ViewPhotoModalDisclosure src={item.upload_foto}>
            <Button colorScheme="ap" variant={"ghost"} className="clicky">
              Lihat
            </Button>
          </ViewPhotoModalDisclosure>
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
        <Center my={"auto"} minH={"300px"}>
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
              {!formattedData && <NoData minH={"300px"} />}

              {formattedData && (
                <>
                  <CustomTableContainer>
                    <CustomTable
                      formattedHeader={formattedHeader}
                      formattedData={formattedData}
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
