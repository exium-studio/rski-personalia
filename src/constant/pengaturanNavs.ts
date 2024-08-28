import {
  RiArticleLine,
  RiCalendarCheckLine,
  RiCalendarCloseLine,
  RiCalendarLine,
  RiCalendarScheduleLine,
  RiFilePaper2Line,
  RiGroup3Line,
  RiHandCoinLine,
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
    groupName: "Akun",
    navs: [
      {
        allowed: 71,
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
    //TODO belum lengkap
    allowed: [99, 87, 81, 91],
    groupName: "Kepegawaian",
    navs: [
      {
        allowed: 99,
        icon: RiWalletLine,
        label: "Kelompok Gaji",
        link: "/pengaturan/karyawan/kelompok-gaji",
      },
      {
        allowed: 87,
        icon: RiIdCardLine,
        label: "Jabatan",
        link: "/pengaturan/karyawan/jabatan",
      },
      {
        allowed: 81,
        icon: RiGroup3Line,
        label: "Unit Kerja",
        link: "/pengaturan/karyawan/unit-kerja",
      },
      {
        allowed: 91,
        icon: RiVerifiedBadgeLine,
        label: "Kompetensi",
        link: "/pengaturan/karyawan/kompetensi",
      },
      {
        //TODO belum lengkap
        allowed: 52,
        icon: RiQuestionLine,
        label: "Jenis Penilaian",
        link: "/pengaturan/karyawan/jenis-penilaian",
      },
      {
        //TODO belum lengkap
        allowed: 52,
        icon: RiQuestionMark,
        label: "Kuisioner Penilaian",
        link: "/pengaturan/karyawan/kuisioner",
      },
    ],
  },
  {
    //TODO belum lengkap
    allowed: [111, null, 117, null, 121],
    groupName: "Keuangan",
    navs: [
      {
        allowed: 111,
        icon: RiHandCoinLine,
        label: "Potongan",
        link: "/pengaturan/keuangan/premi",
      },
      {
        //TODO belum lengkap
        allowed: 52,
        icon: RiListIndefinite,
        label: "Kategori TER",
        link: "/pengaturan/keuangan/kategori-ter-pph21",
      },
      {
        allowed: 117,
        icon: RiFilePaper2Line,
        label: "TER pph21",
        link: "/pengaturan/keuangan/ter-pph21",
      },
      {
        //TODO belum lengkap
        allowed: 52,
        icon: RiArticleLine,
        label: "PTKP",
        link: "/pengaturan/keuangan/ptkp",
      },
      {
        allowed: 121,
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
    //TODO belum lengkap
    allowed: [145, 129, null, 52, 135, 141],
    groupName: "Manajemen Waktu",
    navs: [
      {
        allowed: 145,
        icon: RiMapPinLine,
        label: "Lokasi Kantor",
        link: "/pengaturan/manajemen-waktu/lokasi-presensi",
      },
      {
        allowed: 129,
        icon: RiCalendarScheduleLine,
        label: "Jam Kerja Shift",
        link: "/pengaturan/manajemen-waktu/shift",
      },
      {
        //TODO belum lengkap
        allowed: 52,
        icon: RiCalendarCheckLine,
        label: "Jam Kerja Non-Shift",
        link: "/pengaturan/manajemen-waktu/non-shift",
      },
      {
        allowed: 135,
        icon: RiLandscapeLine,
        label: "Hari Libur Non-Shift",
        link: "/pengaturan/manajemen-waktu/hari-libur",
      },
      {
        allowed: 141,
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
