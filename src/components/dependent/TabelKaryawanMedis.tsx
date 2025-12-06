import { Center, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useDataState from "../../hooks/useDataState";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";
import formatDate from "../../lib/formatDate";
import monthDiff from "../../lib/monthDiff";

interface Props {
  filterConfig: any;
}
export default function TabelKaryawanmedis({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/karyawan/get-karyawan-medis?page=${pageConfig}`,
      payload: {
        ...filterConfig,
      },
      limit: limitConfig,
      dependencies: [limitConfig, pageConfig, filterConfig],
    });

  useEffect(() => {
    setPageConfig(1);
  }, [filterConfig]);

  // const userData = useGetUserData();

  const formattedHeader = [
    {
      th: "Karyawan",
      isSortable: true,
      props: {
        position: "sticky",
        left: "0",
        zIndex: 99,
        w: "243px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
    },
    {
      th: "No. Induk Karyawan",
      isSortable: true,
    },
    {
      th: "Tanggal Berakhir SIP",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Masa Berlaku SIP",
      isSortable: true,
      cProps: {
        justifyContent: "center",
      },
    },
    {
      th: "Tanggal Berakhir STR",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Masa Berlaku STR",
      isSortable: true,
      cProps: {
        justifyContent: "center",
      },
    },
  ];
  const formattedData = data?.map((item: any) => {
    return {
      id: item.id,
      columnsFormat: [
        {
          value: item?.user?.nama,
          td: (
            <AvatarAndNameTableData
              detailKaryawanId={item.id}
              data={{
                id: item?.user?.id,
                nama: item?.user?.nama,
                foto_profil: item?.user?.foto_profil?.path,
              }}
            />
          ),
          props: {
            position: "sticky",
            left: "0",
            w: "243px",
          },
          cProps: {
            borderRight: "1px solid var(--divider3)",
          },
        },
        {
          value: item?.nik,
          td: item?.nik,
          isNumeric: true,
        },
        {
          value: item?.masa_berlaku_sip,
          td: item?.masa_berlaku_sip
            ? formatDate(item?.masa_berlaku_sip, "short")
            : "",
          isDate: true,
          cProps: {
            justify: "center",
          },
        },
        {
          value: item?.masa_berlaku_sip,
          td: item?.masa_berlaku_sip ? (
            `${monthDiff(
              new Date(),
              formatDate(item?.masa_berlaku_sip, "short2"),
              {
                allowNegative: true,
              }
            )} bulan`
          ) : item?.no_sip ? (
            <Text color={"p.500"} fontWeight={"medium"}>
              Seumur Hidup
            </Text>
          ) : (
            ""
          ),
          cProps: {
            color:
              monthDiff(
                new Date(),
                formatDate(item?.masa_berlaku_sip, "short2")
              ) <= 7
                ? "red.400"
                : "",
            justifyContent: "center",
          },
        },
        {
          value: item?.masa_berlaku_str,
          td: item?.masa_berlaku_str
            ? formatDate(item?.masa_berlaku_str, "short")
            : "",
          isDate: true,
          cProps: {
            justify: "center",
          },
        },
        {
          value: item?.masa_berlaku_str,
          td: item?.masa_berlaku_str ? (
            `${monthDiff(
              new Date(),
              new Date(formatDate(item?.masa_berlaku_str, "short2")),
              {
                allowNegative: true,
              }
            )} bulan`
          ) : item?.no_str ? (
            <Text color={"p.500"} fontWeight={"medium"}>
              Seumur Hidup
            </Text>
          ) : (
            ""
          ),
          cProps: {
            color:
              monthDiff(new Date(), new Date(item?.masa_berlaku_sip)) < 7
                ? "red.400"
                : "",
            justifyContent: "center",
          },
        },
      ],
    };
  });

  return (
    <>
      {error && (
        <>
          {notFound && isObjectEmpty(filterConfig, ["periode_tahun"]) && (
            <NoData minH={"300px"} />
          )}

          {notFound && !isObjectEmpty(filterConfig, ["periode_tahun"]) && (
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
