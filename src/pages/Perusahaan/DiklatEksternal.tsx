import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ExportModal from "../../components/dependent/ExportModal";
import NumberInput from "../../components/dependent/input/NumberInput";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelDiklatEksternal from "../../components/dependent/TabelDiklatEksternal";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import TambahAcaraDiklatEksternal from "../../components/independent/TambahAcaraDiklatEksternal";
import useGetUserData from "../../hooks/useGetUserData";

export default function DiklatEksternal() {
  // SX
  const lightDarkColor = useLightDarkColor();

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
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, tahun, setFilterConfig]);

  const userData = useGetUserData();
  const { userPermissions } = useAuth();
  const createPermissions = userData?.role?.id === 1;
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
              boxProps={{ w: "fit-content" }}
            />

            <PermissionTooltip
              permission={exportPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <ExportModal
                url="/api/rski/dashboard/perusahaan/diklat/export"
                title="Export Penggajian"
                downloadFileName="data diklat"
                isDisabled={!exportPermissions}
              />
            </PermissionTooltip>

            <PermissionTooltip
              permission={createPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <TambahAcaraDiklatEksternal isDisabled={!createPermissions} />
            </PermissionTooltip>
          </HStack>

          <TabelDiklatEksternal filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
