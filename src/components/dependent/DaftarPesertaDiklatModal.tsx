import {
  Button,
  ButtonProps,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiArrowRightSLine, RiGroupFill } from "@remixicon/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import backOnClose from "../../lib/backOnCloseOld";
import useBackOnClose from "../../lib/useBackOnCloseOld";
import SearchComponent from "./SearchComponent";

interface Props extends ButtonProps {
  data: any;
}

export default function DaftarPesertaDiklatModal({ data }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(isOpen, onClose);
  const initialRef = useRef(null);

  const [search, setSearch] = useState<string>("");
  const fd = data.filter((peserta: any) => peserta.user.nama.includes(search));

  return (
    <>
      <Button
        className="clicky"
        colorScheme="ap"
        variant={"ghost"}
        leftIcon={<Icon as={RiGroupFill} />}
        onClick={onOpen}
      >
        Lihat
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose(onClose);
        }}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader ref={initialRef} pr={6}>
            <Text fontSize={20}>Daftar Peserta</Text>
            <SearchComponent mt={4} search={search} setSearch={setSearch} />
          </ModalHeader>
          <ModalBody pb={6}>
            {fd?.map((peserta: any, i: number) => (
              <HStack
                key={i}
                p={3}
                borderBottom={"1px solid var(--divider)"}
                justify={"space-between"}
                _hover={{ bg: "var(--divider)" }}
              >
                <Text>{peserta.user.nama}</Text>

                <Button
                  className="btn-clear clicky"
                  w={"fit-content"}
                  h={"fit-content"}
                  color={"p.500"}
                  ml={"auto"}
                  size={"sm"}
                  as={Link}
                  target="_blank"
                  to={`/karyawan/${data.id}`}
                  rightIcon={<Icon as={RiArrowRightSLine} fontSize={16} />}
                  pr={3}
                >
                  <Text fontSize={14}>Detail</Text>
                </Button>
              </HStack>
            ))}

            {fd && fd.length === 0 && (
              <Text textAlign={"center"} my={2}>
                Peserta tidak ditemukan
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
