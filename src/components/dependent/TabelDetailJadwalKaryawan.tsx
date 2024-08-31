import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import { Interface__JadwalItem } from "../../constant/interfaces";
import { responsiveSpacing } from "../../constant/sizes";
import formatTime from "../../lib/formatTime";
import NotFound from "../independent/NotFound";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import SearchComponent from "./input/SearchComponent";
import formatDate from "../../lib/formatDate";

interface Props {
  data: Interface__JadwalItem[];
}

export default function TabelDetailJadwalKaryawan({ data }: Props) {
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    search: "",
    hubungan_keluarga: undefined as any,
    status_hidup: undefined as any,
  });

  const fd = data.filter((item: any) => {
    const searchTerm = filterConfig.search.toLowerCase();

    const matchesSearchTerm = item.shift.nama
      .toLowerCase()
      .includes(searchTerm);

    return matchesSearchTerm;
  });

  const formattedHeader = [
    {
      th: "Label",
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
      th: "Jam Kerja",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
  ];
  const formattedData = fd.map((item) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.shift.nama,
        td: item.shift.nama,
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
        value: item.shift.jam_from,
        td: `${formatTime(item.shift.jam_from as string)} - ${formatTime(
          item.shift.jam_to as string
        )}`,
        isTime: true,
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
