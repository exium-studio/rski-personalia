import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  StackProps,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarLine,
} from "@remixicon/react";
import { useRef, useState } from "react";
import months from "../../../constant/months";
import { iconSize } from "../../../constant/sizes";
import useBackOnClose from "../../../hooks/useBackOnClose";
import backOnClose from "../../../lib/backOnClose";
import formatDate from "../../../lib/formatDate";
import DisclosureHeader from "../DisclosureHeader";
import StringInput from "./StringInput";

type PrefixOption = "basic" | "basicShort" | "long" | "longShort" | "short";

interface Props extends StackProps {
  id: string;
  name: string;
  onConfirm: (inputValue: Date | undefined) => void;
  inputValue: Date | undefined;
  dateFormatOptions?: PrefixOption | object;
  placeholder?: string;
  nonNullable?: boolean;
  isError?: boolean;
}

export default function PeriodPickerModal({
  id,
  name,
  onConfirm,
  inputValue,
  dateFormatOptions,
  placeholder,
  nonNullable,
  isError,
  ...props
}: Props) {
  const initialRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`${id}-${name}` || "period-picker", isOpen, onOpen, onClose);

  const [bulanLocal, setBulanLocal] = useState<number | undefined>(
    inputValue ? inputValue.getMonth() : new Date().getMonth()
  );
  const [tahunLocal, setTahunLocal] = useState<number | undefined>(
    inputValue ? inputValue.getFullYear() : new Date().getFullYear()
  );

  const isTahunValid = (tahun: number | undefined) => {
    return tahun && tahun >= 100 && tahun <= 270000;
  };

  const intervalIncrementRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const timeoutIncrementRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const intervalDecrementRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const timeoutDecrementRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  function handleMouseDownIncrement() {
    if (timeoutIncrementRef.current || intervalIncrementRef.current) return;

    timeoutIncrementRef.current = setTimeout(() => {
      intervalIncrementRef.current = setInterval(() => {
        setTahunLocal((ps) => ps || 0 + 1);
      }, 100);
    }, 300);
  }
  function handleMouseUpIncrement() {
    if (timeoutIncrementRef.current) {
      clearTimeout(timeoutIncrementRef.current);
      timeoutIncrementRef.current = null;
    }
    if (intervalIncrementRef.current) {
      clearInterval(intervalIncrementRef.current);
      intervalIncrementRef.current = null;
    }
  }
  function handleMouseDownDecrement() {
    if (timeoutDecrementRef.current || intervalDecrementRef.current) return;

    timeoutDecrementRef.current = setTimeout(() => {
      intervalDecrementRef.current = setInterval(() => {
        if (tahunLocal && tahunLocal > 0) {
          setTahunLocal((ps) => ps && ps - 1);
        }
      }, 100);
    }, 300);
  }
  function handleMouseUpDecrement() {
    if (timeoutDecrementRef.current) {
      clearTimeout(timeoutDecrementRef.current);
      timeoutDecrementRef.current = null;
    }
    if (intervalDecrementRef.current) {
      clearInterval(intervalDecrementRef.current);
      intervalDecrementRef.current = null;
    }
  }

  function confirm() {
    if (typeof bulanLocal === "number" && typeof tahunLocal === "number") {
      const period = new Date(tahunLocal, bulanLocal);
      console.log("period", period);
      onConfirm(period);
      backOnClose();
    }
  }

  return (
    <>
      <HStack
        as={Button}
        className="btn-clear"
        justify={"space-between"}
        flex={1}
        minH={"40px"}
        px={"16px !important"}
        _hover={{ bg: "var(--divider)" }}
        flexShrink={0}
        w={"100%"}
        bg={"transparent"}
        border={"1px solid var(--divider3)"}
        onClick={() => {
          onOpen();
          setBulanLocal(
            inputValue ? inputValue.getMonth() : new Date().getMonth()
          );
          setTahunLocal(
            inputValue ? inputValue.getFullYear() : new Date().getFullYear()
          );
        }}
        {...props}
      >
        {inputValue ? (
          <Text fontWeight={500}>
            {`${formatDate(
              new Date(inputValue?.getFullYear(), inputValue?.getMonth()),
              "periode"
            )}`}
          </Text>
        ) : (
          //@ts-ignore
          <Text color={props?._placeholder?.color || "#96969691"}>
            {placeholder || "Periode"}
          </Text>
        )}

        <Icon as={RiCalendarLine} />
      </HStack>

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
            <DisclosureHeader title="Pilih Periode Bulan & Tahun" />
          </ModalHeader>

          <ModalBody className="scrollY">
            <FormControl mb={4}>
              <FormLabel>Bulan</FormLabel>
              <SimpleGrid columns={[2, 3]} gap={2}>
                {months.map((month, i) => (
                  <Button
                    key={i}
                    flex={"1 1 100px"}
                    borderColor={i === bulanLocal ? "var(--p500)" : ""}
                    bg={i === bulanLocal ? "var(--p500a5) !important" : ""}
                    className="btn-outline"
                    onClick={() => {
                      setBulanLocal(i);
                    }}
                  >
                    {month}
                  </Button>
                ))}
              </SimpleGrid>
            </FormControl>

            <FormControl isInvalid={!isTahunValid(tahunLocal)}>
              <FormLabel>Tahun</FormLabel>
              <HStack>
                <IconButton
                  aria-label="year min button"
                  icon={<Icon as={RiArrowLeftSLine} fontSize={iconSize} />}
                  className="btn-outline clicky"
                  isDisabled={!!(tahunLocal && tahunLocal <= 0)}
                  onClick={() => {
                    if (tahunLocal && tahunLocal > 0) {
                      setTahunLocal(tahunLocal - 1);
                    }
                  }}
                  onMouseDown={() => {
                    handleMouseDownDecrement();
                  }}
                  onMouseUp={handleMouseUpDecrement}
                  onMouseLeave={handleMouseUpDecrement}
                  onTouchStart={() => {
                    handleMouseDownDecrement();
                  }}
                  onTouchEnd={handleMouseUpDecrement}
                />
                <StringInput
                  name="tahun"
                  textAlign={"center"}
                  placeholder="Tahun"
                  onChangeSetter={(input) => {
                    setTahunLocal(parseInt(input as string));
                  }}
                  inputValue={tahunLocal ? tahunLocal.toString() : ""}
                  placeholderprops={{
                    textAlign: "center",
                  }}
                />
                <IconButton
                  aria-label="year plus button"
                  icon={<Icon as={RiArrowRightSLine} fontSize={iconSize} />}
                  className="btn-outline clicky"
                  isDisabled={!!(tahunLocal && tahunLocal <= 0)}
                  onClick={() => {
                    if (tahunLocal) {
                      setTahunLocal(tahunLocal + 1);
                    }
                  }}
                  onMouseDown={() => {
                    handleMouseDownIncrement();
                  }}
                  onMouseUp={handleMouseUpIncrement}
                  onMouseLeave={handleMouseUpIncrement}
                  onTouchStart={() => {
                    handleMouseDownIncrement();
                  }}
                  onTouchEnd={handleMouseUpIncrement}
                />
              </HStack>
              <FormErrorMessage>
                <Text mx={"auto"} textAlign={"center"}>
                  Tahun tidak valid
                </Text>
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={confirm}
              w={"100%"}
              className="btn-ap clicky"
              isDisabled={!isTahunValid(tahunLocal)}
              colorScheme="ap"
            >
              Konfirmasi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
