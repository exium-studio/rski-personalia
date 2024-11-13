import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import Highlighter from "react-highlight-words";
import useGetUserData from "../../hooks/useGetUserData";
import calculateMasaKerjaFromTanggalMasuk from "../../lib/calculateMasaKerjaFromTanggalMasuk";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import FlexLine from "../independent/FlexLine";
import JenisProfesiBadge from "./JenisProfesiBadge";
import SimplePopover from "./SimplePopover";
import SmallLink from "./SmallLink";
import StatusKaryawanBadge from "./StatusKaryawanBadge";

interface Props {
  nama?: string;
  userData?: any;
  data: any;
  searchQuery: (string | RegExp)[];
}

export default function DetailDataKaryawan({ nama, data, searchQuery }: Props) {
  const userData = useGetUserData();
  const dataPotonganGaji = data?.potongan_gaji || userData?.potongan_gaji;

  return (
    <>
      <VStack align={"stretch"} gap={0}>
        <Text fontSize={20} fontWeight={600} mb={4}>
          Utama
        </Text>

        <VStack
          align={"stretch"}
          w={"100%"}
          gap={4}
          minH={"150px"}
          // bg={"red"}
        >
          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="No. Induk Karyawan"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.nik}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Gelar Depan"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.gelar_depan}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Nama"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {nama || data?.user?.nama}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Gelar Belakang"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.gelar_belakang}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Tempat Lahir"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.tempat_lahir}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Tanggal Lahir"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {formatDate(data?.tgl_lahir)}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Alamat"
              />
            </Box>
            <FlexLine />
            <SimplePopover body={data?.alamat} contentProps={{ mr: "38px" }}>
              <Text
                fontWeight={500}
                whiteSpace={"nowrap"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
                maxW={"243px"}
              >
                {data?.alamat}
              </Text>
            </SimplePopover>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="No. HP"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.no_hp}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="NIK KTP"
              />
            </Box>
            <FlexLine />
            <HStack>
              {data?.nik_ktp && (
                <Text fontWeight={500} textAlign={"right"}>
                  {data?.nik_ktp}
                </Text>
              )}
            </HStack>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="No. KK"
              />
            </Box>
            <FlexLine />
            <HStack>
              {data?.no_kk && (
                <Text fontWeight={500} textAlign={"right"}>
                  {data?.no_kk}
                </Text>
              )}
            </HStack>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="NPWP"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.npwp}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Jenis Kelamin"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.jenis_kelamin === 1
                ? "Laki - laki"
                : data?.jenis_kelamin === 0
                ? "Perempuan"
                : ""}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Agama"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.agama?.label}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Email"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.email}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Golongan Darah"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.golongan_darah?.label}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Tinggi Badan"
              />
            </Box>
            <FlexLine />
            {data?.tinggi_badan && (
              <Text fontWeight={500} textAlign={"right"}>
                {data?.tinggi_badan} cm
              </Text>
            )}
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Berat Badan"
              />
            </Box>
            <FlexLine />
            {data?.berat_badan && (
              <Text fontWeight={500} textAlign={"right"}>
                {data?.berat_badan} kg
              </Text>
            )}
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="BMI"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.bmi_value &&
                data?.bmi_ket &&
                `${parseFloat(data?.bmi_value)?.toFixed(1)} (${data?.bmi_ket})`}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Kode PTKP"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.ptkp?.kode_ptkp}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Pendidikan Terakhir"
              />
            </Box>
            <FlexLine />
            <HStack>
              {data?.pendidikan_terakhir && (
                <Text fontWeight={500} textAlign={"right"}>
                  {data?.pendidikan_terakhir?.label}
                </Text>
              )}
            </HStack>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Asal Sekolah"
              />
            </Box>
            <FlexLine />
            <HStack>
              {data?.asal_sekolah && (
                <Text fontWeight={500} textAlign={"right"}>
                  {data?.asal_sekolah}
                </Text>
              )}
            </HStack>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Tahun Lulus"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.tahun_lulus}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Jabatan"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.jabatan?.nama_jabatan}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Tanggal Masuk"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {formatDate(data?.tgl_masuk)}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Tanggal Diangkat"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {formatDate(data?.tgl_diangkat)}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Tanggal Berakhir PKS"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {formatDate(data?.tgl_berakhir_pks)}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Unit Kerja"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.unit_kerja?.nama_unit}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Status Karyawan"
              />
            </Box>
            <FlexLine />
            <StatusKaryawanBadge data={data?.status_karyawan} />
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Profesi"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.kompetensi?.nama_kompetensi}
            </Text>
          </HStack>
        </VStack>
      </VStack>

      <VStack align={"stretch"} gap={0}>
        <Text fontSize={20} fontWeight={600} mb={4}>
          Kesehatan
        </Text>

        <VStack align={"stretch"} gap={4}>
          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="No. Rekam Medis"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.no_rm}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="No. Manulife"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.no_manulife}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="No. BPJS Kesehatan"
              />
            </Box>
            <FlexLine />
            <HStack>
              {data?.path_no_bpjsksh && (
                <SmallLink to={data?.path_no_bpjsksh}>Lihat</SmallLink>
              )}

              {data?.no_bpjsksh && (
                <Text fontWeight={500} textAlign={"right"}>
                  {data?.no_bpjsksh}
                </Text>
              )}
            </HStack>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="No. BPJS Ketenagakerjaan"
              />
            </Box>
            <FlexLine />
            {data?.path_no_bpjsktk && (
              <SmallLink to={data?.path_no_bpjsktk}>Lihat</SmallLink>
            )}

            {data?.no_bpjsktk && (
              <Text fontWeight={500} textAlign={"right"}>
                {data?.no_bpjsktk}
              </Text>
            )}
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Riwayat Penyakit"
              />
            </Box>
            <FlexLine />
            <SimplePopover
              body={data?.riwayat_penyakit}
              contentProps={{ mr: "38px" }}
            >
              <Text
                fontWeight={500}
                whiteSpace={"nowrap"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
                maxW={"243px"}
              >
                {data?.riwayat_penyakit}
              </Text>
            </SimplePopover>
          </HStack>
        </VStack>
      </VStack>

      <VStack align={"stretch"} gap={0}>
        <Text fontSize={20} fontWeight={600} mb={4}>
          Pekerjaan
        </Text>

        <VStack align={"stretch"} gap={4}>
          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Jenis Profesi"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              <JenisProfesiBadge data={data?.kompetensi?.jenis_kompetensi} />
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Tanggal Keluar"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {formatDate(data?.tgl_keluar)}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Masa Kerja"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {calculateMasaKerjaFromTanggalMasuk(data?.tgl_masuk)}
            </Text>
          </HStack>

          {userData?.id === 1 && (
            <HStack justify={"space-between"}>
              <Box opacity={0.6}>
                <Highlighter
                  highlightClassName="hw"
                  unhighlightClassName="uw"
                  searchWords={searchQuery}
                  autoEscape={true}
                  textToHighlight="Role"
                />
              </Box>
              <FlexLine />
              <Text fontWeight={500} textAlign={"right"}>
                {data?.role?.name}
              </Text>
            </HStack>
          )}

          {/* <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Total Masa Diklat"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {formatDurationShort(data?.masa_diklat)}
            </Text>
          </HStack> */}
        </VStack>
      </VStack>

      <VStack align={"stretch"} gap={0}>
        <Text fontSize={20} fontWeight={600} mb={4}>
          Pendidikan dan Sertifikat
        </Text>

        <VStack align={"stretch"} gap={4}>
          <HStack justify={"space-between"}>
            {/* <Text opacity={0.6}>No. STR</Text> */}
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="No. STR"
              />
            </Box>
            <FlexLine />
            <HStack>
              {data?.path_no_str && <SmallLink to="#">Lihat</SmallLink>}

              {data?.no_str && (
                <Text fontWeight={500} textAlign={"right"}>
                  {data?.no_str}
                </Text>
              )}
            </HStack>
          </HStack>

          <HStack justify={"space-between"}>
            {/* <Text opacity={0.6}>Masa Berlaku STR</Text> */}
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Masa Berlaku STR"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.masa_berlaku_str
                ? formatDate(data?.masa_berlaku_str)
                : data?.no_str
                ? "Seumur Hidup"
                : ""}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            {/* <Text opacity={0.6}>No. SIP</Text> */}
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="No. SIP"
              />
            </Box>
            <FlexLine />
            <HStack>
              {data?.path_no_sip && (
                <SmallLink to={data?.path_no_sip}>Lihat</SmallLink>
              )}

              {data?.no_sip && (
                <Text fontWeight={500} textAlign={"right"}>
                  {data?.no_sip}
                </Text>
              )}
            </HStack>
          </HStack>

          <HStack justify={"space-between"}>
            {/* <Text opacity={0.6}>Masa Berlaku SIP</Text> */}
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Masa Berlaku SIP"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.masa_berlaku_sip
                ? formatDate(data?.masa_berlaku_sip)
                : data?.no_sip
                ? "Seumur Hidup"
                : ""}
            </Text>
          </HStack>
        </VStack>
      </VStack>

      <VStack align={"stretch"} gap={0}>
        <Text fontSize={20} fontWeight={600} mb={4}>
          Keuangan
        </Text>

        <VStack align={"stretch"} gap={4}>
          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="No. Rekening"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.no_rekening}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Kelompok Gaji"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              {data?.kelompok_gaji?.nama_kelompok}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Gaji"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              Rp {formatNumber(data?.kelompok_gaji?.besaran_gaji || 0)}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Uang Makan"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              Rp {formatNumber(data?.uang_makan || 0)}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Uang Lembur"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              Rp {formatNumber(data?.uang_lembur || 0)}
            </Text>
          </HStack>
        </VStack>
      </VStack>

      <VStack align={"stretch"} gap={0}>
        <Text fontSize={20} fontWeight={600} mb={4}>
          Tunjangan
        </Text>

        <VStack align={"stretch"} gap={4}>
          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Tunjangan Jabatan"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              Rp {formatNumber(data?.tunjangan_jabatan || 0)}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Besaran BOR"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              Rp {formatNumber(data?.kompetensi?.nilai_bor || 0)}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Tunjangan Fungsional"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              Rp {formatNumber(data?.tunjangan_fungsional || 0)}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Tunjangan Khusus"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              Rp {formatNumber(data?.tunjangan_khusus || 0)}
            </Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Box opacity={0.6}>
              <Highlighter
                highlightClassName="hw"
                unhighlightClassName="uw"
                searchWords={searchQuery}
                autoEscape={true}
                textToHighlight="Tunjangan Lainnya"
              />
            </Box>
            <FlexLine />
            <Text fontWeight={500} textAlign={"right"}>
              Rp {formatNumber(data?.tunjangan_lainnya || 0)}
            </Text>
          </HStack>
        </VStack>
      </VStack>

      <VStack align={"stretch"} gap={0}>
        <Text fontSize={20} fontWeight={600} mb={4}>
          Potongan
        </Text>

        <VStack align={"stretch"} gap={4}>
          {dataPotonganGaji?.length === 0 && (
            <Text opacity={0.4}>Tidak ada potongan gaji</Text>
          )}

          {dataPotonganGaji?.map((potongan: any, i: number) => (
            <HStack justify={"space-between"} key={i}>
              <Box opacity={0.6}>
                <Highlighter
                  highlightClassName="hw"
                  unhighlightClassName="uw"
                  searchWords={searchQuery}
                  autoEscape={true}
                  textToHighlight={potongan.nama_premi}
                />
              </Box>
              <FlexLine />
              <Text fontWeight={500} textAlign={"right"}>
                {potongan.jenis_premi === 0 || potongan.jenis_premi === "0"
                  ? `${formatNumber(potongan.besaran_premi || 0)}%`
                  : `Rp ${formatNumber(potongan.besaran_premi || 0)}`}
              </Text>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </>
  );
}
