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
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import download from "../../lib/download";
import req from "../../lib/req";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";
import FilterMasaDiklat from "./FilterMasaDiklat";

interface Props extends ButtonProps {}

export default function ExportMasaDiklatModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`export-modal-${1}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const defaultFilterConfig = {
    less_than: undefined as any,
    more_than: undefined as any,
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);

  const handleExport = () => {
    setLoading(true);

    const url = `/api/rski/dashboard/perusahaan/export-masa-diklat`;

    const payload = {
      less_than: filterConfig.less_than * 3600,
      more_than: filterConfig.more_than * 3600,
    };

    req
      .post(url, payload, {
        responseType: "blob",
      })
      .then((r) => {
        if (r.status === 200) {
          download(r.data, `Export Masa Diklat`, "xls");
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
      .catch(async (e) => {
        // Default error message
        let errorMsg =
          "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS";

        // Try to parse error blob if content-type is JSON
        if (e?.response?.data instanceof Blob) {
          try {
            const contentType = e.response.headers["content-type"];
            if (contentType && contentType.includes("application/json")) {
              const text = await e.response.data.text();
              const json = JSON.parse(text);
              if (typeof json.message === "string") {
                errorMsg = json.message;
              }
            }
          } catch (err) {
            console.error("Gagal parse blob jadi JSON:", err);
          }
        }

        toast({
          status: "error",
          title: errorMsg,
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
        }}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title={"Export Masa Diklat"} onClose={() => {}} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.6}>
              Apakah anda yakin akan export (excel) semua data pada tabel ini?
            </Text>
          </ModalBody>

          <ModalFooter>
            <CContainer gap={2}>
              <CContainer gap={2}>
                <FilterMasaDiklat
                  id={"filter-masa-diklat-export"}
                  inputValue={filterConfig}
                  onConfirm={setFilterConfig}
                />
              </CContainer>

              <ButtonGroup>
                <Button
                  w={"100%"}
                  className="btn-solid clicky"
                  onClick={() => {
                    backOnClose();
                  }}
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
