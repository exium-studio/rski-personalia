import {
  Button,
  Center,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiCalendarLine, RiMapPinLine, RiTimeLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatDuration from "../../lib/formatDuration";
import formatDurationShort from "../../lib/formatDurationShort";
import formatNumber from "../../lib/formatNumber";
import formatTime from "../../lib/formatTime";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";

const DaftarDiklat = (props: any) => {
  const { item } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`joined-diklat-${item.id}`, isOpen, onOpen, onClose);

  return (
    <>
      <Button variant={"ghost"} colorScheme="ap" onClick={onOpen}>
        Lihat
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Daftar Diklat"} />
          </ModalHeader>
          <ModalBody>
            <CContainer gap={4}>
              {item?.joined_diklat?.map((item: any) => {
                return (
                  <CContainer
                    bg={"var(--divider)"}
                    borderRadius={8}
                    px={4}
                    py={3}
                  >
                    <HStack align={"start"} mb={2} justify={"space-between"}>
                      <CContainer>
                        <Text fontWeight={"bold"}>{item?.nama_diklat}</Text>
                        <Text opacity={0.6}>
                          {item?.kategori_diklat?.label}
                        </Text>
                      </CContainer>

                      <Text flexShrink={0}>
                        {formatDurationShort(item?.durasi)}
                      </Text>
                    </HStack>
                    <Text opacity={0.6}>{item?.deskripsi}</Text>
                    <HStack opacity={0.6}>
                      <Icon as={RiCalendarLine} />
                      <Text>{formatDate(item?.tgl_mulai)}</Text>
                      <Text>-</Text>
                      <Text>{formatDate(item?.tgl_selesai)}</Text>
                    </HStack>
                    <HStack opacity={0.6}>
                      <Icon as={RiTimeLine} />
                      <Text>{formatTime(item?.jam_mulai)}</Text>
                      <Text>-</Text>
                      <Text>{formatTime(item?.jam_selesai)}</Text>
                    </HStack>
                    <HStack opacity={0.6}>
                      <Icon as={RiMapPinLine} />
                      <Text>{item?.lokasi}</Text>
                    </HStack>
                  </CContainer>
                );
              })}
            </CContainer>
          </ModalBody>
          <ModalFooter>
            <Button w={"full"} onClick={backOnClose} className="btn-solid">
              Mengerti
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

interface Props {
  filterConfig: any;
}
export default function TabelMasaDiklat({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/perusahaan/get-masa-diklat?page=${pageConfig}`,
      payload: {
        ...filterConfig,
        more_than: filterConfig?.more_than * 3600,
        less_than: filterConfig?.less_than * 3600,
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
      th: "Total Masa Diklat",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Total Diklat",
      isSortable: true,
    },
    {
      th: "Daftar Diklat",
      cProps: {
        justify: "center",
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
          value: item?.masa_diklat,
          td: item?.masa_diklat ? formatDuration(item?.masa_diklat) : "",
          isNumeric: true,
          cProps: {
            justifyContent: "center",
          },
        },
        {
          value: item?.total_diklat,
          td: item?.total_diklat ? formatNumber(item?.total_diklat) : "",
          isNumeric: true,
          cProps: {
            justifyContent: "center",
          },
        },
        {
          value: item?.joined_diklat,
          td:
            item?.joined_diklat?.length > 0 ? <DaftarDiklat item={item} /> : "",
          cProps: {
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
