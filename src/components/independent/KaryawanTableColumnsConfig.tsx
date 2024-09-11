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
    { column: "nama", label: "Nama" }, // 0
    { column: "status_aktif", label: "Status Aktif" }, // 1
    { column: "nik", label: "Nik" }, // 2
    { column: "status_karyawan", label: "Status Karyawan" }, // 3
    { column: "no_rm", label: "No. Rekam Medis" }, // 4
    { column: "unit_kerja", label: "Unit Kerja" }, // 5
    { column: "agama", label: "Agama" }, // 6
    { column: "jenis_kelamin", label: "Jenis Kelamin" }, // 7
    { column: "jabatan", label: "Jabatan" }, // 8
    { column: "pendidikan_terakhir", label: "Pendidikan Terakhir" }, // 9
    { column: "email", label: "Email" }, // 10
    { column: "ayah", label: "Ayah" }, // 11
    { column: "ibu", label: "Ibu" }, // 12
    { column: "jumlah_keluarga", label: "Jumlah Keluarga" }, // 13
    { column: "tgl_masuk", label: "Tanggal Masuk" }, // 14
    { column: "tgl_keluar", label: "Tanggal Keluar" }, // 15
    { column: "masa_kerja", label: "Masa Kerja" }, // 16
    // { column: "promosi", label: "Promosi" }, // 17
    // { column: "mutasi", label: "Mutasi" }, // 18
  ];

  const presetColumns = [
    {
      label: "Semua Kolom",
      columns: columnsConfigAllColumns,
    },
    {
      label: "Karyawan",
      columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      label: "Akun",
      columns: [0, 1, 5, 10],
    },
    {
      label: "Keluarga",
      columns: [0, 2, 11, 12, 13],
    },
    {
      label: "Pekerja Kontrak",
      columns: [0, 1, 14, 15, 16],
    },
    {
      label: "Rekam Jejak",
      columns: [0, 2, 3, 4, 5],
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
