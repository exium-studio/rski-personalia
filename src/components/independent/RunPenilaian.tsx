import {
  Button,
  ButtonProps,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { RiChatCheckFill, RiIdCardLine } from "@remixicon/react";
import { useRef, useState } from "react";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import SelectStatusKaryawan from "../dependent/_Select/SelectStatusKaryawan";
import DisclosureHeader from "../dependent/DisclosureHeader";
import TabelKaryawanDinilai from "../dependent/TabelKaryawanDinilai";

interface Props extends ButtonProps {}

export default function RunPenilaian({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("run-penilaian-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [filterConfig, setFilterConfig] = useState<any>(undefined);

  return (
    <>
      <Button
        className="btn-ap clicky"
        colorScheme="ap"
        onClick={onOpen}
        leftIcon={<Icon as={RiChatCheckFill} fontSize={iconSize} />}
        pl={5}
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
      >
        <ModalOverlay />
        <ModalContent borderRadius={12} minH={"calc(100vh - 32px)"}>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader
              title="Run Penilaian Karyawan"
              addition={
                <SelectStatusKaryawan
                  name="status_karyawan"
                  onConfirm={(input) => {
                    setFilterConfig((ps: any) => ({
                      ...ps,
                      status_karyawan: input,
                    }));
                  }}
                  inputValue={filterConfig?.status_karyawan}
                  maxW={"fit-content"}
                  mr={"auto"}
                  ml={4}
                />
              }
            />
          </ModalHeader>
          <ModalBody pb={6}>
            {!filterConfig?.status_karyawan && (
              <VStack
                justify={"center"}
                maxW={"400px"}
                p={responsiveSpacing}
                m={"auto"}
              >
                <Icon as={RiIdCardLine} fontSize={150} opacity={0.6} />
                <Text textAlign={"center"} opacity={0.4}>
                  Pilih status kepegawaian di atas, kemudian sistem akan
                  menampilkan karyawan yang memerlukan penilaian.
                </Text>
              </VStack>
            )}

            {filterConfig?.status_karyawan && (
              <TabelKaryawanDinilai filterConfig={filterConfig} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
