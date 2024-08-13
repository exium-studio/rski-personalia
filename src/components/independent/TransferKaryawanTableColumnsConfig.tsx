import { ButtonProps } from "@chakra-ui/react";
import useTransferKaryawanTableColumnsConfig from "../../global/useTransferKaryawanTableColumnsConfig";
import ColumnsConfigModal from "../dependent/ColumnsConfigModal";

interface Props extends ButtonProps {
  title?: string;
}

export default function TransferKaryawanTableColumnsConfig({
  title,
  ...props
}: Props) {
  const {
    columnsConfigAllColumns,
    clearedTableColumns,
    columnsConfig,
    setColumnsConfig,
  } = useTransferKaryawanTableColumnsConfig();

  const allColumns = [
    { column: "nama", label: "Nama" }, // 0
    { column: "nik", label: "Nik" }, // 1
    { column: "kategori", label: "Kategori Transfer" }, // 2
    { column: "created_at", label: "Tanggal Pengajuan" }, // 3
    { column: "tgl_mulai", label: "Tanggal Mulai" }, // 4
    { column: "unit_kerja_asal", label: "Unit Kerja Asal" }, // 5
    { column: "unit_kerja_tujuan", label: "Unit Kerja Tujuan" }, // 6
    { column: "jabatan_asal", label: "Jabatan Asal" }, // 7
    { column: "jabatan_tujuan", label: "Jabatan Tujuan" }, // 8
    { column: "kelompok_gaji_asal", label: "Kelompok Gaji Asal" }, // 9
    { column: "kelompok_gaji_tujuan", label: "Kelompok Gaji Tujuan" }, // 10
    { column: "role_asal", label: "Role Asal" }, // 11
    { column: "role_tujuan", label: "Role Tujuan" }, // 12
    { column: "alasan", label: "Alasan" }, // 13
    { column: "dokumen", label: "Dokumen" }, // 14
  ];

  const presetColumns = [
    {
      label: "Semua Kolom",
      columns: columnsConfigAllColumns,
    },
    {
      label: "Tanggal Transfer",
      columns: [0, 2, 3, 4],
    },
    {
      label: "Data Asal",
      columns: [0, 2, 5, 7, 9, 11],
    },
    {
      label: "Data Tujuan",
      columns: [0, 2, 6, 8, 10, 12],
    },
    {
      label: "Data Asal & Tujuan",
      columns: [0, 2, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    {
      label: "Alasan & Dokumen",
      columns: [0, 9, 10],
    },
  ];

  // SX

  return (
    <ColumnsConfigModal
      id="config-kolom-tabel-karyawan-modal"
      clearedTableColumns={clearedTableColumns}
      columnsConfig={columnsConfig}
      setColumnsConfig={setColumnsConfig}
      allColumns={allColumns}
      presetColumns={presetColumns}
      {...props}
    />
  );
}
