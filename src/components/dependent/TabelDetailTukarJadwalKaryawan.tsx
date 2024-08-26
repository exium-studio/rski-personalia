import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import formatDate from "../../lib/formatDate";
import NotFound from "../independent/NotFound";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import SearchComponent from "./input/SearchComponent";
import ApprovalStatus from "./StatusVerifikasiBadge";

interface Props {
  data: any[];
}

export default function TabelDetailTukarJadwalKaryawan({ data }: Props) {
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    search: "",
    hubungan_keluarga: undefined as any,
    status_hidup: undefined as any,
  });

  const fd = data.filter((item: any) => {
    const searchTerm = filterConfig.search.toLowerCase();

    const matchesSearchTerm1 = item.user_pengajuan.user.nama
      .toLowerCase()
      .includes(searchTerm);
    const matchesSearchTerm2 = item.user_ditukar.user.nama
      .toLowerCase()
      .includes(searchTerm);

    return matchesSearchTerm1 && matchesSearchTerm2;
  });

  const formattedHeader = [
    {
      th: "Tanggal Pengajuan",
      isSortable: true,
    },
    {
      th: "Kategori Penukaran",
      isSortable: true,
    },
    {
      th: "Status Penukaran",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Unit Kerja",
      isSortable: true,
    },
    {
      th: "Karyawan Pengajuan",
      isSortable: true,
    },
    {
      th: "Karyawan Ditukar",
      isSortable: true,
    },
    {
      th: "Pertukaran Jadwal",
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
        td: formatDate(item.created_at),
      },
      {
        value: item.user_pengajuan?.kategori?.label,
        td: item.user_pengajuan?.kategori?.label,
      },
      {
        value: item.user_pengajuan?.status?.label,
        td: (
          <ApprovalStatus data={item.user_pengajuan?.status?.id} w={"120px"} />
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.unit_kerja?.nama_unit,
        td: item.unit_kerja?.nama_unit,
      },
      {
        value: item.user_pengajuan?.user?.nama,
        td: (
          <AvatarAndNameTableData
            data={{
              id: item.user_pengajuan?.user?.id,
              nama: item.user_pengajuan?.user?.nama,
              foto_profil: item.user_pengajuan?.user?.foto_profil,
            }}
          />
        ),
      },
      {
        value: item.user_ditukar?.user?.nama,
        td: (
          <AvatarAndNameTableData
            data={{
              id: item.user_ditukar?.user?.id,
              nama: item.user_ditukar?.user?.nama,
              foto_profil: item.user_ditukar?.user?.foto_profil,
            }}
          />
        ),
      },
      // {
      //   value: item.pertukaran_jadwal,
      //   td: (
      //     <PertukaranJadwalModal id={item.id} data={item.pertukaran_jadwal} />
      //   ),
      //   cProps: {
      //     justify: "center",
      //   },
      // },
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
          placeholder="cari dengan nama karyawan pengajuan/ditukar"
          tooltipLabel="cari dengan nama karyawan pengajuan/ditukar"
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
