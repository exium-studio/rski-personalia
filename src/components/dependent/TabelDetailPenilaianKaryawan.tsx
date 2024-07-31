import {
  Avatar,
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { RiArrowDownLine, RiArrowUpLine } from "@remixicon/react";
import { useState } from "react";
import { useBodyColor, useContentBgColor } from "../../constant/colors";
import { Tabel__Column__Interface } from "../../constant/interfaces";
import ComponentSpinner from "../independent/ComponentSpinner";
import TabelContainer from "../wrapper/CustomTableContainer";
import TabelFooterConfig from "./TabelFooterConfig";

interface Props {
  data: any;
}

export default function TabelDetailPenilaianKaryawan({ data }: Props) {
  const columns: Tabel__Column__Interface[] = [
    {
      key: "nama",
      label: "Nama Penilai",
      dataType: "avatarAndName",
    },
    {
      key: "unit_kerja",
      label: "Unit Kerja",
      dataType: "string",
    },
    {
      key: "jabatan",
      label: "Jabatan",
      dataType: "string",
    },
    {
      key: "rata_rata",
      label: "Rata-rata",
      dataType: "number",
    },
  ];

  const [loading] = useState<boolean>(false);

  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);

  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);

  // Sort Config
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>({ key: columns[0].key, direction: "asc" });
  const sortedData = [...data];
  if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      //@ts-ignore
      let aValue = a[sortConfig.key];
      //@ts-ignore
      let bValue = b[sortConfig.key];

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1; // Nilai null di bawah
      if (bValue === null) return -1; // Nilai null di bawah

      //@ts-ignore
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      //@ts-ignore
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }
  const sort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // SX
  const contentBgColor = useContentBgColor();
  const bodyColor = useBodyColor();

  return (
    <>
      {loading && <ComponentSpinner mt={4} />}

      {!loading && data && (
        <TabelContainer noTopNavs customReducer={24}>
          <Table>
            <Thead>
              <Tr>
                {columns.map((column, i) => (
                  <Th
                    key={i}
                    whiteSpace={"nowrap"}
                    onClick={() => {
                      sort(column.key);
                    }}
                    cursor={"pointer"}
                    borderBottom={"none !important"}
                    bg={bodyColor}
                    zIndex={2}
                    p={0}
                    {...column.thProps}
                  >
                    <HStack
                      justify={
                        column.preferredTextAlign === "center"
                          ? "center"
                          : column.dataType === "numeric"
                          ? "flex-end"
                          : "space-between"
                      }
                      borderBottom={"1px solid var(--divider3)"}
                      px={4}
                      py={3}
                      h={"52px"}
                      pl={i === 0 ? 4 : ""}
                      pr={i === columns.length - 1 ? 4 : ""}
                      {...column.thContentProps}
                    >
                      <Text fontWeight={600} flexShrink={0} lineHeight={1.2}>
                        {column.label}
                      </Text>

                      {sortConfig && sortConfig.key === column.key && (
                        <>
                          {sortConfig.direction === "asc" ? (
                            <Icon
                              as={RiArrowUpLine}
                              color={"p.500"}
                              fontSize={16}
                            />
                          ) : (
                            <Icon
                              as={RiArrowDownLine}
                              color={"p.500"}
                              fontSize={16}
                            />
                          )}
                        </>
                      )}
                    </HStack>
                  </Th>
                ))}
              </Tr>
            </Thead>

            <Tbody>
              {sortedData.map((row, rowIndex) => (
                <Tr
                  h={"72px"}
                  key={row.id}
                  bg={rowIndex % 2 === 0 ? contentBgColor : bodyColor}
                >
                  <Td pl={4} whiteSpace={"nowrap"}>
                    <HStack>
                      <Avatar size={"sm"} name={"dummy"} src={"dummy"} />
                      <Text>{"dummy"}</Text>
                    </HStack>
                  </Td>
                  <Td whiteSpace={"nowrap"}>{row.hubungan}</Td>
                  <Td whiteSpace={"nowrap"}>{row.pendidikan_terakhir}</Td>
                  <Td whiteSpace={"nowrap"}>{row.pekerjaan}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TabelContainer>
      )}

      <TabelFooterConfig
        limitConfig={limitConfig}
        setLimitConfig={setLimitConfig}
        pageConfig={pageConfig}
        setPageConfig={setPageConfig}
        paginationData={{
          prev_page_url: "",
          next_page_url: "",
          last_page: 1,
        }}
      />
    </>
  );
}
