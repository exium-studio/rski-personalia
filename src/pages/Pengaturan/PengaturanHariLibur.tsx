import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelHariLibur from "../../components/dependent/TabelPengaturanHariLibur";
import TambahHariLibur from "../../components/independent/TambahHariLibur";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import MultiSelectPengaturanDeletedAt from "../../components/dependent/MultiSelectPengaturanDeletedAt";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";

export default function PengaturanHariLibur() {
  // SX
  const lightDarkColor = useLightDarkColor();

  // Filter Config
  const defaultFilterConfig = {
    search: "",
    is_deleted: [],
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);

  const { userPermissions } = useAuth();
  const createPermission = isHasPermissions(userPermissions, [103]);

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
          placeholder="nama hari libur"
          tooltipLabel="Cari dengan nama hari libur"
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
          <TambahHariLibur
            minW={"fit-content"}
            isDisabled={!createPermission}
          />
        </PermissionTooltip>
      </HStack>

      <TabelHariLibur filterConfig={filterConfig} />
    </CContainer>
  );
}
