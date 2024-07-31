import {
  RiCalendarCheckLine,
  RiCalendarCloseLine,
  RiCalendarLine,
  RiFilePaper2Line,
  RiGroup3Line,
  RiHandCoinLine,
  RiIdCardLine,
  RiLandscapeLine,
  RiLockLine,
  RiMapPinLine,
  RiQuestionLine,
  RiUserSettingsLine,
  RiVerifiedBadgeLine,
  RiWalletLine,
} from "@remixicon/react";

const pengaturanNavs = [
  {
    groupName: "Akun",
    navs: [
      {
        icon: RiUserSettingsLine,
        label: "Kelola Role",
        link: "/pengaturan/akun/kelola-role",
      },
      {
        icon: RiLockLine,
        label: "Ubah Kata Sandi",
        link: "/pengaturan/akun/ubah-kata-sandi",
      },
    ],
  },
  {
    groupName: "Kepegawaian",
    navs: [
      {
        icon: RiWalletLine,
        label: "Kelompok Gaji",
        link: "/pengaturan/karyawan/kelompok-gaji",
      },
      {
        icon: RiIdCardLine,
        label: "Jabatan",
        link: "/pengaturan/karyawan/jabatan",
      },
      {
        icon: RiGroup3Line,
        label: "Unit Kerja",
        link: "/pengaturan/karyawan/unit-kerja",
      },
      {
        icon: RiVerifiedBadgeLine,
        label: "Kompetensi",
        link: "/pengaturan/karyawan/kompetensi",
      },
      {
        icon: RiQuestionLine,
        label: "Kuisioner",
        link: "/pengaturan/karyawan/kuisioner",
      },
    ],
  },
  {
    groupName: "Keuangan",
    navs: [
      {
        icon: RiHandCoinLine,
        label: "Potongan",
        link: "/pengaturan/keuangan/premi",
      },
      {
        icon: RiFilePaper2Line,
        label: "TER pph21",
        link: "/pengaturan/keuangan/ter-pph21",
      },
      {
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
    groupName: "Manajemen Waktu",
    navs: [
      {
        icon: RiMapPinLine,
        label: "Lokasi Presensi",
        link: "/pengaturan/manajemen-waktu/lokasi-presensi",
      },
      {
        icon: RiCalendarCheckLine,
        label: "Shift",
        link: "/pengaturan/manajemen-waktu/shift",
      },
      {
        icon: RiLandscapeLine,
        label: "Hari Libur Non-Shift",
        link: "/pengaturan/manajemen-waktu/hari-libur",
      },
      {
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
