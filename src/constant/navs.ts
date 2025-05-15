import {
  RiCalendarFill,
  RiGraduationCapFill,
  RiGroupFill,
  RiHome6Fill,
  RiMoneyDollarCircleFill,
  RiSettings3Fill,
  RiTimerFill,
  RiUserFill,
} from "@remixicon/react";

const navs = [
  {
    allowed: [149],
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
    allowed: [50, 133, 2],
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
        label: "STR/SIP (Kary. Medis)",
        link: "/karyawan-medis",
      },
      {
        allowed: [133],
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
      {
        allowed: [150],
        label: "Anulir Presensi",
        link: "/anulir-presensi",
      },
    ],
  },
  {
    allowed: [22, 29, 36, 41, 4],
    label: "Jadwal",
    link: "/jadwal",
    icon: RiCalendarFill,
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
        label: "Pengajuan Cuti",
        link: "/jadwal/cuti",
      },
      {
        allowed: [162],
        label: "Kuota Cuti",
        link: "/jadwal/kuota-cuti",
      },
      {
        allowed: [4],
        label: "Izin",
        link: "/jadwal/izin",
      },
    ],
  },

  // Keuangan
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
      {
        allowed: [17],
        label: "Tagihan",
        link: "/keuangan/tagihan",
      },
    ],
  },

  // Perusahaan
  {
    allowed: [8],
    label: "Pendidikan",
    link: "/perusahaan/diklat",
    icon: RiGraduationCapFill,
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
      {
        allowed: [8],
        label: "Masa Diklat",
        link: "/perusahaan/masa-diklat",
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
