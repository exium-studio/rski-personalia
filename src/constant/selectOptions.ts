const optionsAgama = [
  { value: 1, label: "Islam" },
  { value: 2, label: "Kristen" },
  { value: 3, label: "Katolik" },
  { value: 4, label: "Budha" },
  { value: 5, label: "Hindu" },
];

const optionsHubunganKeluarga = [
  { value: 1, label: "Ayah" },
  { value: 2, label: "Ibu" },
  { value: 3, label: "Istri" },
  { value: 4, label: "Suami" },
  { value: 5, label: "Anak" },
];

const optionsKategoriCuti = [
  { value: 1, label: "Tahunan" },
  { value: 2, label: "Kelahiran" },
  { value: 3, label: "Pribadi" },
];

const optionsKategoriTukarJadwal = [
  { value: 1, label: "Tukar Shift" },
  { value: 2, label: "Tukar Libur" },
];

const optionsStatusTukarJadwal = [
  { value: null, label: "Menunggu" },
  { value: 1, label: "Disetujui" },
  { value: 0, label: "Tidak Disetujui" },
];

const optionsStatusKerja = [
  { value: 1, label: "Kerja" },
  { value: 2, label: "Cuti" },
  { value: 3, label: "Izin" },
  { value: 4, label: "Libur" },
];

const optionsJenisKaryawan = [
  { value: 1, label: "Shift" },
  { value: 0, label: "Non-Shift" },
];

const optionsJenisKompetensi = [
  { value: 1, label: "Medis" },
  { value: 0, label: "Non-Medis" },
];

const optionsJenisAktivitasPresensi = [
  { value: 1, label: "Masuk" },
  { value: 2, label: "Keluar" },
];

const optionsStatusHidup = [
  { value: 1, label: "Hidup" },
  { value: 0, label: "Meninggal" },
];

const optionsJenisKelamin = [
  {
    value: 1,
    label: "Laki - Laki",
  },
  {
    value: 2,
    label: "Perempuan",
  },
];

const optionsInboxType = [
  {
    id: 1,
    label: "Cuti",
    link: "/beranda/cuti",
  },
  {
    id: 2,
    label: "Pengajuan Tukar Jadwal",
    link: "/beranda/tukar-jadwal?tabindex=0",
  },
  {
    id: 3,
    label: "Permintaan Tukar Jadwal",
    link: "/beranda/tukar-jadwal?tabindex=1",
  },
  {
    id: 4,
    label: "Lembur",
    link: "/beranda/lembur",
  },
  {
    id: 5,
    label: "Event & Diklat",
    link: "/beranda/event-diklat",
  },
  {
    id: 6,
    label: "Slip Gajiku",
    link: "/beranda/slip-gajiku",
  },
  {
    id: 7,
    label: "Dokumen",
    link: "/beranda/dokumen",
  },
  {
    id: 8,
    label: "Feedback",
    link: "/beranda/feedback",
  },
  {
    id: 9,
    label: "Laporan",
    link: "/beranda/laporan",
  },
  {
    id: 10,
    label: "Koperasi",
    link: "/beranda/koperasi",
  },
  {
    id: 11,
    label: "Perubahan Data",
    link: "/profil/edit/riwayat",
  },
  {
    id: 12,
    label: "Pengumuman",
    link: "/beranda/pengumuman",
  },
];

const optionsJenisPotongan = [
  {
    value: 1,
    label: "Nominal",
  },
  {
    value: 2,
    label: "Persentase",
  },
];

const optionsKategoriDiklat = [
  {
    value: 1,
    label: "Internal",
  },
  {
    value: 2,
    label: "Eksternal",
  },
];

export {
  optionsKategoriDiklat,
  optionsStatusHidup,
  optionsAgama,
  optionsKategoriCuti,
  optionsKategoriTukarJadwal,
  optionsStatusTukarJadwal,
  optionsStatusKerja,
  optionsJenisKaryawan,
  optionsJenisAktivitasPresensi,
  optionsJenisKelamin,
  optionsInboxType,
  optionsHubunganKeluarga,
  optionsJenisKompetensi,
  optionsJenisPotongan,
};
