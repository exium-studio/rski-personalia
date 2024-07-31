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
  useDisclosure,
} from "@chakra-ui/react";
import { RiArrowRightUpLine } from "@remixicon/react";
import { useState } from "react";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatTime from "../../lib/formatTime";
import NoData from "../independent/NoData";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import DetailKaryawanModalDisclosure from "./DetailKaryawanModalDisclosure";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";

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
              {data.peserta.map((peserta: any, i: number) => (
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

  const dummy = [
    {
      id: 1,
      nama: "Latihan Ortopedi",
      tgl_pelaksanaan: "2024-12-03",
      peserta: [
        {
          id: 1,
          nama: "Andi Setiawan",
          foto_profil: "https://bit.ly/dan-abramov",
        },
        {
          id: 2,
          nama: "Budi Santoso",
          foto_profil: "https://bit.ly/tioluwani-kolawole",
        },
        {
          id: 3,
          nama: "Citra Lestari",
          foto_profil: "https://bit.ly/kent-c-dodds",
        },
        {
          id: 4,
          nama: "Dewi Anggraini",
          foto_profil: "https://bit.ly/ryan-florence",
        },
        {
          id: 5,
          nama: "Eko Prasetyo",
          foto_profil: "https://bit.ly/prosper-baba",
        },
        {
          id: 6,
          nama: "Fajar Nugroho",
          foto_profil: "https://bit.ly/code-beast",
        },
      ],
      kategori_acara: {
        id: 1,
        label: "Internal",
      },
      tempat: "RSKI Gedung A lt. 2",
      waktu: "2024-12-03 12:00:00",
      penanggung_jawab: "Jolitos Kurniawan",
    },
    {
      id: 2,
      nama: "Seminar Kesehatan",
      tgl_pelaksanaan: "2024-11-10",
      peserta: [
        {
          id: 7,
          nama: "Gita Permata",
          foto_profil: "https://bit.ly/sage-adebayo",
        },
        {
          id: 8,
          nama: "Hendra Wijaya",
          foto_profil: "https://bit.ly/dan-abramov",
        },
        {
          id: 9,
          nama: "Ika Amalia",
          foto_profil: "https://bit.ly/tioluwani-kolawole",
        },
        {
          id: 10,
          nama: "Joko Sutrisno",
          foto_profil: "https://bit.ly/kent-c-dodds",
        },
        {
          id: 11,
          nama: "Kiki Ramadhan",
          foto_profil: "https://bit.ly/ryan-florence",
        },
        {
          id: 12,
          nama: "Lina Wulandari",
          foto_profil: "https://bit.ly/prosper-baba",
        },
      ],
      kategori_acara: {
        id: 2,
        label: "Internal",
      },
      tempat: "Hotel Santika lt. 3",
      waktu: "2024-11-10 09:00:00",
      penanggung_jawab: "Linda Setiawan",
    },
    {
      id: 3,
      nama: "Workshop IT",
      tgl_pelaksanaan: "2024-10-15",
      peserta: [
        {
          id: 13,
          nama: "Maya Kurniawati",
          foto_profil: "https://bit.ly/code-beast",
        },
        {
          id: 14,
          nama: "Nina Sari",
          foto_profil: "https://bit.ly/sage-adebayo",
        },
        {
          id: 15,
          nama: "Omar Hidayat",
          foto_profil: "https://bit.ly/dan-abramov",
        },
        {
          id: 16,
          nama: "Putu Arya",
          foto_profil: "https://bit.ly/tioluwani-kolawole",
        },
        {
          id: 17,
          nama: "Qory Aditya",
          foto_profil: "https://bit.ly/kent-c-dodds",
        },
        {
          id: 18,
          nama: "Rani Aulia",
          foto_profil: "https://bit.ly/ryan-florence",
        },
      ],
      kategori_acara: {
        id: 1,
        label: "Internal",
      },
      tempat: "Universitas Dian Nuswantoro",
      waktu: "2024-10-15 13:00:00",
      penanggung_jawab: "Budi Santoso",
    },
    {
      id: 4,
      nama: "Pelatihan Akuntansi",
      tgl_pelaksanaan: "2024-09-20",
      peserta: [
        {
          id: 19,
          nama: "Sari Lestari",
          foto_profil: "https://bit.ly/prosper-baba",
        },
        {
          id: 20,
          nama: "Toni Kurniawan",
          foto_profil: "https://bit.ly/code-beast",
        },
        {
          id: 21,
          nama: "Uli Nugroho",
          foto_profil: "https://bit.ly/sage-adebayo",
        },
        {
          id: 22,
          nama: "Vina Putri",
          foto_profil: "https://bit.ly/dan-abramov",
        },
        {
          id: 23,
          nama: "Wawan Susanto",
          foto_profil: "https://bit.ly/tioluwani-kolawole",
        },
        {
          id: 24,
          nama: "Xenia Prasetya",
          foto_profil: "https://bit.ly/kent-c-dodds",
        },
      ],
      kategori_acara: {
        id: 1,
        label: "Internal",
      },
      tempat: "Gedung Keuangan lt. 5",
      waktu: "2024-09-20 10:00:00",
      penanggung_jawab: "Sari Lestari",
    },
    {
      id: 5,
      nama: "Webinar Pendidikan",
      tgl_pelaksanaan: "2024-08-25",
      peserta: [
        {
          id: 25,
          nama: "Yoga Saputra",
          foto_profil: "https://bit.ly/ryan-florence",
        },
        {
          id: 26,
          nama: "Zara Fitri",
          foto_profil: "https://bit.ly/prosper-baba",
        },
        {
          id: 27,
          nama: "Anton Wijaya",
          foto_profil: "https://bit.ly/code-beast",
        },
        {
          id: 28,
          nama: "Bella Andriani",
          foto_profil: "https://bit.ly/sage-adebayo",
        },
        {
          id: 29,
          nama: "Cindy Lestari",
          foto_profil: "https://bit.ly/dan-abramov",
        },
        {
          id: 30,
          nama: "Dani Ramadhan",
          foto_profil: "https://bit.ly/tioluwani-kolawole",
        },
      ],
      kategori_acara: {
        id: 2,
        label: "Eksternal",
      },
      tempat: "Online",
      waktu: "2024-08-25 14:00:00",
      penanggung_jawab: "Andi Prasetyo",
    },
    {
      id: 6,
      nama: "Pelatihan Marketing",
      tgl_pelaksanaan: "2024-07-30",
      peserta: [
        {
          id: 31,
          nama: "Eka Rahmawati",
          foto_profil: "https://bit.ly/kent-c-dodds",
        },
        {
          id: 32,
          nama: "Faisal Prasetyo",
          foto_profil: "https://bit.ly/ryan-florence",
        },
        {
          id: 33,
          nama: "Gilang Setiawan",
          foto_profil: "https://bit.ly/prosper-baba",
        },
        {
          id: 34,
          nama: "Hana Kartika",
          foto_profil: "https://bit.ly/code-beast",
        },
        {
          id: 35,
          nama: "Irfan Nugraha",
          foto_profil: "https://bit.ly/sage-adebayo",
        },
        {
          id: 36,
          nama: "Juli Andriana",
          foto_profil: "https://bit.ly/dan-abramov",
        },
      ],
      kategori_acara: {
        id: 1,
        label: "Internal",
      },
      tempat: "Gedung Marketing lt. 1",
      waktu: "2024-07-30 11:00:00",
      penanggung_jawab: "Rina Marpaung",
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
      th: "Nama Acara",
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
      th: "Tanggal Pelaksanaan",
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
      th: "Waktu",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Penanggung Jawab",
      isSortable: true,
    },
  ];
  const formattedData = data?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.nama,
        td: item.nama,
        props: {
          position: "sticky",
          left: 0,
          zIndex: 2,
          w: "180px",
        },
        cProps: {
          borderRight: "1px solid var(--divider3)",
        },
      },
      {
        value: item.tgl_pelaksanaan,
        td: formatDate(item.tgl_pelaksanaan),
        isDate: true,
      },
      {
        value: item.peserta,
        td: <PesertaModal data={item} />,
      },
      {
        value: item.kategori_acara.label,
        td: item.kategori_acara.label,
      },
      {
        value: item.tempat,
        td: item.tempat,
      },
      {
        value: item.waktu,
        td: formatTime(item.waktu),
        isTime: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.penanggung_jawab,
        td: item.penanggung_jawab,
      },
    ],
  }));

  return (
    <>
      {error && (
        <Center my={"auto"} minH={"400px"}>
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
              {!formattedData && <NoData minH={"400px"} />}

              {formattedData && (
                <>
                  <CustomTableContainer>
                    <CustomTable
                      formattedHeader={formattedHeader}
                      formattedData={formattedData}
                      initialSortOrder="desc"
                      initialSortColumnIndex={1}
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
