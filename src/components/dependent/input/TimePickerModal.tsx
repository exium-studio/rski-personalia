import {
  Button,
  ButtonProps,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { RiArrowDownSLine, RiArrowUpSLine, RiTimeLine } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import { useErrorColor } from "../../../constant/colors";
import useBackOnClose from "../../../hooks/useBackOnClose";
import backOnClose from "../../../lib/backOnClose";
import { getHours, getMinutes, getSeconds } from "../../../lib/getTime";
import DisclosureHeader from "../DisclosureHeader";
import StringInput from "./StringInput";
import formatTime from "../../../lib/formatTime";

interface Props extends ButtonProps {
  id: string;
  name: string;
  onConfirm: (inputValue: string | undefined) => void;
  inputValue: string | undefined;
  withSeconds?: boolean;
  placeholder?: string;
  nonNullable?: boolean;
  isError?: boolean;
}

export default function TimePickerModal({
  id,
  name,
  onConfirm,
  inputValue,
  withSeconds = false,
  placeholder,
  nonNullable,
  isError,
  ...props
}: Props) {
  const initialRef = useRef(null);

  // const hoursArray = Array.from({ length: 23 }, (_, i) => i + 1);
  // const minutesArray = Array.from({ length: 59 }, (_, i) => i + 1);

  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`${id}-${name}`, isOpen, onOpen, onClose);

  const defaultTime = "00:00:00";
  const [time, setTime] = useState<string | undefined>(
    inputValue ? inputValue : defaultTime
  );
  const [hours, setHours] = useState<number>(getHours(inputValue));
  const [minutes, setMinutes] = useState<number>(getMinutes(inputValue));
  const [seconds, setSeconds] = useState<number>(getSeconds(inputValue));
  useEffect(() => {
    if (inputValue) {
      setHours(getHours(inputValue));
      setMinutes(getMinutes(inputValue));
      setSeconds(getSeconds(inputValue));
    }
  }, [inputValue]);

  useEffect(() => {
    const fHours = String(hours).padStart(2, "0");
    const fMinutes = String(minutes).padStart(2, "0");
    const fSeconds = String(seconds).padStart(2, "0");
    setTime(`${fHours}:${fMinutes}:${fSeconds}`);
  }, [hours, minutes, seconds]);

  // console.log(inputValue, time, hours, minutes, seconds);

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

  function handleMouseDownIncrement(type: string) {
    if (timeoutIncrementRef.current || intervalIncrementRef.current) return;

    timeoutIncrementRef.current = setTimeout(() => {
      intervalIncrementRef.current = setInterval(() => {
        if (type === "hours") {
          setHours((ps) => (ps < 23 ? ps + 1 : 0));
        } else if (type === "minutes") {
          setMinutes((ps) => (ps < 59 ? ps + 1 : 0));
        } else if (type === "seconds") {
          setSeconds((ps) => (ps < 59 ? ps + 1 : 0));
        }
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
  function handleMouseDownDecrement(type: string) {
    if (timeoutDecrementRef.current || intervalDecrementRef.current) return;

    timeoutDecrementRef.current = setTimeout(() => {
      intervalDecrementRef.current = setInterval(() => {
        if (type === "hours") {
          setHours((ps) => (ps > 0 ? ps - 1 : 23));
        } else if (type === "minutes") {
          setMinutes((ps) => (ps > 0 ? ps - 1 : 59));
        } else if (type === "seconds") {
          setSeconds((ps) => (ps > 0 ? ps - 1 : 59));
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

  function confirmSelected() {
    let confirmable = false;
    if (!nonNullable) {
      confirmable = true;
    } else {
      if (time) {
        confirmable = true;
      }
    }

    if (confirmable) {
      if (time) {
        onConfirm(time);
      } else {
        onConfirm(undefined);
      }
      backOnClose();
    }
  }

  // SX
  const errorColor = useErrorColor();

  return (
    <>
      <Button
        className="btn"
        w={"100%"}
        justifyContent={"space-between"}
        borderRadius={8}
        border={"1px solid var(--divider3)"}
        boxShadow={isError ? `0 0 0px 1px ${errorColor}` : ""}
        py={2}
        px={4}
        h={"40px"}
        fontWeight={400}
        cursor={"pointer"}
        onClick={() => {
          onOpen();
          if (inputValue) {
            setTime(inputValue);
          }
        }}
        // _focus={{ boxShadow: "0 0 0px 2px var(--p500)" }}
        _focus={{ border: "1px solid var(--p500)", boxShadow: "none" }}
        {...props}
      >
        {inputValue ? (
          <Text>{withSeconds ? inputValue : formatTime(inputValue)}</Text>
        ) : (
          <Text //@ts-ignore
            color={props?._placeholder?.color || "#96969691"}
          >
            {placeholder || `Pilih Waktu`}
          </Text>
        )}

        <Icon as={RiTimeLine} mb={"1px"} fontSize={17} />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={0} ref={initialRef}>
            <DisclosureHeader title={placeholder || "Pilih Waktu"} />
          </ModalHeader>

          <ModalBody className="scrollY">
            <HStack justify={"space-between"} gap={1}>
              <VStack flex={"1 1 0"} align={"stretch"} gap={0}>
                <IconButton
                  aria-label="add hour button"
                  icon={<Icon as={RiArrowUpSLine} fontSize={20} />}
                  className="btn-outline clicky"
                  onClick={() => {
                    setHours((ps) => (ps < 23 ? ps + 1 : 0));
                    if (!time) {
                      setTime(defaultTime);
                    }
                  }}
                  onMouseDown={() => {
                    handleMouseDownIncrement("hours");
                  }}
                  onMouseUp={handleMouseUpIncrement}
                  onMouseLeave={handleMouseUpIncrement}
                  onTouchStart={() => {
                    handleMouseDownIncrement("hours");
                  }}
                  onTouchEnd={handleMouseUpIncrement}
                />

                <VStack my={4}>
                  <StringInput
                    name="jam"
                    onChangeSetter={(input) => {
                      if (parseInt(input as string) < 24) {
                        setHours(parseInt(input as string));
                      }
                    }}
                    inputValue={time ? String(hours).padStart(2, "0") : "--"}
                    fontSize={"64px !important"}
                    fontWeight={600}
                    h={"64px"}
                    textAlign={"center"}
                    border={"none !important"}
                    _focus={{ border: "none !important" }}
                  />
                  <Text textAlign={"center"}>Jam</Text>
                </VStack>

                <IconButton
                  aria-label="reduce hour button"
                  icon={<Icon as={RiArrowDownSLine} fontSize={20} />}
                  className="btn-outline clicky"
                  onClick={() => {
                    setHours((ps) => (ps > 0 ? ps - 1 : 23));
                    if (!time) {
                      setTime(defaultTime);
                    }
                  }}
                  onMouseDown={() => {
                    handleMouseDownDecrement("hours");
                  }}
                  onMouseUp={handleMouseUpDecrement}
                  onMouseLeave={handleMouseUpDecrement}
                  onTouchStart={() => {
                    handleMouseDownDecrement("hours");
                  }}
                  onTouchEnd={handleMouseUpDecrement}
                />
              </VStack>

              <Text fontSize={50} opacity={0.2} mt={-9}>
                :
              </Text>

              <VStack flex={"1 1 0"} align={"stretch"} gap={0}>
                <IconButton
                  aria-label="add hour button"
                  icon={<Icon as={RiArrowUpSLine} fontSize={20} />}
                  className="btn-outline clicky"
                  onClick={() => {
                    setMinutes((ps) => (ps < 59 ? ps + 1 : 0));
                    if (!time) {
                      setTime(defaultTime);
                    }
                  }}
                  onMouseDown={() => {
                    handleMouseDownIncrement("minutes");
                  }}
                  onMouseUp={handleMouseUpIncrement}
                  onMouseLeave={handleMouseUpIncrement}
                  onTouchStart={() => {
                    handleMouseDownIncrement("minutes");
                  }}
                  onTouchEnd={handleMouseUpIncrement}
                />

                <VStack my={4}>
                  <StringInput
                    name="jam"
                    onChangeSetter={(input) => {
                      if (parseInt(input as string) < 60) {
                        setMinutes(parseInt(input as string));
                      }
                    }}
                    inputValue={time ? String(minutes).padStart(2, "0") : "--"}
                    fontSize={"64px !important"}
                    fontWeight={600}
                    h={"64px"}
                    textAlign={"center"}
                    border={"none !important"}
                    _focus={{ border: "none !important" }}
                  />
                  <Text textAlign={"center"}>Menit</Text>
                </VStack>

                <IconButton
                  aria-label="reduce hour button"
                  icon={<Icon as={RiArrowDownSLine} fontSize={20} />}
                  className="btn-outline clicky"
                  onClick={() => {
                    setMinutes((ps) => (ps > 0 ? ps - 1 : 59));
                    if (!time) {
                      setTime(defaultTime);
                    }
                  }}
                  onMouseDown={() => {
                    handleMouseDownDecrement("minutes");
                  }}
                  onMouseUp={handleMouseUpDecrement}
                  onMouseLeave={handleMouseUpDecrement}
                  onTouchStart={() => {
                    handleMouseDownDecrement("minutes");
                  }}
                  onTouchEnd={handleMouseUpDecrement}
                />
              </VStack>

              {withSeconds && (
                <>
                  <Text fontSize={50} opacity={0.2} mt={-9}>
                    :
                  </Text>

                  <VStack flex={"1 1 0"} align={"stretch"} gap={0}>
                    <IconButton
                      aria-label="add hour button"
                      icon={<Icon as={RiArrowUpSLine} fontSize={20} />}
                      className="btn-outline clicky"
                      onClick={() => {
                        setSeconds((ps) => (ps < 59 ? ps + 1 : 0));
                        if (!time) {
                          setTime(defaultTime);
                        }
                      }}
                      onMouseDown={() => {
                        handleMouseDownIncrement("seconds");
                      }}
                      onMouseUp={handleMouseUpIncrement}
                      onMouseLeave={handleMouseUpIncrement}
                      onTouchStart={() => {
                        handleMouseDownIncrement("seconds");
                      }}
                      onTouchEnd={handleMouseUpIncrement}
                    />

                    <VStack my={4}>
                      <StringInput
                        name="jam"
                        onChangeSetter={(input) => {
                          if (parseInt(input as string) < 60) {
                            setSeconds(parseInt(input as string));
                          }
                        }}
                        inputValue={
                          time ? String(seconds).padStart(2, "0") : "--"
                        }
                        fontSize={"64px !important"}
                        fontWeight={600}
                        h={"64px"}
                        textAlign={"center"}
                        border={"none !important"}
                        _focus={{ border: "none !important" }}
                      />
                      <Text textAlign={"center"}>Detik</Text>
                    </VStack>

                    <IconButton
                      aria-label="reduce hour button"
                      icon={<Icon as={RiArrowDownSLine} fontSize={20} />}
                      className="btn-outline clicky"
                      onClick={() => {
                        setSeconds((ps) => (ps > 0 ? ps - 1 : 59));
                        if (!time) {
                          setTime(defaultTime);
                        }
                      }}
                      onMouseDown={() => {
                        handleMouseDownDecrement("seconds");
                      }}
                      onMouseUp={handleMouseUpDecrement}
                      onMouseLeave={handleMouseUpDecrement}
                      onTouchStart={() => {
                        handleMouseDownDecrement("seconds");
                      }}
                      onTouchEnd={handleMouseUpDecrement}
                    />
                  </VStack>
                </>
              )}
            </HStack>
          </ModalBody>

          <ModalFooter gap={2}>
            <Button
              className="btn-solid clicky"
              w={"100%"}
              onClick={() => {
                if (time && hours === 0 && minutes === 0 && seconds === 0) {
                  setTime(undefined);
                  setHours(0);
                  setMinutes(0);
                  setSeconds(0);
                } else {
                  setTime(defaultTime);
                  setHours(0);
                  setMinutes(0);
                  setSeconds(0);
                }
              }}
            >
              {time && hours === 0 && minutes === 0 && seconds === 0
                ? "Clear"
                : "Reset"}
            </Button>

            <Button
              colorScheme="ap"
              className="btn-ap clicky"
              w={"100%"}
              isDisabled={nonNullable ? (time ? false : true) : false}
              onClick={confirmSelected}
            >
              Konfirmasi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
