import {
  Button,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import FlexLine from "../independent/FlexLine";
import NoData from "../independent/NoData";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NotFound from "../independent/NotFound";

const PenilaianList = ({ data }: { data: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`penilaian-list-modal-${data.id}`, isOpen, onOpen, onClose);

  return (
    <>
      <Button
        className="clicky"
        colorScheme="ap"
        variant={"ghost"}
        onClick={onOpen}
      >
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
            <DisclosureHeader title={"Daftar Penilaian"} />
          </ModalHeader>

          <ModalBody px={0}>
            <CContainer gap={2}>
              <HStack justify={"space-between"} gap={4} px={6}>
                <Text fontWeight={600}>Rata - Rata</Text>
                <Text fontWeight={600}>{data.rata_rata}</Text>
              </HStack>

              {data.penilaians.map((item: any, i: number) => (
                <HStack key={i} px={6} py={2} justify={"space-between"}>
                  <AvatarAndNameTableData
                    data={{
                      id: item.user_penilai.id,
                      nama: item.user_penilai.nama,
                      foto_profil: item.user_penilai.foto_profil,
                    }}
                  />

                  <FlexLine />

                  <Text>{item.rata_rata}</Text>
                </HStack>
              ))}
            </CContainer>
          </ModalBody>

          <ModalFooter>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              onClick={backOnClose}
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

export default function TabelPenilaianKaryawan({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);

  const { error, notFound, loading, data, retry } = useDataState<any[]>({
    initialData: undefined,
    url: `/api/rski/dashboard/perusahaan/get-data-penilaian?page=${pageConfig}`,
    payload: {
      ...filterConfig,
    },
    limit: limitConfig,
    dependencies: [limitConfig, pageConfig, filterConfig],
  });

  const formattedHeader = [
    {
      th: "Karyawan Dinilai",
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
      th: "Periode",
      isSortable: true,
    },
    {
      th: "Unit Kerja",
      isSortable: true,
    },
    {
      th: "Jabatan",
      isSortable: true,
    },
    {
      th: "Rata - Rata",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Penilaian",
      cProps: {
        justify: "center",
      },
    },
  ];
  const formattedData = data?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.user_dinilai.nama,
        td: (
          <AvatarAndNameTableData
            data={{
              id: item.user_dinilai.id,
              nama: item.user_dinilai.nama,
              foto_profil: item.user_dinilai.foto_profil,
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
        value: item.periode,
        td: formatDate(item.periode, "periode"),
      },
      {
        value: item.unit_kerja_dinilai.nama_unit,
        td: item.unit_kerja_dinilai.nama_unit,
      },
      {
        value: item.jabatan_dinilai.nama_jabatan,
        td: item.jabatan_dinilai.nama_jabatan,
      },
      {
        value: item.rata_rata,
        td: item.rata_rata,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.penilaians,
        td: <PenilaianList data={item} />,
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
