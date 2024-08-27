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
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
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

const PenilaianList = ({ data }: { data: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`penilaian-list-modal-${data.id}`, isOpen, onOpen, onClose);

  // let responseString = String(data?.pertanyaan_jawaban);

  // // Pastikan responseString adalah string sebelum memeriksa endsWith
  // if (responseString.endsWith('"/')) {
  //   responseString = responseString.slice(0, -2);
  // }

  // // Parsing JSON
  // try {
  //   const parsedData = JSON.parse(responseString);
  //   console.log(parsedData);
  // } catch (error) {
  //   console.error("JSON parse error:", error);
  // }

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
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Daftar Penilaian"} />
          </ModalHeader>

          <ModalBody px={0} className="scrollY">
            <CContainer>
              {data?.pertanyaan_jawaban?.map((item: any, i: number) => {
                return (
                  <HStack
                    key={i}
                    justify={"space-between"}
                    align={"start"}
                    px={6}
                    py={4}
                    borderTop={i === 0 ? "1px solid var(--divider)" : ""}
                    borderBottom={"1px solid var(--divider)"}
                  >
                    <Text opacity={0.6}>{item?.pertanyaan}</Text>
                    <Text>{item?.jawaban}</Text>
                  </HStack>
                );
              })}
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
  // Filter Config
  const { formattedFilterKaryawan } = useFilterKaryawan();

  const { error, notFound, loading, data, retry } = useDataState<any[]>({
    initialData: undefined,
    url: `/api/rski/dashboard/perusahaan/get-data-penilaian?page=${pageConfig}`,
    payload: {
      ...formattedFilterKaryawan,
    },
    limit: limitConfig,
    dependencies: [limitConfig, pageConfig, formattedFilterKaryawan],
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
      th: "Penilai",
      isSortable: true,
    },
    {
      th: "Jenis Penilaian",
      isSortable: true,
    },
    {
      th: "Jumlah Pertanyaan",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Nilai Rata - Rata (maks. 5)",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Pertanyaan & Jawaban",
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
        value: item?.user_penilai?.nama,
        td: (
          <AvatarAndNameTableData
            data={{
              id: item.user_penilai.id,
              nama: item.user_penilai.nama,
              foto_profil: item.user_penilai.foto_profil,
            }}
          />
        ),
      },
      {
        value: item?.jenis_penilaian?.nama,
        td: item?.jenis_penilaian?.nama,
      },
      {
        value: item.total_pertanyaan,
        td: item.total_pertanyaan,
        cProps: {
          justify: "center",
        },
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
