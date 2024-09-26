import {
  Box,
  Button,
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
import { ReactNode, useState } from "react";
import req from "../../lib/req";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "./DisclosureHeader";

interface Props {
  children?: ReactNode;
  url: string;
  id: number;
  data?: any;
}

export default function DeleteDataPengaturanModalDisclosure({
  children,
  url,
  id,
  data,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`delete-data-pengaturan-modal-${id}`, isOpen, onOpen, onClose);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  function handleOnDelete() {
    setLoading(true);
    req
      .delete(`${url}/${id}`)
      .then((r) => {
        if (r.status === 200) {
          toast({
            status: "success",
            title: r.data.message,
            isClosable: true,
            position: "bottom-right",
          });
          backOnClose();
          setRt(!rt);
        }
      })
      .catch((e) => {
        console.log(e);
        toast({
          status: "error",
          title:
            e?.response?.data?.message ||
            "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
          isClosable: true,
          position: "bottom-right",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Delete Data Pengaturan"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.4}>
              Apakah anda yakin akan menghapus data pengaturan ini?
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
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
              className="clicky"
              colorScheme="red"
              onClick={handleOnDelete}
              isLoading={loading}
            >
              Ya
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
