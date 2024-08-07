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
import req from "../../constant/req";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";
import PeriodPickerModal from "./input/PeriodPickerModal";

interface Props extends ButtonProps {}

export default function ExportPresensiModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`export-modal-${1}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const today = new Date();
  const [bulan, setBulan] = useState<number>(today.getMonth());
  const [tahun, setTahun] = useState<number>(today.getFullYear());

  const handleExport = () => {
    setLoading(true);
    const payload = { month: bulan + 1, year: tahun };
    req
      .post("/api/rski/dashboard/presensi/export", payload, {
        responseType: "blob",
      })
      .then((r) => {
        if (r.status === 200) {
          // Membuat URL dari Blob
          const url = window.URL.createObjectURL(new Blob([r.data]));

          // Membuat elemen <a> untuk mengunduh file
          const link = document.createElement("a");
          link.href = url;

          // Mendapatkan nama file dari header Content-Disposition
          const contentDisposition = r.headers["content-disposition"];
          const fileName = contentDisposition
            ? contentDisposition
                .split("filename=")[1]
                .split(";")[0]
                .replace(/"/g, "")
            : "RSKI - Data Karyawan";

          link.download = fileName;
          document.body.appendChild(link);
          link.click();

          // Membersihkan URL objek
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
          }, 100);
        } else {
          toast({
            status: "error",
            title: "Maaf terjadi kesalahan pada sistem",
            position: "bottom-right",
            isClosable: true,
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
            title: "Maaf terjadi kesalahan pada sistem",
            position: "bottom-right",
            isClosable: true,
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
            <DisclosureHeader title={"Export Presensi"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.6}>Apakah anda yakin akan export tabel ini?</Text>
          </ModalBody>
          <ModalFooter>
            <CContainer gap={2}>
              <PeriodPickerModal
                id="periode-picker-for-export-presensi"
                name="periode export presensi"
                bulan={bulan}
                setBulan={setBulan}
                tahun={tahun}
                setTahun={setTahun}
              />
              <ButtonGroup>
                <Button
                  w={"100%"}
                  className="btn-solid clicky"
                  onClick={backOnClose}
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
