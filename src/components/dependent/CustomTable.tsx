import {
  Box,
  Center,
  Checkbox,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Table,
  TableProps,
  TableRowProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiListCheck,
  RiMore2Fill,
} from "@remixicon/react";
import { useRef, useState } from "react";
import { useLightDarkColor } from "../../constant/colors";
import {
  Interface__FormattedTableData,
  Interface__FormattedTableHeader,
} from "../../constant/interfaces";
import { iconSize } from "../../constant/sizes";

interface BatchActionsProps {
  selectedRows: number[];
  batchActions: any[];
  selectAllRows: boolean;
  handleSelectAllRows: (isChecked: boolean) => void;
  tableRef: any;
}

const BatchActions = ({
  selectedRows,
  batchActions,
  selectAllRows,
  handleSelectAllRows,
  tableRef,
}: BatchActionsProps) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        h={"52px"}
        w={"52px"}
        borderRadius={0}
        className="btn"
        aria-label="batch actions options"
        icon={<Icon as={RiListCheck} fontSize={iconSize} />}
        _expanded={{ bg: "var(--divider3) !important" }}
      />

      <Portal containerRef={tableRef}>
        <MenuList zIndex={10} minW={"200px"}>
          <MenuGroup title={`${selectedRows.length} Terpilih`} fontWeight={400}>
            <MenuDivider />

            <MenuItem
              justifyContent={"space-between"}
              onClick={() => {
                handleSelectAllRows(selectAllRows);
              }}
              closeOnSelect={false}
            >
              <Text color={"p.500"} fontWeight={550}>
                Pilih Semua
              </Text>
              <Checkbox colorScheme="ap" isChecked={selectAllRows} />
            </MenuItem>

            <MenuDivider />

            {batchActions?.map((option, i) => {
              return option === "divider" ? (
                <MenuDivider key={i} />
              ) : (
                <Box key={i}>{option(selectedRows)}</Box>
              );
            })}
          </MenuGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
};

interface RowOptionsProps {
  rowData: any;
  rowOptions: any[];
  tableRef: any;
}

const RowOptions = ({ rowData, rowOptions, tableRef }: RowOptionsProps) => {
  // console.log("row data", row);
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        h={"60px"}
        w={"52px"}
        borderRadius={0}
        className="btn"
        aria-label="row options"
        icon={<Icon as={RiMore2Fill} fontSize={iconSize} />}
        _expanded={{ bg: "var(--divider3) !important" }}
      />

      <Portal containerRef={tableRef}>
        <MenuList zIndex={10} className="rowOptionsList" minW={"200px"}>
          {rowOptions?.map((option, i) => {
            return option === "divider" ? (
              <MenuDivider key={i} />
            ) : (
              <Box key={i}>{option(rowData)}</Box>
            );
          })}
        </MenuList>
      </Portal>
    </Menu>
  );
};

interface Props extends TableProps {
  formattedHeader: Interface__FormattedTableHeader[];
  formattedData: Interface__FormattedTableData[];
  onRowClick?: (rowData: any) => void;
  originalData?: any;
  columnsConfig?: number[];
  batchActions?: any[];
  rowOptions?: any[];
  initialSortOrder?: "asc" | "desc";
  initialSortColumnIndex?: number;
  trBodyProps?: TableRowProps;
}

export default function CustomTable({
  formattedHeader,
  formattedData,
  onRowClick,
  originalData,
  batchActions,
  columnsConfig,
  rowOptions,
  initialSortOrder,
  initialSortColumnIndex,
  trBodyProps,
  ...props
}: Props) {
  const tableHeader = columnsConfig
    ? columnsConfig.map((columnIndex) => formattedHeader[columnIndex])
    : formattedHeader;

  const tableBody = columnsConfig
    ? formattedData.map((data) => {
        const filteredColumns = columnsConfig.map(
          (columnIndex) => data.columnsFormat[columnIndex]
        );
        return { ...data, columnsFormat: filteredColumns };
      })
    : formattedData;

  const [selectAllRows, setSelectAllRows] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    sortColumnIndex: number | undefined;
    direction: "asc" | "desc";
  }>({
    sortColumnIndex: initialSortColumnIndex || undefined,
    direction: initialSortOrder || "asc",
  });

  // Row Click
  const handleRowClick = (rowData: any) => {
    if (onRowClick) {
      onRowClick(rowData);
    }
  };

  // Batch Actions
  const handleSelectAllRows = (isChecked: boolean) => {
    setSelectAllRows(!selectAllRows);
    if (!isChecked) {
      const allIds = formattedData.map((row) => row.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };
  const toggleRowSelection = (rowId: number) => {
    setSelectedRows((prevSelected) => {
      const isSelected = prevSelected.includes(rowId);

      if (isSelected) {
        setSelectAllRows(false);
        return prevSelected.filter((id) => id !== rowId);
      } else {
        if (formattedData.length === selectedRows.length + 1) {
          setSelectAllRows(true);
        }
        return [...prevSelected, rowId];
      }
    });
  };

  // Sort
  const requestSort = (columnIndex: number) => {
    setSortConfig((prevConfig) => ({
      sortColumnIndex: columnIndex,
      direction:
        prevConfig.sortColumnIndex === columnIndex &&
        prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };
  const sortedData = () => {
    if (
      sortConfig.sortColumnIndex !== undefined &&
      sortConfig.sortColumnIndex !== null
    ) {
      return tableBody.sort((a, b) => {
        //@ts-ignore
        const aValue = a.columnsFormat[sortConfig.sortColumnIndex].value;
        //@ts-ignore
        const bValue = b.columnsFormat[sortConfig.sortColumnIndex].value;

        if (
          //@ts-ignore
          a.columnsFormat[sortConfig.sortColumnIndex].isNumeric &&
          //@ts-ignore
          b.columnsFormat[sortConfig.sortColumnIndex].isNumeric
        ) {
          return sortConfig.direction === "asc"
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
        } else if (
          //@ts-ignore
          a.columnsFormat[sortConfig.sortColumnIndex].isDate &&
          //@ts-ignore
          b.columnsFormat[sortConfig.sortColumnIndex].isDate
        ) {
          const dateA = new Date(aValue as string);
          const dateB = new Date(bValue as string);
          return sortConfig.direction === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        } else if (
          //@ts-ignore
          a.columnsFormat[sortConfig.sortColumnIndex].isTime &&
          //@ts-ignore
          b.columnsFormat[sortConfig.sortColumnIndex].isTime
        ) {
          const timeA = aValue as string;
          const timeB = bValue as string;

          // Bandingkan waktu
          if (sortConfig.direction === "asc") {
            return timeA.localeCompare(timeB);
          } else {
            return timeB.localeCompare(timeA);
          }
        } else {
          return sortConfig.direction === "asc"
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        }
      });
    }
    return formattedData;
  };

  const renderSortIcon = (columnIndex: number) => {
    if (sortConfig.sortColumnIndex === columnIndex) {
      return (
        <>
          {sortConfig.direction === "asc" ? (
            <Icon as={RiArrowUpLine} color={"p.500"} fontSize={16} />
          ) : (
            <Icon as={RiArrowDownLine} color={"p.500"} fontSize={16} />
          )}
        </>
      );
    }
    return null;
  };

  const tableRef = useRef(null);

  const dataToMap =
    sortConfig.sortColumnIndex !== null &&
    sortConfig.sortColumnIndex !== undefined
      ? sortedData()
      : tableBody;

  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <>
      {/* {onRowClick && <Box w={"4px"} h={"100%"} bg={"p.500"} />} */}

      <Table
        ref={tableRef}
        minW={"0"}
        w={tableHeader.length > 1 ? "100%" : "fit-content"}
        {...props}
      >
        <Thead>
          <Tr position={"sticky"} top={0} zIndex={3}>
            {onRowClick && (
              <Td minW={"2px"} maxW={"2px"} p={0} position={"sticky"} left={0}>
                <Box w={"2px"} h={"52px"} bg={lightDarkColor} />
              </Td>
            )}

            {batchActions && (
              <Td
                h={"52px"}
                w={"52px !important"}
                minW={"0% !important"}
                maxW={"52px !important"}
                p={0}
                position={"sticky"}
                left={0}
              >
                <Center
                  h={"52px"}
                  w={"52px"}
                  borderRight={"1px solid var(--divider3)"}
                  borderBottom={"1px solid var(--divider3)"}
                  bg={lightDarkColor}
                >
                  <BatchActions
                    selectedRows={selectedRows}
                    batchActions={batchActions}
                    selectAllRows={selectAllRows}
                    handleSelectAllRows={handleSelectAllRows}
                    tableRef={tableRef}
                  />
                </Center>
              </Td>
            )}

            {tableHeader.map((header, i) => (
              <Th
                key={i}
                bg={lightDarkColor}
                whiteSpace={"nowrap"}
                onClick={() => {
                  header.isSortable && requestSort(i);
                }}
                cursor={header?.isSortable ? "pointer" : "auto"}
                borderBottom={"none !important"}
                p={0}
                {...header?.props}
              >
                <HStack
                  borderBottom={"1px solid var(--divider3)"}
                  // justify={"space-between"}
                  px={4}
                  py={3}
                  gap={4}
                  h={"52px"}
                  pl={i === 0 ? 4 : ""}
                  pr={i === formattedHeader.length - 1 ? 4 : ""}
                  {...header?.cProps}
                >
                  <Text>{header?.th}</Text>

                  {renderSortIcon(i)}
                </HStack>
              </Th>
            ))}

            {rowOptions && (
              <Td
                h={"52px"}
                w={"52px !important"}
                minW={"0% !important"}
                maxW={"52px !important"}
                p={0}
                position={"sticky"}
                right={0}
              >
                <Center
                  h={"52px"}
                  w={"52px"}
                  borderLeft={"1px solid var(--divider3)"}
                  borderBottom={"1px solid var(--divider3)"}
                  bg={lightDarkColor}
                ></Center>
              </Td>
            )}
          </Tr>
        </Thead>

        <Tbody>
          {dataToMap.map((row, rowIndex) => {
            return (
              <Tr
                key={rowIndex}
                role="group"
                transition={"200ms"}
                onClick={(e) => {
                  handleRowClick(row);
                }}
                cursor={onRowClick ? "pointer" : "auto"}
                px={2}
                borderBottom={"1px solid var(--divider)"}
                position={"relative"}
                // className={onRowClick ? "rowHoverOnClick" : ""}
                {...trBodyProps}
              >
                {onRowClick && (
                  <Td
                    minW={"2px"}
                    maxW={"2px"}
                    p={0}
                    position={"sticky"}
                    left={0}
                  >
                    <Box
                      w={"2px"}
                      h={"60px"}
                      bg={lightDarkColor}
                      _groupHover={{ bg: "p.500" }}
                    />
                  </Td>
                )}

                {batchActions && (
                  <Td
                    h={"60px"}
                    w={"52px !important"}
                    minW={"0% !important"}
                    maxW={"52px !important"}
                    p={0}
                    position={"sticky"}
                    left={0}
                    bg={lightDarkColor}
                    zIndex={2}
                    className="btn"
                  >
                    <Center
                      w={"52px"}
                      h={"60px"}
                      borderRight={"1px solid var(--divider3)"}
                      _groupHover={{
                        bg: "var(--divider)",
                      }}
                      _groupActive={
                        onRowClick ? { bg: "var(--divider2)" } : undefined
                      }
                      transition={"200ms"}
                      cursor={"pointer"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRowSelection(row.id);
                      }}
                    >
                      <Checkbox
                        colorScheme="ap"
                        // size={"lg"}
                        onChange={() => {
                          toggleRowSelection(row.id);
                        }}
                        isChecked={selectedRows.includes(row.id)}
                      />
                    </Center>
                  </Td>
                )}

                {row.columnsFormat.map((col, colIndex) => (
                  <Td
                    key={colIndex}
                    whiteSpace={"nowrap"}
                    bg={lightDarkColor}
                    p={0}
                    {...col?.props}
                  >
                    <HStack
                      _groupHover={{
                        bg: "var(--divider)",
                      }}
                      _groupActive={
                        onRowClick ? { bg: "var(--divider2)" } : undefined
                      }
                      py={3}
                      px={4}
                      h={"60px"}
                      transition={"200ms"}
                      {...col?.cProps}
                    >
                      {typeof col?.td === "string" ||
                      typeof col?.td === "number" ? (
                        <Text>{col?.td}</Text>
                      ) : (
                        col?.td
                      )}
                    </HStack>
                  </Td>
                ))}

                {rowOptions && (
                  <Td
                    h={"52px"}
                    w={"52px !important"}
                    minW={"0% !important"}
                    maxW={"52px !important"}
                    p={0}
                    position={"sticky"}
                    right={0}
                    bg={lightDarkColor}
                    zIndex={2}
                  >
                    <Center
                      h={"60px"}
                      w={"52px"}
                      borderLeft={"1px solid var(--divider3)"}
                      _groupHover={{
                        bg: "var(--divider)",
                      }}
                      _groupActive={
                        onRowClick ? { bg: "var(--divider2)" } : undefined
                      }
                      transition={"200ms"}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <RowOptions
                        rowData={row}
                        rowOptions={rowOptions}
                        tableRef={tableRef}
                      />
                    </Center>
                  </Td>
                )}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
}
