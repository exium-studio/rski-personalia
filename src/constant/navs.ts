import {
  RiBuilding2Fill,
  RiGroupFill,
  RiHome6Fill,
  RiMoneyDollarCircleFill,
  RiSettings3Fill,
  RiTimeFill,
  RiTimerFill,
  RiUserFill,
} from "@remixicon/react";

const navs = [
  {
    allowed: [1],
    label: "Dashboard",
    link: "/dashboard",
    icon: RiHome6Fill,
    subNavs: [
      {
        allowed: [1],
        label: "Dashboard",
        link: "/dashboard",
      },
    ],
  },
  {
    //TODO belum lengkap
    allowed: [58],
    label: "Karyawan",
    link: "/karyawan",
    icon: RiGroupFill,
    subNavs: [
      {
        allowed: [58],
        label: "Karyawan",
        link: "/karyawan",
      },
      {
        //TODO belum lengkap
        allowed: [58],
        label: "Transfer Karyawan",
        link: "/karyawan/transfer-karyawan",
      },
      {
        //TODO belum lengkap
        allowed: [58],
        label: "Permintaan Perubahan Data",
        link: "/karyawan/perubahan-data-karyawan",
      },
      // {
      //   label: "Verifikasi Dokumen",
      //   link: "/karyawan/verifikasi-dokumen-karyawan",
      // },
    ],
  },
  {
    allowed: [52],
    label: "Presensi",
    link: "/presensi",
    icon: RiTimerFill,
    subNavs: [
      {
        allowed: [52],
        label: "Presensi",
        link: "/presensi",
      },
    ],
  },
  {
    allowed: [52, 32, 40, 141],
    label: "Jadwal",
    link: "/jadwal",
    icon: RiTimeFill,
    subNavs: [
      {
        allowed: [52],
        label: "Jadwal",
        link: "/jadwal",
      },
      {
        allowed: [32],
        label: "Tukar Jadwal",
        link: "/jadwal/penukaran-jadwal",
      },
      {
        allowed: [40],
        label: "Lembur",
        link: "/jadwal/lembur",
      },
      {
        allowed: [141],
        label: "Cuti",
        link: "/jadwal/cuti",
      },
    ],
  },
  {
    allowed: [18, 14],
    label: "Keuangan",
    link: "/keuangan/penggajian",
    icon: RiMoneyDollarCircleFill,
    subNavs: [
      {
        allowed: [18],
        label: "Penggajian",
        link: "/keuangan/penggajian",
      },
      {
        allowed: [14],
        label: "THR",
        link: "/keuangan/thr",
      },
    ],
  },
  {
    allowed: [7, 147],
    label: "Perusahaan",
    link: "/perusahaan/diklat",
    icon: RiBuilding2Fill,
    subNavs: [
      {
        allowed: [7],
        label: "Diklat",
        link: "/perusahaan/diklat",
      },
      // {
      //   label: "Pelaporan Karyawan",
      //   link: "/perusahaan/pelaporan-karyawan",
      // },
      {
        allowed: [147],
        label: "Penilaian Karyawan",
        link: "/perusahaan/penilaian-karyawan",
      },
    ],
  },
  {
    label: "Profil",
    link: "/profil",
    icon: RiUserFill,
    subNavs: [
      {
        label: "Profil",
        link: "/profil",
      },
    ],
  },
  {
    label: "Pengaturan",
    link: "/pengaturan",
    icon: RiSettings3Fill,
    subNavs: [
      {
        label: "Pengaturan",
        link: "/pengaturan",
      },
    ],
  },
];

export default navs;
