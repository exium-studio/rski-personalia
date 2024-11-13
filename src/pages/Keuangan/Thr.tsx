import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ExportModal from "../../components/dependent/ExportModal";
import NumberInput from "../../components/dependent/input/NumberInput";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelRiwayatThr from "../../components/dependent/TabelRiwayatThr";
import RunThr from "../../components/independent/RunThr";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";

export default function Thr() {
  // Filter Config
  const defaultFilterConfig = {
    search: "",
    tahun: new Date().getFullYear(),
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);
  const [search, setSearch] = useState("");
  const [tahun, setTahun] = useState<any>(new Date().getFullYear());

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterConfig({ search: search, tahun: tahun });
    }, 1);

    return () => {
      clearTimeout(handler);
    };
  }, [search, tahun, setFilterConfig]);

  // SX
  const lightDarkColor = useLightDarkColor();

  const { userPermissions } = useAuth();
  const createPermissions = isHasPermissions(userPermissions, [12]);
  const exportPermissions = isHasPermissions(userPermissions, [14]);

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
              tooltipLabel="Cari dengan periode"
              placeholder="periode"
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
                url="/api/rski/dashboard/keuangan/run-thr/export"
                title="Export Penggajian"
                downloadFileName="Data THR"
                isDisabled={!exportPermissions}
              />
            </PermissionTooltip>

            <PermissionTooltip
              permission={createPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <RunThr minW={"fit-content"} isDisabled={!createPermissions} />
            </PermissionTooltip>
          </HStack>

          <TabelRiwayatThr filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
