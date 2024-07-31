import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ExportModal from "../../components/dependent/ExportModal";
import ImportModal from "../../components/dependent/ImportModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelRekamJejak from "../../components/dependent/TabelRekamJejak";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useFilterKaryawan from "../../global/useFilterKaryawan";

export default function RekamJejak() {
  // Filter Config
  const { filterKaryawan, setFilterKaryawan } = useFilterKaryawan();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterKaryawan({ search });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, setFilterKaryawan]);

  useEffect(() => {
    console.log("Current filterKaryawan state:", filterKaryawan);
  }, [filterKaryawan]);

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
        >
          <HStack
            pt={responsiveSpacing}
            justify={"space-between"}
            w={"100%"}
            mb={responsiveSpacing}
            className="tabelConfig noScroll"
            overflowX={"auto"}
            flexShrink={0}
          >
            <HStack>
              <SearchComponent
                name="search"
                onChangeSetter={(input) => {
                  setSearch(input ? input : "");
                }}
                inputValue={search}
              />

              <FilterKaryawan px={6} />
            </HStack>

            <HStack>
              <ExportModal url={""} title={"Export Rekam Jejak"} px={6} />

              <ImportModal url={""} title={"Import Karyawan"} px={6} />
            </HStack>
          </HStack>

          <TabelRekamJejak />
        </CContainer>
      </CWrapper>
    </>
  );
}
