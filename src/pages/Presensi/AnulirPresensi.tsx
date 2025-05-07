import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import ExportModal from "../../components/dependent/ExportModal";
import DateRangePickerModal from "../../components/dependent/input/DateRangePickerModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelAnulirPresensi from "../../components/dependent/TabelAnulirPresensi";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";

export default function AnulirPresensi() {
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
  const exportPermissions = isHasPermissions(userPermissions, [153]);

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

            <DateRangePickerModal
              id="date-range-picker-modal"
              name="date-range-picker-modal"
              onConfirm={(input) => {
                setFilterConfig({
                  ...filterConfig,
                  tgl_mulai: input?.from,
                  tgl_selesai: input?.to,
                });
              }}
              inputValue={
                filterConfig.tgl_mulai && filterConfig.tgl_selesai
                  ? {
                      from: filterConfig.tgl_mulai,
                      to: filterConfig.tgl_selesai,
                    }
                  : undefined
              }
              w={"200px"}
            />

            <PermissionTooltip
              permission={exportPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <ExportModal
                url="/api/rski/dashboard/perusahaan/diklat-eksternal/export"
                title="Export Diklat Eksternal"
                downloadFileName="Data Diklat Eksternal"
                isDisabled={!exportPermissions}
              />
            </PermissionTooltip>
          </HStack>

          <TabelAnulirPresensi filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
