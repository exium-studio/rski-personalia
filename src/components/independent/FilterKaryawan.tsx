import {
  Accordion,
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ButtonGroup,
  ButtonProps,
  Center,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiEqualizer3Fill } from "@remixicon/react";
import { useRef, useState } from "react";
import { useLightDarkColor } from "../../constant/colors";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useBackOnClose from "../../hooks/useBackOnClose";
import useCallBackOnNavigate from "../../hooks/useCallBackOnNavigate";
import backOnClose from "../../lib/backOnClose";
import formatNumber from "../../lib/formatNumber";
import formattedFilterKaryawanReducer from "../../lib/formattedFilterKaryawanReducer";
import FilterAgama from "../dependent/_FilterOptions/FilterAgama";
import FilterJebatan from "../dependent/_FilterOptions/FilterJabatan";
import FilterJenisKelamin from "../dependent/_FilterOptions/FilterJenisKelamin";
import FilterJenisPegawai from "../dependent/_FilterOptions/FilterJenisPegawai";
import FilterMasaKerja from "../dependent/_FilterOptions/FilterMasaKerja";
import FilterStatusAktif from "../dependent/_FilterOptions/FilterStatusAktif";
import FilterStatusKaryawan from "../dependent/_FilterOptions/FilterStatusKaryawan";
import FilterTglMasuk from "../dependent/_FilterOptions/FilterTglMasuk";
import FilterUnitKerja from "../dependent/_FilterOptions/FilterUnitKerja";
import DisclosureHeader from "../dependent/DisclosureHeader";
import FilterPendidikanTerakhir from "../dependent/_FilterOptions/FilterPendidikanTerakhir";
import { useLocation } from "react-router-dom";
import FilterJenisKompetensi from "../dependent/_FilterOptions/FilterJenisKompetensi";
import formatDate from "../../lib/formatDate";

interface Props extends ButtonProps {
  title?: string;
}

export default function FilterKaryawan({ title, ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("filter-karyawan", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const { pathname } = useLocation();

  const {
    defaultFilterKaryawan,
    filterKaryawan,
    setFilterKaryawan,
    // formattedFilterKaryawan,
    setFormattedFilterKaryawan,
    clearFormattedFilterKaryawan,
  } = useFilterKaryawan();

  const [localFilterConfig, setLocalFilterConfig] = useState<any | null>(
    filterKaryawan
  );

  function filterCount(values: any) {
    let count = 0;

    if (values.unit_kerja && values.unit_kerja.length > 0) {
      count += values.unit_kerja.length;
    }
    if (values.jenis_karyawan && values.jenis_karyawan.length > 0) {
      count += values.jenis_karyawan.length;
    }
    if (values.jenis_kompetensi && values.jenis_kompetensi.length > 0) {
      count += values.jenis_kompetensi.length;
    }
    if (values.jabatan && values.jabatan.length > 0) {
      count += values.jabatan.length;
    }
    if (values.status_karyawan && values.status_karyawan.length > 0) {
      count += values.status_karyawan.length;
    }
    if (values.masa_kerja && values.masa_kerja.length > 0) {
      count += values.masa_kerja.length;
    }
    if (values.status_aktif && values.status_aktif.length > 0) {
      count += values.status_aktif.length;
    }
    if (values.tgl_masuk && values.tgl_masuk.length > 0) {
      count += values.tgl_masuk.length;
    }
    if (values.agama && values.agama.length > 0) {
      count += values.agama.length;
    }
    if (values.jenis_kelamin && values.jenis_kelamin.length > 0) {
      count += values.jenis_kelamin.length;
    }
    if (values.pendidikan_terakhir && values.pendidikan_terakhir.length > 0) {
      count += values.pendidikan_terakhir.length;
    }
    return count;
  }

  function handleApplyFilter() {
    const formattedFilters = {
      search: localFilterConfig.search,
      unit_kerja: localFilterConfig.unit_kerja.map((item: any) => item.id),
      jenis_karyawan: localFilterConfig.jenis_karyawan.map(
        (item: any) => item.value
      ),
      jenis_kompetensi: localFilterConfig.jenis_kompetensi.map(
        (item: any) => item.value
      ),
      jabatan: localFilterConfig.jabatan.map((item: any) => item.id),
      status_karyawan: localFilterConfig.status_karyawan.map(
        (item: any) => item.value
      ),
      masa_kerja: localFilterConfig.masa_kerja,
      status_aktif: localFilterConfig.status_aktif.map(
        (item: any) => item.value
      ),
      tgl_masuk:
        localFilterConfig.tgl_masuk?.length > 0
          ? [formatDate(localFilterConfig.tgl_masuk?.[0], "short")]
          : [],
      agama: localFilterConfig.agama.map((item: any) => item.value),
      jenis_kelamin: localFilterConfig.jenis_kelamin.map(
        (item: any) => item.value
      ),
      pendidikan_terakhir: localFilterConfig.pendidikan_terakhir.map(
        (item: any) => item.id
      ),
    };

    setFilterKaryawan(localFilterConfig);

    clearFormattedFilterKaryawan();

    setFormattedFilterKaryawan(
      formattedFilterKaryawanReducer(formattedFilters)
    );
  }

  useCallBackOnNavigate(() => {
    setFilterKaryawan(defaultFilterKaryawan);
    clearFormattedFilterKaryawan();
  });

  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <>
      <Button
        className="btn-outline clicky"
        leftIcon={<Icon as={RiEqualizer3Fill} fontSize={iconSize} />}
        flexShrink={0}
        pl={5}
        onClick={() => {
          onOpen();
          setLocalFilterConfig(filterKaryawan);
          // setClear(false);
        }}
        {...props}
      >
        <HStack>
          {filterCount(filterKaryawan) && (
            <Center
              position={"absolute"}
              right={"-6px"}
              top={"-6px"}
              flexShrink={0}
              minW={"20px"}
              h={"20px"}
              borderRadius={"full"}
              bg={"p.500"}
              ml={"auto"}
            >
              <Text color={lightDarkColor} fontSize={12} fontWeight={600}>
                {formatNumber(filterCount(filterKaryawan))}
              </Text>
            </Center>
          )}

          <Text>Filter Kary.</Text>
        </HStack>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        isCentered
        size={"lg"}
        // scrollBehavior="inside"
      >
        <ModalOverlay />

        <ModalContent minW={"328px"}>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title={title || "Filter Karyawan"} />
          </ModalHeader>

          <ModalBody className="scrollY">
            {pathname === "/jadwal" && (
              <Alert mb={responsiveSpacing} alignItems={"start"}>
                <AlertIcon />
                <AlertDescription maxW={"640px !important"}>
                  Jika tidak memiliki akses Bypass Unit Kerja, maka filter unit
                  kerja akan dikunci/tidak bisa dihilangkan sesuai dengan unit
                  kerja anda.
                </AlertDescription>
              </Alert>
            )}

            <Accordion allowToggle>
              <FilterUnitKerja
                filterConfig={localFilterConfig}
                setFilterConfig={setLocalFilterConfig}
              />

              <FilterJenisPegawai
                filterConfig={localFilterConfig}
                setFilterConfig={setLocalFilterConfig}
              />

              <FilterJenisKompetensi
                filterConfig={localFilterConfig}
                setFilterConfig={setLocalFilterConfig}
              />

              <FilterJebatan
                filterConfig={localFilterConfig}
                setFilterConfig={setLocalFilterConfig}
              />

              <FilterStatusKaryawan
                filterConfig={localFilterConfig}
                setFilterConfig={setLocalFilterConfig}
              />

              <FilterMasaKerja
                filterConfig={localFilterConfig}
                setFilterConfig={setLocalFilterConfig}
              />

              <FilterStatusAktif
                filterConfig={localFilterConfig}
                setFilterConfig={setLocalFilterConfig}
              />

              <FilterTglMasuk
                filterConfig={localFilterConfig}
                setFilterConfig={setLocalFilterConfig}
              />

              <FilterAgama
                filterConfig={localFilterConfig}
                setFilterConfig={setLocalFilterConfig}
              />

              <FilterJenisKelamin
                filterConfig={localFilterConfig}
                setFilterConfig={setLocalFilterConfig}
              />

              <FilterPendidikanTerakhir
                filterConfig={localFilterConfig}
                setFilterConfig={setLocalFilterConfig}
              />
            </Accordion>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup w={"100%"}>
              <Button
                w={"50%"}
                className="btn-solid clicky"
                onClick={() => {
                  // console.log("prev search", localFilterConfig?.search);
                  setLocalFilterConfig({
                    ...defaultFilterKaryawan,
                    search: localFilterConfig?.search,
                  });
                  // console.log({
                  //   ...defaultFilterKaryawan,
                  //   search: localFilterConfig?.search,
                  // });
                  // setClear(true);
                }}
              >
                Clear
              </Button>

              <Button
                onClick={() => {
                  handleApplyFilter();
                  backOnClose();
                }}
                w={"50%"}
                colorScheme="ap"
                className="btn-ap clicky"
              >
                Terapkan
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
