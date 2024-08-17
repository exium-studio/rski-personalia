import {
  Button,
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useDataState from "../../hooks/useDataState";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import PerubahanDataRender from "./PerubahanDataRender";
import Retry from "./Retry";
import StatusApprovalBadge from "./StatusApprovalBadge";
import TabelFooterConfig from "./TabelFooterConfig";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "./DisclosureHeader";

interface KonfirmasiProps {
  data: any;
}

function KonfirmasiPermintaan({ data }: KonfirmasiProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `konfirmasi-permintaan-perubahan-data-${data.id}`,
    isOpen,
    onOpen,
    onClose
  );

  return (
    <>
      <Button
        className="clicky"
        colorScheme="ap"
        variant={"ghost"}
        onClick={onOpen}
      >
        Verifikasi
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
            <DisclosureHeader title={"Konfirmasi Permintaan"} />
          </ModalHeader>
          <ModalBody></ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default function TabelPermintaanPerubahanData() {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Config
  const { formattedFilterKaryawan } = useFilterKaryawan();

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any>({
      initialData: undefined,
      url: `/api/rski/dashboard/karyawan/riwayat-perubahan/get-riwayat-perubahan-karyawan?page=${pageConfig}`,
      payload: { ...formattedFilterKaryawan },
      limit: limitConfig,
      dependencies: [limitConfig, pageConfig, formattedFilterKaryawan],
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
    {
      th: "",
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
        value: item?.status_perubahan?.id,
        td: (
          <StatusApprovalBadge data={item?.status_perubahan.id} w={"120px"} />
        ),
        isNumeric: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.kolom,
        td: item.kolom,
      },
      {
        value: item.data,
        td: (
          <PerubahanDataRender
            column={item.kolom?.toLowerCase()}
            data={item.original_data}
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
            column={item.kolom?.toLowerCase()}
            data={item.updated_data}
          />
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: "",
        td: <KonfirmasiPermintaan data={item} />,
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
                      // onRowClick={() => {
                      //   onOpen();
                      // }}
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
