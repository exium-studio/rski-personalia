import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelPerubahanData from "../../components/dependent/TabelPermintaanPerubahanData";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import SelectMultiStatusVerifikasi from "../../components/dependent/_Select/MultiSelectStatusVerifikasi";

export default function PermintaanPerubahanDataKaryawan() {
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    status_verifikasi: undefined,
  });
  const { setFormattedFilterKaryawan } = useFilterKaryawan();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setFormattedFilterKaryawan({ search });
    }, 1);

    return () => {
      clearTimeout(handler);
    };
  }, [search, setFormattedFilterKaryawan]);

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
              tooltipLabel="Cari dengan nama/no. induk karyawan"
              placeholder="nama/no. induk karyawan"
            />

            <SelectMultiStatusVerifikasi
              name="status_verifikasi"
              onConfirm={(input) => {
                setFilterConfig((ps: any) => ({
                  ...ps,
                  status_verifikasi: input,
                }));
              }}
              inputValue={filterConfig.status_verifikasi}
              placeholder="Filter Status Verifikasi"
              maxW={"165px !important"}
              optionsDisplay="chip"
              _focus={{ border: "1px solid var(--divider)" }}
            />

            <FilterKaryawan />
          </HStack>

          <TabelPerubahanData filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
