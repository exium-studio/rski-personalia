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
import { endOfWeek, startOfWeek } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Interface__SelectOption } from "../../constant/interfaces";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import download from "../../lib/download";
import formatDate from "../../lib/formatDate";
import req from "../../lib/req";
import CContainer from "../wrapper/CContainer";
import SelectJenisKaryawan from "./_Select/SelectJenisKaryawan";
import DisclosureHeader from "./DisclosureHeader";
import DateRangePickerModal from "./input/DateRangePickerModal";

interface Props extends ButtonProps {}

export default function ExportJadwalModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`export-modal-${1}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [jenisKaryawan, setJenisKaryawan] = useState<
    Interface__SelectOption | undefined
  >({ value: 1, label: "Shift" });

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const today = new Date();
  const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
  const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });
  const defaultRangeTgl = {
    from: startOfWeekDate,
    to: endOfWeekDate,
  };
  const defaultDateRangeFilterConfig = {
    tgl_mulai: defaultRangeTgl?.from,
    tgl_selesai: defaultRangeTgl?.to,
  };
  const defaultDateRangeFilterConfigRef = useRef(defaultDateRangeFilterConfig);
  const [dateRange, setDateRange] = useState<any>(defaultDateRangeFilterConfig);
  const confirmDateRange = (
    inputValue: { from: Date; to: Date } | undefined
  ) => {
    setDateRange({
      tgl_mulai: inputValue?.from,
      tgl_selesai: inputValue?.to,
    });
  };

  const handleExport = () => {
    setLoading(true);

    let url = "";
    if (jenisKaryawan?.value === 1) {
      url = `api/rski/dashboard/jadwal-karyawan/export-shift`;
    } else if (jenisKaryawan?.value === 0) {
      url = `api/rski/dashboard/jadwal-karyawan/export-non-shift`;
    }

    const payload = {
      tgl_mulai: formatDate(dateRange?.tgl_mulai, "short"),
      tgl_selesai: formatDate(dateRange?.tgl_selesai, "short"),
    };

    req
      .post(url, payload, {
        responseType: "blob", // Penting untuk menangani file biner
      })
      .then((r) => {
        if (r.status === 200) {
          download(
            r.data,
            `Export Jadwal ${
              jenisKaryawan?.value === 1
                ? "Shift"
                : jenisKaryawan?.value === 0
                ? "Non-Shift"
                : ""
            }`,
            "xls"
          );
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
        toast({
          status: "error",
          title:
            (typeof e?.response?.data?.message === "string" &&
              (e?.response?.data?.message as string)) ||
            "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
          isClosable: true,
          position: "bottom-right",
        });
      })
      .finally(() => {
        backOnClose();
        setLoading(false);
      });
  };

  useEffect(() => {
    const jenisKaryawanValue = jenisKaryawan?.value;
    if (jenisKaryawanValue === 1) {
      setDateRange(defaultDateRangeFilterConfigRef?.current);
    } else {
      setDateRange(undefined);
    }
  }, [jenisKaryawan]);

  return (
    <>
      <Button
        minW={"120px"}
        className="btn-outline clicky"
        leftIcon={<Icon as={RiUploadLine} fontSize={iconSize} />}
        pl={5}
        onClick={onOpen}
        {...props}
      >
        Export
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          setJenisKaryawan(undefined);
        }}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader
              title={"Export Jadwal"}
              onClose={() => {
                setJenisKaryawan(undefined);
              }}
            />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.6}>Apakah anda yakin akan export tabel ini?</Text>
          </ModalBody>

          <ModalFooter>
            <CContainer gap={2}>
              <CContainer gap={2}>
                <SelectJenisKaryawan
                  name="jenis-karyawan"
                  onConfirm={(input) => {
                    setJenisKaryawan(input);
                  }}
                  inputValue={jenisKaryawan}
                  nonNullable
                />
                <DateRangePickerModal
                  id="jadwal-date-range"
                  name="date-range"
                  minW={"165px"}
                  w={"100%"}
                  onConfirm={confirmDateRange}
                  inputValue={{
                    from: dateRange?.tgl_mulai,
                    to: dateRange?.tgl_selesai,
                  }}
                  maxRange={31}
                  nonNullable
                  presetsConfig={["thisWeek", "thisMonth"]}
                  isDisabled={jenisKaryawan?.value === 0}
                />
              </CContainer>

              <ButtonGroup>
                <Button
                  w={"100%"}
                  className="btn-solid clicky"
                  onClick={() => {
                    backOnClose();
                    setJenisKaryawan(undefined);
                  }}
                  isDisabled={loading || jenisKaryawan === undefined}
                >
                  Tidak
                </Button>
                <Button
                  w={"100%"}
                  className="btn-ap clicky"
                  colorScheme="ap"
                  isDisabled={jenisKaryawan === undefined}
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
