import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  Wrap,
} from "@chakra-ui/react";
import { RiArrowDownSLine, RiSearch2Line } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import { useErrorColor } from "../../../constant/colors";
import { Interface__SelectOption } from "../../../constant/interfaces";
import { iconSize, responsiveSpacing } from "../../../constant/sizes";
import useBackOnClose from "../../../hooks/useBackOnClose";
import useScreenHeight from "../../../hooks/useScreenHeight";
import backOnClose from "../../../lib/backOnClose";
import ComponentSpinner from "../../independent/ComponentSpinner";
import NotFound from "../../independent/NotFound";
import CContainer from "../../independent/wrapper/CContainer";
import DisclosureHeader from "../DisclosureHeader";
import SearchComponent from "./SearchComponent";
import req from "../../../lib/req";

const ListUnitKerja = ({ listKaryawan, setSelected }: any) => {
  const [options, setOptions] = useState<any>(undefined);

  useEffect(() => {
    if (!options) {
      req
        .get("/api/get-list-unit-kerja")
        .then((r) => {
          if (r.status === 200) {
            const options = r.data.data.map((item: any) => ({
              id: item.id,
              label: item.nama_unit,
            }));
            setOptions(options);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [options]);

  const [search, setSearch] = useState<string>("");
  const fd = options?.filter((data: any) =>
    data?.label?.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelectKaryawanByUnitKerja(uniKerjaId: number) {
    // console.log(listKaryawan);
    const selectedKaryawan = listKaryawan
      .filter((karyawan: any) => karyawan?.unit_kerja?.id === uniKerjaId)
      .map((karyawan: any) => ({
        value: karyawan.id,
        label: karyawan.user.nama,
      }));
    // console.log(selectedKaryawan);
    setSelected(selectedKaryawan);
  }

  return (
    <Accordion allowToggle mb={4}>
      <AccordionItem bg={"var(--divider)"} borderRadius={8} border={"none"}>
        <AccordionButton>
          <HStack w={"100%"} justify={"space-between"}>
            <Text>Pilih Karyawan Berdasarkan Unit Kerja</Text>
            <AccordionIcon />
          </HStack>
        </AccordionButton>
        <AccordionPanel px={4}>
          {!options && <ComponentSpinner minH={"300px"} />}

          <InputGroup
            position={"sticky"}
            top={0}
            mb={4}
            // bg={useBodyColor()}
            zIndex={2}
          >
            <InputLeftElement>
              <Icon as={RiSearch2Line} fontSize={iconSize} opacity={0.4} />
            </InputLeftElement>

            <Input
              name="search"
              placeholder="Pencarian"
              border={"0 !important"}
              borderBottom={"1px solid var(--divider) !important"}
              borderRadius={"0 !important"}
              _focus={{
                border: "0 !important",
                borderBottom: "1px solid var(--p500) !important",
              }}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              value={search}
            />
          </InputGroup>

          <Wrap spacing={2}>
            {options && (
              <>
                {fd.length === 0 && <NotFound minH={"300px"} />}

                {fd.length > 0 &&
                  fd?.map((item: any, i: number) => (
                    <Button
                      key={i}
                      className="btn-outline"
                      borderRadius={"full"}
                      onClick={() => {
                        handleSelectKaryawanByUnitKerja(item.id);
                      }}
                    >
                      {item?.label}
                    </Button>
                  ))}
              </>
            )}
          </Wrap>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

interface Props {
  id: string;
  name: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  options?: Interface__SelectOption[];
  listKaryawan: any;
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

export default function MultipleSelectModalKaryawanPenerimaKaryawan({
  id,
  name,
  isOpen,
  onOpen,
  onClose,
  options,
  listKaryawan,
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

  const [selectAll, setSelectAll] = useState<boolean>(false);

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

  useEffect(() => {
    if (options?.length === selected?.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [isOpen, options, selected]);

  // SX
  const sh = useScreenHeight();
  const errorColor = useErrorColor();

  return (
    <>
      <Tooltip
        label={
          inputValue && inputValue.length > 0
            ? `${inputValue && inputValue.map((item) => ` ${item.label}`)}`
            : placeholder
        }
        placement="bottom-start"
        openDelay={500}
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
          <Box
            w={"100%"}
            overflowX={inputValue && inputValue.length > 0 ? "auto" : "hidden"}
            className="noScroll"
          >
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
                  whiteSpace={"nowrap"}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
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
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        isCentered={sh < 650 ? false : true}
        scrollBehavior={sh < 650 ? "outside" : "inside"}
        blockScrollOnMount={false}
        size={"lg"}
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
            <Box>
              <DisclosureHeader title={placeholder || "Multi Pilih"} />
            </Box>
          </ModalHeader>

          <ModalBody className="scrollY">
            <Alert
              flexShrink={0}
              // status="warning"
              mb={responsiveSpacing}
              alignItems={"start"}
            >
              <AlertIcon />
              <AlertDescription maxW={"640px !important"}>
                Klik Unit Kerja untuk memilih karyawan di unit kerja tersebut
              </AlertDescription>
            </Alert>

            <ListUnitKerja
              listKaryawan={listKaryawan}
              setSelected={setSelected}
            />

            {(withSearch ||
              (optionsDisplay === "list" && options && options?.length > 10) ||
              (optionsDisplay === "chip" &&
                options &&
                options?.length > 20)) && (
              <Box pb={responsiveSpacing}>
                <SearchComponent
                  name="search select options"
                  inputValue={search}
                  onChangeSetter={(inputValue) => {
                    setSearch(inputValue);
                  }}
                />
              </Box>
            )}

            {fo && (
              <>
                <Box
                  onClick={() => {
                    if (!selectAll) {
                      setSelected(options);
                    } else {
                      setSelected(undefined);
                    }
                  }}
                  w={"fit-content"}
                  mb={4}
                >
                  <Checkbox
                    name="semua_karyawan"
                    onChange={(e) => setSelectAll(e.target.checked)}
                    isChecked={selectAll}
                    colorScheme="ap"
                  >
                    <Text mt="-2.5px" color={"p.500"} fontWeight={500}>
                      Pilih Semua
                    </Text>
                  </Checkbox>
                </Box>

                {fo.length > 0 && (
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
                                setSelectAll(false);
                              } else {
                                // Add the option to the selected array
                                //@ts-ignore
                                if (selected?.length + 1 === options?.length) {
                                  setSelectAll(true);
                                }
                                newSelected = [...newSelected, option];
                              }

                              setSelected(newSelected);
                            }}
                            borderColor={
                              selected &&
                              selected.some(
                                (item) => item.value === option.value
                              )
                                ? "var(--p500)"
                                : "transparent !important"
                            }
                            bg={
                              selected &&
                              selected.some(
                                (item) => item.value === option.value
                              )
                                ? "var(--p500a5) !important"
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
                      <Wrap pb={"1px"}>
                        {fo.map((option, i) => (
                          <Button
                            key={i}
                            justifyContent={"space-between"}
                            className="btn-outline"
                            borderRadius={"full"}
                            borderColor={
                              selected &&
                              selected.some(
                                (item) => item.value === option.value
                              )
                                ? "var(--p500)"
                                : ""
                            }
                            bg={
                              selected &&
                              selected.some(
                                (item) => item.value === option.value
                              )
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
                                setSelectAll(false);
                              } else {
                                //@ts-ignore
                                if (selected?.length + 1 === options?.length) {
                                  setSelectAll(true);
                                }
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
                  </>
                )}

                {fo.length === 0 && (
                  <NotFound minH={"300px"} label="Opsi tidak ditemukan" />
                )}
              </>
            )}

            {!fo && <ComponentSpinner my={"auto"} />}
          </ModalBody>

          <ModalFooter gap={2}>
            <Button
              className="btn-solid clicky"
              w={"100%"}
              onClick={() => {
                setSelected([]);
                setSelectAll(false);
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
