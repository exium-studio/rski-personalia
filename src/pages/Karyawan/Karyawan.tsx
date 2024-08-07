import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ExportKaryawanModal from "../../components/dependent/ExportKaryawanModal";
import ImportModal from "../../components/dependent/ImportModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelKaryawan from "../../components/dependent/TabelKaryawan";
import TambahKaryawanModal from "../../components/dependent/TambahKaryawanModal";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import KaryawanTableColumnsConfig from "../../components/independent/KaryawanTableColumnsConfig";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useFilterKaryawan from "../../global/useFilterKaryawan";

export default function Karyawan() {
  // Filter Config
  const { setFilterKaryawan, setFormattedFilterKaryawan } = useFilterKaryawan();
  const [search, setSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterKaryawan({ search });
      setFormattedFilterKaryawan({ search });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, setFilterKaryawan, setFormattedFilterKaryawan]);

  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <>
      <CWrapper overflowY={"auto"}>
        <CContainer
          flex={1}
          px={responsiveSpacing}
          pb={responsiveSpacing}
          pt={0}
          bg={lightDarkColor}
          borderRadius={12}
          overflowY={"auto"}
          className="scrollY"
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
              minW={"165px"}
              name="search"
              onChangeSetter={(input) => {
                setSearch(input);
              }}
              inputValue={search}
              placeholder="Pencarian nama/no. induk karyawan"
            />

            <FilterKaryawan />

            <KaryawanTableColumnsConfig title="Config Kolom Tabel Karyawan" />

            <ExportKaryawanModal px={6} />

            <ImportModal url={""} title={"Import Karyawan"} px={6} />

            <TambahKaryawanModal minW={"fit-content"} />
          </HStack>

          <TabelKaryawan />
        </CContainer>
      </CWrapper>
    </>
  );
}
