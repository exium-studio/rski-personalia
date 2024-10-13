import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  ButtonProps,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  Tooltip,
  useDisclosure,
  Wrap,
} from "@chakra-ui/react";
import { RiLayoutColumnLine } from "@remixicon/react";
import { useRef, useState } from "react";
import { Interface__ColumnConfig } from "../../constant/interfaces";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";

interface Props extends ButtonProps {
  id: string;
  clearedTableColumns: number[];
  columnsConfig: number[];
  setColumnsConfig: (tableColumns: number[]) => void;
  allColumns: Interface__ColumnConfig[];
  presetColumns: { label: string; columns: number[] }[];
  title?: string;
}

export default function ColumnsConfigModal({
  id,
  clearedTableColumns,
  columnsConfig,
  setColumnsConfig,
  allColumns,
  presetColumns,
  title,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useBackOnClose(id, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [selected, setSelected] = useState<number[]>([0]);

  // SX

  return (
    <>
      <Button
        className="btn-outline clicky"
        leftIcon={<Icon as={RiLayoutColumnLine} fontSize={iconSize} />}
        flexShrink={0}
        pl={5}
        pr={6}
        onClick={() => {
          onOpen();
          setSelected(columnsConfig);
        }}
        {...props}
      >
        Kolom
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        // scrollBehavior="inside"
        allowPinchZoom
        size={"xl"}
        blockScrollOnMount={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius={12} className="scrollY">
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title={title || "Config Kolom Tabel"} />
          </ModalHeader>

          <ModalBody className="scrollY" gap={responsiveSpacing}>
            <CContainer>
              <Text fontWeight={500} mb={2} opacity={0.6}>
                Preset Kolom
              </Text>
              <SimpleGrid columns={[1, 2, null, 3]} gap={2} flex={1}>
                {presetColumns.map((preset, i) => (
                  <Button
                    key={i}
                    // borderRadius={"full"}
                    className="btn-solid clicky"
                    onClick={() => {
                      setSelected(preset.columns);
                    }}
                  >
                    <Tooltip label={preset.label} openDelay={500}>
                      <Text
                        overflow={"hidden"}
                        whiteSpace={"nowrap"}
                        textOverflow={"ellipsis"}
                      >
                        {preset.label}
                      </Text>
                    </Tooltip>
                  </Button>
                ))}
              </SimpleGrid>
            </CContainer>

            <CContainer>
              <Text fontWeight={500} mb={2} opacity={0.6}>
                Kolom
              </Text>
              <Wrap gap={2}>
                {allColumns.map((option, i) => {
                  const ok = i !== 0;
                  return (
                    ok && (
                      <Button
                        key={i}
                        // flex={"1 1 0"}
                        // minW={"max-content"}
                        // borderRadius={"full"}
                        fontWeight={500}
                        className={"btn-outline clicky"}
                        borderColor={
                          selected && selected.some((item) => item === i)
                            ? "var(--p500)"
                            : ""
                        }
                        bg={
                          selected && selected.some((item) => item === i)
                            ? "var(--p500a5) !important"
                            : ""
                        }
                        onClick={() => {
                          const isSelected =
                            selected && selected.some((item) => item === i);
                          let newSelected = selected || [];

                          if (isSelected) {
                            // Filter out the option if it's already selected
                            newSelected = newSelected.filter(
                              (item) => item !== i
                            );
                          } else {
                            // Add the option to the selected array
                            newSelected = [...newSelected, i];
                          }

                          setSelected(newSelected);
                        }}
                      >
                        <Tooltip label={option.label} openDelay={500}>
                          <Text
                            opacity={
                              selected && selected.some((item) => item === i)
                                ? 1
                                : 0.6
                            }
                            overflow={"hidden"}
                            whiteSpace={"nowrap"}
                            textOverflow={"ellipsis"}
                          >
                            {option.label}
                          </Text>
                        </Tooltip>
                      </Button>
                    )
                  );
                })}
              </Wrap>
            </CContainer>

            <CContainer mt={"auto"}>
              <Text fontWeight={500} mb={2} opacity={0.6}>
                Urutan Kolom (dari kiri ke kanan)
              </Text>
              <Box overflowX={"auto"} className="scrollX" pb={4}>
                <HStack>
                  {selected.length === 0 && (
                    <Text opacity={0.4}>Tidak ada kolom yang dipilih</Text>
                  )}
                  {selected.map((columnIndex, i) => (
                    <Badge
                      textTransform={"none"}
                      bg={"var(--divider)"}
                      color={"var(--divider-text)"}
                      // border={"1px solid var(--p500a2)"}
                      fontWeight={450}
                      fontSize={"md"}
                      key={i}
                    >
                      {allColumns[columnIndex].label}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            </CContainer>
          </ModalBody>

          <ModalFooter>
            <CContainer>
              <ButtonGroup>
                <Button
                  w={"100%"}
                  className="btn-solid clicky"
                  onClick={() => {
                    setSelected(clearedTableColumns);
                  }}
                >
                  Clear
                </Button>
                <Button
                  w={"100%"}
                  className="btn-ap clicky"
                  colorScheme="ap"
                  isDisabled={selected.length < 2}
                  onClick={() => {
                    setColumnsConfig(selected);
                    backOnClose();
                  }}
                >
                  Terapkan
                </Button>
              </ButtonGroup>
            </CContainer>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
