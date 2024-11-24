import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelShift from "../../components/dependent/TabelPengaturanShift";
import TambahShift from "../../components/independent/TambahShift";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import MultiSelectPengaturanDeletedAt from "../../components/dependent/MultiSelectPengaturanDeletedAt";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import MultiSelectUnitKerja from "../../components/dependent/_Select/MultiSelectUnitKerja";

export default function PengaturanShift() {
  // SX
  const lightDarkColor = useLightDarkColor();

  // Filter Config
  const defaultFilterConfig = {
    search: "",
    unit_kerja: [],
    is_deleted: [],
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);

  const { userPermissions } = useAuth();
  const createPermission = isHasPermissions(userPermissions, [99]);

  return (
    <CContainer
      px={responsiveSpacing}
      pb={responsiveSpacing}
      bg={lightDarkColor}
      borderRadius={12}
      flex={"1 1 600px"}
      h={"100%"}
      overflowY={"auto"}
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
            setFilterConfig((ps: any) => ({
              ...ps,
              search: input,
            }));
          }}
          inputValue={filterConfig.search}
          placeholder="nama shift"
          tooltipLabel="Cari dengan nama shift"
        />

        <MultiSelectUnitKerja
          name="unit_kerja"
          onConfirm={(input) => {
            setFilterConfig((ps: any) => ({
              ...ps,
              unit_kerja: input,
            }));
          }}
          inputValue={filterConfig.unit_kerja}
          optionsDisplay="chip"
          placeholder="Filter Unit Kerja"
        />

        <MultiSelectPengaturanDeletedAt
          name="is_deleted"
          onConfirm={(input) => {
            setFilterConfig((ps: any) => ({
              ...ps,
              is_deleted: input,
            }));
          }}
          inputValue={filterConfig.is_deleted}
          optionsDisplay="chip"
          placeholder="Filter Dihapus"
          maxW={"165px"}
          _focus={{ border: "1px solid var(--divider3)" }}
        />

        <PermissionTooltip permission={createPermission}>
          <TambahShift minW={"fit-content"} isDisabled={!createPermission} />
        </PermissionTooltip>
      </HStack>

      <TabelShift filterConfig={filterConfig} />
    </CContainer>
  );
}
