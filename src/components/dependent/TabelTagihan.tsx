import {
  Alert,
  AlertDescription,
  AlertIcon,
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
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useDataState from "../../hooks/useDataState";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import StatusTagihanBadge from "./StatusTagihanBadge";
import TabelFooterConfig from "./TabelFooterConfig";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "./DisclosureHeader";
import useCountdown from "../../hooks/useCountdown";
import req from "../../lib/req";
import useRenderTrigger from "../../hooks/useRenderTrigger";

const KonfirmasiPelunasan = ({ item }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`konfirmasi-pelunasan-${item.id}`, isOpen, onOpen, onClose);
  const { countDown } = useCountdown({ initialValue: 5, conditions: isOpen });
  const [loading, setLoading] = useState<boolean>(false);
  const { rt, setRt } = useRenderTrigger();
  const toast = useToast();

  const onConfirm = () => {
    setLoading(true);
    const url = `/api/rski/dashboard/keuangan/tagihan-potongan/${item.id}/pelunasan`;
    req
      .post(url)
      .then((r) => {
        if (r.status === 200) {
          setRt(!rt);
          backOnClose();
          toast({
            status: "success",
            title: r?.data?.message,
            position: "bottom-right",
            isClosable: true,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        toast({
          status: "error",
          title:
            (typeof e?.response?.data?.message === "string" &&
              (e?.response?.data?.message as string)) ||
            "Terjadi kendala",
          position: "bottom-right",
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Button variant={"outline"} colorScheme="ap" onClick={onOpen}>
        Lunasi
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
            <DisclosureHeader title={"Konfirmasi Pelunasan"} />
          </ModalHeader>
          <ModalBody>
            <Alert mb={4} status="warning" alignItems={"start"}>
              <AlertIcon />
              <AlertDescription>
                Ketika penggajian bulan ini sudah dijalankan, maka segala
                perubahan data tagihan karyawan tidak akan berpengaruh terhadap
                data penggajian bulan ini.
              </AlertDescription>
            </Alert>
            <Text opacity={0.4}>
              Apakah anda yakin tagihan <b>{item.user.nama}</b> akan{" "}
              <b>dilunasi</b>?
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              w={"50%"}
              className="btn-solid clicky"
              onClick={backOnClose}
            >
              Tidak
            </Button>
            <Button
              w={"50%"}
              className="btn-ap clicky"
              colorScheme="ap"
              isLoading={loading}
              isDisabled={countDown !== 0}
              onClick={onConfirm}
            >
              {countDown !== 0 ? `Tunggu ${countDown} detik` : "Ya"}
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
export default function TabelTagihan({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: "/api/rski/dashboard/keuangan/get-tagihan-potongan",
      payload: {
        ...filterConfig,
      },
      limit: limitConfig,
      dependencies: [limitConfig, pageConfig, filterConfig],
    });

  useEffect(() => {
    setPageConfig(1);
  }, [filterConfig]);

  const formattedHeader = [
    {
      th: "Nama",
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
      th: "Status Tagihan",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Kategori Tagihan",
      isSortable: true,
    },
    {
      th: "Periode Mulai",
      isSortable: true,
    },
    {
      th: "Periode Selesai",
      isSortable: true,
    },
    {
      th: "Tagihan per Bulan",
      isSortable: true,
    },
    {
      th: "Tenor",
      isSortable: true,
    },
    {
      th: "Sisa Tagihan",
      isSortable: true,
    },
    {
      th: "Pelunasan",
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
            detailKaryawanId={item.id}
            data={{
              id: item.user.id,
              nama: item.user.nama,
              fullName: `${item?.gelar_depan || ""} ${item.user?.nama} ${
                item?.gelar_belakang || ""
              }`,
              foto_profil: item.user.foto_profil,
            }}
          />
        ),
        props: {
          position: "sticky",
          left: "0",
          zIndex: 2,
        },
        cProps: {
          borderRight: "1px solid var(--divider3)",
        },
      }, // 0
      {
        value: item.status_tagihan?.label,
        td: <StatusTagihanBadge data={item.status_tagihan} w={"140px"} />,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.kategori_tagihan?.label,
        td: item.kategori_tagihan?.label,
      },
      {
        value: item.bulan_mulai,
        td: formatDate(item.bulan_mulai, "periode"),
      },
      {
        value: item.bulan_selesai,
        td: formatDate(item.bulan_selesai, "periode"),
      },
      {
        value: item.besaran,
        td: `Rp ${formatNumber(item.besaran || 0)}`,
      },
      {
        value: item.tenor,
        td: `${formatNumber(item.tenor || 0)} bulan`,
      },
      {
        value: item.sisa_tagihan,
        td: `Rp ${formatNumber(item.sisa_tagihan || 0)}`,
      },
      {
        value: "",
        td: item.status_tagihan.id !== 3 && <KonfirmasiPelunasan item={item} />,
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
          {notFound && isObjectEmpty(filterConfig, ["tahun"]) && (
            <NoData minH={"300px"} />
          )}

          {notFound && !isObjectEmpty(filterConfig, ["tahun"]) && (
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
                      initialSortOrder="desc"
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
