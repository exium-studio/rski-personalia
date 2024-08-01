import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import MultiSelectPengaturanDeletedAt from "../../components/dependent/MultiSelectPengaturanDeletedAt";
import TabelPengaturanJabatan from "../../components/dependent/TabelPengaturanJabatan";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TambahJabatan from "../../components/independent/TambahJabatan";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";

export default function PengaturanJabatan() {
  // Filter Config
  const defaultFilterConfig = {
    search: "",
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
          flex={"1 1 0"}
          minW={"165px"}
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

        <TambahJabatan minW={"fit-content"} />
      </HStack>

      <TabelPengaturanJabatan filterConfig={filterConfig} />
    </CContainer>
  );
}
