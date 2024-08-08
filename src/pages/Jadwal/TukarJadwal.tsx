import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SelectStatusPenukaranJadwal from "../../components/dependent/_Select/SelectStatusPenukaranJadwal";
import ExportModal from "../../components/dependent/ExportModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelTukarJadwal from "../../components/dependent/TabelTukarJadwal";
import AjukanTukarJadwalModal from "../../components/independent/AjukanTukarJadwalModal";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useFilterKaryawan from "../../global/useFilterKaryawan";

export default function TukarJadwal() {
  // Filter Config
  const { filterKaryawan, setFilterKaryawan } = useFilterKaryawan();
  const [filterConfig, setFilterConfig] = useState({
    ...filterKaryawan,
    status_pertukaran: undefined,
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
            <SelectStatusPenukaranJadwal
              name="status_penukaran"
              onConfirm={(input) => {
                setFilterConfig((ps: any) => ({
                  ...ps,
                  status_pertukaran: input,
                }));
              }}
              inputValue={filterConfig.status_pertukaran}
              minW={"fit-content"}
              w={"fit-content"}
            />
            <FilterKaryawan />
            <ExportModal url="" title="Export Penukaran Jadwal" />
            <AjukanTukarJadwalModal minW={"fit-content"} />
          </HStack>

          <TabelTukarJadwal filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
