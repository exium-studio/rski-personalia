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
    label: "Dashboard",
    link: "/dashboard",
    icon: RiHome6Fill,
    subNavs: [
      {
        label: "Dashboard",
        link: "/dashboard",
      },
    ],
  },
  {
    allowed: [50],
    label: "Karyawan",
    link: "/karyawan",
    icon: RiGroupFill,
    subNavs: [
      {
        allowed: [50],
        label: "Karyawan",
        link: "/karyawan",
      },
      {
        allowed: [50],
        label: "Transfer Karyawan",
        link: "/karyawan/transfer-karyawan",
      },
      {
        allowed: [2],
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
    allowed: [45],
    label: "Presensi",
    link: "/presensi",
    icon: RiTimerFill,
    subNavs: [
      {
        allowed: [45],
        label: "Presensi",
        link: "/presensi",
      },
    ],
  },
  {
    allowed: [22, 29, 36, 41],
    label: "Jadwal",
    link: "/jadwal",
    icon: RiTimeFill,
    subNavs: [
      {
        allowed: [22],
        label: "Jadwal",
        link: "/jadwal",
      },
      {
        allowed: [29],
        label: "Tukar Jadwal",
        link: "/jadwal/penukaran-jadwal",
      },
      {
        allowed: [36],
        label: "Lembur",
        link: "/jadwal/lembur",
      },
      {
        allowed: [41],
        label: "Cuti",
        link: "/jadwal/cuti",
      },
      {
        allowed: [4],
        label: "Izin",
        link: "/jadwal/izin",
      },
    ],
  },
  {
    allowed: [17, 13],
    label: "Keuangan",
    link: "/keuangan/penggajian",
    icon: RiMoneyDollarCircleFill,
    subNavs: [
      {
        allowed: [17],
        label: "Penggajian",
        link: "/keuangan/penggajian",
      },
      {
        allowed: [13],
        label: "THR",
        link: "/keuangan/thr",
      },
    ],
  },
  {
    allowed: [8, 114],
    label: "Perusahaan",
    link: "/perusahaan/diklat",
    icon: RiBuilding2Fill,
    subNavs: [
      {
        allowed: [8],
        label: "Diklat Internal",
        link: "/perusahaan/diklat",
      },
      {
        allowed: [8],
        label: "Diklat Eksternal",
        link: "/perusahaan/diklat-eksternal",
      },
      // {
      //   label: "Pelaporan Karyawan",
      //   link: "/perusahaan/pelaporan-karyawan",
      // },
      // {
      //   allowed: [114],
      //   label: "Penilaian Karyawan",
      //   link: "/perusahaan/penilaian-karyawan",
      // },
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
