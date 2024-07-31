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
import { dummyPekerjaKontrak } from "../../const/dummy";
import { Tabel__Column__Interface } from "../../constant/interfaces";
import formatDate from "../../lib/formatDate";
import ComponentSpinner from "../independent/ComponentSpinner";
import TabelContainer from "../wrapper/CustomTableContainer";
import BooleanBadge from "./BooleanBadge";
import TabelFooterConfig from "./TabelFooterConfig";

interface Props {
  filterConfig?: any;
}

export default function TabelPekerjaKontrak({ filterConfig }: Props) {
  const columns: Tabel__Column__Interface[] = [
    {
      key: "nama",
      label: "Nama",
      dataType: "avatarAndName",
    },
    {
      key: "unit_kerja",
      label: "Unit Kerja",
      dataType: "string",
    },
    {
      key: "tgl_masuk",
      label: "Tanggal Masuk",
      dataType: "date",
    },
    {
      key: "tgl_keluar",
      label: "Tanggal Keluar",
      dataType: "date",
    },
    {
      key: "status_aktif",
      label: "Status Aktif",
      dataType: "badge",
      preferredTextAlign: "center",
    },
  ];

  //! DEBUG
  // console.log(filterConfig);
  //! DEBUG

  //TODO get karyawan

  const [data] = useState<any[] | null>(dummyPekerjaKontrak);
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
  const sortedData = data && [...data];
  if (sortConfig !== null && sortedData) {
    sortedData.sort((a, b) => {
      let aValue, bValue;

      // Tangani properti bersarang
      if (sortConfig.key === "nama") {
        aValue = a.user?.nama;
        bValue = b.user?.nama;
      } else if (sortConfig.key === "unit_kerja") {
        aValue = a.unit_kerja?.nama_unit;
        bValue = b.unit_kerja?.nama_unit;
      } else if (sortConfig.key === "status_aktif") {
        aValue = !a.tgl_keluar ? 1 : 0;
        bValue = !b.tgl_keluar ? 1 : 0;
      } else {
        //@ts-ignore
        aValue = a[sortConfig.key];
        //@ts-ignore
        bValue = b[sortConfig.key];
      }

      // Penanganan khusus untuk tanggal dan nilai null
      if (sortConfig.key === "tgl_keluar") {
        aValue = a.tgl_keluar ? new Date(a.tgl_keluar) : null;
        bValue = b.tgl_keluar ? new Date(b.tgl_keluar) : null;
      }

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1; // Nilai null di bawah
      if (bValue === null) return -1; // Nilai null di bawah

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
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

      {!loading && sortedData && (
        <>
          <TabelContainer>
            <Table minW={"100%"}>
              <Thead>
                <Tr position={"sticky"} top={0} zIndex={3}>
                  {columns.map((column, i) => (
                    <Th
                      key={i}
                      whiteSpace={"nowrap"}
                      onClick={() => {
                        if (column.dataType !== "action") {
                          sort(column.key);
                        }
                      }}
                      cursor={"pointer"}
                      borderBottom={"none !important"}
                      bg={bodyColor}
                      zIndex={2}
                      p={0}
                      {...column.thProps}
                    >
                      {column.dataType === "action" ||
                      column.dataType === "link" ? (
                        <HStack
                          justify={"center"}
                          borderBottom={"1px solid var(--divider3)"}
                          px={4}
                          py={3}
                          h={"52px"}
                          pl={i === 0 ? 4 : ""}
                          pr={i === columns.length - 1 ? 4 : ""}
                          {...column.thContentProps}
                        >
                          <Text>{column.label}</Text>
                        </HStack>
                      ) : (
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
                          <Text
                            fontWeight={600}
                            flexShrink={0}
                            lineHeight={1.2}
                          >
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
                      )}
                    </Th>
                  ))}
                </Tr>
              </Thead>

              <Tbody>
                {sortedData.map((row, i) => (
                  <Tr h={"72px"} key={i} bg={i % 2 === 0 ? contentBgColor : ""}>
                    <Td whiteSpace={"nowrap"}>
                      <HStack>
                        <Avatar
                          size={"sm"}
                          name={row.user.nama}
                          src={row.user.foto_profil}
                        />
                        <Text>{row.user.nama}</Text>
                      </HStack>
                    </Td>
                    <Td whiteSpace={"nowrap"}>{row.unit_kerja.nama_unit}</Td>
                    <Td whiteSpace={"nowrap"}>
                      {formatDate(row.tgl_masuk as string)}
                    </Td>
                    <Td whiteSpace={"nowrap"}>
                      {formatDate(row.tgl_keluar as string)}
                    </Td>
                    <Td whiteSpace={"nowrap"}>
                      <BooleanBadge
                        data={!row.tgl_keluar}
                        trueValue="Aktif"
                        falseValue="Tidak Aktif"
                        w={"100%"}
                        maxW={"120px"}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabelContainer>

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
      )}
    </>
  );
}
