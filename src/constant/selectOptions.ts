const optionsAgama = [
  { value: 1, label: "Islam" },
  { value: 2, label: "Kristen" },
  { value: 3, label: "Katolik" },
  { value: 4, label: "Budha" },
  { value: 5, label: "Hindu" },
  { value: 6, label: "Konghucu" },
];

const optionsHubunganKeluarga = [
  { value: "Suami", label: "Suami" },
  { value: "Istri", label: "Istri" },
  { value: "Anak Ke-1", label: "Anak Ke-1" },
  { value: "Anak Ke-2", label: "Anak Ke-2" },
  { value: "Anak Ke-3", label: "Anak Ke-3" },
  { value: "Anak Ke-4", label: "Anak Ke-4" },
  { value: "Anak Ke-5", label: "Anak Ke-5" },
  { value: "Ibu", label: "Ibu" },
  { value: "Bapak", label: "Bapak" },
  { value: "Ibu Mertua", label: "Ibu Mertua" },
  { value: "Bapak Mertua", label: "Bapak Mertua" },
  // { value: "Nenek", label: "Nenek" },
  // { value: "Kakek", label: "Kakek" },
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
  { value: 1, label: "Menunggu" },
  { value: 7, label: "Disetujui Karyawan" },
  { value: 6, label: "Ditolak Karyawan" },
  { value: 2, label: "Verif. 1 Disetujui" },
  { value: 3, label: "Verif. 1 Ditolak" },
  { value: 4, label: "Verif. 2 Disetujui" },
  { value: 5, label: "Verif. 2 Ditolak" },
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
    value: 0,
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
    label: "Nominal (Rp)",
  },
  {
    value: 0,
    label: "Persentase (%)",
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

const optionsTipeTransfer = [
  {
    value: 1,
    label: "Mutasi",
  },
  {
    value: 2,
    label: "Promosi",
  },
];

const optionsSumberPotongan = [
  {
    value: 1,
    label: "Gaji Bruto",
  },
  {
    value: 2,
    label: "Gaji Pokok",
  },
  {
    value: 3,
    label: "Gaji Total",
  },
];

const optionsStatusKaryawan = [
  {
    value: 1,
    label: "Tetap",
  },
  {
    value: 2,
    label: "Kontrak",
  },
  {
    value: 3,
    label: "Magang",
  },
  {
    value: 7,
    label: "Outsourcing",
  },
  {
    value: 8,
    label: "Paruh Waktu",
  },
  {
    value: 9,
    label: "Dokter Mitra",
  },
];

const optionsPendidikan = [
  {
    value: 1,
    label: "SD",
  },
  {
    value: 2,
    label: "SMP",
  },
  {
    value: 3,
    label: "SMA",
  },
  {
    value: 4,
    label: "SMK",
  },
  {
    value: 5,
    label: "Diploma 1 (D1)",
  },
  {
    value: 6,
    label: "Diploma 2 (D2)",
  },
  {
    value: 7,
    label: "Diploma 3 (D3)",
  },
  {
    value: 8,
    label: "Diploma 4 (D4) / Sarjana Terapan",
  },
  {
    value: 9,
    label: "Sarjana (S1)",
  },
  {
    value: 10,
    label: "Magister (S2)",
  },
  {
    value: 11,
    label: "Doktor (S3)",
  },
  {
    value: 12,
    label: "Pendidikan Non-Formal",
  },
];

const optionsStatusAktif = [
  {
    value: 1,
    label: "Belum Aktif",
  },
  {
    value: 2,
    label: "Aktif",
  },
  {
    value: 3,
    label: "Di-Non-Aktifkan",
  },
];

const optionsGoldar = [
  { value: 1, label: "A" },
  { value: 2, label: "B" },
  { value: 3, label: "AB" },
  { value: 4, label: "O" },
];

const optionsKategoriTagihan = [
  { value: 1, label: "Obat/Perawatan" },
  { value: 2, label: "Koperasi" },
];

const optionsModulVerifikasi = [
  {
    value: 1,
    label: "Permintaan Perubahan Data",
    label2: 1,
  },
  {
    value: 2,
    label: "Tukar Jadwal",
    label2: 2,
  },
  {
    value: 3,
    label: "Cuti",
    label2: 2,
  },
  {
    value: 4,
    label: "Izin",
    label2: 1,
  },
  {
    value: 5,
    label: "Diklat Internal",
    label2: 3,
  },
  {
    value: 6,
    label: "Diklat Eksternal",
    label2: 2,
  },
];

export {
  optionsModulVerifikasi,
  optionsKategoriTagihan,
  optionsGoldar,
  optionsStatusAktif,
  optionsPendidikan,
  optionsStatusKaryawan,
  optionsSumberPotongan,
  optionsTipeTransfer,
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
