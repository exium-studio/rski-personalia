import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import formatDate from "../../lib/formatDate";
import formatDurationShort from "../../lib/formatDurationShort";
import formatTime from "../../lib/formatTime";
import NotFound from "../independent/NotFound";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import SearchComponent from "./input/SearchComponent";
import StatusLemburBadge from "./StatusLemburBadge";

interface Props {
  data: any[];
}

export default function TabelDetailLemburKaryawan({ data }: Props) {
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    search: "",
    hubungan_keluarga: undefined as any,
    status_hidup: undefined as any,
  });

  // const fd = data.filter((item: any) => {
  //   const searchTerm = filterConfig.search.toLowerCase();

  //   const matchesSearchTerm1 = formatDate(item?.tgl_pengajuan)
  //     .toLowerCase()
  //     .includes(searchTerm);

  //   return matchesSearchTerm1;
  // });
  const fd = data;

  const formattedHeader = [
    {
      th: "Status Lembur",
      isSortable: true,
    },
    {
      th: "Tanggal Lembur",
      isSortable: true,
    },
    {
      th: "Jam Kerja Jadwal",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Durasi",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
  ];
  const formattedData = fd?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.created_at,
        td: (
          <StatusLemburBadge
            tgl_mulai_jadwal={
              item.jadwal_shift?.tgl_mulai || item.tgl_pengajuan
            }
            w={"120px"}
          />
        ),
      },
      {
        value: item.jadwal_shift?.tgl_mulai || item.tgl_pengajuan,
        td: formatDate(item.jadwal_shift?.tgl_mulai || item.tgl_pengajuan),
        isDate: true,
      },
      {
        value: item.jadwal?.shift?.jam_from || item.jadwal_non_shift?.jam_from,
        td: `${formatTime(
          item.jadwal_shift?.shift?.jam_from || item.jadwal_non_shift?.jam_from
        )} - ${formatTime(
          item.jadwal_shift?.shift?.jam_to || item.jadwal_non_shift?.jam_to
        )}`,
        isTime: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.durasi,
        td: formatDurationShort(item.durasi),
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
          placeholder="cari dengan tanggal jadwal"
          tooltipLabel="cari dengan tanggal jadwal (27 Agustus 2024)"
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
