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
import { RiArrowRightUpLine } from "@remixicon/react";
import { useState } from "react";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatDuration from "../../lib/formatDuration";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import DetailKaryawanModalDisclosure from "./DetailKaryawanModalDisclosure";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import StatusPersetujuanDiklatBadge from "./StatusPersetujuanDiklatBadge";
import TabelFooterConfig from "./TabelFooterConfig";
import VerifikasiModal from "./VerifikasiModal";

const PesertaModal = ({ data }: { data: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`peserta-diklat-modal-${data.id}`, isOpen, onOpen, onClose);

  return (
    <>
      <Button
        colorScheme="ap"
        variant={"ghost"}
        className="clicky"
        onClick={onOpen}
      >
        Lihat
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Peserta Diklat"} />
          </ModalHeader>
          <ModalBody className="scrollY">
            <CContainer gap={2}>
              {data.list_peserta?.map((peserta: any, i: number) => (
                <DetailKaryawanModalDisclosure key={i} user_id={peserta.id}>
                  <HStack
                    justifyContent={"space-between"}
                    p={4}
                    className="btn-solid clicky"
                    borderRadius={12}
                  >
                    <AvatarAndNameTableData
                      data={{
                        id: peserta.id,
                        nama: peserta.nama,
                        foto_profil: peserta.foto_profil,
                      }}
                      noDetail
                      w={"fit-content"}
                      maxW={"fit-content"}
                    />

                    <Icon
                      as={RiArrowRightUpLine}
                      fontSize={iconSize}
                      opacity={0.4}
                    />
                  </HStack>
                </DetailKaryawanModalDisclosure>
              ))}
            </CContainer>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={backOnClose}
              w={"100%"}
              className="btn-solid clicky"
            >
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

export default function TabelDiklat({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/perusahaan/get-data-diklat?page=${pageConfig}`,
      payload: {
        ...filterConfig,
      },
      limit: limitConfig,
      dependencies: [limitConfig, pageConfig, filterConfig],
    });

  const formattedHeader = [
    {
      th: "Nama Acara",
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
      th: "Status Verifikasi",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Deskripsi",
    },
    {
      th: "Kuota",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Tanggal Mulai",
      isSortable: true,
    },
    {
      th: "Tanggal Selesai",
      isSortable: true,
    },
    {
      th: "Peserta",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Kategori Acara",
      isSortable: true,
    },
    {
      th: "Tempat",
      isSortable: true,
    },
    {
      th: "Durasi",
      isSortable: true,
    },
    {
      th: "Verif. 1",
      props: {
        position: "sticky",
        right: 0,
        zIndex: 4,
      },
      cProps: {
        justify: "center",
        borderLeft: "1px solid var(--divider3)",
      },
    },
    {
      th: "Verif. 2",
      props: {
        position: "sticky",
        right: 0,
        zIndex: 3,
      },
      cProps: {
        justify: "center",
        borderLeft: "1px solid var(--divider3)",
      },
    },
  ];
  const formattedData = data?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.nama_diklat,
        td: item.nama_diklat,
        props: {
          position: "sticky",
          left: 0,
          zIndex: 2,
        },
        cProps: {
          borderRight: "1px solid var(--divider3)",
          w: "243px",
        },
      },
      {
        value: item.status_diklat.label,
        td: (
          <StatusPersetujuanDiklatBadge data={item.status_diklat} w={"180px"} />
        ),
      },
      {
        value: item.deskripsi,
        td: (
          <Text
            w={"100%"}
            maxW={"300px"}
            overflow={"hidden"}
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
          >
            {item.deskripsi}
          </Text>
        ),
      },
      {
        value: item.kuota,
        td: item.kuota,
        cProps: { justify: "center" },
      },
      {
        value: item.tgl_mulai,
        td: formatDate(item.tgl_mulai),
        isDate: true,
      },
      {
        value: item.tgl_selesai,
        td: formatDate(item.tgl_selesai),
        isDate: true,
      },
      {
        value: item.peserta,
        td: <PesertaModal data={item} />,
      },
      {
        value: item.kategori_diklat?.label,
        td: item.kategori_diklat?.label,
      },
      {
        value: item.lokasi,
        td: item.lokasi,
      },
      {
        value: item.durasi,
        td: formatDuration(item.durasi),
        isTime: true,
      },
      {
        value: "",
        td: (
          <VerifikasiModal
            aria-label={`perubahan-data-verif-1-button-${item.id}"`}
            id={`verifikasi-diklat-modal-${item.id}`}
            submitUrl={`/api/rski/dashboard/perusahaan/diklat/${item.id}/verifikasi-step-1`}
            approvePayloadKey="verifikasi_pertama_disetujui"
            disapprovePayloadKey="verifikasi_pertama_ditolak"
            isDisabled={item?.status_diklat?.id !== 1}
          />
        ),
        props: {
          position: "sticky",
          right: 0,
          zIndex: 2,
        },
        cProps: {
          justify: "center",
          borderLeft: "1px solid var(--divider3)",
        },
      },
      {
        value: "",
        td: (
          <VerifikasiModal
            aria-label={`perubahan-data-verif-2-button-${item.id}"`}
            id={`verifikasi-diklat-modal-2-${item.id}`}
            submitUrl={`/api/rski/dashboard/perusahaan/diklat/${item.id}/verifikasi-step-1`}
            approvePayloadKey="verifikasi_kedua_disetujui"
            disapprovePayloadKey="verifikasi_kedua_ditolak"
            isDisabled={item?.status_diklat?.id !== 4}
          />
        ),
        props: {
          position: "sticky",
          right: 0,
          zIndex: 1,
        },
        cProps: {
          justify: "center",
          borderLeft: "1px solid var(--divider3)",
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
