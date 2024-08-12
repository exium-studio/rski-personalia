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
import isObjectEmpty from "../../lib/isObjectEmpty";
import NotFound from "../independent/NotFound";

interface Props {
  filterConfig: any;
}

export default function TabelPelaporanKaryawan({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/perusahaan/get-data-pelaporan?page=${pageConfig}`,
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
        value: item.pelaku.nama,
        td: (
          <AvatarAndNameTableData
            data={{
              id: item.pelaku.id,
              nama: item.pelaku.nama,
              foto_profil: item.pelaku.foto_profil,
            }}
          />
        ),
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
        value: item.foto,
        td: (
          <ViewPhotoModalDisclosure src={item.foto}>
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
                </>
              )}
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
  );
}
