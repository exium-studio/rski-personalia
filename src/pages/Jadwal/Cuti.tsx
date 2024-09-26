import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MultiSelectStatusVerifikasi2 from "../../components/dependent/_Select/MultiSelectStatusVerifikasi2";
import MultiSelectTipeCuti from "../../components/dependent/_Select/MultiSelectTipeCuti";
import ExportModal from "../../components/dependent/ExportModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelCuti from "../../components/dependent/TabelCuti";
import AjukanCutiModal from "../../components/independent/AjukanCutiModal";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import isHasPermissions from "../../lib/isHasPermissions";

export default function Cuti() {
  // Filter Config
  const { setFilterKaryawan, setFormattedFilterKaryawan } = useFilterKaryawan();
  const [filterConfig, setFilterConfig] = useState({
    status_cuti: undefined,
    tipe_cuti: undefined,
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

  const { userPermissions } = useAuth();
  const createPermissions = isHasPermissions(userPermissions, [38]);
  const exportPermissions = isHasPermissions(userPermissions, [42]);

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

            <MultiSelectTipeCuti
              name={"tipe_cuti"}
              // minW={"fit-content"}
              maxW={"165px !important"}
              placeholder="Filter Tipe Cuti"
              onConfirm={(input: any) => {
                setFilterConfig((ps: any) => ({
                  ...ps,
                  tipe_cuti: input,
                }));
              }}
              inputValue={filterConfig.tipe_cuti}
              optionsDisplay="chip"
              pr={5}
              maxSelectedDisplay={1}
              _focus={{ border: "1px solid var(--divider3) !important" }}
            />

            <MultiSelectStatusVerifikasi2
              name={"status_cuti"}
              // minW={"fit-content"}
              maxW={"165px !important"}
              placeholder="Filter Status Cuti"
              onConfirm={(input: any) => {
                setFilterConfig((ps: any) => ({
                  ...ps,
                  status_cuti: input,
                }));
              }}
              inputValue={filterConfig.status_cuti}
              optionsDisplay="chip"
              pr={5}
              maxSelectedDisplay={1}
              _focus={{ border: "1px solid var(--divider3) !important" }}
            />

            <FilterKaryawan />

            <PermissionTooltip
              permission={exportPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <ExportModal
                url="/api/rski/dashboard/jadwal-karyawan/cuti/export"
                title="Export Cuti"
                downloadFileName="Data Cuti"
                isDisabled={!exportPermissions}
              />
            </PermissionTooltip>
            <PermissionTooltip
              permission={createPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <AjukanCutiModal
                minW={"fit-content"}
                isDisabled={!createPermissions}
              />
            </PermissionTooltip>
          </HStack>

          <TabelCuti filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
