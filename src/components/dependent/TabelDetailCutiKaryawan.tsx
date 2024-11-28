import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import NotFound from "../independent/NotFound";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import ApprovalStatus from "./StatusVerifikasiBadge";
import CustomTable from "./CustomTable";
import SearchComponent from "./input/SearchComponent";

interface Props {
  data: any[];
}

export default function TabelDetailCutiKaryawan({ data }: Props) {
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    search: "",
    hubungan_keluarga: undefined as any,
    status_hidup: undefined as any,
  });

  const fd = data.filter((item: any) => {
    const searchTerm = filterConfig.search.toLowerCase();

    const matchesSearchTerm = item.tipe_cuti.nama
      .toLowerCase()
      .includes(searchTerm);

    return matchesSearchTerm;
  });

  const formattedHeader = [
    {
      th: "Tipe Cuti",
      isSortable: true,
    },
    {
      th: "Status Cuti",
      isSortable: true,
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
      th: "Durasi",
      isSortable: true,
    },
    {
      th: "Catatan",
    },
  ];
  const formattedData = fd.map((item) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.tipe_cuti.nama,
        td: item.tipe_cuti.nama,
      },
      {
        value: item.status_cuti.label,
        td: <ApprovalStatus data={item.status_cuti} />,
      },
      {
        value: item.tgl_from,
        td: formatDate(item.tgl_from),
      },
      {
        value: item.tgl_to,
        td: formatDate(item.tgl_to),
      },
      {
        value: item.durasi,
        td: `${formatNumber(item.durasi)} hari`,
      },
      {
        value: item.catatan,
        td: item.catatan,
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
          placeholder="cari dengan"
          tooltipLabel="cari dengan"
        />
      </HStack>

      {fd.length === 0 && <NotFound />}

      {fd.length > 0 && (
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
