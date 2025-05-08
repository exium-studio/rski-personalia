import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import ExportMasaDiklatModal from "../../components/dependent/ExportMasaDiklatModal";
import FilterMasaDiklat from "../../components/dependent/FilterMasaDiklat";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelMasaDiklat from "../../components/dependent/TabelMasaDiklat";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";

export default function MasaDiklat() {
  // SX
  const lightDarkColor = useLightDarkColor();

  // Filter Config
  const defaultFilterConfig = {
    search: "",
    less_than: undefined as any,
    more_than: undefined as any,
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);

  const { userPermissions } = useAuth();
  const exportPermissions = isHasPermissions(userPermissions, [9]);

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

            <FilterMasaDiklat
              id={"filter-masa-diklat-index"}
              inputValue={filterConfig}
              onConfirm={setFilterConfig}
            />

            <PermissionTooltip
              permission={exportPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <ExportMasaDiklatModal />
            </PermissionTooltip>
          </HStack>

          <TabelMasaDiklat filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
