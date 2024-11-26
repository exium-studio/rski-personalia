import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ExportModal from "../../components/dependent/ExportModal";
import NumberInput from "../../components/dependent/input/NumberInput";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelDiklat from "../../components/dependent/TabelDiklat";
import TambahAcaraDiklat from "../../components/independent/TambahAcaraDiklat";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";

export default function Diklat() {
  // Filter Config
  const defaultFilterConfig = {
    search: "",
    periode_tahun: new Date().getFullYear(),
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);
  const [search, setSearch] = useState("");
  const [tahun, setTahun] = useState<any>(new Date().getFullYear());

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterConfig({ search: search, periode_tahun: tahun });
    }, 1);

    return () => {
      clearTimeout(handler);
    };
  }, [search, tahun, setFilterConfig]);

  // SX
  const lightDarkColor = useLightDarkColor();

  const { userPermissions } = useAuth();
  const createPermissions = isHasPermissions(userPermissions, [7]);
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
                setSearch(input);
              }}
              inputValue={search}
            />

            <NumberInput
              name="tahun"
              onChangeSetter={(input) => {
                setTahun(input);
              }}
              inputValue={tahun}
              placeholder={"Periode Tahun"}
              noFormat
              boxProps={{ w: "fit-content", minW: "80px" }}
            />

            <PermissionTooltip
              permission={exportPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <ExportModal
                url="/api/rski/dashboard/perusahaan/diklat-internal/export"
                title="Export Diklat Internal"
                downloadFileName="Data Diklat Internal"
                isDisabled={!exportPermissions}
              />
            </PermissionTooltip>

            <PermissionTooltip
              permission={createPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <TambahAcaraDiklat
                minW={"fit-content"}
                isDisabled={!createPermissions}
              />
            </PermissionTooltip>
          </HStack>

          <TabelDiklat filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
