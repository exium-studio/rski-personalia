import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import { Interface__AnggotaKeluarga } from "../../constant/interfaces";
import { responsiveSpacing } from "../../constant/sizes";
import NotFound from "../independent/NotFound";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import MultiSelectHubunganKeluarga from "./_Select/MultiSelectHubunganKeluarga";
import MultiSelectStatusHidup from "./_Select/MultiSelectStatusHidup";
import BooleanBadge from "./BooleanBadge";
import CustomTable from "./CustomTable";
import SearchComponent from "./input/SearchComponent";

interface Props {
  data: Interface__AnggotaKeluarga[];
}

export default function TabelDetailKeluargaKaryawan({ data }: Props) {
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    search: "",
    hubungan_keluarga: undefined as any,
    status_hidup: undefined as any,
  });

  const fd = data.filter((item: any) => {
    const searchTerm = filterConfig.search.toLowerCase();
    const hubunganTerm = filterConfig.hubungan_keluarga;
    const statusHidupTerm = filterConfig.status_hidup;

    const matchesSearchTerm = item.nama.toLowerCase().includes(searchTerm);
    const matchesHubunganTerm =
      hubunganTerm && hubunganTerm.length > 0
        ? hubunganTerm.some(
            (filterItem: any) => filterItem.value === item.hubungan.id
          )
        : true;
    const matchesStatusHidupTerm =
      statusHidupTerm && statusHidupTerm.length > 0
        ? statusHidupTerm.some(
            (filterItem: any) => filterItem.value === item.status_hidup
          )
        : true;

    return matchesSearchTerm && matchesHubunganTerm && matchesStatusHidupTerm;
  });

  const formattedHeader = [
    {
      th: "Nama",
      isSortable: true,
    },
    {
      th: "Status Hubungan",
      isSortable: true,
    },
    {
      th: "Status Hidup",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Pendidikan Terakhir",
      isSortable: true,
    },
    {
      th: "Pekerjaan",
      isSortable: true,
    },
    {
      th: "No. Telepon",
      isSortable: true,
    },
    {
      th: "Email",
      isSortable: true,
    },
  ];
  const formattedData = fd.map((item) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.nama,
        td: item.nama,
      },
      {
        value: item.hubungan.label,
        td: item.hubungan.label,
      },
      {
        value: item.status_hidup,
        td: (
          <BooleanBadge
            data={item.status_hidup}
            trueValue="Hidup"
            falseValue="Meninggal"
            w={"120px"}
          />
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.pendidikan_terakhir,
        td: item.pendidikan_terakhir,
      },
      {
        value: item.pekerjaan,
        td: item.pekerjaan,
      },
      {
        value: item.no_hp,
        td: item.no_hp,
      },
      {
        value: item.email,
        td: item.email,
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

        <MultiSelectHubunganKeluarga
          name="hubungan_keluarga"
          onConfirm={(input) => {
            setFilterConfig((ps) => ({
              ...ps,
              hubungan_keluarga: input,
            }));
          }}
          inputValue={filterConfig.hubungan_keluarga}
          optionsDisplay="chip"
          placeholder="Filter Hubungan"
          minW={"fit-content"}
          w={"fit-content"}
        />

        <MultiSelectStatusHidup
          name="status_hidup"
          onConfirm={(input) => {
            setFilterConfig((ps) => ({
              ...ps,
              status_hidup: input,
            }));
          }}
          inputValue={filterConfig.status_hidup}
          optionsDisplay="chip"
          placeholder="Filter Status Hidup"
          minW={"fit-content"}
          w={"fit-content"}
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
