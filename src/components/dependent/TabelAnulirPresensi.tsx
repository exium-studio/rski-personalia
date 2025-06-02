import {
  Button,
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatTimeFromDate from "../../lib/formatTimeFromDate";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import DisclosureHeader from "./DisclosureHeader";
import JadwalItem from "./JadwalItem";
import Retry from "./Retry";
import TabelElipsisText from "./TabelElipsisText";
import TabelFooterConfig from "./TabelFooterConfig";

interface Props {
  filterConfig: any;
}
export default function TabelAnulirPresensi({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Config
  const { formattedFilterKaryawan } = useFilterKaryawan();

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/presensi/get-data-anulir-presensi?page=${pageConfig}`,
      payload: {
        ...formattedFilterKaryawan,
        ...(filterConfig?.status_cuti?.length > 0 && {
          status_cuti: filterConfig.status_cuti.map((sp: any) => sp.value),
        }),
        ...(filterConfig?.tipe_cuti?.length > 0 && {
          tipe_cuti: filterConfig.tipe_cuti.map((sp: any) => sp.value),
        }),
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
      th: "Jadwal",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Presensi Masuk",
      isSortable: true,
    },
    {
      th: "Presensi Keluar",
      isSortable: true,
    },
    {
      th: "Dokumen Tambahan",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Keterangan",
    },
  ];
  const formattedData = data?.map((item: any) => {
    const JadwalModal = () => {
      // Hooks
      const { isOpen, onOpen, onClose } = useDisclosure();
      useBackOnClose(`jadwal-modal-${item?.id}`, isOpen, onOpen, onClose);

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
            size={"sm"}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <DisclosureHeader title={"Jadwal"} />
              </ModalHeader>

              <ModalBody>
                <CContainer gap={2}>
                  {item?.presensi?.unit_kerja?.jenis_karyawan && (
                    <>
                      <Text opacity={0.6}>
                        {item?.presensi?.jadwal_shift?.shift?.nama || "Libur"}
                      </Text>

                      {item?.presensi?.jadwal_shift?.tgl_mulai && (
                        <Text>
                          {formatDate(item?.presensi?.jadwal_shift?.tgl_mulai)}
                        </Text>
                      )}

                      {item?.presensi?.jadwal_shift?.shift ? (
                        <JadwalItem
                          jam_from={
                            item?.presensi?.jadwal_shift?.shift?.jam_from
                          }
                          jam_to={item?.presensi?.jadwal_shift?.shift?.jam_to}
                        />
                      ) : (
                        <Text>-</Text>
                      )}
                    </>
                  )}

                  {!item?.presensi?.unit_kerja?.jenis_karyawan && (
                    <>
                      <Text opacity={0.6}>
                        {item?.presensi?.jadwal_non_shift?.nama || "Libur"}
                      </Text>

                      {item?.presensi?.jam_masuk && (
                        <Text>{formatDate(item?.presensi?.jam_masuk)}</Text>
                      )}

                      {item?.presensi?.jadwal_non_shift ? (
                        <JadwalItem
                          jam_from={item?.presensi?.jadwal_non_shift?.jam_from}
                          jam_to={item?.presensi?.jadwal_non_shift?.jam_to}
                        />
                      ) : (
                        <Text>-</Text>
                      )}
                    </>
                  )}
                </CContainer>
              </ModalBody>

              <ModalFooter>
                <Button
                  className="btn-solid clicky"
                  onClick={backOnClose}
                  flex={1}
                >
                  Mengerti
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      );
    };

    return {
      id: item.id,
      columnsFormat: [
        {
          value: item.data_karyawan.user.nama,
          td: (
            <AvatarAndNameTableData
              detailKaryawanId={item.data_karyawan.id}
              data={{
                id: item?.data_karyawan?.user.id,
                nama: item?.data_karyawan?.user?.nama,
                foto_profil: item?.data_karyawan?.user?.foto_profil?.path,
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
          value: item?.data_karyawan?.nik,
          td: item?.data_karyawan?.nik,
          isNumeric: true,
        },
        {
          value: item?.jadwal_shift?.id || item?.jadwal_non_shift?.id,
          td: <JadwalModal />,
          cProps: {
            justify: "center",
          },
        },
        {
          value: item?.presensi?.jam_masuk,
          td: item?.presensi?.jam_masuk
            ? `${formatDate(
                item?.presensi?.jam_masuk,
                "short"
              )} - ${formatTimeFromDate(item?.presensi?.jam_masuk)}`
            : "",
          isDate: true,
        },
        {
          value: item?.presensi?.jam_keluar,
          td: item?.presensi?.jam_keluar
            ? `${formatDate(
                item?.presensi?.jam_keluar,
                "short"
              )} - ${formatTimeFromDate(item?.presensi?.jam_keluar)}`
            : "",
          isDate: true,
        },
        {
          value: item?.dokumen_anulir?.id,
          td: (
            <Link to={item?.dokumen_anulir?.path} target="_blank">
              <Button variant={"ghost"} colorScheme="ap">
                Lihat
              </Button>
            </Link>
          ),
          cProps: {
            justify: "center",
          },
        },
        {
          value: item?.keterangan,
          td: <TabelElipsisText data={item?.keterangan} />,
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
