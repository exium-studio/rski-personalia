import { HStack } from "@chakra-ui/react";
import { endOfWeek, startOfWeek } from "date-fns";
import { useState } from "react";
import ExportModal from "../../components/dependent/ExportModal";
import ImportModal from "../../components/dependent/ImportModal";
import DateRangePickerModal from "../../components/dependent/input/DateRangePickerModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelJadwal from "../../components/dependent/TabelJadwal";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import TerapkanJadwalModal from "../../components/independent/TerapkanJadwalModal";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useFilterKaryawan from "../../global/useFilterKaryawan";

export default function Jadwal() {
  const today = new Date();
  const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
  const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });

  const defaultRangeTgl = {
    from: startOfWeekDate,
    to: endOfWeekDate,
  };

  const { filterKaryawan } = useFilterKaryawan();

  // Filter Config
  const defaultFilterConfig = {
    ...filterKaryawan,
    range_tgl: defaultRangeTgl,
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);
  const confirmDateRange = (
    inputValue: { from: Date; to: Date } | undefined
  ) => {
    setFilterConfig((ps: any) => ({
      ...ps,
      range_tgl: inputValue
        ? { from: inputValue.from, to: inputValue.to }
        : undefined,
    }));
  };

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
              name="search"
              minW={"165px"}
              onChangeSetter={(inputValue) => {
                setFilterConfig((ps: any) => ({
                  ...ps,
                  search: inputValue,
                }));
              }}
              inputValue={filterConfig.search}
            />
            <DateRangePickerModal
              id="jadwal-date-range"
              name="date-range"
              minW={"140px"}
              w={"fit-content"}
              onConfirm={confirmDateRange}
              inputValue={filterConfig.range_tgl}
              maxRange={7}
              nonNullable
            />
            <FilterKaryawan />
            <ExportModal url="" title="Export Jadwal" />
            <ImportModal url="" title="Import Jadwal" />
            <TerapkanJadwalModal minW={"fit-content"} />
          </HStack>

          <TabelJadwal filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
