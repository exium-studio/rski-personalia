import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import MultiSelectJenisPotongan from "../../components/dependent/_Select/MultiSelectJenisPotongan";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import MultiSelectPengaturanDeletedAt from "../../components/dependent/MultiSelectPengaturanDeletedAt";
import TabelPengaturanPotongan from "../../components/dependent/TabelPengaturanPotongan";
import TambahPotongan from "../../components/independent/TambahPotongan";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";

export default function PengaturanPremi() {
  // Filter Config
  const defaultFilterConfig = {
    search: "",
    is_deleted: [],
    jenis_premi: [],
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);

  // SX
  const lightDarkColor = useLightDarkColor();

  const { userPermissions } = useAuth();
  const createPermission = isHasPermissions(userPermissions, [85]);

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
          tooltipLabel="Cari dengan nama potongan"
          placeholder="nama potongan"
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

        <MultiSelectJenisPotongan
          name="jenis_premi"
          onConfirm={(input) => {
            setFilterConfig((ps: any) => ({
              ...ps,
              jenis_premi: input,
            }));
          }}
          inputValue={filterConfig.jenis_premi}
          optionsDisplay="chip"
          placeholder="Filter Jenis Potongan"
          maxW={"165px"}
        />

        <PermissionTooltip permission={createPermission}>
          <TambahPotongan minW={"fit-content"} isDisabled={!createPermission} />
        </PermissionTooltip>
      </HStack>

      <TabelPengaturanPotongan filterConfig={filterConfig} />
    </CContainer>
  );
}
