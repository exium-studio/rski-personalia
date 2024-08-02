import {
  Box,
  Button,
  ButtonGroup,
  ButtonProps,
  HStack,
  Icon,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { RiLogoutBoxLine, RiRestartLine } from "@remixicon/react";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import DisclosureHeader from "../../components/dependent/DisclosureHeader";
import NotificationModal from "../../components/independent/NotificationModal";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useLightDarkColor } from "../../constant/colors";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useGetUserData from "../../hooks/useGetUserData";
import useLogout from "../../hooks/useLogout";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import FlexLine from "../../components/independent/FlexLine";
import JenisKaryawanBadge from "../../components/dependent/JenisKaryawanBadge";
import SmallLink from "../../components/dependent/SmallLink";
import formatMasaKerja from "../../lib/formatMasaKerja";
import formatNumber from "../../lib/formatNumber";

interface LogoutProps extends ButtonProps {}

const LogoutConfirmation = ({ ...props }: LogoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("profile-logout-confirmation-modal", isOpen, onOpen, onClose);

  const { logout, logoutLoading } = useLogout();

  // SX

  return (
    <>
      <Button
        leftIcon={
          <Icon
            as={RiLogoutBoxLine}
            fontSize={iconSize}
            transform={"rotate(180deg)"}
          />
        }
        colorScheme="red"
        variant={"ghost"}
        size={"lg"}
        onClick={onOpen}
        className="clicky"
        {...props}
      >
        Keluar
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Keluar"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.4}>Apakah anda yakin akan keluar akun?</Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              onClick={backOnClose}
              isDisabled={logoutLoading}
            >
              Tidak
            </Button>
            <Button
              w={"100%"}
              className="clicky"
              colorScheme="red"
              onClick={logout}
              isLoading={logoutLoading}
            >
              Ya
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default function Profil() {
  // SX
  const lightDarkColor = useLightDarkColor();

  const userData = useGetUserData();
  console.log(userData);

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

  return (
    <CWrapper p={"0 !important"} position={"relative"}>
      <Stack
        flexShrink={0}
        zIndex={2}
        flexDir={["column", null, null, "row"]}
        flex={1}
        align={"stretch"}
        gap={0}
        overflowY={"auto"}
      >
        <VStack
          p={responsiveSpacing}
          pt={"0 !important"}
          gap={0}
          animation={"flyInFromTop 500ms ease"}
          minW={"400px"}
        >
          <>
            <Box minW={"50px"} flex={"1 1 50px"} bg={"#353535"} mx={"auto"} />

            <Box
              flexShrink={0}
              w={"65px"}
              h={"20px"}
              bg={"#353535"}
              mx={"auto"}
              p={1}
              borderRadius={"full"}
            >
              <Box
                w={"100%"}
                h={"100%"}
                bg={lightDarkColor}
                borderRadius={"full"}
              />
            </Box>

            <Box
              flexShrink={0}
              mt={"-5px"}
              mb={"-10px"}
              w={"16px"}
              h={"30px"}
              bg={"gray"}
              mx={"auto"}
              borderRadius={"2px"}
              zIndex={3}
            />

            <Box
              flexShrink={0}
              w={"200px"}
              h={"16px"}
              bg={"p.500"}
              mx={"auto"}
              p={1}
              borderRadius={"100px 100px 0 0"}
              border={"1px solid var(--divider3)"}
              borderBottom={"none !important"}
              zIndex={2}
              mb={"-2px"}
            >
              <Box
                mt={"2px"}
                w={"50px"}
                h={"8px"}
                bg={"p.600"}
                borderRadius={"full"}
                mx={"auto"}
              />
            </Box>
          </>

          <Box m={"auto"} flex={1}>
            <Box position={"relative"}>
              <CContainer
                bg={"p.500"}
                borderRadius={12}
                position={"relative"}
                overflowY={"auto"}
                className="admin-card"
                w={"300px"}
                mb={responsiveSpacing}
                p={1}
                border={"1px solid var(--divider3)"}
              >
                <CContainer flex={"1 1 150px"} gap={responsiveSpacing}>
                  <Image
                    src={
                      userData?.foto_profil ||
                      "/images/defaultProfilePhoto.webp"
                    }
                    aspectRatio={1}
                    borderRadius={"8px 8px 0 0"}
                    boxSize={"289.61x"}
                  />
                </CContainer>

                <CContainer
                  p={responsiveSpacing}
                  bg={"white"}
                  color={"dark"}
                  borderRadius={"0 0 8px 8px"}
                  border={"1px solid var(--divider3)"}
                  position={"relative"}
                  overflow={"clip"}
                >
                  <Text fontWeight={600} fontSize={20}>
                    {userData.nama}
                  </Text>

                  <Text opacity={0.4}>{userData.role.name}</Text>

                  <HStack align={"end"} mt={12}>
                    <Text fontSize={14}>{userData?.email}</Text>
                  </HStack>

                  <Image
                    src="/logo512.png"
                    position={"absolute"}
                    bottom={-16}
                    right={-16}
                    w={"200px"}
                    opacity={0.1}
                  />
                </CContainer>
              </CContainer>

              <Box
                w={"100px"}
                h={"5px"}
                bg={"p.600"}
                position={"absolute"}
                bottom={"0"}
                left={"50%"}
                transform={"translateX(-50%)"}
                zIndex={99}
              ></Box>
            </Box>
          </Box>

          <VStack flex={1}>
            <LogoutConfirmation w={"300px"} mb={"auto"} mx={"auto"} />
          </VStack>
        </VStack>

        <CContainer
          flexShrink={0}
          p={responsiveSpacing}
          flex={1}
          gap={responsiveSpacing}
          overflowY={[null, null, null, "auto"]}
        >
          <HStack justify={"space-between"} gap={responsiveSpacing}>
            <Text fontWeight={600} fontSize={18}>
              {formatDate(new Date(), "long")}
            </Text>

            <ButtonGroup>
              <IconButton
                aria-label="refresh button"
                className="btn-solid clicky"
                icon={
                  <Icon
                    as={RiRestartLine}
                    fontSize={20}
                    onClick={() => {
                      window.location.reload();
                    }}
                  />
                }
              />

              <NotificationModal aria-label="Notification Button" />

              <ColorModeSwitcher className="btn-solid clicky" />
            </ButtonGroup>
          </HStack>

          <CContainer
            flex={1}
            borderRadius={12}
            bg={lightDarkColor}
            overflowY={"auto"}
          >
            <HStack p={responsiveSpacing}>
              <SearchComponent
                name="search"
                onChangeSetter={(input) => {
                  setSearch(input);
                }}
                inputValue={search}
              />
            </HStack>

            <CContainer
              flex={1}
              overflowY={"auto"}
              className="scrollY"
              bg={lightDarkColor}
              gap={responsiveSpacing}
              p={responsiveSpacing}
              pt={"0 !important"}
            >
              <VStack align={"stretch"} gap={0}>
                <Text fontSize={20} fontWeight={600} mb={4}>
                  Data Pribadi
                </Text>

                <VStack
                  align={"stretch"}
                  w={"100%"}
                  gap={4}
                  minH={"150px"}
                  // bg={"red"}
                >
                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Email</Text> */}
                    <Box opacity={0.6}>
                      <Highlighter
                        highlightClassName="hw"
                        unhighlightClassName="uw"
                        searchWords={searchQuery}
                        autoEscape={true}
                        textToHighlight="Jenis Pegawai"
                      />
                    </Box>
                    <FlexLine />
                    <JenisKaryawanBadge
                      data={userData.data_karyawan.unit_kerja?.jenis_karyawan}
                    />
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>No. Induk Karyawan</Text> */}
                    <Box opacity={0.6}>
                      <Highlighter
                        highlightClassName="hw"
                        unhighlightClassName="uw"
                        searchWords={searchQuery}
                        autoEscape={true}
                        textToHighlight="Username Akun"
                      />
                    </Box>
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      {userData.data_karyawan.user?.username}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Email</Text> */}
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
                      {userData.data_karyawan?.email}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>No. Induk Karyawan</Text> */}
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
                      {userData.data_karyawan?.nik}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>NIK KTP</Text> */}
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
                      <SmallLink to="#">Lihat</SmallLink>
                      <Text fontWeight={500} textAlign={"right"}>
                        {userData.data_karyawan?.nik_ktp}
                      </Text>
                    </HStack>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>No. KK</Text> */}
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
                      <SmallLink to="#">Lihat</SmallLink>
                      <Text fontWeight={500} textAlign={"right"}>
                        {userData.data_karyawan?.no_kk}
                      </Text>
                    </HStack>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>No. HP</Text> */}
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
                      {userData.data_karyawan.no_hp}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Tempat Lahir</Text> */}
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
                      {userData.data_karyawan.tempat_lahir}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Tanggal Lahir</Text> */}
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
                      {formatDate(userData.data_karyawan.tgl_lahir)}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Jenis Kelamin</Text> */}
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
                      {userData.data_karyawan.jenis_kelamin?.label}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Agama</Text> */}
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
                      {userData.data_karyawan.agama?.label}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Gelar Depan</Text> */}
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
                      {userData.data_karyawan?.gelar_depan}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Alamat</Text> */}
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
                    <Tooltip label={userData.data_karyawan.alamat}>
                      <Text
                        fontWeight={500}
                        noOfLines={1}
                        maxW={"180px"}
                        cursor={"pointer"}
                      >
                        {userData.data_karyawan.alamat}
                      </Text>
                    </Tooltip>
                  </HStack>
                </VStack>
              </VStack>

              <VStack align={"stretch"} gap={0}>
                <Text fontSize={20} fontWeight={600} mb={4}>
                  Data Kesehatan
                </Text>

                <VStack align={"stretch"} gap={4}>
                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>No. Rekam Medis</Text> */}
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
                      {userData.data_karyawan.no_rm}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>No. Manulife</Text> */}
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
                      {userData.data_karyawan.no_manulife}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>No. BPJS Kesehatan</Text> */}
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
                      <SmallLink to="#">Lihat</SmallLink>
                      <Text fontWeight={500} textAlign={"right"}>
                        {userData.data_karyawan.no_bpjsksh}
                      </Text>
                    </HStack>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>No. BPJS Ketenagakerjaan</Text> */}
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
                    <Text fontWeight={500} textAlign={"right"}>
                      {userData.data_karyawan.no_bpjsktk}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Tinggi Badan</Text> */}
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
                    <Text fontWeight={500} textAlign={"right"}>
                      {userData.data_karyawan.tinggi_badan} cm
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Berat Badan</Text> */}
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
                    <Text fontWeight={500} textAlign={"right"}>
                      {userData.data_karyawan.berat_badan} kg
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Golongan Darah</Text> */}
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
                      {userData.data_karyawan.golongan_darah?.label}
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
                      {formatDate(userData.data_karyawan.tgl_masuk)}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Tanggal Keluar</Text> */}
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
                      {formatDate(userData.data_karyawan.tgl_keluar)}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Tanggal Diangkat</Text> */}
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
                      {formatDate(userData.data_karyawan.tgl_diangkat)}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Masa Kerja</Text> */}
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
                      {formatMasaKerja(userData.data_karyawan.masa_kerja)}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Unit Kerja</Text> */}
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
                      {userData.data_karyawan.unit_kerja?.nama_unit}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Jabatan</Text> */}
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
                      {userData.data_karyawan.jabatan?.nama_jabatan}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Kompetensi</Text> */}
                    <Box opacity={0.6}>
                      <Highlighter
                        highlightClassName="hw"
                        unhighlightClassName="uw"
                        searchWords={searchQuery}
                        autoEscape={true}
                        textToHighlight="Kompetensi"
                      />
                    </Box>
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      {userData.data_karyawan.kompetensi?.nama_kompetensi}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Status Kepegawaian</Text> */}
                    <Box opacity={0.6}>
                      <Highlighter
                        highlightClassName="hw"
                        unhighlightClassName="uw"
                        searchWords={searchQuery}
                        autoEscape={true}
                        textToHighlight="Status Kepegawaian"
                      />
                    </Box>
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      {userData.data_karyawan.status_karyawan?.label}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Tanggal Berakhir PKS</Text> */}
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
                      {formatDate(userData.data_karyawan.tgl_berakhir_pks)}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Masa Diklat</Text> */}
                    <Box opacity={0.6}>
                      <Highlighter
                        highlightClassName="hw"
                        unhighlightClassName="uw"
                        searchWords={searchQuery}
                        autoEscape={true}
                        textToHighlight="Masa Diklat"
                      />
                    </Box>
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      {formatMasaKerja(userData.data_karyawan.masa_diklat)}
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
                    <Box opacity={0.6}>
                      <Highlighter
                        highlightClassName="hw"
                        unhighlightClassName="uw"
                        searchWords={searchQuery}
                        autoEscape={true}
                        textToHighlight="No. Ijazah"
                      />
                    </Box>
                    <FlexLine />
                    <HStack>
                      <SmallLink to="#">Lihat</SmallLink>
                      <Text fontWeight={500} textAlign={"right"}>
                        {userData.data_karyawan.no_ijazah}
                      </Text>
                    </HStack>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Tahun Lulus</Text> */}
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
                      {userData.data_karyawan.tahun_lulus}
                    </Text>
                  </HStack>

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
                      <SmallLink to="#">Lihat</SmallLink>
                      <Text fontWeight={500} textAlign={"right"}>
                        {userData.data_karyawan.no_str}
                      </Text>
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
                      {formatDate(userData.data_karyawan.masa_berlaku_str)}
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
                      <SmallLink to="#">Lihat</SmallLink>
                      <Text fontWeight={500} textAlign={"right"}>
                        {userData.data_karyawan.no_sip}
                      </Text>
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
                      {formatDate(userData.data_karyawan.masa_berlaku_sip)}
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
                      {userData.data_karyawan.kelompok_gaji?.nama_kelompok}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Gaji</Text> */}
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
                      Rp{" "}
                      {formatNumber(
                        userData.data_karyawan.kelompok_gaji?.besaran_gaji
                      )}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>NPWP</Text> */}
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
                      {userData.data_karyawan.npwp}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>No. Rekening</Text> */}
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
                      {userData.data_karyawan.no_rekening}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Kode PTKP</Text> */}
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
                      {userData.data_karyawan.ptkp?.kode_ptkp}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Uang Makan</Text> */}
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
                      Rp {formatNumber(userData.data_karyawan.uang_makan)}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Uang Lembur</Text> */}
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
                      Rp {formatNumber(userData.data_karyawan.uang_lembur)}
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
                      Rp{" "}
                      {formatNumber(userData.data_karyawan.tunjangan_jabatan)}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Fungsional</Text> */}
                    <Box opacity={0.6}>
                      <Highlighter
                        highlightClassName="hw"
                        unhighlightClassName="uw"
                        searchWords={searchQuery}
                        autoEscape={true}
                        textToHighlight="Fungsional"
                      />
                    </Box>
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      Rp{" "}
                      {formatNumber(
                        userData.data_karyawan.tunjangan_fungsional
                      )}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Khusus</Text> */}
                    <Box opacity={0.6}>
                      <Highlighter
                        highlightClassName="hw"
                        unhighlightClassName="uw"
                        searchWords={searchQuery}
                        autoEscape={true}
                        textToHighlight="Khusus"
                      />
                    </Box>
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      Rp {formatNumber(userData.data_karyawan.tunjangan_khusus)}
                    </Text>
                  </HStack>

                  <HStack justify={"space-between"}>
                    {/* <Text opacity={0.6}>Lainnya</Text> */}
                    <Box opacity={0.6}>
                      <Highlighter
                        highlightClassName="hw"
                        unhighlightClassName="uw"
                        searchWords={searchQuery}
                        autoEscape={true}
                        textToHighlight="Lainnya"
                      />
                    </Box>
                    <FlexLine />
                    <Text fontWeight={500} textAlign={"right"}>
                      Rp{" "}
                      {formatNumber(userData.data_karyawan.tunjangan_lainnya)}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </CContainer>
          </CContainer>
        </CContainer>
      </Stack>
    </CWrapper>
  );
}
