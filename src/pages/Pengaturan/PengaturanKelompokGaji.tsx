import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import MultiSelectPengaturanDeletedAt from "../../components/dependent/MultiSelectPengaturanDeletedAt";
import TabelKelompokGaji from "../../components/dependent/TabelPengaturanKelompokGaji";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TambahKelompokGaji from "../../components/independent/TambahKelompokGaji";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";

export default function PengaturanKelompokGaji() {
  // Filter Config
  const defaultFilterConfig = {
    search: "",
    is_deleted: [],
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);

  // SX
  const lightDarkColor = useLightDarkColor();

  const { userPermissions } = useAuth();
  const createPermission = isHasPermissions(userPermissions, [77]);

  return (
    <CContainer
      px={responsiveSpacing}
      pb={responsiveSpacing}
      pt={0}
      h={"100%"}
      overflowY={"auto"}
      className="scrollY"
      bg={lightDarkColor}
      borderRadius={12}
      flex={"1 1 600px"}
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
          flex={"1 1 0"}
          minW={"165px"}
          name="search"
          onChangeSetter={(input) => {
            setFilterConfig((ps: any) => ({
              ...ps,
              search: input,
            }));
          }}
          inputValue={filterConfig.search}
          tooltipLabel="Cari dengan nama gaji pokok"
          placeholder="nama gaji pokok"
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
          <TambahKelompokGaji
            minW={"fit-content"}
            isDisabled={!createPermission}
          />
        </PermissionTooltip>
      </HStack>

      <TabelKelompokGaji filterConfig={filterConfig} />
    </CContainer>
  );
}
