import { HStack, Text, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import formatNumber from "../../lib/formatNumber";
import isHasPermissions from "../../lib/isHasPermissions";
import NotFound from "../independent/NotFound";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import MultiSelectUnitKerja from "./_Select/MultiSelectUnitKerja";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import DetailPenggajianKaryawanModal from "./DetailPenggajianKaryawanModal";
import ExportRiwayatPenggajianModal from "./ExportRiwayatPenggajianModal";
import SearchComponent from "./input/SearchComponent";
import TabelFooterConfig from "./TabelFooterConfig";

interface Props {
  data: any;
  status_riwayat_gaji: any;
}

export default function TabelDetailPenggajian({
  data,
  status_riwayat_gaji,
}: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Detail Penggajian Karyawan Disclosure
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    search: "",
    unit_kerja: undefined as any,
  });

  // Filter data based on search and unit_kerja
  const fd = useMemo(() => {
    return data.data_penggajian.filter((item: any) => {
      const searchTerm = filterConfig.search.toLowerCase();
      const unitKerjaTerm = filterConfig.unit_kerja;

      const matchesSearchTerm = item.user.nama
        .toLowerCase()
        .includes(searchTerm);
      const matchesUnitKerjaTerm =
        unitKerjaTerm && unitKerjaTerm.length > 0
          ? unitKerjaTerm.some(
              (filterItem: any) => filterItem.value === item.unit_kerja.id
            )
          : true;

      return matchesSearchTerm && matchesUnitKerjaTerm;
    });
  }, [filterConfig, data.data_penggajian]);

  // Calculate the total number of pages
  const totalPage = limitConfig === 0 ? 1 : Math.ceil(fd.length / limitConfig);

  // Calculate start and end index for the current page
  const startIndex = (pageConfig - 1) * limitConfig;
  const endIndex = limitConfig === 0 ? fd.length : startIndex + limitConfig;

  const formattedHeader = [
    {
      th: "Nama",
      isSortable: true,
      props: {
        position: "sticky",
        left: 0,
        zIndex: 99,
        w: "243px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
    },
    {
      th: "No. Induk Karyawan",
      isSortable: true,
    },
    {
      th: "Unit Kerja",
      isSortable: true,
    },
    {
      th: "Kelompok Gaji",
      isSortable: true,
    },
    {
      th: "Gaji Pokok",
      isSortable: true,
      cProps: {
        justify: "end",
      },
    },
    {
      th: "Take Home Pay",
      isSortable: true,
      cProps: {
        justify: "end",
      },
    },
  ];

  // Format the data for the current page
  const formattedData = fd
    .slice(startIndex, endIndex)
    .map((item: any) => {
      return {
        id: item.id,
        columnsFormat: [
          {
            value: item.user.nama,
            td: (
              <AvatarAndNameTableData
                data={{
                  id: item.user.id,
                  nama: item.user.nama,
                  fullName: `${item?.gelar_depan || ""} ${item.user?.nama} ${
                    item?.gelar_belakang || ""
                  }`,
                  foto_profil: item.user.foto_profil,
                }}
              />
            ),
            props: {
              position: "sticky",
              left: 0,
              zIndex: 2,
            },
            cProps: {
              borderRight: "1px solid var(--divider3)",
            },
          },
          {
            value: item?.nik,
            td: item?.nik,
          },
          {
            value: item?.unit_kerja?.nama_unit,
            td: item?.unit_kerja?.nama_unit,
          },
          {
            value: item?.kelompok_gaji?.nama_kelompok,
            td: item?.kelompok_gaji?.nama_kelompok,
          },
          {
            value: item?.kelompok_gaji?.besaran_gaji,
            td: `Rp ${formatNumber(item?.kelompok_gaji?.besaran_gaji)}`,
            isNumeric: true,
            cProps: {
              justify: "end",
            },
          },
          {
            value: item.take_home_pay,
            td: `Rp ${formatNumber(item.take_home_pay)}`,
            isNumeric: true,
            cProps: {
              justify: "end",
            },
          },
        ],
      };
    })
    .filter(Boolean); // Hapus elemen null atau false

  // Get riwayat_id from localStorage
  const riwayatId = parseInt(localStorage.getItem("riwayat_id") as string);

  // Permission to export
  const { userPermissions } = useAuth();
  const exportPermission = isHasPermissions(userPermissions, [18]);

  // Pagination data for the footer
  const paginationData = {
    links: {
      first: "",
      last: "",
      prev: null,
      next: null,
    },
    meta: {
      current_page: pageConfig,
      last_page: totalPage,
      per_page: limitConfig,
      total: fd.length,
    },
  };

  return (
    <>
      <HStack mb={responsiveSpacing}>
        <SearchComponent
          name="search"
          onChangeSetter={(input: string) => {
            setFilterConfig((ps) => ({
              ...ps,
              search: input,
            }));
            setPageConfig(1);
          }}
          inputValue={filterConfig.search}
          tooltipLabel="Cari dengan nama/no. induk karyawan"
          placeholder="nama/no. induk karyawan"
        />

        <MultiSelectUnitKerja
          name="unit_kerja"
          onConfirm={(input) => {
            setFilterConfig((ps) => ({
              ...ps,
              unit_kerja: input,
            }));
            setPageConfig(1); // Reset to first page when filter is applied
          }}
          inputValue={filterConfig.unit_kerja}
          optionsDisplay="chip"
          placeholder="Filter Unit Kerja"
          minW={"fit-content"}
          w={"fit-content"}
        />

        <PermissionTooltip permission={exportPermission}>
          <ExportRiwayatPenggajianModal
            periode={data.data_riwayat?.periode}
            isDisabled={!exportPermission}
          />
        </PermissionTooltip>
      </HStack>

      {fd.length === 0 && <NotFound />}

      {fd.length > 0 && (
        <>
          <CustomTableContainer>
            <CustomTable
              formattedHeader={formattedHeader}
              formattedData={formattedData}
              onRowClick={(rowData) => {
                localStorage.setItem("riwayat_id", rowData.id);
                onOpen();
              }}
            />
          </CustomTableContainer>
        </>
      )}

      <TabelFooterConfig
        limitConfig={limitConfig}
        setLimitConfig={setLimitConfig}
        pageConfig={pageConfig}
        setPageConfig={setPageConfig}
        paginationData={paginationData}
        footer={
          <Text opacity={0.4} textAlign={["left", null, "center"]}>
            Klik row untuk melihat detail penggajian karyawan
          </Text>
        }
      />

      <DetailPenggajianKaryawanModal
        id={"detail-penggajian-karyawan-by-row-click"}
        riwayat_id={riwayatId}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        status_riwayat_gaji={status_riwayat_gaji}
      />
    </>
  );
}
