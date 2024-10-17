import { HStack, Icon, MenuItem, Text } from "@chakra-ui/react";
import { useState } from "react";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import NotFound from "../independent/NotFound";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import MultiSelectHubunganKeluarga from "./_Select/MultiSelectHubunganKeluarga";
import MultiSelectStatusHidup from "./_Select/MultiSelectStatusHidup";
import BooleanBadge from "./BooleanBadge";
import CustomTable from "./CustomTable";
import SearchComponent from "./input/SearchComponent";
import useGetUserData from "../../hooks/useGetUserData";
import { RiEditLine } from "@remixicon/react";
import EditAnggotaKeluargaModalDisclosure from "../independent/EditAnggotaKeluargaModalDisclosure";
import TambahAnggotaKeluarga from "./TambahAnggotaKeluarga";
import PermissionTooltip from "../wrapper/PermissionTooltip";

interface Props {
  idKaryawan: number;
  data: any[];
}

export default function TabelDetailKeluargaKaryawan({
  idKaryawan,
  data,
}: Props) {
  // Permission States
  const userData = useGetUserData();
  const isUserSuperAdmin = userData?.role?.id === 1;

  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    search: "",
    hubungan_keluarga: undefined as any,
    status_hidup: undefined as any,
  });

  // Row Options
  const rowOptions = [
    (rowData: any) => {
      return (
        <EditAnggotaKeluargaModalDisclosure
          idKaryawan={idKaryawan}
          rowData={rowData}
        >
          <PermissionTooltip permission={isUserSuperAdmin}>
            <MenuItem isDisabled={!isUserSuperAdmin}>
              <Text>Edit</Text>
              <Icon as={RiEditLine} fontSize={iconSize} opacity={0.4} />
            </MenuItem>
          </PermissionTooltip>
        </EditAnggotaKeluargaModalDisclosure>
      );
    },
  ];

  const fd = data.filter((item: any) => {
    const searchTerm = filterConfig.search.toLowerCase();
    const hubunganTerm = filterConfig.hubungan_keluarga;
    const statusHidupTerm = filterConfig.status_hidup;

    const matchesSearchTerm = item.nama_keluarga
      .toLowerCase()
      .includes(searchTerm);
    const matchesHubunganTerm =
      hubunganTerm && hubunganTerm.length > 0
        ? hubunganTerm.some(
            (filterItem: any) => filterItem.label === item.hubungan
          )
        : true;
    const matchesStatusHidupTerm =
      statusHidupTerm && statusHidupTerm.length > 0
        ? statusHidupTerm.some(
            (filterItem: any) => filterItem.value === item.status_hidup
          )
        : true;

    return matchesSearchTerm && matchesHubunganTerm && matchesStatusHidupTerm;
  });

  const formattedHeader = [
    {
      th: "Nama",
      isSortable: true,
    },
    // {
    //   th: "Status Keluarga",
    //   isSortable: true,
    //   cProps: {
    //     justify: "center",
    //   },
    // },
    {
      th: "Hubungan",
      isSortable: true,
    },
    {
      th: "Status Hidup",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Pendidikan Terakhir",
      isSortable: true,
    },
    {
      th: "Pekerjaan",
      isSortable: true,
    },
    {
      th: "No. Telepon",
      isSortable: true,
    },
    {
      th: "Email",
      isSortable: true,
    },
    {
      th: "Tanggungan BPJS",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    // {
    //   th: "Verif. 1",
    //   props: {
    //     position: "sticky",
    //     right: 0,
    //     zIndex: 4,
    //     w: "122px",
    //   },
    //   cProps: {
    //     justify: "center",
    //     borderLeft: "1px solid var(--divider3)",
    //     borderRight: "1px solid var(--divider3)",
    //     w: "122px",
    //   },
    // },
  ];
  const formattedData = fd.map((item) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.nama_keluarga,
        td: item.nama_keluarga,
      },
      // {
      //   value: item.status_keluarga,
      //   td: <StatusVerifikasiBadge data={item.status_keluarga} w={"180px"} />,
      //   cProps: {
      //     justify: "center",
      //   },
      // },
      {
        value: item.hubungan,
        td: item.hubungan,
      },
      {
        value: item.status_hidup,
        td: (
          <BooleanBadge
            data={item.status_hidup}
            trueValue="Hidup"
            falseValue="Meninggal"
            w={"120px"}
          />
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.pendidikan_terakhir?.label,
        td: item.pendidikan_terakhir?.label,
      },
      {
        value: item.pekerjaan,
        td: item.pekerjaan,
      },
      {
        value: item.no_hp,
        td: item.no_hp,
      },
      {
        value: item.email,
        td: item.email,
      },
      {
        value: item.is_bpjs,
        td: (
          <BooleanBadge
            data={item.is_bpjs}
            trueValue="Ditanggung"
            falseValue="Tidak Ditanggung"
            w={"150px"}
          />
        ),
        cProps: {
          justify: "center",
        },
      },
      // {
      //   value: "",
      //   td: item?.status_keluarga?.id === 1 && (
      //     <PermissionTooltip permission={editPermission}>
      //       <VerifikasiModal
      //         aria-label={`perubahan-data-verif-1-button-${item.id}"`}
      //         id={`verifikasi-perubahan-data-modal-${item.id}`}
      //         submitUrl={`api/rski/dashboard/karyawan/detail-karyawan-keluarga/${item.id}/verifikasi`}
      //         approvePayloadKey="verifikasi_pertama_disetujui"
      //         disapprovePayloadKey="verifikasi_pertama_ditolak"
      //         isDisabled={!editPermission}
      //       />
      //     </PermissionTooltip>
      //   ),
      //   props: {
      //     position: "sticky",
      //     right: 0,
      //     zIndex: 2,
      //   },
      //   cProps: {
      //     justify: "center",
      //     borderLeft: "1px solid var(--divider3)",
      //     borderRight: "1px solid var(--divider3)",
      //     w: "122px",
      //   },
      // },
    ],
    originalData: item,
  }));

  return (
    <>
      <HStack mb={responsiveSpacing}>
        <SearchComponent
          name="search"
          onChangeSetter={(input) => {
            setFilterConfig((ps) => ({
              ...ps,
              search: input,
            }));
          }}
          inputValue={filterConfig.search}
        />

        <MultiSelectHubunganKeluarga
          name="hubungan_keluarga"
          onConfirm={(input) => {
            setFilterConfig((ps) => ({
              ...ps,
              hubungan_keluarga: input,
            }));
          }}
          inputValue={filterConfig.hubungan_keluarga}
          optionsDisplay="chip"
          placeholder="Filter Hubungan"
          minW={"fit-content"}
          w={"fit-content"}
        />

        <MultiSelectStatusHidup
          name="status_hidup"
          onConfirm={(input) => {
            setFilterConfig((ps) => ({
              ...ps,
              status_hidup: input,
            }));
          }}
          inputValue={filterConfig.status_hidup}
          optionsDisplay="chip"
          placeholder="Filter Status Hidup"
          minW={"fit-content"}
          w={"fit-content"}
        />

        <TambahAnggotaKeluarga idKaryawan={idKaryawan} />
      </HStack>

      {fd.length === 0 && <NotFound />}

      {fd.length > 0 && (
        <CustomTableContainer>
          <CustomTable
            formattedHeader={formattedHeader}
            formattedData={formattedData}
            rowOptions={rowOptions}
          />
        </CustomTableContainer>
      )}
    </>
  );
}
