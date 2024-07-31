import {
  Avatar,
  Button,
  Center,
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import {
  RiArrowDownLine,
  RiArrowRightSLine,
  RiArrowUpLine,
} from "@remixicon/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useBodyColor, useContentBgColor } from "../../constant/colors";
import { dummyKaryawanList } from "../../const/dummy";
import { Tabel__Column__Interface } from "../../constant/interfaces";
import ComponentSpinner from "../independent/ComponentSpinner";
import TabelContainer from "../wrapper/CustomTableContainer";
import TabelFooterConfig from "./TabelFooterConfig";
import BooleanBadge from "./BooleanBadge";

interface Props {
  filterConfig?: any;
}

export default function TabelVerifikasiBerkas({ filterConfig }: Props) {
  const columns: Tabel__Column__Interface[] = [
    {
      key: "nama",
      label: "Nama",
      dataType: "avatarAndName",
    },
    {
      key: "jumlah_berkas",
      label: "Jumlah Berkas",
      dataType: "string",
    },
    {
      key: "status_verifikasi",
      label: "Status Verifikasi",
      dataType: "badge",
      preferredTextAlign: "center",
    },
  ];

  //! DEBUG
  // console.log(filterConfig);
  //! DEBUG

  //TODO get karyawan

  const [data] = useState<any[] | null>(dummyKaryawanList);
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
      //@ts-ignore
      let aValue = a[sortConfig.key];
      //@ts-ignore
      let bValue = b[sortConfig.key];

      // Handle nested properties
      if (sortConfig.key === "nama") {
        aValue = a.user?.nama;
        bValue = b.user?.nama;
      } else if (sortConfig.key === "unit_kerja") {
        aValue = a.unit_kerja?.nama_unit;
        bValue = b.unit_kerja?.nama_unit;
      } else if (sortConfig.key === "kelompok_gaji") {
        aValue = a.kelompok_gaji.nama_kelompok;
        bValue = b.kelompok_gaji.nama_kelompok;
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

                  {/* Kolom tetap di sebelah kanan */}
                  <Th
                    position={"sticky"}
                    top={0}
                    right={0}
                    borderBottom={"none !important"}
                    p={0}
                    bg={bodyColor}
                    zIndex={2}
                  >
                    <Center
                      px={4}
                      py={3}
                      zIndex={99}
                      borderLeft={"1px solid var(--divider3)"}
                      borderBottom={"1px solid var(--divider3)"}
                      h={"52px"}
                    >
                      <Text>Detail</Text>
                    </Center>
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {sortedData.map((row, i) => (
                  <Tr
                    h={"72px"}
                    key={i}
                    bg={i % 2 === 0 ? contentBgColor : bodyColor}
                  >
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
                    <Td whiteSpace={"nowrap"} textAlign={"center"}>
                      <BooleanBadge
                        w={"100%"}
                        maxW={"160px"}
                        data={Math.random() < 0.5 ? 0 : 1}
                        trueValue="Diverifikasi"
                        falseValue="Belum diverifikasi"
                      />
                    </Td>

                    {/* Kolom tetap di sebelah kanan */}
                    <Td
                      position={"sticky"}
                      top={0}
                      right={0}
                      borderBottom={" none !important"}
                      p={0}
                      bg={i % 2 === 0 ? contentBgColor : bodyColor}
                      zIndex={1}
                      w={"150px"}
                    >
                      <VStack
                        borderLeft={"1px solid var(--divider3)"}
                        w={"150px"}
                        h={"72px"}
                        px={4}
                        align={"stretch"}
                        justify={"center"}
                      >
                        <Button
                          colorScheme="ap"
                          variant={"ghost"}
                          className="clicky"
                          as={Link}
                          to={`/perusahaan/verifikasi-berkas/${row.id}`}
                          rightIcon={
                            <Icon as={RiArrowRightSLine} fontSize={20} />
                          }
                          pr={3}
                        >
                          Detail
                        </Button>
                      </VStack>
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
