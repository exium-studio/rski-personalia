import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import MultiSelectPengaturanDeletedAt from "../../components/dependent/MultiSelectPengaturanDeletedAt";
import TabelPengaturanKuisioner from "../../components/dependent/TabelPengaturanKuisioner";
import MultiSelectJabatan from "../../components/dependent/_Select/MultiSelectJabatan";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TambahKuisioner from "../../components/independent/TambahKuisioner";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";

export default function PengaturanKuisioner() {
  // Filter Config
  const defaultFilterConfig = {
    search: "",
    jabatan: [],
    is_deleted: [],
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);

  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <CContainer
      px={responsiveSpacing}
      pb={responsiveSpacing}
      pt={0}
      h={"100%"}
      overflowY={"auto"}
      className="scrollY"
      bg={lightDarkColor}
      borderRadius={12}
      flex={"1 1 600px"}
    >
      <HStack
        py={responsiveSpacing}
        justify={"space-between"}
        w={"100%"}
        className="tabelConfig scrollX"
        overflowX={"auto"}
        flexShrink={0}
      >
        <SearchComponent
          flex={"1 1 165px"}
          name="search"
          onChangeSetter={(input) => {
            setFilterConfig((ps: any) => ({
              ...ps,
              search: input,
            }));
          }}
          inputValue={filterConfig.search}
        />

        <MultiSelectPengaturanDeletedAt
          name="is_deleted"
          onConfirm={(input) => {
            setFilterConfig((ps: any) => ({
              ...ps,
              is_deleted: input,
            }));
          }}
          inputValue={filterConfig.is_deleted}
          optionsDisplay="chip"
          placeholder="Filter Dihapus"
          flex={"0 1 fit-content"}
        />

        <MultiSelectJabatan
          name="jabatan"
          onConfirm={(input) => {
            setFilterConfig((ps: any) => ({
              ...ps,
              jabatan: input,
            }));
          }}
          inputValue={filterConfig.jabatan}
          optionsDisplay="chip"
          placeholder="Filter Jabatan"
          flex={"0 1 fit-content"}
        />

        <TambahKuisioner minW={"fit-content"} />
      </HStack>

      <TabelPengaturanKuisioner filterConfig={filterConfig} />
    </CContainer>
  );
}
