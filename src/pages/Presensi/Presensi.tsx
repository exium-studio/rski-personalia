import { HStack } from "@chakra-ui/react";
import { endOfWeek, startOfWeek } from "date-fns";
import { useEffect, useRef, useState } from "react";
import ExportPresensiModal from "../../components/dependent/ExportPresensiModal";
import ImportModal from "../../components/dependent/ImportModal";
import DateRangePickerModal from "../../components/dependent/input/DateRangePickerModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelPresensi from "../../components/dependent/TabelPresensi";
import FilterKaryawanForceFilter from "../../components/independent/FilterKaryawanForceFilter";
import PresensiTotal from "../../components/independent/PresensiTotal";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useFilterKaryawanForceFilter from "../../global/useFilterKaryawanForceFilter";
import useGetUserData from "../../hooks/useGetUserData";
import isHasPermissions from "../../lib/isHasPermissions";
import { useForceUnitKerjaFilter } from "../../hooks/useForceUnitKerjaFilter";

export default function Presensi() {
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
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    ...defaultFilterConfig,
  });
  const [search, setSearch] = useState("");
  const {
    filterKaryawan,
    formattedFilterKaryawan,
    setFilterKaryawan,
    setFormattedFilterKaryawan,
  } = useFilterKaryawanForceFilter();
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

  const userData = useGetUserData();
  const isUserSuperAdmin = userData?.role?.id === 1;

  // const confirmDate = (newDate: Date | undefined) => {
  //   setFilterConfig((ps: any) => ({ ...ps, tanggal: newDate }));
  // };

  // SX
  const lightDarkColor = useLightDarkColor();

  // Permission
  const { userPermissions } = useAuth();
  const exportPermission = isHasPermissions(userPermissions, [47]);
  const importPermission = isHasPermissions(userPermissions, [46]);

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

  return (
    <>
      <CWrapper>
        {isUserSuperAdmin && (
          <PresensiTotal tanggal={today} mb={responsiveSpacing} />
        )}

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

            {/* <DatePickerModal
              id="presensi-date-picker"
              name="'date-picker"
              minW={"fit-content"}
              w={"fit-content"}
              onConfirm={confirmDate}
              inputValue={filterConfig.tanggal}
              nonNullable
              _focus={{ border: "1px solid var(--divider)" }}
            /> */}

            <DateRangePickerModal
              id="jadwal-date-range-filter"
              name="date-range"
              minW={"165px"}
              w={"fit-content"}
              onConfirm={confirmDateRange}
              inputValue={{
                from: filterConfig.tgl_mulai,
                to: filterConfig.tgl_selesai,
              }}
              maxRange={1830}
              nonNullable
              presetsConfig={["thisWeek", "thisMonth"]}
            />

            <FilterKaryawanForceFilter />

            <PermissionTooltip
              permission={exportPermission}
              boxProps={{ w: "fit-content" }}
            >
              <ExportPresensiModal isDisabled={!exportPermission} />
            </PermissionTooltip>

            <PermissionTooltip
              permission={importPermission}
              boxProps={{ w: "fit-content" }}
            >
              <ImportModal
                url="/api/rski/dashboard/presensi/import"
                title="Import Presensi"
                reqBodyKey="presensi_file"
                templateDownloadUrl="/api/rski/dashboard/download-template-presensi"
                isDisabled={!importPermission}
              />
            </PermissionTooltip>
          </HStack>

          <TabelPresensi
            // filterConfig={{
            //   ...filterConfig,
            //   tanggal: formatDate(filterConfig.tanggal, "short"),
            // }}
            filterConfig={filterConfig}
          />
        </CContainer>
      </CWrapper>
    </>
  );
}
