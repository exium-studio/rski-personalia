import {
  Avatar,
  Button,
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { RiEditBoxFill, RiUserHeartFill } from "@remixicon/react";
import { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import JenisKaryawanBadge from "../../components/dependent/JenisKaryawanBadge";
import SearchComponent from "../../components/dependent/SearchComponent";
import SmallLink from "../../components/dependent/SmallLink";
import ComponentSpinner from "../../components/independent/ComponentSpinner";
import FlexLine from "../../components/independent/FlexLine";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useBodyColor } from "../../constant/colors";
import { dummyDetailKaryawan } from "../../const/dummy";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import formatDate from "../../lib/formatDate";
import formatMasaKerja from "../../lib/formatMasaKerja";
import formatNumber from "../../lib/formatNumber";
import BooleanBadge from "../../components/dependent/BooleanBadge";

export default function DetailKaryawan() {
  const [data] = useState<any | null>(dummyDetailKaryawan);
  const [loading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string[]>([]);

  useEffect(() => {
    const words = search.split(" ").filter((word) => word.length > 0);
    const modifiedWords = words.reduce((acc: string[], word) => {
      acc.push(word);
      if (word.toLowerCase() === "nomor") {
        acc.push("no.");
      } else if (word.toLowerCase() === "nik") {
        acc.push("no. induk karyawan");
      }
      return acc;
    }, []);
    setSearchQuery(modifiedWords);
  }, [search]);

  // SX
  const bodyColor = useBodyColor();

  return (
    <CWrapper
      overflowY={"auto"}
      // className="scrollY"
    >
      {loading && <ComponentSpinner minH={"400px"} flex={1} />}

      {!loading && data && (
        <>
          <Wrap spacing={responsiveSpacing} overflowY={"auto"}>
            <CContainer
              py={responsiveSpacing}
              flex={"1 1 350px"}
              bg={bodyColor}
              borderRadius={12}
              position={"sticky"}
              top={"0"}
              h={"fit-content !important"}
              maxH={"calc(100vh - 88px - 24px)"}
              overflowY={"auto"}
              className="noScroll"
            >
              <VStack flex={1} overflowY={"auto"} className="scrollY">
                <VStack>
                  <Avatar
                    w={"250px"}
                    h={"250px"}
                    size={"xxl"}
                    fontSize={"80px !important"}
                    src={data.user.foto_profil}
                    name={data.user.nama}
                    mb={2}
                  />

                  <Text
                    fontWeight={600}
                    fontSize={22}
                    maxW={"280px"}
                    textAlign={"center"}
                    mb={1}
                  >
                    {data.user.nama}
                  </Text>

                  <JenisKaryawanBadge
                    data={data.unit_kerja.jenis_karyawan}
                    mb={responsiveSpacing}
                  />
                </VStack>

                <VStack
                  align={"stretch"}
                  w={"100%"}
                  gap={4}
                  px={responsiveSpacing}
                  minH={"150px"}
                  // bg={"red"}
                >
                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Email</Text> */}
                    <Highlighter
                      highlightClassName="hw"
                      unhighlightClassName="uw"
                      searchWords={searchQuery}
                      autoEscape={true}
                      textToHighlight="Status Aktif"
                    />
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      <BooleanBadge
                        data={data.user.status_aktif}
                        trueValue="Aktif"
                        falseValue="Tidak Aktif"
                      />
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>No. Induk Karyawan</Text> */}
                    <Highlighter
                      highlightClassName="hw"
                      unhighlightClassName="uw"
                      searchWords={searchQuery}
                      autoEscape={true}
                      textToHighlight="Username Akun"
                    />
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      {data.user.username}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Email</Text> */}
                    <Highlighter
                      highlightClassName="hw"
                      unhighlightClassName="uw"
                      searchWords={searchQuery}
                      autoEscape={true}
                      textToHighlight="Email"
                    />
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      {data.email}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>No. Induk Karyawan</Text> */}
                    <Highlighter
                      highlightClassName="hw"
                      unhighlightClassName="uw"
                      searchWords={searchQuery}
                      autoEscape={true}
                      textToHighlight="No. Induk Karyawan"
                    />
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      {data.nik}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>NIK KTP</Text> */}
                    <Highlighter
                      highlightClassName="hw"
                      unhighlightClassName="uw"
                      searchWords={searchQuery}
                      autoEscape={true}
                      textToHighlight="NIK KTP"
                    />
                    <FlexLine />
                    <HStack>
                      <SmallLink to="#">Lihat</SmallLink>
                      <Text fontWeight={500} textAlign={"right"}>
                        {data.nik_ktp}
                      </Text>
                    </HStack>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>No. KK</Text> */}
                    <Highlighter
                      highlightClassName="hw"
                      unhighlightClassName="uw"
                      searchWords={searchQuery}
                      autoEscape={true}
                      textToHighlight="No. KK"
                    />
                    <FlexLine />
                    <HStack>
                      <SmallLink to="#">Lihat</SmallLink>
                      <Text fontWeight={500} textAlign={"right"}>
                        {data.no_kk}
                      </Text>
                    </HStack>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>No. HP</Text> */}
                    <Highlighter
                      highlightClassName="hw"
                      unhighlightClassName="uw"
                      searchWords={searchQuery}
                      autoEscape={true}
                      textToHighlight="No. HP"
                    />
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      {data.no_hp}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Tempat Lahir</Text> */}
                    <Highlighter
                      highlightClassName="hw"
                      unhighlightClassName="uw"
                      searchWords={searchQuery}
                      autoEscape={true}
                      textToHighlight="Tempat Lahir"
                    />
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      {data.tempat_lahir}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Tanggal Lahir</Text> */}
                    <Highlighter
                      highlightClassName="hw"
                      unhighlightClassName="uw"
                      searchWords={searchQuery}
                      autoEscape={true}
                      textToHighlight="Tanggal Lahir"
                    />
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      {formatDate(data.tgl_lahir)}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Jenis Kelamin</Text> */}
                    <Highlighter
                      highlightClassName="hw"
                      unhighlightClassName="uw"
                      searchWords={searchQuery}
                      autoEscape={true}
                      textToHighlight="Jenis Kelamin"
                    />
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      {data.jenis_kelamin.toLowerCase() === "p"
                        ? "Perempuan"
                        : "Laki - laki"}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Agama</Text> */}
                    <Highlighter
                      highlightClassName="hw"
                      unhighlightClassName="uw"
                      searchWords={searchQuery}
                      autoEscape={true}
                      textToHighlight="Agama"
                    />
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      {data.agama}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Gelar Depan</Text> */}
                    <Highlighter
                      highlightClassName="hw"
                      unhighlightClassName="uw"
                      searchWords={searchQuery}
                      autoEscape={true}
                      textToHighlight="Gelar Depan"
                    />
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      {data.gelar_depan}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Alamat</Text> */}
                    <Highlighter
                      highlightClassName="hw"
                      unhighlightClassName="uw"
                      searchWords={searchQuery}
                      autoEscape={true}
                      textToHighlight="Alamat"
                    />
                    <FlexLine />
                    <Popover>
                      <PopoverTrigger>
                        <Text
                          fontWeight={500}
                          noOfLines={1}
                          maxW={"180px"}
                          cursor={"pointer"}
                        >
                          {data.alamat}
                        </Text>
                      </PopoverTrigger>
                      <Portal>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverBody>
                            <Text fontWeight={500}>{data.alamat}</Text>
                          </PopoverBody>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                  </HStack>
                </VStack>
              </VStack>
            </CContainer>

            <VStack
              flex={"1 1 500px"}
              gap={responsiveSpacing}
              borderRadius={12}
              overflowY={"auto"}
              minH={"300px"}
              maxH={"calc(100vh - 88px - 24px)"}
              className="noScroll"
            >
              <CContainer
                py={responsiveSpacing}
                bg={bodyColor}
                borderRadius={12}
                gap={responsiveSpacing}
                overflowY={"auto"}
              >
                <Wrap px={responsiveSpacing}>
                  <SearchComponent search={search} setSearch={setSearch} />

                  <Button
                    flex={"1 1 120px"}
                    leftIcon={<Icon as={RiUserHeartFill} fontSize={iconSize} />}
                    colorScheme="ap"
                    variant={"outline"}
                    as={Link}
                    to={`/karyawan/keluarga-karyawan/${data.id}`}
                    className="clicky"
                  >
                    Data Keluarga
                  </Button>

                  <Button
                    flex={"1 1 80px"}
                    leftIcon={<Icon as={RiEditBoxFill} fontSize={iconSize} />}
                    colorScheme="ap"
                    className="btn-ap clicky"
                    as={Link}
                    to={`/karyawan/${data.id}/edit`}
                    pl={3}
                  >
                    Edit
                  </Button>
                </Wrap>

                <VStack
                  align={"stretch"}
                  gap={responsiveSpacing}
                  overflowY={"auto"}
                  className="scrollY"
                  px={responsiveSpacing}
                >
                  <VStack align={"stretch"} gap={0}>
                    <Text fontSize={20} fontWeight={600} mb={4}>
                      Data Kesehatan
                    </Text>

                    <VStack align={"stretch"} gap={4}>
                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>No. Rekam Medis</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="No. Rekam Medis"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.no_rm}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>No. Manulife</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="No. Manulife"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.no_manulife}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>No. BPJS Kesehatan</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="No. BPJS Kesehatan"
                        />
                        <FlexLine />
                        <HStack>
                          <SmallLink to="#">Lihat</SmallLink>
                          <Text fontWeight={500} textAlign={"right"}>
                            {data.no_bpjsksh}
                          </Text>
                        </HStack>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>No. BPJS Ketenagakerjaan</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="No. BPJS Ketenagakerjaan"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.no_bpjsktk}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Tinggi Badan</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Tinggi Badan"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.tinggi_badan} cm
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Berat Badan</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Berat Badan"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.berat_badan} kg
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Golongan Darah</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Golongan Darah"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.golongan_darah}
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>

                  <VStack align={"stretch"} gap={0}>
                    <Text fontSize={20} fontWeight={600} mb={4}>
                      Data Pekerjaan
                    </Text>

                    <VStack align={"stretch"} gap={4}>
                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Tanggal Masuk</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Tanggal Masuk"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {formatDate(data.tgl_masuk)}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Tanggal Keluar</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Tanggal Keluar"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {formatDate(data.tgl_keluar)}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Tanggal Diangkat</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Tanggal Diangkat"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {formatDate(data.tgl_diangkat)}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Masa Kerja</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Masa Kerja"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {formatMasaKerja(data.masa_kerja)}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Unit Kerja</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Unit Kerja"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.unit_kerja.nama_unit}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Jabatan</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Jabatan"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.jabatan.nama_jabatan}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Kompetensi</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Kompetensi"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.kompetensi.nama_kompetensi}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Status Kepegawaian</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Status Kepegawaian"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.status_karyawan.label}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Tanggal Berakhir PKS</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Tanggal Berakhir PKS"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {formatDate(data.tgl_berakhir_pks)}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Masa Diklat</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Masa Diklat"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {formatMasaKerja(data.masa_diklat)}
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>

                  <VStack align={"stretch"} gap={0}>
                    <Text fontSize={20} fontWeight={600} mb={4}>
                      Data Pendidikan dan Sertifikat
                    </Text>

                    <VStack align={"stretch"} gap={4}>
                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>No. Ijazah</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="No. Ijazah"
                        />
                        <FlexLine />
                        <HStack>
                          <SmallLink to="#">Lihat</SmallLink>
                          <Text fontWeight={500} textAlign={"right"}>
                            {data.no_ijazah}
                          </Text>
                        </HStack>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Tahun Lulus</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Tahun Lulus"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.tahun_lulus}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>No. STR</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="No. STR"
                        />
                        <FlexLine />
                        <HStack>
                          <SmallLink to="#">Lihat</SmallLink>
                          <Text fontWeight={500} textAlign={"right"}>
                            {data.no_str}
                          </Text>
                        </HStack>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Masa Berlaku STR</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Masa Berlaku STR"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {formatDate(data.masa_berlaku_str)}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>No. SIP</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="No. SIP"
                        />
                        <FlexLine />
                        <HStack>
                          <SmallLink to="#">Lihat</SmallLink>
                          <Text fontWeight={500} textAlign={"right"}>
                            {data.no_sip}
                          </Text>
                        </HStack>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Masa Berlaku SIP</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Masa Berlaku SIP"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {formatDate(data.masa_berlaku_sip)}
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>

                  <VStack align={"stretch"} gap={0}>
                    <Text fontSize={20} fontWeight={600} mb={4}>
                      Data Keuangan
                    </Text>

                    <VStack align={"stretch"} gap={4}>
                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Kelompok Gaji</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Kelompok Gaji"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.kelompok_gaji.nama_kelompok}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Gaji</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Gaji"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          Rp {formatNumber(data.kelompok_gaji.besaran_gaji)}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>NPWP</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="NPWP"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.npwp}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>No. Rekening</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="No. Rekening"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.no_rekening}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Kode PTKP</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Kode PTKP"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          {data.ptkp.kode_ptkp}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Uang Makan</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Uang Makan"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          Rp {formatNumber(data.uang_makan)}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Uang Lembur</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Uang Lembur"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          Rp {formatNumber(data.uang_lembur)}
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>

                  <VStack align={"stretch"} gap={0}>
                    <Text fontSize={20} fontWeight={600} mb={4}>
                      Data Tunjangan
                    </Text>

                    <VStack align={"stretch"} gap={4}>
                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Jabatan</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Jabatan"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          Rp {formatNumber(data.tunjangan_jabatan)}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Fungsional</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Fungsional"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          Rp {formatNumber(data.tunjangan_fungsional)}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Khusus</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Khusus"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          Rp {formatNumber(data.tunjangan_khusus)}
                        </Text>
                      </HStack>

                      <HStack justify={"space-between"}>
                        {/* <Text opacity={0.6}>Lainnya</Text> */}
                        <Highlighter
                          highlightClassName="hw"
                          unhighlightClassName="uw"
                          searchWords={searchQuery}
                          autoEscape={true}
                          textToHighlight="Lainnya"
                        />
                        <FlexLine />
                        <Text fontWeight={500} textAlign={"right"}>
                          Rp {formatNumber(data.tunjangan_lainnya)}
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </VStack>
              </CContainer>
            </VStack>
          </Wrap>
        </>
      )}
    </CWrapper>
  );
}
