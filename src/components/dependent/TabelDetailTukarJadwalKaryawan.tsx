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
import PertukaranJadwalModal from "./PertukaranJadwalModal";

interface Props {
  data: any;
}

export default function TabelDetailTukarJadwalKaryawan({ data }: Props) {
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    search: "",
  });

  const fd = data.pertukaran_jadwal.filter((item: any) => {
    const searchTerm = filterConfig.search.toLowerCase();

    const matchesSearchTerm1 = item.karyawan_pengajuan.nama
      .toLowerCase()
      .includes(searchTerm);
    const matchesSearchTerm2 = item.karyawan_ditukar.nama
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
    // {
    //   th: "Unit Kerja",
    //   isSortable: true,
    // },
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
  const formattedData = fd?.map((item: any) => {
    return {
      id: item.id,
      columnsFormat: [
        {
          value: item.created_at,
          td: formatDate(item.tanggal_pengajuan),
        },
        {
          value: item.karyawan_pengajuan.nama,
          td: item.karyawan_pengajuan.nama,
        },
        {
          value: item?.status_penukaran?.label,
          td: <ApprovalStatus data={item?.status_penukaran} w={"180px"} />,
          cProps: {
            justify: "center",
          },
        },
        // {
        //   value: data.unit_kerja?.nama_unit,
        //   td: data.unit_kerja?.nama_unit,
        // },
        {
          value: item.karyawan_pengajuan?.nama,
          td: (
            <AvatarAndNameTableData
              data={{
                id: item.karyawan_pengajuan?.id,
                nama: item.karyawan_pengajuan?.nama,
                foto_profil: item.karyawan_pengajuan?.foto_profil,
              }}
            />
          ),
        },
        {
          value: item.karyawan_ditukar?.nama,
          td: (
            <AvatarAndNameTableData
              data={{
                id: item.karyawan_ditukar?.id,
                nama: item.karyawan_ditukar?.nama,
                foto_profil: item.karyawan_ditukar?.foto_profil,
              }}
            />
          ),
        },
        {
          value: item.pertukaran_jadwal,
          td: (
            <PertukaranJadwalModal
              id={item.id}
              userPengajuan={item.karyawan_pengajuan}
              userDitukar={item.karyawan_ditukar}
              data={item.list_jadwal}
            />
          ),
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
