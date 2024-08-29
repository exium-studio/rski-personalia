import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ExportPresensiModal from "../../components/dependent/ExportPresensiModal";
import ImportModal from "../../components/dependent/ImportModal";
import DatePickerModal from "../../components/dependent/input/DatePickerModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelPresensi from "../../components/dependent/TabelPresensi";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import PresensiTotal from "../../components/independent/PresensiTotal";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";

export default function Presensi() {
  const today = new Date();

  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    tanggal: today,
  });
  const [search, setSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterConfig((ps: any) => ({ ...ps, search: search }));
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, setFilterConfig]);

  const confirmDate = (newDate: Date | undefined) => {
    setFilterConfig((ps: any) => ({ ...ps, tanggal: newDate }));
  };

  // SX
  const lightDarkColor = useLightDarkColor();

  const { userPermissions } = useAuth();
  const exportPermission = isHasPermissions(userPermissions, [47]);
  const importPermission = isHasPermissions(userPermissions, [46]);

  return (
    <>
      <CWrapper>
        <PresensiTotal mb={responsiveSpacing} />

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

            <DatePickerModal
              id="presensi-date-picker"
              name="'date-picker"
              minW={"fit-content"}
              w={"fit-content"}
              onConfirm={confirmDate}
              inputValue={filterConfig.tanggal}
              nonNullable
              _focus={{ border: "1px solid var(--divider)" }}
            />

            <FilterKaryawan />

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
                templateDownloadUrl="api/rski/dashboard/download-template-presensi"
                isDisabled={!importPermission}
              />
            </PermissionTooltip>
          </HStack>

          <TabelPresensi filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
