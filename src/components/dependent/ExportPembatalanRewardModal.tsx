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
import useFilterKaryawanExportPembatalanReward from "../../global/useFilterKaryawanExportPembatalanReward";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import download from "../../lib/download";
import req from "../../lib/req";
import FilterKaryawanForExport from "../independent/FilterKaryawanForExport";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";

interface Props extends ButtonProps {}

export default function ExportPembatalanRewardModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`export-modal-${1}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const {
    defaultFilterKaryawan,
    filterKaryawan,
    setFilterKaryawan,
    formattedFilterKaryawan,
    setFormattedFilterKaryawan,
  } = useFilterKaryawanExportPembatalanReward();

  const handleExport = () => {
    setLoading(true);
    const payload = {
      ...formattedFilterKaryawan,
    };
    req
      .post("/api/rski/dashboard/presensi/history-reward/export", payload, {
        responseType: "blob",
      })
      .then((r) => {
        if (r?.status === 200) {
          download(r.data, `Data Pembatalan Reward`, "xls");
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
        if (e.response?.status === 404) {
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
            <DisclosureHeader title={"Export Reward"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.6}>
              Apakah anda yakin akan export (excel) semua data pada tabel ini?
            </Text>
          </ModalBody>
          <ModalFooter>
            <CContainer gap={2}>
              <FilterKaryawanForExport
                id="filter-karyawan-export-reward-presensi"
                defaultFilterKaryawan={defaultFilterKaryawan}
                filterKaryawan={filterKaryawan}
                setFilterKaryawan={setFilterKaryawan}
                setFormattedFilterKaryawan={setFormattedFilterKaryawan}
              />

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
