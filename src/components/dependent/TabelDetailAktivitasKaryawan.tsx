import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import formatDate from "../../lib/formatDate";
import formatTime from "../../lib/formatTime";
import NotFound from "../independent/NotFound";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import SearchComponent from "./input/SearchComponent";

interface Props {
  data: any[];
}

export default function TabelDetailAktivitasKaryawan({ data }: Props) {
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
      th: "Aktivitas",
      isSortable: true,
    },
    {
      th: "Tanggal",
      isSortable: true,
    },
    {
      th: "Waktu Presensi",
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
        value: item?.presensi,
        td: item?.presensi,
      },
      {
        value: item?.tanggal,
        td: formatDate(item?.tanggal),
        isDate: true,
      },
      {
        value: item?.tanggal,
        td: formatTime(item?.jam),
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
