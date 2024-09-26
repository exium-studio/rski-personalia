import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SelectMultiStatusVerifikasi from "../../components/dependent/_Select/MultiSelectStatusVerifikasi";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelIzin from "../../components/dependent/TabelIzin";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useFilterKaryawan from "../../global/useFilterKaryawan";

export default function Izin() {
  // Filter Config
  const { setFilterKaryawan, setFormattedFilterKaryawan } = useFilterKaryawan();
  const [filterConfig, setFilterConfig] = useState({
    status_izin: undefined,
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterKaryawan({ search });
      setFormattedFilterKaryawan({ search });
    }, 1);

    return () => {
      clearTimeout(handler);
    };
  }, [search, setFilterKaryawan, setFormattedFilterKaryawan]);

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
              tooltipLabel="Cari dengan nama/no. induk karyawan"
              placeholder="nama/no. induk karyawan"
            />

            <SelectMultiStatusVerifikasi
              name={"status_izin"}
              // minW={"fit-content"}
              maxW={"165px !important"}
              placeholder="Filter Status Izin"
              onConfirm={(input: any) => {
                setFilterConfig((ps: any) => ({
                  ...ps,
                  status_izin: input,
                }));
              }}
              inputValue={filterConfig.status_izin}
              optionsDisplay="chip"
              pr={5}
              maxSelectedDisplay={1}
              _focus={{ border: "1px solid var(--divider3) !important" }}
            />

            <FilterKaryawan />
          </HStack>

          <TabelIzin filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
