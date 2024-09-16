import {
  Button,
  ButtonProps,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { RiStarFill } from "@remixicon/react";
import { useRef, useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "../dependent/DisclosureHeader";
import MultiSelectJabatan from "../dependent/_Select/MultiSelectJabatan";
import MultiSelectStatusKaryawan from "../dependent/_Select/MultiSelectStatusKaryawan";
import SearchComponent from "../dependent/input/SearchComponent";

interface Props extends ButtonProps {
  user_id: number;
}

export default function RunPenilaian({ user_id, ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("run-penilaian-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [filterConfig, setFilterConfig] = useState<any>({
    search: "",
    status_karyawan: [],
    jabatan: [],
  });

  return (
    <>
      <Button
        flexShrink={0}
        leftIcon={<Icon as={RiStarFill} color={"orange.400"} />}
        pl={5}
        className="btn-solid clicky"
        flex={1}
        onClick={onOpen}
        {...props}
      >
        Run Penilaian
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
        }}
        initialFocusRef={initialRef}
        isCentered
        blockScrollOnMount={false}
        size={"full"}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent borderRadius={12} minH={"calc(100vh - 32px)"}>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title="Run Penilaian Karyawan" />
          </ModalHeader>
          <ModalBody pb={6}>
            <HStack mb={responsiveSpacing}>
              <SearchComponent
                name="search"
                onChangeSetter={(input) => {
                  setFilterConfig((ps: any) => ({
                    ...ps,
                    search: input,
                  }));
                }}
                inputValue={filterConfig.search}
              />

              <MultiSelectJabatan
                name="jabatan"
                onConfirm={(input) => {
                  setFilterConfig((ps: any) => ({
                    ...ps,
                    jabatan: input,
                  }));
                }}
                inputValue={filterConfig.jabatan}
                optionsDisplay="chip"
                maxW={"200px"}
                placeholder="Filter Jabatan"
              />

              <MultiSelectStatusKaryawan
                name="status_karyawan"
                onConfirm={(input) => {
                  setFilterConfig((ps: any) => ({
                    ...ps,
                    status_karyawan: input,
                  }));
                }}
                inputValue={filterConfig.status_karyawan}
                optionsDisplay="chip"
                maxW={"200px"}
                placeholder="Filter Status Karyawan"
              />
            </HStack>

            {/* <TabelKaryawanDinilai filterConfig={filterConfig} /> */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
