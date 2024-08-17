import { ChakraProvider } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavContainer from "./components/wrapper/NavContainer";
import PengaturanContainer from "./components/wrapper/PengaturanContainer";
import navs from "./constant/navs";
import useBodyRef from "./global/useBodyRef";
import "./globalStyle.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import InternalServerErrorPage from "./pages/Error/InternalServerErrorPage";
import MaintenancePage from "./pages/Error/MaintenancePage";
import MissingPage from "./pages/Error/MissingPage";
import Cuti from "./pages/Jadwal/Cuti";
import Jadwal from "./pages/Jadwal/Jadwal";
import Lembur from "./pages/Jadwal/Lembur";
import TukarJadwal from "./pages/Jadwal/TukarJadwal";
import Karyawan from "./pages/Karyawan/Karyawan";
import PerubahanDataKaryawan from "./pages/Karyawan/PerubahanDataKaryawan";
import TransferKaryawan from "./pages/Karyawan/TransferKaryawan";
import Penggajian from "./pages/Keuangan/Penggajian";
import Thr from "./pages/Keuangan/Thr";
import Login from "./pages/Login/Login";
import PengaturanHariLibur from "./pages/Pengaturan/PengaturanHariLibur";
import PengaturanJabatan from "./pages/Pengaturan/PengaturanJabatan";
import PengaturanJadwalPenggajian from "./pages/Pengaturan/PengaturanJadwalPenggajian";
import PengaturanJamKerjaNonShift from "./pages/Pengaturan/PengaturanJamKerjaNonShift";
import PengaturanKategoriTer from "./pages/Pengaturan/PengaturanKategoriTer";
import PengaturanKelolaRole from "./pages/Pengaturan/PengaturanKelolaRole";
import PengaturanKelompokGaji from "./pages/Pengaturan/PengaturanKelompokGaji";
import PengaturanKompetensi from "./pages/Pengaturan/PengaturanKompetensi";
import PengaturanKuisioner from "./pages/Pengaturan/PengaturanKuisioner";
import PengaturanLanding from "./pages/Pengaturan/PengaturanLanding";
import PengaturanLokasiPresensi from "./pages/Pengaturan/PengaturanLokasiPresensi";
import PengaturanPremi from "./pages/Pengaturan/PengaturanPotongan";
import PengaturanPtkp from "./pages/Pengaturan/PengaturanPtkp";
import PengaturanShift from "./pages/Pengaturan/PengaturanShift";
import PengaturanTerPph21 from "./pages/Pengaturan/PengaturanTerPph21";
import PengaturanCuti from "./pages/Pengaturan/PengaturanTipeCuti";
import PengaturanUbahKataSandi from "./pages/Pengaturan/PengaturanUbahKataSandi";
import PengaturanUnitKerja from "./pages/Pengaturan/PengaturanUnitKerja";
import Perusahaan from "./pages/Perusahaan/Diklat";
import PelaporanKaryawan from "./pages/Perusahaan/PelaporanKaryawan";
import PenilaianKaryawan from "./pages/Perusahaan/PenilaianKaryawan";
import Presensi from "./pages/Presensi/Presensi";
import Profil from "./pages/Profil/Profil";
import { globalTheme } from "./theme/globalTheme";
import PengaturanJenisPenilaian from "./pages/Pengaturan/PengaturanJenisPenilaian";

// github pekok

export const App = () => {
  const bodyRef = useRef(null);
  const { setBodyRef } = useBodyRef();
  useEffect(() => {
    if (bodyRef.current) {
      setBodyRef(bodyRef);
    }
  }, [bodyRef, setBodyRef]);

  return (
    <ChakraProvider theme={globalTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <NavContainer
                active={0}
                title="Dashboard"
                topNavsData={navs[0].subNavs}
                topNavActive={0}
                allowed={[1]}
              >
                <Dashboard />
              </NavContainer>
            }
          />
          <Route
            path="/karyawan"
            element={
              <NavContainer
                active={1}
                title="Pegawai"
                topNavsData={navs[1].subNavs}
                topNavActive={0}
              >
                <Karyawan />
              </NavContainer>
            }
          />
          <Route
            path="/karyawan/transfer-karyawan"
            element={
              <NavContainer
                active={1}
                title="Transfer Karyawan"
                topNavsData={navs[1].subNavs}
                topNavActive={1}
              >
                <TransferKaryawan />
              </NavContainer>
            }
          />
          <Route
            path="/karyawan/perubahan-data-karyawan"
            element={
              <NavContainer
                active={1}
                title="Permintaan Perubahan Data"
                topNavsData={navs[1].subNavs}
                topNavActive={2}
              >
                <PerubahanDataKaryawan />
              </NavContainer>
            }
          />

          <Route
            path="/presensi"
            element={
              <NavContainer
                active={2}
                title="Presensi"
                topNavsData={navs[2].subNavs}
                topNavActive={0}
              >
                <Presensi />
              </NavContainer>
            }
          />

          <Route
            path="/jadwal"
            element={
              <NavContainer
                active={3}
                title="Jadwal"
                topNavsData={navs[3].subNavs}
                topNavActive={0}
              >
                <Jadwal />
              </NavContainer>
            }
          />
          <Route
            path="/jadwal/penukaran-jadwal"
            element={
              <NavContainer
                active={3}
                title="Penukaran Jadwal"
                topNavsData={navs[3].subNavs}
                topNavActive={1}
              >
                <TukarJadwal />
              </NavContainer>
            }
          />
          <Route
            path="/jadwal/lembur"
            element={
              <NavContainer
                active={3}
                title="Lembur"
                topNavsData={navs[3].subNavs}
                topNavActive={2}
              >
                <Lembur />
              </NavContainer>
            }
          />
          <Route
            path="/jadwal/cuti"
            element={
              <NavContainer
                active={3}
                title="Cuti"
                topNavsData={navs[3].subNavs}
                topNavActive={3}
              >
                <Cuti />
              </NavContainer>
            }
          />
          <Route
            path="/keuangan/penggajian"
            element={
              <NavContainer
                active={4}
                title="Penggajian"
                topNavsData={navs[4].subNavs}
                topNavActive={0}
              >
                <Penggajian />
              </NavContainer>
            }
          />
          <Route
            path="/keuangan/thr"
            element={
              <NavContainer
                active={4}
                title="THR"
                topNavsData={navs[4].subNavs}
                topNavActive={1}
              >
                <Thr />
              </NavContainer>
            }
          />

          <Route
            path="/perusahaan/diklat"
            element={
              <NavContainer
                active={5}
                title="Diklat"
                topNavsData={navs[5].subNavs}
                topNavActive={0}
              >
                <Perusahaan />
              </NavContainer>
            }
          />
          <Route
            path="/perusahaan/pelaporan-karyawan"
            element={
              <NavContainer
                active={5}
                title="Pelaporan Karyawan"
                topNavsData={navs[5].subNavs}
                topNavActive={1}
              >
                <PelaporanKaryawan />
              </NavContainer>
            }
          />
          <Route
            path="/perusahaan/penilaian-karyawan"
            element={
              <NavContainer
                active={5}
                title="Penilaian Karyawan"
                topNavsData={navs[5].subNavs}
                topNavActive={2}
              >
                <PenilaianKaryawan />
              </NavContainer>
            }
          />

          <Route
            path="/profil"
            element={
              <NavContainer
                active={6}
                title="Profil"
                topNavsData={navs[6].subNavs}
                topNavActive={0}
              >
                <Profil />
              </NavContainer>
            }
          />

          <Route
            path="/pengaturan"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan"
              >
                <PengaturanContainer>
                  <PengaturanLanding />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/akun/kelola-role"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Kelola Role"
              >
                <PengaturanContainer activeGroup={0} active={0}>
                  <PengaturanKelolaRole />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/akun/ubah-kata-sandi"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Ubah Kata Sandi"
              >
                <PengaturanContainer activeGroup={0} active={1}>
                  <PengaturanUbahKataSandi />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/karyawan/kelompok-gaji"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Kelompok Gaji"
              >
                <PengaturanContainer activeGroup={1} active={0}>
                  <PengaturanKelompokGaji />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/karyawan/jabatan"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Jabatan"
              >
                <PengaturanContainer activeGroup={1} active={1}>
                  <PengaturanJabatan />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/karyawan/unit-kerja"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Unit Kerja"
              >
                <PengaturanContainer activeGroup={1} active={2}>
                  <PengaturanUnitKerja />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/karyawan/kompetensi"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Kompetensi"
              >
                <PengaturanContainer activeGroup={1} active={3}>
                  <PengaturanKompetensi />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/karyawan/jenis-penilaian"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Jenis Penilaian"
              >
                <PengaturanContainer activeGroup={1} active={4}>
                  <PengaturanJenisPenilaian />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/karyawan/kuisioner"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Pertanyaan Penilaian"
              >
                <PengaturanContainer activeGroup={1} active={5}>
                  <PengaturanKuisioner />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/keuangan/premi"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Potongan"
              >
                <PengaturanContainer activeGroup={2} active={0}>
                  <PengaturanPremi />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/keuangan/kategori-ter-pph21"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Kategori TER"
              >
                <PengaturanContainer activeGroup={2} active={1}>
                  <PengaturanKategoriTer />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/keuangan/ter-pph21"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - TER pph21"
              >
                <PengaturanContainer activeGroup={2} active={2}>
                  <PengaturanTerPph21 />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/keuangan/ptkp"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - PTKP"
              >
                <PengaturanContainer activeGroup={2} active={3}>
                  <PengaturanPtkp />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/keuangan/jadwal-penggajian"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Tanggal Penggajian"
              >
                <PengaturanContainer activeGroup={2} active={4}>
                  <PengaturanJadwalPenggajian />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/manajemen-waktu/lokasi-presensi"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Lokasi Presensi"
              >
                <PengaturanContainer activeGroup={3} active={0}>
                  <PengaturanLokasiPresensi />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/manajemen-waktu/shift"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Jam Kerja Shift"
              >
                <PengaturanContainer activeGroup={3} active={1}>
                  <PengaturanShift />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/manajemen-waktu/non-shift"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Jam Kerja Non Shift"
              >
                <PengaturanContainer activeGroup={3} active={2}>
                  <PengaturanJamKerjaNonShift />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/manajemen-waktu/hari-libur"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Hari Libur Non-Shift"
              >
                <PengaturanContainer activeGroup={3} active={3}>
                  <PengaturanHariLibur />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/manajemen-waktu/cuti"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Tipe Cuti"
              >
                <PengaturanContainer activeGroup={3} active={4}>
                  <PengaturanCuti />
                </PengaturanContainer>
              </NavContainer>
            }
          />

          <Route path="/servererror" element={<InternalServerErrorPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="*" element={<MissingPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};
