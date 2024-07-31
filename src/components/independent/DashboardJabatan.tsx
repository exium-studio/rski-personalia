import { Box, HStack, StackProps, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useBodyColor } from "../../constant/colors";
import { Jabatan__Interface } from "../../constant/interfaces";
import Skeleton from "./Skeleton";
import {
  dashboardItemHeight,
  dashboardItemMinWidth,
  responsiveSpacing,
} from "../../constant/sizes";
import FlexLine from "./FlexLine";

interface Props extends StackProps {}

export default function DashboardJabatan({ ...props }: Props) {
  //! DEBUG
  const dummy = [
    {
      nama: "CEO",
      jumlah: 1,
    },
    {
      nama: "CTO",
      jumlah: 4,
    },
    {
      nama: "CFO",
      jumlah: 2,
    },
    {
      nama: "HRD",
      jumlah: 5,
    },
    {
      nama: "Manager",
      jumlah: 16,
    },
    {
      nama: "Staff",
      jumlah: 254,
    },
    {
      nama: "Dokter Hewan",
      jumlah: 10,
    },
    {
      nama: "Dokter Gigi",
      jumlah: 10,
    },
    {
      nama: "Dokter Bedah",
      jumlah: 10,
    },
    {
      nama: "Dokter Anak",
      jumlah: 10,
    },
    {
      nama: "Dokter Kulit",
      jumlah: 10,
    },
    {
      nama: "Dokter Palsu",
      jumlah: 10,
    },
    {
      nama: "Office Boy",
      jumlah: 10,
    },
  ];
  //! DEBUG

  const [data] = useState<Jabatan__Interface[] | null>(dummy);
  const [loading] = useState<boolean>(false);
  useEffect(() => {
    //TODO api get data dashboard jenis kelamin
  }, []);

  // SX
  const bodyColor = useBodyColor();

  return (
    <>
      {loading && <Skeleton flex={"1 1 0"} h={"100%"} minH={"400px"} />}

      {!loading && data && (
        <VStack
          align={"stretch"}
          bg={bodyColor}
          borderRadius={12}
          minW={dashboardItemMinWidth}
          gap={0}
          h={dashboardItemHeight}
          {...props}
        >
          <Box p={responsiveSpacing}>
            <Text fontWeight={600}>Jabatan</Text>
            <Text fontSize={14} opacity={0.6}>
              Karyawan saat ini
            </Text>
          </Box>

          <VStack
            align={"stretch"}
            gap={4}
            pb={responsiveSpacing}
            overflowY={"auto"}
            px={responsiveSpacing}
            // className="scrollY"
          >
            {data.map((jabatan, i) => (
              <HStack key={i} justify={"space-between"}>
                <Text fontSize={14} flexShrink={0}>
                  {jabatan.nama}
                </Text>
                <FlexLine />
                <Text fontSize={14}>{jabatan.jumlah}</Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      )}
    </>
  );
}
