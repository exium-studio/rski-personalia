import {
  RiArticleLine,
  RiBook2Line,
  RiCalendarCheckLine,
  RiCalendarCloseLine,
  RiCalendarLine,
  RiCalendarScheduleLine,
  RiFilePaper2Line,
  RiGraduationCapLine,
  RiGroup3Line,
  RiHandCoinLine,
  RiHospitalLine,
  RiIdCardLine,
  RiLandscapeLine,
  RiListIndefinite,
  RiLockLine,
  RiMapPinLine,
  RiQuestionLine,
  RiQuestionMark,
  RiUserSettingsLine,
  RiVerifiedBadgeLine,
  RiWalletLine,
} from "@remixicon/react";

const pengaturanNavs = [
  {
    allowed: [61, 130, null],
    groupName: "Akun",
    navs: [
      {
        allowed: [61],
        icon: RiUserSettingsLine,
        label: "Hak Akses (Role)",
        link: "/pengaturan/akun/kelola-role",
      },
      {
        allowed: [130],
        icon: RiVerifiedBadgeLine,
        label: "Hak Verifikasi",
        link: "/pengaturan/akun/hak-verifikasi",
      },
      {
        icon: RiLockLine,
        label: "Ubah Kata Sandi",
        link: "/pengaturan/akun/ubah-kata-sandi",
      },
    ],
  },
  {
    allowed: [125, 80, 72, 68, 76, 114, 84, 140, 137],
    groupName: "Karyawan",
    navs: [
      {
        allowed: [125],
        icon: RiGraduationCapLine,
        label: "Pendidikan Terakhir",
        link: "/pengaturan/karyawan/pendidikan",
      },
      {
        allowed: [80],
        icon: RiWalletLine,
        label: "Kelompok Gaji",
        link: "/pengaturan/karyawan/kelompok-gaji",
      },
      {
        allowed: [72],
        icon: RiIdCardLine,
        label: "Jabatan",
        link: "/pengaturan/karyawan/jabatan",
      },
      {
        allowed: [68],
        icon: RiGroup3Line,
        label: "Unit Kerja",
        link: "/pengaturan/karyawan/unit-kerja",
      },
      {
        allowed: [76],
        icon: RiVerifiedBadgeLine,
        label: "Profesi",
        link: "/pengaturan/karyawan/kompetensi",
      },
      {
        allowed: [114],
        icon: RiQuestionLine,
        label: "Jenis Penilaian",
        link: "/pengaturan/karyawan/jenis-penilaian",
      },
      {
        allowed: [84],
        icon: RiQuestionMark,
        label: "Kuesioner Penilaian",
        link: "/pengaturan/karyawan/kuisioner",
      },
      {
        allowed: [140],
        icon: RiHospitalLine,
        label: "Tentang",
        link: "/pengaturan/karyawan/tentang",
      },
      {
        allowed: [137],
        icon: RiBook2Line,
        label: "Materi Pelatihan",
        link: "/pengaturan/karyawan/materi",
      },
    ],
  },
  {
    allowed: [88, 92, 94],
    groupName: "Keuangan",
    navs: [
      {
        allowed: [88],
        icon: RiHandCoinLine,
        label: "Potongan",
        link: "/pengaturan/keuangan/premi",
      },
      {
        allowed: [92],
        icon: RiListIndefinite,
        label: "Kategori TER",
        link: "/pengaturan/keuangan/kategori-ter-pph21",
      },
      {
        allowed: [92],
        icon: RiFilePaper2Line,
        label: "TER pph21",
        link: "/pengaturan/keuangan/ter-pph21",
      },
      {
        allowed: [92],
        icon: RiArticleLine,
        label: "PTKP",
        link: "/pengaturan/keuangan/ptkp",
      },
      {
        allowed: [94],
        icon: RiCalendarLine,
        label: "Tanggal Penggajian",
        link: "/pengaturan/keuangan/jadwal-penggajian",
      },
      // {
      //   icon: RiVerifiedBadgeLine,
      //   label: "THR",
      //   link: "/pengaturan/karyawan/kompetensi",
      // },
    ],
  },
  {
    allowed: [112, 102, 106, 110],
    groupName: "Manajemen Waktu",
    navs: [
      {
        allowed: [112],
        icon: RiMapPinLine,
        label: "Lokasi Kantor",
        link: "/pengaturan/manajemen-waktu/lokasi-presensi",
      },
      {
        allowed: [102],
        icon: RiCalendarScheduleLine,
        label: "Jam Kerja Shift",
        link: "/pengaturan/manajemen-waktu/shift",
      },
      {
        allowed: [102],
        icon: RiCalendarCheckLine,
        label: "Jam Kerja Non-Shift",
        link: "/pengaturan/manajemen-waktu/non-shift",
      },
      {
        allowed: [106],
        icon: RiLandscapeLine,
        label: "Hari Libur Non-Shift",
        link: "/pengaturan/manajemen-waktu/hari-libur",
      },
      {
        allowed: [110],
        icon: RiCalendarCloseLine,
        label: "Tipe Cuti",
        link: "/pengaturan/manajemen-waktu/cuti",
      },
      // {
      //   icon: RiVerifiedBadgeLine,
      //   label: "THR",
      //   link: "/pengaturan/karyawan/kompetensi",
      // },
    ],
  },
];

export default pengaturanNavs;
