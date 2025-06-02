import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import ExportPembatalanRewardModal from "../../components/dependent/ExportPembatalanRewardModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelPembatalanReward from "../../components/dependent/TabelPembatalanReward";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";

export default function PembatalanReward() {
  // SX
  const lightDarkColor = useLightDarkColor();

  // Filter Config
  const defaultFilterConfig = {
    search: "",
    tgl_mulai: undefined as any,
    tgl_selesai: undefined as any,
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);

  const { userPermissions } = useAuth();
  const exportPermissions = isHasPermissions(userPermissions, [165]);

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
                setFilterConfig({ ...filterConfig, search: input });
              }}
              inputValue={filterConfig.search}
            />

            <FilterKaryawan />

            <PermissionTooltip
              permission={exportPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <ExportPembatalanRewardModal isDisabled={!exportPermissions} />
            </PermissionTooltip>
          </HStack>

          <TabelPembatalanReward filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
