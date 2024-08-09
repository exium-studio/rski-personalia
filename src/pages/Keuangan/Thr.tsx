import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ExportModal from "../../components/dependent/ExportModal";
import NumberInput from "../../components/dependent/input/NumberInput";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelRiwayatThr from "../../components/dependent/TabelRiwayatThr";
import RunThr from "../../components/independent/RunThr";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";

export default function Thr() {
  // Filter Config
  const defaultFilterConfig = {
    search: "",
    tahun: new Date().getFullYear(),
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);
  const [search, setSearch] = useState("");
  const [tahun, setTahun] = useState<any>(new Date().getFullYear());

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterConfig({ search: search, tahun: tahun });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, tahun, setFilterConfig]);

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

            <NumberInput
              name="search"
              onChangeSetter={(input) => {
                setTahun(input);
              }}
              inputValue={tahun}
              placeholder={"Periode Tahun"}
              _placeholder={{ color: "var(--divider-text)" }}
              opacity={1}
              noFormat
              flex={"1 1 320px"}
            />

            <ExportModal
              url="/api/rski/dashboard/keuangan/run-thr/export"
              title="Export Penggajian"
              downloadFileName="Data THR"
            />

            <RunThr minW={"fit-content"} />
          </HStack>

          <TabelRiwayatThr filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
