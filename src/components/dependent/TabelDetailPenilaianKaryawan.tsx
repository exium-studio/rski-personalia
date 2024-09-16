import {
  Button,
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
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import NotFound from "../independent/NotFound";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import DisclosureHeader from "./DisclosureHeader";
import SearchComponent from "./input/SearchComponent";

const PertanyaanJawabanModal = ({ data }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `pertanyaan-jawaban-modal-${data.id}`,
    isOpen,
    onOpen,
    onClose
  );

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme="ap"
        variant={"ghost"}
        className="clicky"
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
            <DisclosureHeader title={"Pertanyaan & Jawaban"} />
          </ModalHeader>
          <ModalBody>
            {data?.pertanyaan_jawaban?.map((item: any, i: number) => (
              <HStack
                key={i}
                justify={"space-between"}
                borderBottom={
                  i === data?.pertanyaan_jawaban?.length - 1
                    ? ""
                    : "1px solid var(--divider3)"
                }
                pb={i === data?.pertanyaan_jawaban?.length - 1 ? 0 : 4}
                mb={i === data?.pertanyaan_jawaban?.length - 1 ? 0 : 4}
                align={"start"}
              >
                <Text>{item?.pertanyaan}</Text>
                <Text>{item?.jawaban}</Text>
              </HStack>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-solid clicky"
              w={"100%"}
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
  data: any[];
}

export default function TabelDetailPenilaianKaryawan({ data }: Props) {
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    search: "",
    hubungan_keluarga: undefined as any,
    status_hidup: undefined as any,
  });

  const fd = data?.filter((item: any) => {
    const searchTerm = filterConfig?.search.toLowerCase();

    const matchesSearchTerm = item?.presensi
      ?.toLowerCase()
      .includes(searchTerm);
    const matchesSearchTerm2 = formatDate(item?.tanggal)
      ?.toLowerCase()
      .includes(searchTerm);

    return matchesSearchTerm || matchesSearchTerm2;
  });

  const formattedHeader = [
    {
      th: "Jenis Penilaian",
      isSortable: true,
    },
    {
      th: "Total Pertanyaan",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Pertanyaan Jawaban",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Rata - rata",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
  ];
  const formattedData = fd?.map((item) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item?.jenis_penilaian?.nama,
        td: item?.jenis_penilaian?.nama,
      },
      {
        value: item?.total_pertanyaan,
        td: formatNumber(item?.total_pertanyaan),
        isNumeric: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: "",
        td: <PertanyaanJawabanModal data={item} />,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item?.rata_rata,
        td: formatNumber(item?.rata_rata),
        isNumeric: true,
        cProps: {
          justify: "center",
        },
      },
    ],
  }));

  return (
    <>
      <HStack mb={responsiveSpacing}>
        <SearchComponent
          name="search"
          onChangeSetter={(input) => {
            setFilterConfig((ps) => ({
              ...ps,
              search: input,
            }));
          }}
          inputValue={filterConfig.search}
        />
      </HStack>

      {fd?.length === 0 && <NotFound />}

      {fd?.length > 0 && (
        <CustomTableContainer>
          <CustomTable
            formattedHeader={formattedHeader}
            formattedData={formattedData}
            // rowOptions={rowOptions}
          />
        </CustomTableContainer>
      )}
    </>
  );
}
