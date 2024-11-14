import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ExportModal from "../../components/dependent/ExportModal";
import ImportModal from "../../components/dependent/ImportModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelTagihan from "../../components/dependent/TabelTagihan";
import TambahTagihan from "../../components/independent/TambahTagihan";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";

export default function Tagihan() {
  // Filter Config
  const defaultFilterConfig = {
    search: "",
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterConfig({ search: search });
    }, 1);

    return () => {
      clearTimeout(handler);
    };
  }, [search, setFilterConfig]);

  // SX
  const lightDarkColor = useLightDarkColor();

  const { userPermissions } = useAuth();
  const createPermissions = isHasPermissions(userPermissions, [15]);
  const exportPermissions = isHasPermissions(userPermissions, [18]);
  const importPermission = isHasPermissions(userPermissions, [126]);

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

            {/* 
            <NumberInput
              name="tahun"
              onChangeSetter={(input) => {
                setTahun(input);
              }}
              inputValue={tahun}
              placeholder={"Periode Tahun"}
              noFormat
              boxProps={{ w: "fit-content" }}
            /> */}

            <PermissionTooltip
              permission={exportPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <ExportModal
                url="/api/rski/dashboard/keuangan/tagihan-potongan/export"
                title="Export Tagihan"
                downloadFileName="Data Tagihan"
                isDisabled={!exportPermissions}
              />
            </PermissionTooltip>

            <PermissionTooltip
              permission={importPermission}
              boxProps={{ w: "fit-content" }}
            >
              <ImportModal
                url={"/api/rski/dashboard/keuangan/tagihan-potongan/import"}
                title={"Import Tagihan"}
                reqBodyKey="tagihan"
                templateDownloadUrl="/api/rski/dashboard/download-template-tagihan-potongan"
                isDisabled={!importPermission}
              />
            </PermissionTooltip>

            <PermissionTooltip
              permission={createPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <TambahTagihan
                minW={"fit-content"}
                isDisabled={!createPermissions}
              />
            </PermissionTooltip>
          </HStack>

          <TabelTagihan filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
