import {
  Button,
  ButtonGroup,
  ButtonProps,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiUploadLine } from "@remixicon/react";
import { useRef, useState } from "react";
import { iconSize } from "../../constant/sizes";
import useFilterKaryawanExportCuti from "../../global/useFilterKaryawanExportCuti";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import download from "../../lib/download";
import req from "../../lib/req";
import FilterKaryawanForExport from "../independent/FilterKaryawanForExport";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";

interface Props extends ButtonProps {}

export default function ExportCutiModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`export-modal-${1}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  // const today = new Date();
  // const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
  // const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });
  // const defaultRangeTgl = {
  //   from: startOfWeekDate,
  //   to: endOfWeekDate,
  // };
  const {
    defaultFilterKaryawan,
    filterKaryawan,
    setFilterKaryawan,
    formattedFilterKaryawan,
    setFormattedFilterKaryawan,
  } = useFilterKaryawanExportCuti();

  // Filter Config
  // const defaultFilterConfig = {
  //   tgl_mulai: defaultRangeTgl?.from,
  //   tgl_selesai: defaultRangeTgl?.to,
  // };
  // const [dateRange, setDateRange] = useState<any>(defaultFilterConfig);

  // const confirmDateRange = (
  //   inputValue: { from: Date; to: Date } | undefined
  // ) => {
  //   setDateRange({
  //     tgl_mulai: inputValue?.from,
  //     tgl_selesai: inputValue?.to,
  //   });
  // };

  const handleExport = () => {
    setLoading(true);
    const payload = {
      // tgl_mulai: formatDate(dateRange?.tgl_mulai, "short"),
      // tgl_selesai: formatDate(dateRange?.tgl_selesai, "short"),
      ...formattedFilterKaryawan,
    };
    req
      .post("/api/rski/dashboard/jadwal-karyawan/cuti/export", payload, {
        responseType: "blob",
      })
      .then((r) => {
        if (r.status === 200) {
          download(r.data, `Data Cuti`, "xls");
        } else {
          toast({
            status: "error",
            title:
              "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
            isClosable: true,
            position: "bottom-right",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        if (e.response.status === 404) {
          toast({
            status: "error",
            title: "Data presensi tidak ditemukan untuk periode yang diminta.",
            position: "bottom-right",
            isClosable: true,
          });
        } else {
          toast({
            status: "error",
            title:
              (typeof e?.response?.data?.message === "string" &&
                (e?.response?.data?.message as string)) ||
              "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
            isClosable: true,
            position: "bottom-right",
          });
        }
      })
      .finally(() => {
        backOnClose();
        setLoading(false);
      });
  };

  return (
    <>
      <Button
        // variant={"outline"}
        // colorScheme="ap"
        minW={"120px"}
        className="btn-outline clicky"
        leftIcon={
          <Icon
            as={RiUploadLine}
            fontSize={iconSize}
            // color={chartColors[1]}
            // opacity={0.4}
          />
        }
        pl={5}
        onClick={onOpen}
        {...props}
      >
        Export
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title={"Export Cuti"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.6}>Apakah anda yakin akan export tabel ini?</Text>
          </ModalBody>
          <ModalFooter>
            <CContainer gap={2}>
              {/* <PeriodPickerForDatePickerModal
                id="periode-picker-for-export-presensi"
                name="periode export presensi"
                bulan={bulan}
                setBulan={setBulan}
                tahun={tahun}
                setTahun={setTahun}
              /> */}
              <FilterKaryawanForExport
                id="filter-karyawan-export-presensi"
                defaultFilterKaryawan={defaultFilterKaryawan}
                filterKaryawan={filterKaryawan}
                setFilterKaryawan={setFilterKaryawan}
                setFormattedFilterKaryawan={setFormattedFilterKaryawan}
              />
              {/* <DateRangePickerModal
                id="jadwal-date-range"
                name="date-range"
                minW={"165px"}
                w={"100%"}
                onConfirm={confirmDateRange}
                inputValue={{
                  from: dateRange.tgl_mulai,
                  to: dateRange.tgl_selesai,
                }}
                maxRange={31}
                nonNullable
                presetsConfig={["thisWeek", "thisMonth"]}
              /> */}

              <ButtonGroup>
                <Button
                  w={"100%"}
                  className="btn-solid clicky"
                  onClick={backOnClose}
                  isDisabled={loading}
                >
                  Tidak
                </Button>
                <Button
                  w={"100%"}
                  className="btn-ap clicky"
                  colorScheme="ap"
                  isLoading={loading}
                  onClick={handleExport}
                >
                  Ya
                </Button>
              </ButtonGroup>
            </CContainer>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
