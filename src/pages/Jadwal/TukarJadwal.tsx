import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MultiSelectStatusPenukaranJadwal from "../../components/dependent/_Select/MultiSelectStatusPenukaranJadwal";
import ExportModal from "../../components/dependent/ExportModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelTukarJadwal from "../../components/dependent/TabelTukarJadwal";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import isHasPermissions from "../../lib/isHasPermissions";

export default function TukarJadwal() {
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    status_penukaran: undefined,
  });
  const [search, setSearch] = useState("");
  const { setFilterKaryawan, setFormattedFilterKaryawan } = useFilterKaryawan();
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterKaryawan({ search });
      setFormattedFilterKaryawan({ search });
    }, 1);

    return () => {
      clearTimeout(handler);
    };
  }, [search, setFilterKaryawan, setFormattedFilterKaryawan]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterKaryawan({ search });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, setFilterKaryawan]);

  // SX
  const lightDarkColor = useLightDarkColor();

  const { userPermissions } = useAuth();
  // const createPermissions = isHasPermissions(userPermissions, [26]);
  const exportPermissions = isHasPermissions(userPermissions, [30]);

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
            <MultiSelectStatusPenukaranJadwal
              name="status_penukaran"
              onConfirm={(input) => {
                setFilterConfig((ps: any) => ({
                  ...ps,
                  status_penukaran: input,
                }));
              }}
              inputValue={filterConfig.status_penukaran}
              optionsDisplay="chip"
              maxW={"165px"}
              maxSelectedDisplay={1}
              _focus={{ border: "1px solid var(--divider)" }}
            />

            <FilterKaryawan />

            <PermissionTooltip
              permission={exportPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <ExportModal
                url="/api/rski/dashboard/jadwal-karyawan/tukar-jadwal/export"
                title="Export Penukaran Jadwal"
                downloadFileName="Data Tukar Jadwal"
                isDisabled={!exportPermissions}
              />
            </PermissionTooltip>

            {/* <PermissionTooltip
              permission={createPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <AjukanTukarJadwalModal
                minW={"fit-content"}
                isDisabled={!createPermissions}
              />
            </PermissionTooltip> */}
          </HStack>

          <TabelTukarJadwal filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
