import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import formatDate from "../../lib/formatDate";
import formatTime from "../../lib/formatTime";
import getThisWeekDates from "../../lib/getThisWeekDates";
import NotFound from "../independent/NotFound";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import SearchComponent from "./input/SearchComponent";

interface Props {
  data: any;
}

export default function TabelDetailJadwalKaryawan({ data }: Props) {
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    search: "",
  });

  const fd = data.filter((item: any) => {
    const searchTerm = filterConfig.search.toLowerCase();

    const matchesSearchTerm = item?.shift
      ? item?.shift?.nama.toLowerCase().includes(searchTerm)
      : "libur".includes(searchTerm);

    return matchesSearchTerm;
  });

  const thisWeekDates = getThisWeekDates();

  console.log(thisWeekDates);

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
  const formattedData: any[] = fd
    .filter((item: any) => item !== null)
    .map((item: any, i: number) => {
      return {
        id: item?.id,
        columnsFormat: [
          {
            value: item?.shift?.nama || item?.nama || "Libur",
            td: item?.shift?.nama || item?.nama || "Libur",
          },
          {
            value: item.tgl_mulai || thisWeekDates[i],
            td: formatDate(item.tgl_mulai) || formatDate(thisWeekDates[i]),
            isDate: true,
          },
          {
            value: item.tgl_selesai || thisWeekDates[i],
            td: formatDate(item.tgl_selesai) || formatDate(thisWeekDates[i]),
            isDate: true,
          },
          {
            value: item?.shift?.jam_from,
            td: item?.shift
              ? `${formatTime(item?.shift?.jam_from as string)} - ${formatTime(
                  item?.shift?.jam_to as string
                )}`
              : `${formatTime(item?.jam_from as string)} - ${formatTime(
                  item?.jam_to as string
                )}`,
            isTime: true,
            cProps: {
              justify: "center",
            },
          },
        ],
      };
    });

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
