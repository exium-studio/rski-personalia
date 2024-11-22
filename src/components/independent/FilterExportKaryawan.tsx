import {
  Accordion,
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
import { iconSize } from "../../constant/sizes";
import useExportFilterKaryawan from "../../global/useExportFilterKaryawan";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import formatNumber from "../../lib/formatNumber";
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
import formatDate from "../../lib/formatDate";
import FilterJenisKompetensi from "../dependent/_FilterOptions/FilterJenisKompetensi";

interface Props extends ButtonProps {
  title?: string;
}

export default function FilterExportKaryawan({ title, ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("export-filter-karyawan", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const {
    defaultFilterKaryawan,
    filterKaryawan,
    setFilterKaryawan,
    setFormattedFilterKaryawan,
  } = useExportFilterKaryawan();

  const [localFilterConfig, setLocalFilterConfig] = useState<any | null>(
    defaultFilterKaryawan
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
    // Membuat formattedFilters dengan semua filter
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

    // Menghapus properti dengan array kosong kecuali 'search'
    const filteredFilters = Object.entries(formattedFilters)
      .filter(
        ([key, value]) =>
          key === "search" || (Array.isArray(value) && value.length > 0)
      )
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as { [key: string]: any });

    // Mengupdate state dengan filter yang diformat
    setFilterKaryawan(localFilterConfig);
    setFormattedFilterKaryawan(filteredFilters);
    backOnClose();
  }

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

          <Text>Filter Export</Text>
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
            <DisclosureHeader title={title || "Filter Export Karyawan"} />
          </ModalHeader>

          <ModalBody className="scrollY">
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
                  setLocalFilterConfig(defaultFilterKaryawan);
                }}
              >
                Clear
              </Button>

              <Button
                onClick={handleApplyFilter}
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
