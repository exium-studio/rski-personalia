import {
  RiBuilding2Fill,
  RiGroupFill,
  RiHome6Fill,
  RiMoneyDollarCircleFill,
  RiSettingsFill,
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
    label: "Karyawan",
    link: "/karyawan",
    icon: RiGroupFill,
    subNavs: [
      {
        label: "Karyawan",
        link: "/karyawan",
      },
      {
        label: "Transfer Karyawan",
        link: "/karyawan/transfer-karyawan",
      },
      {
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
    label: "Presensi",
    link: "/presensi",
    icon: RiTimerFill,
    subNavs: [
      {
        label: "Presensi",
        link: "/presensi",
      },
    ],
  },
  {
    label: "Jadwal",
    link: "/jadwal",
    icon: RiTimeFill,
    subNavs: [
      {
        label: "Jadwal",
        link: "/jadwal",
      },
      {
        label: "Penukaran Jadwal",
        link: "/jadwal/penukaran-jadwal",
      },
      {
        label: "Lembur",
        link: "/jadwal/lembur",
      },
      {
        label: "Cuti",
        link: "/jadwal/cuti",
      },
    ],
  },
  {
    label: "Keuangan",
    link: "/keuangan/penggajian",
    icon: RiMoneyDollarCircleFill,
    subNavs: [
      {
        label: "Penggajian",
        link: "/keuangan/penggajian",
      },
      {
        label: "THR",
        link: "/keuangan/thr",
      },
    ],
  },
  {
    label: "Perusahaan",
    link: "/perusahaan/diklat",
    icon: RiBuilding2Fill,
    subNavs: [
      {
        label: "Diklat",
        link: "/perusahaan/diklat",
      },
      {
        label: "Pelaporan Karyawan",
        link: "/perusahaan/pelaporan-karyawan",
      },
      {
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
    link: "/pengaturan/akun/kelola-role",
    icon: RiSettingsFill,
    subNavs: [
      {
        label: "Pengaturan",
        link: "/pengaturan/akun/kelola-role",
      },
    ],
  },
];

export default navs;
