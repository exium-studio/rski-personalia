import { StackProps } from "@chakra-ui/react";

export interface Interface__SelectOption {
  value: any;
  label: string;
  label2?: string;
  original_data?: any;
}

export interface Attendance__Data__Interface {
  masuk: string;
  keluar: string;
  jam_kerja: number;
  office_lat: number;
  office_lng: number;
}

export interface Aktivitas__Interface {
  type: string;
  timestamp: string;
}

export interface User__Data__Interface {
  name: string;
  role: string;
  image: string;
  is_complete: boolean;
}

export interface Select__Item__Interface {
  value?: number | null;
  label: string;
}

export interface Jadwal__Interface {
  id: number;
  masuk: string; // bisa untuk tanggal hari libur
  minggu?: number;
  keluar?: string | null;
  label?: string | null; // Nama Shift
  assignees?: Karyawan__Interface[];
  keterangan?: string;
}

export interface User__Interface {
  id: number;
  nama: string;
  username: string;
  password: string;
  role_id: number;
  role: string;
  foto_profil: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Karyawan__Interface {
  agama?: string;
  alamat?: string;
  ayah?: string;
  berat_badan?: string;
  created_at?: string;
  email?: string;
  foto_profil: string;
  gelar_depan?: string;
  golongan_darah?: string;
  id: number;
  ibu?: string;
  is_active?: boolean;
  jabatan?: string;
  jenis_kelamin?: string;
  jumlah_keluarga?: number;
  kelompok_gaji?: string;
  laporan?: string;
  masa_berlaku_sip?: string;
  masa_berlaku_str?: string;
  masa_diklat?: string;
  masa_kerja?: string;
  mutasi?: string;
  nik?: string;
  nik_ktp?: string;
  no_bpjsksh?: string;
  no_bpjsktk?: string;
  no_hp?: string;
  no_ijasah?: string;
  no_kk?: string;
  no_manulife?: string;
  no_rekening?: string;
  no_rm?: string;
  no_sip?: string;
  no_str?: string;
  npwp?: string;
  nama?: string;
  penghargaan?: string;
  profesi?: string;
  promosi?: string;
  ptkp?: string;
  status_karyawan?: string;
  tgl_berakhir_pks?: string;
  tgl_diangkat?: Date | string;
  tgl_keluar?: Date | string;
  tgl_lahir?: string;
  tgl_masuk?: Date | string;
  tgl_mulai?: Date | string;
  tgl_selesai?: Date | string;
  tahun_lulus?: string;
  tempat_lahir?: string;
  tinggi_badan?: string;
  uang_lembur?: number;
  unit_kerja?: string;
  updated_at?: string;
  user_id?: string;
  username?: string;
}

export type Valid__Status__Type = "Kerja" | "Cuti" | "Izin" | "Libur";

export interface Dashboard__Total__Interface {
  totalKaryawan: number;
  totalLibur: number;
  totalCuti: number;
  totalIzinKerja: number;
}

export interface Jabatan__Interface {
  nama: string;
  jumlah: number;
}

export interface Pengumuman__Interface {
  id: number;
  judul: string;
  konten: string;
  is_read: boolean | number;
  tgl_berakhir: string;
  created_at: string | Date;
  updated_at: string | Date | undefined;
}

export interface TopNavs__Interface {
  label: string;
  link: string;
}

export interface Tabel__Column__Interface {
  key: string;
  label: string;
  actionLabel?: string;
  actionComponent?: any;
  dataType:
    | "string"
    | "number"
    | "numeric"
    | "date"
    | "badge"
    | "avatarAndName"
    | "link"
    | "action"
    | "duration"
    | "time"
    | "modal";
  link?: string;
  preferredTextAlign?: string;
  action?: any;
  tdProps?: any;
  tdContentProps?: any;
  thProps?: any;
  thContentProps?: any;
  actionButtonProps?: any;
}

export interface Presensi__SUmmary__Interface {
  hadir: {
    tepat_waktu: number;
    terlambat: number;
    hadir: number;
  };
  tidak_hadir: {
    absen: number;
    izin: number;
    invalid: number;
  };
  libur: {
    hari_libur: number;
    cuti: number;
  };
}

export interface Riwayat__Penggajian__Interface {
  id: number;
  periode: string;
  updated_at: string;
  total_karyawan_terverifikasi: number;
  laporan: {
    id: number;
  };
  status: string;
}

export interface Unit__Kerja__Interface {}

export interface DetailKaryawan {
  id: number;
  user: User;
  email: string;
  no_rm: number;
  no_manulife: number;
  tgl_masuk: Date;
  unit_kerja: UnitKerja;
  jabatan: Jabatan;
  kompetensi: Kompetensi;
  role: Role;
  nik: string;
  nik_ktp: string;
  status_karyawan: StatusKaryawan;
  tempat_lahir: string;
  tgl_lahir: Date;
  kelompok_gaji: KelompokGaji;
  no_rekening: string;
  tunjangan_jabatan: number;
  tunjangan_fungsional: number;
  tunjangan_khusus: number;
  tunjangan_lainnya: number;
  uang_lembur: number;
  uang_makan: number;
  ptkp: Ptkp;
  tgl_keluar: Date;
  no_kk: string;
  alamat: string;
  gelar_depan: string;
  no_hp: string;
  no_bpjsksh: string;
  no_bpjsktk: string;
  tgl_diangkat: Date;
  masa_kerja: string;
  npwp: string;
  jenis_kelamin: number | boolean;
  agama: string;
  golongan_darah: string;
  tinggi_badan: number;
  berat_badan: number;
  no_ijazah: string;
  tahun_lulus: number;
  no_str: string;
  masa_berlaku_str: Date;
  no_sip: string;
  masa_berlaku_sip: Date;
  tgl_berakhir_pks: Date;
  masa_diklat: number;
  created_at: Date;
  updated_at: Date;
}

export interface Jabatan {
  id: number;
  nama_jabatan: string;
  is_struktural: number;
  tunjangan: number;
  created_at: Date;
  updated_at: Date;
}

export interface KelompokGaji {
  id: number;
  nama_kelompok: string;
  besaran_gaji: number;
  created_at: Date;
  updated_at: Date;
}

export interface Kompetensi {
  id: number;
  nama_kompetensi: string;
  jenis_kompetensi: number;
  total_tunjangan: number;
  created_at: Date;
  updated_at: Date;
}

export interface Ptkp {
  id: number;
  kode_ptkp: string;
  kategori_ter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Role {
  id: number;
  name: string;
  deskripsi: string;
  guard_name: string;
  created_at: Date;
  updated_at: Date;
  pivot: Pivot;
}

export interface Pivot {
  model_type: string;
  model_id: number;
  role_id: number;
}

export interface StatusKaryawan {
  id: number;
  label: string;
}

export interface UnitKerja {
  id: number;
  nama_unit: string;
  jenis_karyawan: number;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  nama: string;
  username: string;
  email_verified_at: null;
  role_id: null;
  foto_profil: null;
  data_completion_step: number;
  status_aktif: number;
  created_at: Date;
  updated_at: Date;
  roles: Role;
}

//! NEW
export interface Interface__ChartDoughnut {
  datasets: {
    customTooltipLabels: string[];
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
    [key: string]: any;
  }[];
  labels?: string[];
  aspectRatio?: number;
  cutout?: string;
}

export interface Interface__ChartLine {
  datasets: {
    customTooltipLabels: string[] | number[];
    data: { x: string; y: number }[] | number[];
    backgroundColor: string[] | string;
    borderColor: string;
    borderWidth: number;
    fill?: boolean;
    tension?: number;
    [key: string]: any;
  }[];
  xLabel?: string;
  yLabel?: string;
  labels?: string[];
  aspectRatio?: number;
}

export interface Interface__TableRowOption {
  label: string | React.ReactNode;
  handleOnClick: (param: any) => void;
}

export interface Interface__ColumnConfigOld {
  th: string | React.ReactNode;
  thProps?: any;
  td: any;
  tdProps?: any;
  isNumeric: boolean;
  isSortable: boolean;
  sortKey: string;
  isHidden: boolean;
  rowOptions?: Interface__TableRowOption[];
  // rowOnClick?: (param: any) => void;
}

export interface Interface__FormattedTableHeader {
  column?: string;
  th: string;
  isSortable?: boolean;
  props?: any;
  cProps?: StackProps;
}

export interface Interface__FormattedTableBody {
  id: number;
  columnsFormat: {
    column?: string;
    original_data?: any;
    value: any;
    td: any;
    isNumeric?: boolean; // default false
    isDate?: boolean; // default false
    isTime?: boolean; // default false
    props?: any;
    cProps?: StackProps;
  }[];
}

export interface Interface__User {
  id: number;
  nama: string;
  username: string;
  email_verified_at: Date | string | null;
  role_id: number | null;
  roles: Interface__Role[];
  foto_profil: string | null;
  data_completion_step: number;
  unit_kerja?: Interface__UnitKerja;
  status_aktif: number;
  created_at: Date | string;
  updated_at: Date | string | null;
}

export interface Interface__UnitKerja {
  id: number;
  nama_unit: string;
  jenis_karyawan: boolean | number | null;
  created_at: Date | string;
  updated_at: Date | string | null;
}

export interface Interface__StatusKaryawan {
  id: number;
  label: string;
}

export type Interface__ValidStatusKerja = "Kerja" | "Cuti" | "Izin" | "Libur";

export interface Interface__Shift {
  id: number;
  nama: string;
  jam_from: string | Date;
  jam_to: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
  deleted_at: string | Date;
}

export interface Interface__JadwalItem {
  id: number;
  tgl_mulai: string | Date;
  tgl_selesai: string | Date;
  shift: Interface__Shift;
  updated_at: string | Date;
}

export interface Interface__Jadwal {
  id: number;
  nama: string | null;
  jam_from: Date | string;
  jam_to: Date | string | null;
  assignees?: Interface__Karyawan[];
  created_at: Date | string;
  updated_at: Date | string | null;
}

export interface Interface__Karyawan {
  id: number;
  user: Interface__User;
  nik: string;
  no_rm: string;
  unit_kerja: Interface__UnitKerja;
  status_karyawan: Interface__StatusKaryawan;
  status_kerja?: Interface__ValidStatusKerja;
  jadwals?: Interface__Jadwal[];
  created_at: Date | string;
  updated_at: Date | string | null;
}

export interface Interface__Jabatan {
  id: number;
  nama_jabatan: string;
  is_struktural: number;
  tunjangan: number;
  created_at: Date | string;
  updated_at: Date | string | null;
}

export interface Interface__Kompetensi {
  id: number;
  nama_kompetensi: string;
  jenis_kompetensi: number;
  total_tunjangan: number;
  created_at: Date | string;
  updated_at: Date | string | null;
}

export interface Interface__Pivot {
  model_type: string;
  model_id: number;
  role_id: number;
}

export interface Interface__Role {
  id: number;
  name: string;
  deskripsi: string;
  guard_name: string;
  created_at: Date | string;
  updated_at: Date | string | null;
  pivot: Interface__Pivot;
}

export interface Interface__KelompokGaji {
  id: number;
  nama_kelompok: string;
  besaran_gaji: number;
  created_at: Date | string;
  updated_at: Date | string | null;
}

export interface Interface__Ptkp {
  id: number;
  kode_ptkp: string;
  kategori_ter_id: number;
  created_at: Date | string;
  updated_at: Date | string | null;
}

export interface Interface__ConstantTable {
  id: number | boolean | null;
  label: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface Interface__AnggotaKeluarga {
  id: number;
  hubungan: Interface__ConstantTable;
  nama: string;
  pendidikan_terakhir: string;
  pekerjaan: string;
  status_hidup: boolean | number;
  no_hp: string;
  email: string;
  created_at: Date | string;
  updated_at: Date | string | null;
}

export interface Interface__DetailKaryawan {
  id: number;
  user: Interface__User;
  email: string;
  no_rm: string;
  no_manulife: string;
  tgl_masuk: Date | string;
  unit_kerja: Interface__UnitKerja;
  jabatan: Interface__Jabatan;
  kompetensi: Interface__Kompetensi;
  nik: string;
  nik_ktp: string;
  status_karyawan: Interface__StatusKaryawan;
  tempat_lahir: string;
  tgl_lahir: Date | string;
  kelompok_gaji: Interface__KelompokGaji;
  no_rekening: string;
  tunjangan_jabatan: number;
  tunjangan_fungsional: number;
  tunjangan_khusus: number;
  tunjangan_lainnya: number;
  uang_lembur: number;
  uang_makan: number;
  ptkp: Interface__Ptkp;
  tgl_keluar: Date | string;
  no_kk: string;
  alamat: string;
  gelar_depan: string;
  gelar_belakang: string;
  no_hp: string;
  no_bpjsksh: string;
  no_bpjsktk: string;
  tgl_diangkat: Date | string;
  masa_kerja: number;
  npwp: string;
  jenis_kelamin: number | boolean;
  agama: Interface__ConstantTable;
  golongan_darah: Interface__ConstantTable;
  tinggi_badan: number;
  berat_badan: number;
  no_ijazah: string;
  tahun_lulus: number;
  no_str: string;
  masa_berlaku_str: Date | string;
  no_sip: string;
  masa_berlaku_sip: Date | string;
  tgl_berakhir_pks: Date | string;
  pendidikan_terakhir: Interface__ConstantTable;
  masa_diklat: number;
  jumlah_keluarga: number;
  ibu: Interface__AnggotaKeluarga;
  ayah: Interface__AnggotaKeluarga;
  created_at: Date | string;
  updated_at: Date | string | null;
}

export interface Interface__ColumnConfig {
  column: string;
  label: string;
}

export interface Interface__RowOption {
  callback: (row: any) => void;
  element: React.ReactNode;
}

export interface Interface__BatchAction {
  callback: (rowIds: number[]) => void;
  element: React.ReactNode;
}

export interface LatLng {
  lat: number;
  lng: number;
}
