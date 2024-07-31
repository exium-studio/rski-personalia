import {
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
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
import CContainer from "../../independent/wrapper/CContainer";
import DisclosureHeader from "../DisclosureHeader";
import SearchComponent from "./SearchComponent";

interface Props {
  id: string;
  name: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  options?: Interface__SelectOption[];
  onConfirm: (inputValue: Interface__SelectOption[] | undefined) => void;
  inputValue: Interface__SelectOption[] | undefined;
  withSearch?: boolean;
  optionsDisplay?: "list" | "chip";
  maxSelectedDisplay?: number;
  isError?: boolean;
  placement?: "top" | "bottom" | "left" | "right";
  placeholder?: string;
  nonNullable?: boolean;
}

export default function MultipleSelectModal({
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
  maxSelectedDisplay = 2,
  isError,
  placement = "bottom",
  placeholder,
  nonNullable,
  ...props
}: Props) {
  useBackOnClose(`${id}-${name}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<
    Interface__SelectOption[] | undefined
  >(inputValue);
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
  const sh = useScreenHeight();
  const errorColor = useErrorColor();

  return (
    <>
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
        px={
          inputValue && inputValue.length > 0
            ? "8px !important"
            : "12px !important"
        }
        pl={
          inputValue && inputValue.length > 0
            ? "8px !important"
            : "16px !important"
        }
        {...props}
      >
        <Box overflowX={"auto"} className="noScroll">
          <HStack w={"100%"}>
            {inputValue && inputValue.length > 0 ? (
              inputValue.map((value, i) => {
                return (
                  i < maxSelectedDisplay && (
                    <Badge
                      key={i}
                      borderRadius={6}
                      bg={"var(--divider)"}
                      textTransform={"none"}
                      flex={"1 1 100px"}
                      h={"24px"}
                      pt={"5.5px"}
                    >
                      {value.label}
                    </Badge>
                  )
                );
              })
            ) : placeholder ? (
              <Text
                //@ts-ignore
                color={props?._placeholder?.color || "#96969691"}
                fontWeight={400}
              >
                {placeholder}
              </Text>
            ) : (
              <Text opacity={0.3} fontWeight={400}>
                Multi Pilih
              </Text>
            )}

            {inputValue && inputValue.length - maxSelectedDisplay > 0 && (
              <Badge bg={"var(--divider)"} h={"24px"} pt={"5.5px"}>
                +
                {inputValue.length - maxSelectedDisplay > 0 &&
                  inputValue.length - maxSelectedDisplay}
              </Badge>
            )}
          </HStack>
        </Box>

        <Icon as={RiArrowDownSLine} fontSize={18} />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        isCentered={sh < 650 ? false : true}
        scrollBehavior={sh < 650 ? "outside" : "inside"}
      >
        <ModalOverlay />
        <ModalContent
          my={sh < 650 ? 0 : ""}
          h={withSearch && sh >= 650 ? "100%" : ""}
        >
          <ModalHeader ref={initialRef}>
            <Box>
              <DisclosureHeader title={placeholder || "Multi Pilih"} />

              {withSearch && (
                <Box px={6} pb={6}>
                  <SearchComponent
                    name="search select options"
                    inputValue={search}
                    onChangeSetter={(inputValue) => {
                      setSearch(inputValue);
                    }}
                  />
                </Box>
              )}
            </Box>
          </ModalHeader>
          <ModalBody className="scrollY">
            {fo && (
              <>
                {optionsDisplay === "list" && (
                  <CContainer gap={2}>
                    {fo.map((option, i) => (
                      <Button
                        key={i}
                        px={4}
                        justifyContent={"space-between"}
                        className="btn-outline"
                        onClick={() => {
                          const isSelected =
                            selected &&
                            selected.some(
                              (item) => item.value === option.value
                            );
                          let newSelected = selected || [];

                          if (isSelected) {
                            // Filter out the option if it's already selected
                            newSelected = newSelected.filter(
                              (item) => item.value !== option.value
                            );
                          } else {
                            // Add the option to the selected array
                            newSelected = [...newSelected, option];
                          }

                          setSelected(newSelected);
                        }}
                        borderColor={
                          selected &&
                          selected.some((item) => item.value === option.value)
                            ? "var(--p500a2)"
                            : "transparent !important"
                        }
                        bg={
                          selected &&
                          selected.some((item) => item.value === option.value)
                            ? "var(--p500a4) !important"
                            : ""
                        }
                      >
                        <Text
                          overflow={"hidden"}
                          whiteSpace={"nowrap"}
                          textOverflow={"ellipsis"}
                        >
                          {option.label}
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
                          {option.label2}
                        </Text>
                      </Button>
                    ))}
                  </CContainer>
                )}

                {optionsDisplay === "chip" && (
                  <Wrap>
                    {fo.map((option, i) => (
                      <Button
                        key={i}
                        justifyContent={"space-between"}
                        className="btn-outline"
                        borderRadius={"full"}
                        borderColor={
                          selected &&
                          selected.some((item) => item.value === option.value)
                            ? "var(--p500a2)"
                            : ""
                        }
                        bg={
                          selected &&
                          selected.some((item) => item.value === option.value)
                            ? "var(--p500a5) !important"
                            : ""
                        }
                        onClick={() => {
                          const isSelected =
                            selected &&
                            selected.some(
                              (item) => item.value === option.value
                            );
                          let newSelected = selected || [];

                          if (isSelected) {
                            // Filter out the option if it's already selected
                            newSelected = newSelected.filter(
                              (item) => item.value !== option.value
                            );
                          } else {
                            // Add the option to the selected array
                            newSelected = [...newSelected, option];
                          }

                          setSelected(newSelected);
                        }}
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

                {fo.length === 0 && <NotFound label="Opsi tidak ditemukan" />}
              </>
            )}

            {!fo && <ComponentSpinner my={"auto"} />}
          </ModalBody>
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
        </ModalContent>
      </Modal>
    </>
  );
}
