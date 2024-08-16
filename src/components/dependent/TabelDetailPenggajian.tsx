import { HStack, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import NotFound from "../independent/NotFound";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import MultiSelectUnitKerja from "./_Select/MultiSelectUnitKerja";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import DetailPenggajianKaryawanModal from "./DetailPenggajianKaryawanModal";
import ExportModal from "./ExportModal";
import SearchComponent from "./input/SearchComponent";

interface Props {
  data: any;
}

export default function TabelDetailPenggajian({ data }: Props) {
  // Detail Penggajian Karyawan Disclosure
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    search: "",
    unit_kerja: undefined as any,
  });

  const fd = data.data_penggajian.filter((item: any) => {
    const searchTerm = filterConfig.search.toLowerCase();
    const unitKerjaTerm = filterConfig.unit_kerja;

    const matchesSearchTerm = item.user.nama.toLowerCase().includes(searchTerm);
    const matchesUnitKerjaTerm =
      unitKerjaTerm && unitKerjaTerm.length > 0
        ? unitKerjaTerm.some(
            (filterItem: any) => filterItem.value === item.unit_kerja.id
          )
        : true;

    return matchesSearchTerm && matchesUnitKerjaTerm;
  });

  const formattedHeader = [
    {
      th: "Nama",
      isSortable: true,
      props: {
        position: "sticky",
        left: 0,
        zIndex: 99,
        w: "243px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
    },
    {
      th: "Unit Kerja",
      isSortable: true,
    },
    {
      th: "Kelompok Gaji",
      isSortable: true,
    },
    {
      th: "Gaji Pokok",
      isSortable: true,
      cProps: {
        justify: "end",
      },
    },
    {
      th: "Take Home Pay",
      isSortable: true,
      cProps: {
        justify: "end",
      },
    },
  ];
  const formattedData = fd.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.user.nama,
        td: (
          <AvatarAndNameTableData
            data={{
              id: item.user.id,
              nama: item.user.nama,
              foto_profil: item.user.foto_profil,
            }}
          />
        ),
        props: {
          position: "sticky",
          left: 0,
          zIndex: 2,
        },
        cProps: {
          borderRight: "1px solid var(--divider3)",
        },
      },
      {
        value: item.unit_kerja.nama_unit,
        td: item.unit_kerja.nama_unit,
      },
      {
        value: item.kelompok_gaji.nama_kelompok,
        td: item.kelompok_gaji.nama_kelompok,
      },
      {
        value: item.kelompok_gaji.besaran_gaji,
        td: `Rp ${formatNumber(item.kelompok_gaji.besaran_gaji)}`,
        isNumeric: true,
        cProps: {
          justify: "end",
        },
      },
      {
        value: item.take_home_pay,
        td: `Rp ${formatNumber(item.take_home_pay)}`,
        isNumeric: true,
        cProps: {
          justify: "end",
        },
      },
    ],
  }));

  const [riwayatId, setRiwayatId] = useState<number | undefined>(undefined);

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

        <MultiSelectUnitKerja
          name="unit_kerja"
          onConfirm={(input) => {
            setFilterConfig((ps) => ({
              ...ps,
              unit_kerja: input,
            }));
          }}
          inputValue={filterConfig.unit_kerja}
          optionsDisplay="chip"
          placeholder="Filter Unit Kerja"
          minW={"fit-content"}
          w={"fit-content"}
        />

        <ExportModal
          url=""
          title={`Export Penggajian ${formatDate(
            data.data_riwayat.periode,
            "periode"
          )}`}
        />
      </HStack>

      {fd.length === 0 && <NotFound />}

      {fd.length > 0 && (
        <>
          <CustomTableContainer>
            <CustomTable
              formattedHeader={formattedHeader}
              formattedData={formattedData}
              onRowClick={(rowData) => {
                setRiwayatId(rowData.id);
                onOpen();
              }}
              // rowOptions={rowOptions}
            />
          </CustomTableContainer>

          <Text opacity={0.4} textAlign={"center"} mt={responsiveSpacing}>
            Klik row untuk melihat detail penggajian karyawan
          </Text>
        </>
      )}

      <DetailPenggajianKaryawanModal
        riwayat_id={riwayatId}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
    </>
  );
}
