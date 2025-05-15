import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ExportCutiModal from "../../components/dependent/ExportCutiModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelKuotaCuti from "../../components/dependent/TabelKuotaCuti";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import isHasPermissions from "../../lib/isHasPermissions";

export default function KuotaCuti() {
  // Filter Config
  const { setFilterKaryawan, setFormattedFilterKaryawan } = useFilterKaryawan();
  // const [filterConfig, setFilterConfig] = useState({
  //   status_cuti: undefined,
  //   tipe_cuti: undefined,
  // });
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
  const exportPermissions = isHasPermissions(userPermissions, [163]);

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

            <FilterKaryawan />

            <PermissionTooltip
              permission={exportPermissions}
              boxProps={{ w: "fit-content" }}
            >
              {/* <ExportModal
                url="/api/rski/dashboard/jadwal-karyawan/cuti/export"
                title="Export Cuti"
                downloadFileName="Data Cuti"
                isDisabled={!exportPermissions}
              /> */}
              <ExportCutiModal isDisabled={!exportPermissions} />
            </PermissionTooltip>
          </HStack>

          <TabelKuotaCuti
          // filterConfig={filterConfig}
          />
        </CContainer>
      </CWrapper>
    </>
  );
}
