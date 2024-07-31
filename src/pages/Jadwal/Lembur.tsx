import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SelectMultiKompensasi from "../../components/dependent/_Select/SelectMultiKompensasi";
import ExportModal from "../../components/dependent/ExportModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelLembur from "../../components/dependent/TabelLembur";
import AjukanLemburModal from "../../components/independent/AjukanLemburModal";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useFilterKaryawan from "../../global/useFilterKaryawan";

export default function Lembur() {
  // Filter Config
  const { filterKaryawan, setFilterKaryawan } = useFilterKaryawan();
  const [filterConfig, setFilterConfig] = useState({
    ...filterKaryawan,
    kompensasi: undefined,
  });
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
      <CWrapper>
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
            />
            <SelectMultiKompensasi
              name="kompensasi"
              placeholder="Filter Kompensasi"
              onConfirm={(input: any) => {
                setFilterConfig((ps: any) => ({
                  ...ps,
                  kompensasi: input,
                }));
              }}
              inputValue={filterConfig.kompensasi}
              minW={"fit-content"}
              w={"fit-content"}
            />
            <ExportModal url="" title="Export Lembur" />
            <AjukanLemburModal minW={"fit-content"} />
          </HStack>

          <TabelLembur filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
