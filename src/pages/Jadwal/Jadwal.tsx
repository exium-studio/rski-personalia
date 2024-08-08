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
import formatTime from "../../lib/formatTime";

export default function Jadwal() {
  const today = new Date();
  const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
  const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });

  const defaultRangeTgl = {
    from: startOfWeekDate,
    to: endOfWeekDate,
  };

  // Filter Config
  const defaultFilterConfig = {
    tgl_mulai: defaultRangeTgl?.from,
    tgl_selesai: defaultRangeTgl?.to,
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);
  const confirmDateRange = (
    inputValue: { from: Date; to: Date } | undefined
  ) => {
    setFilterConfig((ps: any) => ({
      ...ps,
      tgl_mulai: inputValue?.from,
      tgl_selesai: inputValue?.to,
    }));
  };

  // SX
  const lightDarkColor = useLightDarkColor();

  //@ts-ignore
  console.log(formatTime(undefined));

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
              inputValue={{
                from: filterConfig.tgl_mulai,
                to: filterConfig.tgl_selesai,
              }}
              maxRange={7}
              nonNullable
            />
            <FilterKaryawan />
            <ExportModal
              url="/api/rski/dashboard/jadwal-karyawan/export"
              title="Export Jadwal"
              downloadFileName="Data Jadwal"
            />
            <ImportModal
              url="/api/rski/dashboard/jadwal-karyawan/jadwal-import"
              title="Import Jadwal"
            />
            <TerapkanJadwalModal minW={"fit-content"} />
          </HStack>

          <TabelJadwal filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
