import { HStack } from "@chakra-ui/react";
import { endOfWeek, startOfWeek } from "date-fns";
import { useEffect, useRef, useState } from "react";
import ExportJadwalModal from "../../components/dependent/ExportJadwalModal";
import ImportModal from "../../components/dependent/ImportModal";
import DateRangePickerModal from "../../components/dependent/input/DateRangePickerModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelJadwal from "../../components/dependent/TabelJadwal";
import FilterKaryawanForceFilter from "../../components/independent/FilterKaryawanForceFilter";
import TerapkanJadwalModal from "../../components/independent/TerapkanJadwalModal";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useFilterKaryawanForceFilter from "../../global/useFilterKaryawanForceFilter";
import { useForceUnitKerjaFilter } from "../../hooks/useForceUnitKerjaFilter";
import useGetUserData from "../../hooks/useGetUserData";
import isHasPermissions from "../../lib/isHasPermissions";

export default function Jadwal() {
  // Filter Config
  const today = new Date();
  const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
  const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });
  const defaultRangeTgl = {
    from: startOfWeekDate,
    to: endOfWeekDate,
  };
  const defaultFilterConfig = {
    tgl_mulai: defaultRangeTgl?.from,
    tgl_selesai: defaultRangeTgl?.to,
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);
  const {
    filterKaryawan,
    formattedFilterKaryawan,
    setFilterKaryawan,
    setFormattedFilterKaryawan,
  } = useFilterKaryawanForceFilter();
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

  const confirmDateRange = (
    inputValue: { from: Date; to: Date } | undefined
  ) => {
    setFilterConfig((ps: any) => ({
      ...ps,
      tgl_mulai: inputValue?.from,
      tgl_selesai: inputValue?.to,
    }));
  };

  // Permissions
  const { userPermissions } = useAuth();
  const exportPermissions = isHasPermissions(userPermissions, [24]);
  const importPermissions = isHasPermissions(userPermissions, [23]);
  const createPermissions = isHasPermissions(userPermissions, [19]);

  // Handle force filter unit kerja
  const user = useGetUserData();
  const userRef = useRef(user);
  const formattedFilterKaryawanRef = useRef(formattedFilterKaryawan);
  useForceUnitKerjaFilter({
    userRef,
    filterKaryawan,
    setFilterKaryawan,
    formattedFilterKaryawanRef,
    setFormattedFilterKaryawan,
  });

  // console.log(filterKaryawan);
  // console.log(formattedFilterKaryawan);

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

            <FilterKaryawanForceFilter />

            <PermissionTooltip
              permission={exportPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <ExportJadwalModal isDisabled={!exportPermissions} />
            </PermissionTooltip>

            <PermissionTooltip
              permission={importPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <ImportModal
                url="/api/rski/dashboard/jadwal-karyawan/import"
                title="Import Jadwal"
                reqBodyKey="jadwal_karyawan_file"
                templateDownloadUrl="/api/rski/dashboard/download-template-jadwal"
                isDisabled={!importPermissions}
              />
            </PermissionTooltip>

            <PermissionTooltip
              permission={createPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <TerapkanJadwalModal
                minW={"fit-content"}
                isDisabled={!createPermissions}
              />
            </PermissionTooltip>
          </HStack>

          <TabelJadwal filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
