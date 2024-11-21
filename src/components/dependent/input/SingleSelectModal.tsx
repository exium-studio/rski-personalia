import {
  Box,
  Button,
  ButtonProps,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { RiArrowDownSLine } from "@remixicon/react";
import { useRef, useState } from "react";
import { useErrorColor } from "../../../constant/colors";
import { Interface__SelectOption } from "../../../constant/interfaces";
import useBackOnClose from "../../../hooks/useBackOnClose";
import useScreenHeight from "../../../hooks/useScreenHeight";
import backOnClose from "../../../lib/backOnClose";
import ComponentSpinner from "../../independent/ComponentSpinner";
import NotFound from "../../independent/NotFound";
import DisclosureHeader from "../DisclosureHeader";
import SearchComponent from "./SearchComponent";
import { responsiveSpacing } from "../../../constant/sizes";

interface Props extends ButtonProps {
  id: string;
  name: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  options?: Interface__SelectOption[];
  onConfirm: (inputValue: Interface__SelectOption | undefined) => void;
  inputValue: Interface__SelectOption | undefined;
  withSearch?: boolean;
  optionsDisplay?: "list" | "chip";
  isError?: boolean;
  placeholder?: string;
  nonNullable?: boolean;
}

export default function SingleSelectModal({
  id,
  name,
  isOpen,
  onOpen,
  onClose,
  options,
  onConfirm,
  inputValue,
  withSearch,
  optionsDisplay = "list",
  isError,
  placeholder,
  nonNullable,
  ...props
}: Props) {
  useBackOnClose(`${id}-${name}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<Interface__SelectOption | undefined>(
    inputValue
  );
  const fo = search
    ? options?.filter((option) => {
        const searchTerm = search.toLowerCase();
        return (
          option.value.toString().toLowerCase().includes(searchTerm) ||
          option.label.toString().toLowerCase().includes(searchTerm) ||
          option.label2?.toString().toLowerCase().includes(searchTerm)
        );
      })
    : options;

  function confirmSelected() {
    let confirmable = false;
    if (!nonNullable) {
      confirmable = true;
    } else {
      if (selected) {
        confirmable = true;
      }
    }

    if (confirmable) {
      if (selected) {
        onConfirm(selected);
      } else {
        onConfirm(undefined);
      }
      backOnClose();
    }
  }

  // SX
  const errorColor = useErrorColor();
  const sh = useScreenHeight();

  return (
    <>
      <Tooltip
        label={
          inputValue
            ? `${inputValue?.label || ""} ${inputValue?.label2 || ""}`
            : placeholder
        }
        openDelay={500}
        placement="bottom-start"
      >
        <Button
          className="btn-clear"
          border={"1px solid var(--divider3)"}
          borderColor={isError ? errorColor : ""}
          borderRadius={8}
          gap={3}
          _focus={{
            border: "1px solid var(--p500)",
            boxShadow: "none !important",
          }}
          cursor={"pointer"}
          onClick={() => {
            onOpen();
            setSelected(inputValue);
          }}
          justifyContent={"space-between"}
          w={"100%"}
          role="group"
          px={"12px !important"}
          pl={"16px !important"}
          {...props}
        >
          <HStack
            w={"100%"}
            flexShrink={1}
            overflow={"hidden"}
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
          >
            {inputValue && (
              <>
                <Text
                  fontWeight={400}
                  overflow={"hidden"}
                  whiteSpace={"nowrap"}
                  textOverflow={"ellipsis"}
                >
                  {inputValue.label}
                </Text>

                <Text
                  fontWeight={400}
                  opacity={0.4}
                  ml={2}
                  overflow={"hidden"}
                  whiteSpace={"nowrap"}
                  textOverflow={"ellipsis"}
                >
                  {inputValue.label2}
                </Text>
              </>
            )}

            {!inputValue && (
              <Text
                //@ts-ignore
                color={props?._placeholder?.color || "#96969691"}
                fontWeight={400}
                overflow={"hidden"}
                whiteSpace={"nowrap"}
                textOverflow={"ellipsis"}
              >
                {placeholder || "Pilih Salah Satu"}
              </Text>
            )}
          </HStack>

          <Icon as={RiArrowDownSLine} fontSize={18} />
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        isCentered={sh < 650 ? false : true}
        scrollBehavior={sh < 650 ? "outside" : "inside"}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent
          my={sh < 650 ? 0 : ""}
          h={
            (withSearch ||
              (optionsDisplay === "list" && options && options?.length > 10) ||
              (optionsDisplay === "chip" && options && options?.length > 20)) &&
            sh >= 650
              ? "100%"
              : ""
          }
          maxH={"650px"}
        >
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title={placeholder || "Pilih Salah Satu"} />

            {(withSearch ||
              (optionsDisplay === "list" && options && options?.length > 10) ||
              (optionsDisplay === "chip" &&
                options &&
                options?.length > 20)) && (
              <Box px={6} pb={responsiveSpacing}>
                <SearchComponent
                  name="search select options"
                  inputValue={search}
                  onChangeSetter={(inputValue) => {
                    setSearch(inputValue);
                  }}
                />
              </Box>
            )}
          </ModalHeader>

          <ModalBody className="scrollY" overflowY={"auto"}>
            {fo && (
              <>
                {fo.length > 0 && (
                  <>
                    {optionsDisplay === "list" && (
                      <VStack align={"stretch"}>
                        {fo.map((option, i) => (
                          <Tooltip
                            key={i}
                            label={
                              <Box>
                                <Text fontSize={"sm"}>{option?.label}</Text>
                                <Text fontSize={"sm"}>{option?.label2}</Text>
                              </Box>
                            }
                            placement="bottom-start"
                            openDelay={500}
                          >
                            <Button
                              px={4}
                              justifyContent={"space-between"}
                              className="btn-outline"
                              onClick={() => {
                                setSelected(option);
                              }}
                              borderColor={
                                selected && selected.value === option.value
                                  ? "var(--p500)"
                                  : "transparent !important"
                              }
                              bg={
                                selected && selected.value === option.value
                                  ? "var(--p500a4) !important"
                                  : ""
                              }
                            >
                              <Text
                                overflow={"hidden"}
                                whiteSpace={"nowrap"}
                                textOverflow={"ellipsis"}
                              >
                                {option?.label}
                              </Text>

                              <Text
                                ml={4}
                                opacity={0.4}
                                maxW={"120px"}
                                whiteSpace={"nowrap"}
                                overflow={"hidden"}
                                textOverflow={"ellipsis"}
                                fontWeight={400}
                              >
                                {option?.label2}
                              </Text>
                            </Button>
                          </Tooltip>
                        ))}
                      </VStack>
                    )}

                    {optionsDisplay === "chip" && (
                      <Wrap>
                        {fo.map((option, i) => (
                          <Button
                            key={i}
                            justifyContent={"space-between"}
                            className="btn-outline"
                            onClick={() => {
                              setSelected(option);
                            }}
                            borderRadius={"full"}
                            borderColor={
                              selected && selected.value === option.value
                                ? "var(--p500)"
                                : ""
                            }
                            bg={
                              selected && selected.value === option.value
                                ? "var(--p500a4) !important"
                                : ""
                            }
                            gap={2}
                          >
                            <Text
                              overflow={"hidden"}
                              whiteSpace={"nowrap"}
                              textOverflow={"ellipsis"}
                            >
                              {option.label}
                            </Text>
                            {/* <Text opacity={0.4}>{option.label2}</Text> */}
                          </Button>
                        ))}
                      </Wrap>
                    )}
                  </>
                )}

                {fo.length === 0 && (
                  <NotFound minH={"300px"} label="Opsi tidak ditemukan" />
                )}
              </>
            )}

            {!fo && <ComponentSpinner my={"auto"} />}
          </ModalBody>

          {fo && (
            <ModalFooter gap={2}>
              <Button
                className="btn-solid clicky"
                w={"100%"}
                onClick={() => {
                  setSelected(undefined);
                }}
              >
                Clear
              </Button>

              <Button
                colorScheme="ap"
                className="btn-ap clicky"
                w={"100%"}
                isDisabled={nonNullable ? (selected ? false : true) : false}
                onClick={confirmSelected}
              >
                Konfirmasi
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
