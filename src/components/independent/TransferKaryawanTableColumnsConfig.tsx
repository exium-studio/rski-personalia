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
    { column: "nama", label: "Nama" },
    { column: "nik", label: "Nik" },
    { column: "kategori", label: "Kategori Transfer" },
    { column: "created_at", label: "Tanggal Pengajuan" },
    { column: "tgl_mulai", label: "Tanggal Mulai" },
    { column: "unit_kerja_asal", label: "Unit Kerja Asal" },
    { column: "unit_kerja_tujuan", label: "Unit Kerja Tujuan" },
    { column: "jabatan_asal", label: "Jabatan Asal" },
    { column: "jabatan_tujuan", label: "Jabatan Tujuan" },
    { column: "alasan", label: "Alasan" },
    { column: "dokumen", label: "Dokumen" },
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
      columns: [0, 2, 5, 7],
    },
    {
      label: "Data Tujuan",
      columns: [0, 2, 6, 8],
    },
    {
      label: "Data Asal & Tujuan",
      columns: [0, 2, 5, 6, 7, 8],
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
