import {
  Alert,
  AlertDescription,
  AlertIcon,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  RiCalendarCheckLine,
  RiCalendarScheduleLine,
  RiUploadLine,
} from "@remixicon/react";
import { useRef, useState } from "react";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import download from "../../lib/download";
import req from "../../lib/req";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";

interface Props extends ButtonProps {}

export default function ExportJadwalModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`export-modal-${1}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [jenisKaryawan, setJenisKaryawan] = useState<number | undefined>(
    undefined
  );

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleExport = () => {
    setLoading(true);

    let url = "";
    if (jenisKaryawan === 1) {
      url = `api/rski/dashboard/jadwal-karyawan/export-shift`;
    } else if (jenisKaryawan === 0) {
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
              jenisKaryawan === 1
                ? "Shift"
                : jenisKaryawan === 0
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
            <CContainer gap={2}>
              <Alert status="warning">
                <AlertIcon />
                <AlertDescription>Pilih tipe export dahulu</AlertDescription>
              </Alert>

              <Button
                onClick={() => {
                  setJenisKaryawan(1);
                }}
                justifyContent={"space-between"}
                className={
                  jenisKaryawan === 1 ? "selected clicky" : "btn-outline clicky"
                }
                rightIcon={
                  <Icon as={RiCalendarScheduleLine} fontSize={iconSize} />
                }
              >
                Jadwal Shift
              </Button>
              <Button
                onClick={() => {
                  setJenisKaryawan(0);
                }}
                justifyContent={"space-between"}
                className={
                  jenisKaryawan === 0 ? "selected clicky" : "btn-outline clicky"
                }
                rightIcon={
                  <Icon as={RiCalendarCheckLine} fontSize={iconSize} />
                }
              >
                Jadwal Non-Shift
              </Button>
            </CContainer>
          </ModalBody>
          <ModalFooter>
            <CContainer gap={2}>
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
