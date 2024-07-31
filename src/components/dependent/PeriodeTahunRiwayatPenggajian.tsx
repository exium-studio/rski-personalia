import {
  Button,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { RiCalendarLine } from "@remixicon/react";
import { Dispatch, useRef, useState } from "react";
import backOnClose from "../../lib/backOnCloseOld";
import formatYear from "../../lib/formatYear";
import parseNumber from "../../lib/parseNumber";
import useBackOnClose from "../../lib/useBackOnCloseOld";

interface Props {
  filterConfig: any;
  setFilterConfig: Dispatch<any>;
}

export default function PeriodeTahunRiwayatPenggajian({
  filterConfig,
  setFilterConfig,
}: Props) {
  const today = new Date();

  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(isOpen, onClose);
  const initialRef = useRef(null);

  const [data, setData] = useState<number | null>(null);

  return (
    <>
      <Button
        flex={"1 1 110px"}
        rightIcon={<Icon as={RiCalendarLine} mb={"2px"} />}
        justifyContent={"space-between"}
        className="btn-outline clicky"
        onClick={onOpen}
      >
        {filterConfig.periode_tahun || "Semua Tahun"}
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
          <ModalHeader>Periode Tahun</ModalHeader>
          <ModalBody>
            <form
              id="periodeTahunRiwayatPenggajianForm"
              onSubmit={(e) => {
                e.preventDefault();
                setFilterConfig({
                  ...filterConfig,
                  periode_tahun: data,
                });
                backOnClose(onClose);
              }}
            >
              <Input
                ref={initialRef}
                placeholder={today.getFullYear().toString()}
                onChange={(e) => {
                  setData(parseNumber(e.target.value));
                }}
                value={formatYear(data)}
              />
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type={"submit"}
              form="periodeTahunRiwayatPenggajianForm"
              className="btn-ap clicky"
              colorScheme="ap"
              w={"100%"}
            >
              Terapkan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
