import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ExportModal from "../../components/dependent/ExportModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelPelaporanKaryawan from "../../components/dependent/TabelPelaporanKaryawan";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useFilterKaryawan from "../../global/useFilterKaryawan";

export default function PelaporanKaryawan() {
  // Filter Config
  const { filterKaryawan, setFilterKaryawan } = useFilterKaryawan();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterKaryawan({ search: search });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, setFilterKaryawan]);

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

            <FilterKaryawan title="Filter Karyawan Pelapor" />

            <ExportModal
              url="/api/rski/dashboard/perusahaan/pelaporan/export"
              title="Export Penggajian"
              downloadFileName="Data Pelaporan"
            />
          </HStack>

          <TabelPelaporanKaryawan filterConfig={filterKaryawan} />
        </CContainer>
      </CWrapper>
    </>
  );
}
