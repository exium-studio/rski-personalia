import {
  Box,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RiSearch2Line } from "@remixicon/react";
import { useEffect, useState } from "react";
import { useBodyColor } from "../../constant/colors";
import { Pengumuman__Interface } from "../../constant/interfaces";
import {
  dashboardItemHeight,
  dashboardItemMinWidth,
  responsiveSpacing,
} from "../../constant/sizes";
import Skeleton from "./Skeleton";

import DashboardBuatPengumumanModal from "./DashboardBuatPengumumanModal";
import DashboardPengumumanItemDetail from "./DashboardPengumumanItemDetail";

interface Props extends StackProps {}

export default function DashboardPengumuman({ ...props }: Props) {
  //! DEBUG
  const dummy = [
    {
      id: 1,
      judul: "Judul Pengumuman",
      pengumuman:
        "Contoh isi pengumuman, bisa pendek, bisa sangat amat panjang sekali seperti ini, ber tele - tele kaya lele",
      tgl_berakhir:
        "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
      created_at: "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
      updated_at: "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
    },
    {
      id: 2,
      judul: "Judul Pengumuman",
      pengumuman:
        "Contoh isi pengumuman, bisa pendek, bisa sangat amat panjang sekali seperti ini, tambahan aja",
      tgl_berakhir:
        "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
      created_at: "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
      updated_at: "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
    },
    {
      id: 3,
      judul: "Judul Pengumuman",
      pengumuman: "Contoh isi pengumuman, bisa pendek",
      tgl_berakhir:
        "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
      created_at: "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
      updated_at: "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
    },
    {
      id: 4,
      judul: "Judul Pengumuman",
      pengumuman:
        "Contoh isi pengumuman, bisa pendek, bisa sangat amat panjang sekali seperti ini, bisa diberi keterangan ditujukan pada siapa",
      tgl_berakhir:
        "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
      created_at: "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
      updated_at: "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
    },
    {
      id: 5,
      judul: "Judul Pengumuman",
      pengumuman:
        "Contoh isi pengumuman, bisa pendek, bisa sangat amat panjang sekali seperti ini, tidak bisa insert link atau semacamnya",
      tgl_berakhir:
        "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
      created_at: "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
      updated_at: "Tue May 07 2024 21:13:25 GMT+0700 (Western Indonesia Time)",
    },
  ];
  //! DEBUG

  const [search, setSearch] = useState<string>("");
  const [data] = useState<Pengumuman__Interface[] | null>(dummy);
  const [loading] = useState<boolean>(false);
  useEffect(() => {
    //TODO api get data dashboard jenis kelamin
  }, []);

  // SX
  const bodyColor = useBodyColor();

  return (
    <>
      {loading && <Skeleton flex={"1 1 0"} h={"100%"} minH={"300px"} />}

      {!loading && (
        <VStack
          align={"stretch"}
          bg={bodyColor}
          borderRadius={12}
          gap={0}
          minW={dashboardItemMinWidth}
          overflowX={"hidden"}
          h={dashboardItemHeight}
          {...props}
        >
          <Box p={responsiveSpacing}>
            <HStack
              justify={"space-between"}
              mb={responsiveSpacing}
              align={"start"}
            >
              <Box>
                <Text fontWeight={600}>Pengumuman</Text>
                <Text fontSize={14} opacity={0.6}>
                  Pengumuman saat ini
                </Text>
              </Box>

              <DashboardBuatPengumumanModal />
            </HStack>

            <HStack>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={RiSearch2Line} />
                </InputLeftElement>
                <Input
                  name="search"
                  placeholder="Pencarian"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  value={search}
                />
              </InputGroup>
            </HStack>
          </Box>

          <VStack
            align={"stretch"}
            overflowY={"auto"}
            className="scrollX scrollY"
            flex={1}
            gap={0}
          >
            {!data && (
              <Text m={"auto"} opacity={0.6}>
                Tidak ada pengumuman
              </Text>
            )}

            {data &&
              data.map((pengumuman, i) => (
                <DashboardPengumumanItemDetail
                  key={i}
                  data={pengumuman}
                  borderBottom={
                    i < data.length - 1 ? "1px solid var(--divider2)" : ""
                  }
                />
              ))}
          </VStack>
        </VStack>
      )}
    </>
  );
}
