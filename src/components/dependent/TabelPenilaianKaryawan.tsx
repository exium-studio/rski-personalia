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
import { responsiveSpacing } from "../../constant/sizes";
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

  const dummy = [
    {
      periode: "2024-05-22",
      user_dinilai: {
        id: 3,
        nama: "Jolitos Kurniawan",
        username: "username1",
        email_verified_at: null,
        role_id: null,
        foto_profil: "https://bit.ly/dan-abramov",
        data_completion_step: 1,
        status_aktif: 1,
        created_at: "2024-06-06T23:48:35.000000Z",
        updated_at: "2024-06-06T23:48:35.000000Z",
        roles: [
          {
            id: 3,
            name: "Admin",
            deskripsi:
              "satellites native some bottle blanket extra continued young married lost far great door short quick example tin teeth variety shadow does line met these",
            guard_name: "web",
            created_at: "2024-04-19T23:48:34.000000Z",
            updated_at: "2024-06-06T23:48:34.000000Z",
            pivot: {
              model_type: "App\\Models\\User",
              model_id: 3,
              role_id: 3,
            },
          },
        ],
      },
      unit_kerja_dinilai: {
        id: 12,
        nama_unit: "Sumber Daya Manusia (SDM)",
        jenis_karyawan: 1,
        created_at: "2024-03-20T23:48:34.000000Z",
        updated_at: "2024-06-06T23:48:34.000000Z",
      },
      jabatan_dinilai: {
        id: 16,
        nama_jabatan: "Tenaga Radiologi",
        is_struktural: 0,
        tunjangan: 1697689,
        created_at: "2023-07-14T23:48:34.000000Z",
        updated_at: "2024-06-06T23:48:34.000000Z",
      },
      penilaians: [
        {
          user_penilai: {
            id: 3,
            nama: "Karlitos Marsukik",
            username: "username1",
            email_verified_at: null,
            role_id: null,
            foto_profil: "https://bit.ly/dan-abramov",
            data_completion_step: 1,
            status_aktif: 1,
            created_at: "2024-06-06T23:48:35.000000Z",
            updated_at: "2024-06-06T23:48:35.000000Z",
            roles: [
              {
                id: 3,
                name: "Admin",
                deskripsi:
                  "satellites native some bottle blanket extra continued young married lost far great door short quick example tin teeth variety shadow does line met these",
                guard_name: "web",
                created_at: "2024-04-19T23:48:34.000000Z",
                updated_at: "2024-06-06T23:48:34.000000Z",
                pivot: {
                  model_type: "App\\Models\\User",
                  model_id: 3,
                  role_id: 3,
                },
              },
            ],
          },
          rata_rata: 90,
        },
        {
          user_penilai: {
            id: 3,
            nama: "Nanda Simonsely",
            username: "username1",
            email_verified_at: null,
            role_id: null,
            foto_profil: "https://bit.ly/dan-abramov",
            data_completion_step: 1,
            status_aktif: 1,
            created_at: "2024-06-06T23:48:35.000000Z",
            updated_at: "2024-06-06T23:48:35.000000Z",
            roles: [
              {
                id: 3,
                name: "Admin",
                deskripsi:
                  "satellites native some bottle blanket extra continued young married lost far great door short quick example tin teeth variety shadow does line met these",
                guard_name: "web",
                created_at: "2024-04-19T23:48:34.000000Z",
                updated_at: "2024-06-06T23:48:34.000000Z",
                pivot: {
                  model_type: "App\\Models\\User",
                  model_id: 3,
                  role_id: 3,
                },
              },
            ],
          },
          rata_rata: 10,
        },
      ],
      rata_rata: 95,
    },
  ];

  const { error, loading, data, retry } = useDataState<any[]>({
    initialData: dummy,
    url: "",
    payload: {
      filterConfig: filterConfig,
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
        w: "180px",
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
        <Center my={"auto"} minH={"300px"}>
          <Retry loading={loading} retry={retry} />
        </Center>
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
