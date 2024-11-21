import {
  Center,
  HStack,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { eachDayOfInterval } from "date-fns";
import { useEffect, useState } from "react";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useDataState from "../../hooks/useDataState";
import formatDate from "../../lib/formatDate";
import formatDurationShort from "../../lib/formatDurationShort";
import formatTime from "../../lib/formatTime";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import TabelJadwalItem from "./JadwalTabelItem";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";
import TerapkanJadwalKaryawanTerpilih from "./TerapkanJadwalKaryawanTerpilih";

interface Props {
  filterConfig?: any;
}

export default function TabelJadwal({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Karyawan Config
  const { formattedFilterKaryawan } = useFilterKaryawan();

  // console.log(filterKaryawan);
  // console.log(formattedFilterKaryawan);

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any>({
      initialData: undefined,
      url: `/api/rski/dashboard/jadwal-karyawan/get-data-jadwal?page=${pageConfig}`,
      payload: {
        tgl_mulai: formatDate(filterConfig.tgl_mulai, "short"),
        tgl_selesai: formatDate(filterConfig.tgl_selesai, "short"),
        ...formattedFilterKaryawan,
      },
      limit: limitConfig,
      dependencies: [
        limitConfig,
        pageConfig,
        filterConfig,
        formattedFilterKaryawan,
      ],
    });

  useEffect(() => {
    setPageConfig(1);
  }, [formattedFilterKaryawan, filterConfig]);

  const dateList = eachDayOfInterval({
    start: filterConfig.tgl_mulai,
    end: filterConfig.tgl_selesai,
  });

  const formattedHeader = [
    {
      th: "Nama",
      isSortable: true,
      props: {
        position: "sticky",
        left: 0,
        zIndex: 99,
        w: "243px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
    },
    ...dateList.map((date) => ({
      th: formatDate(date, "longShort"),
    })),
  ];
  const formattedData = data?.map((item: any, rowIndex: number) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.user.nama,
        td: (
          <CContainer>
            <AvatarAndNameTableData
              data={{
                id: item.user.id,
                nama: item.user.nama,
                foto_profil: item.user.foto_profil,
                unit_kerja: item.unit_kerja,
              }}
              addition={
                <HStack my={2} w={"100%"}>
                  <Text
                    textAlign={"right"}
                    ml={"auto"}
                    fontWeight={600}
                    opacity={0.4}
                  >
                    {formatDurationShort(item?.total_jam)}
                  </Text>
                </HStack>
              }
            />
          </CContainer>
        ),
        props: {
          position: "sticky",
          left: 0,
          zIndex: 2,
        },
        cProps: {
          h: "92px",
          borderRight: "1px solid var(--divider3)",
        },
      },
      ...(item.list_jadwal?.map((jadwal: any, i: number) => {
        return {
          value: jadwal?.label,
          td:
            jadwal !== null ? (
              // Render cuti
              jadwal?.status === 5 ? (
                <CContainer
                  // bg={"var(--divider)"}
                  border={"2px solid var(--divider2)"}
                  p={4}
                  borderRadius={8}
                  justify={"center"}
                  gap={1}
                  position={"relative"}
                >
                  {/* <Box
                    position={"absolute"}
                    top={2}
                    right={2}
                    bg={darkLightColor}
                    w={"6px"}
                    h={"6px"}
                    borderRadius={"full"}
                    opacity={0.8}
                  /> */}

                  <Text fontSize={"sm"} whiteSpace={"wrap"}>
                    {jadwal?.tipe_cuti?.nama || "Nama Cuti"}
                  </Text>
                  {jadwal?.keterangan ? (
                    <Popover>
                      <PopoverTrigger>
                        <Text fontSize={"sm"} whiteSpace={"wrap"} noOfLines={1}>
                          {jadwal?.keterangan}
                        </Text>
                      </PopoverTrigger>

                      <PopoverContent>
                        <PopoverCloseButton />
                        <PopoverBody>
                          <Text mb={2}>Keterangan</Text>
                          <Text fontSize={"sm"} whiteSpace={"wrap"}>
                            {jadwal?.keterangan}
                          </Text>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Text>-</Text>
                  )}
                </CContainer>
              ) : (
                <>
                  {/* Render Jadwal Shift */}
                  {parseInt(item.unit_kerja?.jenis_karyawan) === 1 ? (
                    <TabelJadwalItem
                      data={item}
                      jadwal={jadwal}
                      tgl={dateList[i]}
                      index={i}
                      rowIndex={rowIndex}
                    />
                  ) : (
                    // Render Jadwal Non Shift
                    <CContainer
                      bg={"var(--divider)"}
                      p={4}
                      borderRadius={8}
                      justify={"center"}
                      gap={1}
                    >
                      <Tooltip label={jadwal?.nama} openDelay={500}>
                        <Text
                          fontSize={14}
                          maxW={"130px"}
                          whiteSpace={"nowrap"}
                          overflow={"hidden"}
                          textOverflow={"ellipsis"}
                        >
                          {jadwal?.nama}
                        </Text>
                      </Tooltip>
                      <Text fontSize={14} whiteSpace={"nowrap"}>
                        {jadwal?.jam_from && jadwal?.jam_to
                          ? `${formatTime(jadwal?.jam_from)} - ${formatTime(
                              jadwal?.jam_to
                            )}`
                          : "Libur"}
                      </Text>
                    </CContainer>
                  )}
                </>
              )
            ) : // Render jika data jadwal null
            parseInt(item.unit_kerja?.jenis_karyawan) === 1 ? (
              // Render Terapkan Jadwal Shift
              <TerapkanJadwalKaryawanTerpilih
                data={item}
                tgl={dateList[i]}
                index={i}
                rowIndex={rowIndex}
              />
            ) : (
              // Render Jadwal Nonshift kosong
              <CContainer
                bg={"var(--divider)"}
                p={4}
                borderRadius={8}
                justify={"center"}
              >
                <Text
                  textAlign={"center"}
                  opacity={0.4}
                  whiteSpace={"wrap"}
                  fontSize={"sm"}
                >
                  Terapkan Jadwal di Pengaturan Jam Kerja Non-Shift
                </Text>
              </CContainer>
            ),
          cProps: {
            align: "stretch",
            h: "92px",
            p: "6px",
          },
        };
      }) || []),
    ],
  }));

  return (
    <>
      {error && (
        <>
          {notFound && isObjectEmpty(formattedFilterKaryawan) && (
            <NoData minH={"300px"} />
          )}

          {notFound && !isObjectEmpty(formattedFilterKaryawan) && (
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
              {(!data || (data && data.length === 0)) && (
                <NoData minH={"300px"} />
              )}

              {(data || (data && data.length > 0)) && (
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
