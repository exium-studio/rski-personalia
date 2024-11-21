import {
  Box,
  ChakraProvider,
  Image,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import FormForgotPasswordStep1 from "./components/form/Auth/FormForgotPasswordStep1";
import FormForgotPasswordStep2 from "./components/form/Auth/FormForgotPasswordStep2";
import FormForgotPasswordStep3 from "./components/form/Auth/FormForgotPasswordStep3";
import FormLogin from "./components/form/Auth/FormLogin";
import CContainer from "./components/wrapper/CContainer";
import Container from "./components/wrapper/Container";
import NavContainer from "./components/wrapper/NavContainer";
import PengaturanContainer from "./components/wrapper/PengaturanContainer";
import { useLightDarkColor } from "./constant/colors";
import navs from "./constant/navs";
import useBodyRef from "./global/useBodyRef";
import "./globalStyle.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import InternalServerErrorPage from "./pages/Error/InternalServerErrorPage";
import MaintenancePage from "./pages/Error/MaintenancePage";
import MissingPage from "./pages/Error/MissingPage";
import Cuti from "./pages/Jadwal/Cuti";
import Izin from "./pages/Jadwal/Izin";
import Jadwal from "./pages/Jadwal/Jadwal";
import Lembur from "./pages/Jadwal/Lembur";
import TukarJadwal from "./pages/Jadwal/TukarJadwal";
import Karyawan from "./pages/Karyawan/Karyawan";
import PerubahanDataKaryawan from "./pages/Karyawan/PermintaanPerubahanDataKaryawan";
import TransferKaryawan from "./pages/Karyawan/TransferKaryawan";
import Penggajian from "./pages/Keuangan/Penggajian";
import Tagihan from "./pages/Keuangan/Tagihan";
import Thr from "./pages/Keuangan/Thr";
import PengaturanHakVerifikasi from "./pages/Pengaturan/PengaturanHakVerifikasi";
import PengaturanHariLibur from "./pages/Pengaturan/PengaturanHariLibur";
import PengaturanJabatan from "./pages/Pengaturan/PengaturanJabatan";
import PengaturanJadwalPenggajian from "./pages/Pengaturan/PengaturanJadwalPenggajian";
import PengaturanJamKerjaNonShift from "./pages/Pengaturan/PengaturanJamKerjaNonShift";
import PengaturanJenisPenilaian from "./pages/Pengaturan/PengaturanJenisPenilaian";
import PengaturanKategoriTer from "./pages/Pengaturan/PengaturanKategoriTer";
import PengaturanKelolaRole from "./pages/Pengaturan/PengaturanKelolaRole";
import PengaturanKelompokGaji from "./pages/Pengaturan/PengaturanKelompokGaji";
import PengaturanKompetensi from "./pages/Pengaturan/PengaturanKompetensi";
import PengaturanKuisioner from "./pages/Pengaturan/PengaturanKuisioner";
import PengaturanLanding from "./pages/Pengaturan/PengaturanLanding";
import PengaturanLokasiPresensi from "./pages/Pengaturan/PengaturanLokasiPresensi";
import PengaturanMateri from "./pages/Pengaturan/PengaturanMateri";
import PengaturanPendidikan from "./pages/Pengaturan/PengaturanPendidikan";
import PengaturanPremi from "./pages/Pengaturan/PengaturanPotongan";
import PengaturanPtkp from "./pages/Pengaturan/PengaturanPtkp";
import PengaturanShift from "./pages/Pengaturan/PengaturanShift";
import PengaturanTentang from "./pages/Pengaturan/PengaturanTentang";
import PengaturanTerPph21 from "./pages/Pengaturan/PengaturanTerPph21";
import PengaturanCuti from "./pages/Pengaturan/PengaturanTipeCuti";
import PengaturanUbahKataSandi from "./pages/Pengaturan/PengaturanUbahKataSandi";
import PengaturanUnitKerja from "./pages/Pengaturan/PengaturanUnitKerja";
import Diklat from "./pages/Perusahaan/Diklat";
import DiklatEksternal from "./pages/Perusahaan/DiklatEksternal";
import PenilaianKaryawan from "./pages/Perusahaan/PenilaianKaryawan";
import Presensi from "./pages/Presensi/Presensi";
import Profil from "./pages/Profil/Profil";
import { globalTheme } from "./theme/globalTheme";

const AuthPageLayout = () => {
  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <Container>
      <CContainer>
        <Stack
          flexDir={["column", null, "row"]}
          minH={"100vh"}
          w={"100%"}
          h={"100%"}
          align={"stretch"}
        >
          <VStack
            align={"stretch"}
            justify={"space-between"}
            minH={"100vh"}
            py={6}
            px={[6, null, 12]}
            maxW={"450px"}
            w={"100%"}
          >
            <VStack h={"200px"} align={"flex-start"} mb={6}>
              <Image
                src={"/logo512.png"}
                h={"140px"}
                mx={["auto", null, "0"]}
              />
            </VStack>

            <Box>
              <Outlet />
            </Box>

            <CContainer h={"200px"} justify={"end"}>
              <Text opacity={0.6} mt={6}>
                Copyright 2024 RSKI All right Reserved
              </Text>
            </CContainer>
          </VStack>

          <VStack p={6} minH={"300px"} flex={1}>
            <VStack
              borderRadius={12}
              justify={"space-between"}
              align={"flex-start"}
              p={4}
              overflow={"clip"}
              w={"100%"}
              bgImage={"/images/login.png"}
              bgSize={"cover"}
              bgPos={"center"}
              flex={1}
            >
              <ColorModeSwitcher
                ml={"auto"}
                bg={`${lightDarkColor} !important`}
                _hover={{ bg: `${lightDarkColor} !important` }}
                _active={{ bg: `${lightDarkColor} !important` }}
              />

              <VStack
                // maxW={"700px"}
                bg={"blackAlpha.600"}
                color={"white"}
                p={4}
                borderRadius={12}
                backdropFilter={"blur(5px)"}
              >
                <Text>
                  “Di rumah sakit kami, kami memberikan perawatan yang tak
                  tertandingi, di mana keahlian berpadu dengan kasih sayang,
                  untuk memastikan hasil terbaik bagi setiap pasien”
                </Text>
              </VStack>
            </VStack>
          </VStack>
        </Stack>
      </CContainer>
    </Container>
  );
};

export const App = () => {
  const bodyRef = useRef(null);
  const { setBodyRef } = useBodyRef();
  useEffect(() => {
    if (bodyRef.current) {
      setBodyRef(bodyRef);
    }
  }, [bodyRef, setBodyRef]);

  // Connection handler
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    const handleOnline = () => {
      if (!firstLoad) {
        toast({
          title: "Koneksi Pulih",
          description: "Anda kembali online.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    };

    const handleOffline = () => {
      toast({
        title: "Jaringan Terputus",
        description: "Anda sedang offline.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    };

    // Tambahkan event listener
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast, firstLoad]);

  // Hindari toast pertama kali
  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
    }
  }, [firstLoad]);

  return (
    <ChakraProvider theme={globalTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPageLayout />}>
            <Route index element={<FormLogin />} />
            <Route
              path={"forgot-password-1"}
              element={<FormForgotPasswordStep1 />}
            />
            <Route
              path={"forgot-password-2/:email"}
              element={<FormForgotPasswordStep2 />}
            />
            <Route
              path={"forgot-password-3/:email/:otp"}
              element={<FormForgotPasswordStep3 />}
            />
          </Route>
          <Route
            path="/dashboard"
            element={
              <NavContainer
                active={0}
                title="Dashboard"
                topNavsData={navs[0].subNavs}
                topNavActive={0}
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
                title="Karyawan"
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
            path="/jadwal/izin"
            element={
              <NavContainer
                active={3}
                title="Izin"
                topNavsData={navs[3].subNavs}
                topNavActive={4}
              >
                <Izin />
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
            path="/keuangan/tagihan"
            element={
              <NavContainer
                active={4}
                title="Tagihan"
                topNavsData={navs[4].subNavs}
                topNavActive={2}
              >
                <Tagihan />
              </NavContainer>
            }
          />
          <Route
            path="/perusahaan/diklat"
            element={
              <NavContainer
                active={5}
                title="Diklat Internal"
                topNavsData={navs[5].subNavs}
                topNavActive={0}
              >
                <Diklat />
              </NavContainer>
            }
          />
          <Route
            path="/perusahaan/diklat-eksternal"
            element={
              <NavContainer
                active={5}
                title="Diklat Eksternal"
                topNavsData={navs[5].subNavs}
                topNavActive={1}
              >
                <DiklatEksternal />
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
                title="Pengaturan - Hak Akses (Role)"
              >
                <PengaturanContainer activeGroup={0} active={0}>
                  <PengaturanKelolaRole />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/akun/hak-verifikasi"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Hak Verifikasi"
              >
                <PengaturanContainer activeGroup={0} active={1}>
                  <PengaturanHakVerifikasi />
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
                <PengaturanContainer activeGroup={0} active={2}>
                  <PengaturanUbahKataSandi />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/karyawan/pendidikan"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pendidikan Terakhir"
              >
                <PengaturanContainer activeGroup={1} active={0}>
                  <PengaturanPendidikan />
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
                <PengaturanContainer activeGroup={1} active={1}>
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
                <PengaturanContainer activeGroup={1} active={2}>
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
                <PengaturanContainer activeGroup={1} active={3}>
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
                <PengaturanContainer activeGroup={1} active={4}>
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
                <PengaturanContainer activeGroup={1} active={5}>
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
                title="Pengaturan - Kuesioner Penilaian"
              >
                <PengaturanContainer activeGroup={1} active={6}>
                  <PengaturanKuisioner />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/karyawan/tentang"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Tentang Rumah Sakit"
              >
                <PengaturanContainer activeGroup={1} active={7}>
                  <PengaturanTentang />
                </PengaturanContainer>
              </NavContainer>
            }
          />
          <Route
            path="/pengaturan/karyawan/materi"
            element={
              <NavContainer
                active={7}
                topNavsData={navs[7].subNavs}
                topNavActive={0}
                title="Pengaturan - Materi"
              >
                <PengaturanContainer activeGroup={1} active={8}>
                  <PengaturanMateri />
                </PengaturanContainer>
              </NavContainer>
            }
          />

          {/* Potongan */}
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
                title="Pengaturan - Lokasi Kantor"
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
