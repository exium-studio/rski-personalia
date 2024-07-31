import { ButtonProps } from "@chakra-ui/react";
import ColumnsConfigModal from "../dependent/ColumnsConfigModal";
import useKaryawanTableColumnsConfig from "../../global/useKaryawanTableColumnsConfig";

interface Props extends ButtonProps {
  title?: string;
}

export default function KaryawanTableColumnsConfig({ title, ...props }: Props) {
  const {
    columnsConfigAllColumns,
    clearedTableColumns,
    columnsConfig,
    setColumnsConfig,
  } = useKaryawanTableColumnsConfig();

  const allColumns = [
    { column: "nama", label: "Nama" },
    { column: "status_aktif", label: "Status Aktif" },
    { column: "status_karyawan", label: "Status Kepegawaian" },
    { column: "nik", label: "Nik" },
    { column: "no_rm", label: "No. Rekam Medis" },
    { column: "unit_kerja", label: "Unit Kerja" },
    { column: "email", label: "Email" },
    { column: "username", label: "Username" },
    { column: "ayah", label: "Ayah" },
    { column: "ibu", label: "Ibu" },
    { column: "jumlah_keluarga", label: "Jumlah Keluarga" },
    { column: "tgl_masuk", label: "Tanggal Masuk" },
    { column: "tgl_keluar", label: "Tanggal Keluar" },
    { column: "masa_kerja", label: "Masa Kerja" },
    { column: "promosi", label: "Promosi" },
    { column: "mutasi", label: "Mutasi" },
  ];
  const presetColumns = [
    {
      label: "Semua Kolom",
      columns: columnsConfigAllColumns,
    },
    {
      label: "Karyawan",
      columns: [0, 1, 2, 3, 4, 5],
    },
    {
      label: "Akun",
      columns: [0, 1, 5, 6, 7],
    },
    {
      label: "Keluarga",
      columns: [0, 8, 9, 10],
    },
    {
      label: "Pekerja Kontrak",
      columns: [0, 3, 11, 12, 7],
    },
    {
      label: "Rekam Jejak",
      columns: [0, 11, 12, 13, 14, 15],
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
