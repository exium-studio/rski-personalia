import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ExportKaryawanModal from "../../components/dependent/ExportKaryawanModal";
import ImportModal from "../../components/dependent/ImportModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelKaryawan from "../../components/dependent/TabelKaryawan";
import TambahKaryawanModal from "../../components/dependent/TambahKaryawanModal";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import KaryawanTableColumnsConfig from "../../components/independent/KaryawanTableColumnsConfig";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import isHasPermissions from "../../lib/isHasPermissions";

export default function Karyawan() {
  // Filter Config
  const { setFilterKaryawan, setFormattedFilterKaryawan } = useFilterKaryawan();
  const [search, setSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterKaryawan({ search });
      setFormattedFilterKaryawan({ search });
    }, 1);

    return () => {
      clearTimeout(handler);
    };
  }, [search, setFilterKaryawan, setFormattedFilterKaryawan]);

  // SX
  const lightDarkColor = useLightDarkColor();

  const { userPermissions } = useAuth();
  const exportPermission = isHasPermissions(userPermissions, [52]);
  const importPermission = isHasPermissions(userPermissions, [51]);
  const createPermission = isHasPermissions(userPermissions, [48]);

  return (
    <>
      <CWrapper overflowY={"auto"}>
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

            <FilterKaryawan />

            <KaryawanTableColumnsConfig title="Config Kolom Tabel Karyawan" />

            <PermissionTooltip
              permission={exportPermission}
              boxProps={{ w: "fit-content" }}
            >
              <ExportKaryawanModal isDisabled={!exportPermission} />
            </PermissionTooltip>

            <PermissionTooltip
              permission={importPermission}
              boxProps={{ w: "fit-content" }}
            >
              <ImportModal
                url={"/api/rski/dashboard/karyawan/import"}
                title={"Import Karyawan"}
                reqBodyKey="karyawan_file"
                templateDownloadUrl="/api/rski/dashboard/download-template-karyawan"
                isDisabled={!importPermission}
              />
            </PermissionTooltip>

            <PermissionTooltip
              permission={createPermission}
              boxProps={{ w: "fit-content" }}
            >
              <TambahKaryawanModal
                minW={"fit-content"}
                isDisabled={!createPermission}
              />
            </PermissionTooltip>
          </HStack>

          <TabelKaryawan />
        </CContainer>
      </CWrapper>
    </>
  );
}
