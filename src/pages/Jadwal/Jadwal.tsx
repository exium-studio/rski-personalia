import { HStack } from "@chakra-ui/react";
import { endOfWeek, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
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

  // Filter Config
  const defaultFilterConfig = {
    tgl_mulai: defaultRangeTgl?.from,
    tgl_selesai: defaultRangeTgl?.to,
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);
  const [search, setSearch] = useState("");
  const { setFilterKaryawan, setFormattedFilterKaryawan } = useFilterKaryawan();
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterKaryawan({ search });
      setFormattedFilterKaryawan({ search });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, setFilterKaryawan, setFormattedFilterKaryawan]);
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

            <DateRangePickerModal
              id="jadwal-date-range"
              name="date-range"
              minW={"165px"}
              w={"fit-content"}
              onConfirm={confirmDateRange}
              inputValue={{
                from: filterConfig.tgl_mulai,
                to: filterConfig.tgl_selesai,
              }}
              maxRange={7}
              nonNullable
              presetsConfig={["thisWeek", "nextWeek"]}
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
              reqBodyKey="jadwal_karyawan_file"
              templateDownloadUrl="api/rski/dashboard/download-template-jadwal"
            />

            <TerapkanJadwalModal minW={"fit-content"} />
          </HStack>

          <TabelJadwal filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
