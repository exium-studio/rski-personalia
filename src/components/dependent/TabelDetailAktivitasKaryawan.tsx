import { useDisclosure } from "@chakra-ui/react";
import formatDate from "../../lib/formatDate";
import formatDuration from "../../lib/formatDuration";
import formatTime from "../../lib/formatTimeOld";
import NotFound from "../independent/NotFound";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import DetailPresensiKaryawanModal from "./DetailPresensiKaryawanModal";

interface Props {
  data: any[];
  filterConfig?: any;
}

export default function TabelDetailAktivitasKaryawan({
  data,
  filterConfig,
}: Props) {
  // Presensi Detail Disclosure Config
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fd = data?.filter((item: any) => {
    const searchTerm = filterConfig?.search.toLowerCase();

    const matchesSearchTerm2 = formatDate(item?.tanggal)
      ?.toLowerCase()
      .includes(searchTerm);

    return matchesSearchTerm2;
  });

  const formattedHeader = [
    {
      th: "Kategori",
      isSortable: true,
      props: {
        position: "sticky",
        left: "2px",
        zIndex: 2,
      },
    },
    {
      th: "Jadwal",
      isSortable: true,
    },
    {
      th: "Presensi Masuk",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Presensi keluar",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Durasi kerja",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
  ];
  const formattedData = fd?.map((item) => {
    return {
      id: item.id,
      columnsFormat: [
        {
          value: item.kategori_presensi?.label,
          td: item.kategori_presensi?.label,
          props: {
            position: "sticky",
            left: "2px",
            zIndex: 2,
          },
        },
        {
          value: item?.presensi,
          td: "21/11/2024 - 21/11/2024 (09:00 - 18:00)",
        },
        {
          value: item.jam_masuk,
          td: formatTime(item.jam_masuk),
          isTime: true,
          cProps: {
            justify: "center",
          },
        },
        {
          value: item.jam_keluar,
          td: formatTime(item.jam_keluar),
          isTime: true,
          cProps: {
            justify: "center",
          },
        },
        {
          value: item.durasi,
          td: formatDuration(item.durasi),
          isNumber: true,
          cProps: {
            justify: "center",
          },
        },
      ],
    };
  });

  const presensi_id = parseInt(localStorage.getItem("presensi_id") as string);

  return (
    <>
      {fd?.length === 0 && <NotFound />}

      {fd?.length > 0 && (
        <>
          <CustomTableContainer>
            <CustomTable
              formattedHeader={formattedHeader}
              formattedData={formattedData}
              onRowClick={(row) => {
                localStorage.setItem("presensi_id", row.id);
                onOpen();
              }}
              // rowOptions={rowOptions}
            />
          </CustomTableContainer>

          <DetailPresensiKaryawanModal
            presensi_id={presensi_id}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          />
        </>
      )}
    </>
  );
}
