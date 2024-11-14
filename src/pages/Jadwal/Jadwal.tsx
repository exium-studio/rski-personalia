import { HStack } from "@chakra-ui/react";
import { endOfWeek, startOfWeek } from "date-fns";
import { useEffect, useRef, useState } from "react";
import ExportJadwalModal from "../../components/dependent/ExportJadwalModal";
import ImportModal from "../../components/dependent/ImportModal";
import DateRangePickerModal from "../../components/dependent/input/DateRangePickerModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelJadwal from "../../components/dependent/TabelJadwal";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import TerapkanJadwalModal from "../../components/independent/TerapkanJadwalModal";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useGetUserData from "../../hooks/useGetUserData";
import isHasPermissions from "../../lib/isHasPermissions";

export default function Jadwal() {
  // Permissions
  const { userPermissions } = useAuth();
  const exportPermissions = isHasPermissions(userPermissions, [24]);
  const importPermissions = isHasPermissions(userPermissions, [23]);
  const createPermissions = isHasPermissions(userPermissions, [19]);
  const bypassUnitKerjaPermission = isHasPermissions(userPermissions, [25]);

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
  const {
    filterKaryawan,
    setFilterKaryawan,
    formattedFilterKaryawan,
    setFormattedFilterKaryawan,
  } = useFilterKaryawan();

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

  const user = useGetUserData();
  const userRef = useRef(user);
  // const filterKaryawanRef = useRef(filterKaryawan);
  const formattedFilterKaryawanRef = useRef(formattedFilterKaryawan);

  useEffect(() => {
    // console.log(userRef.current);

    if (userRef.current) {
      const unitKerjaUser = userRef.current?.data_karyawan?.unit_kerja;

      // console.log("uk user", unitKerjaUser);
      // console.log(unitKerjaUser);

      if (unitKerjaUser && !bypassUnitKerjaPermission) {
        const unitKerjaExists = filterKaryawan.unit_kerja.some(
          (uk: any) => uk.id === unitKerjaUser.id
        );

        if (!unitKerjaExists) {
          const presetUnitKerjaFilterKaryawan = {
            ...filterKaryawan,
            unit_kerja: [
              ...filterKaryawan.unit_kerja,
              {
                id: unitKerjaUser?.id,
                label: unitKerjaUser?.nama_unit,
              },
            ],
          };
          setFilterKaryawan(presetUnitKerjaFilterKaryawan);
        }

        const formattedUnitKerjaExists =
          formattedFilterKaryawanRef.current?.unit_kerja?.includes(
            unitKerjaUser.id
          );

        if (!formattedUnitKerjaExists) {
          const presetUnitKerjaFormattedFilterKaryawan = {
            ...formattedFilterKaryawanRef.current,
            unit_kerja: [
              ...(formattedFilterKaryawanRef.current?.unit_kerja || []),
              unitKerjaUser.id,
            ],
          };
          setFormattedFilterKaryawan(presetUnitKerjaFormattedFilterKaryawan);
        }
      }
    }
  }, [
    filterKaryawan,
    setFilterKaryawan,
    setFormattedFilterKaryawan,
    bypassUnitKerjaPermission,
  ]);

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

            <FilterKaryawan />

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
