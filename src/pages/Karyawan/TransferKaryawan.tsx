import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MultiSelectKategoriTransfer from "../../components/dependent/_Select/MultiSelectKategoriTransfer";
import ExportModal from "../../components/dependent/ExportModal";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelTransferKarywan from "../../components/dependent/TabelTransferKaryawan";
import AjukanTransferKaryawanModal from "../../components/independent/AjukanTransferKaryawanModal";
import FilterKaryawan from "../../components/independent/FilterKaryawan";
import TransferKaryawanTableColumnsConfig from "../../components/independent/TransferKaryawanTableColumnsConfig";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import isHasPermissions from "../../lib/isHasPermissions";

export default function TransferKaryawan() {
  // Filter Config
  const { setFormattedFilterKaryawan } = useFilterKaryawan();
  const [search, setSearch] = useState("");
  const [filterConfig, setFilterConfig] = useState({
    kategori_transfer: undefined,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setFormattedFilterKaryawan({ search });
    }, 1);

    return () => {
      clearTimeout(handler);
    };
  }, [search, setFormattedFilterKaryawan]);

  // SX
  const lightDarkColor = useLightDarkColor();

  const { userPermissions } = useAuth();
  const exportPermission = isHasPermissions(userPermissions, [134]);
  const createPermission = isHasPermissions(userPermissions, [131]);

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

            <MultiSelectKategoriTransfer
              name="kategori_transfer"
              onConfirm={(input) => {
                setFilterConfig((ps: any) => ({
                  ...ps,
                  kategori_transfer: input,
                }));
              }}
              inputValue={filterConfig.kategori_transfer}
              placeholder="Filter Kategori Transfer"
              maxW={"165px !important"}
              minW={"100px"}
              optionsDisplay="chip"
              _focus={{ border: "1px solid var(--divider)" }}
            />

            <FilterKaryawan />

            <TransferKaryawanTableColumnsConfig />

            <PermissionTooltip
              permission={exportPermission}
              boxProps={{ w: "fit-content" }}
            >
              <ExportModal
                url="/api/rski/dashboard/karyawan/transfer/export"
                title="Export Transfer Karyawan"
                downloadFileName={"Transfer Karyawan"}
                isDisabled={!exportPermission}
              />
            </PermissionTooltip>

            <PermissionTooltip
              permission={createPermission}
              boxProps={{ w: "fit-content" }}
            >
              <AjukanTransferKaryawanModal
                minW={"fit-content"}
                isDisabled={!createPermission}
              />
            </PermissionTooltip>
          </HStack>

          <TabelTransferKarywan filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
