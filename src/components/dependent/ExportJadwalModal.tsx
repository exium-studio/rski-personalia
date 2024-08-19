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
import { Interface__SelectOption } from "../../constant/interfaces";
import req from "../../constant/req";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import download from "../../lib/download";
import CContainer from "../wrapper/CContainer";
import SelectJenisKaryawan from "./_Select/SelectJenisKaryawan";
import DisclosureHeader from "./DisclosureHeader";

interface Props extends ButtonProps {}

export default function ExportJadwalModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`export-modal-${1}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [jenisKaryawan, setJenisKaryawan] = useState<
    Interface__SelectOption | undefined
  >(undefined);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleExport = () => {
    setLoading(true);

    let url = "";
    if (jenisKaryawan?.value === 1) {
      url = `api/rski/dashboard/jadwal-karyawan/export-shift`;
    } else if (jenisKaryawan?.value === 0) {
      url = `api/rski/dashboard/jadwal-karyawan/export-non-shift`;
    }

    req
      .get(url, {
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
            title: "Maaf terjadi kesalahan pada sistem",
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
            "Maaf terjadi kesalahan pada sistem",
          isClosable: true,
          position: "bottom-right",
        });
      })
      .finally(() => {
        backOnClose();
        setLoading(false);
      });
  };

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
        onClose={backOnClose}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title={"Export Jadwal"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.6}>Apakah anda yakin akan export tabel ini?</Text>
          </ModalBody>
          <ModalFooter>
            <CContainer gap={2}>
              <SelectJenisKaryawan
                name="jenis_karyawan"
                onConfirm={(input) => {
                  setJenisKaryawan(input);
                }}
                inputValue={jenisKaryawan}
              />
              <ButtonGroup>
                <Button
                  w={"100%"}
                  className="btn-solid clicky"
                  onClick={backOnClose}
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
