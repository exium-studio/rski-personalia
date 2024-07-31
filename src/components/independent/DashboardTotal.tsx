import {
  Center,
  HStack,
  Icon,
  SimpleGrid,
  SimpleGridProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  RiFileCopy2Fill,
  RiHome4Fill,
  RiLandscapeFill,
  RiTeamFill,
} from "@remixicon/react";
import { useEffect, useState } from "react";
import { Dashboard__Total__Interface } from "../../constant/interfaces";
import formatNumber from "../../lib/formatNumber";
import { responsiveSpacing } from "../../constant/sizes";

interface Props extends SimpleGridProps {}

export default function DashboardTotal({ ...props }: Props) {
  //! DEBUG
  const dummy = {
    totalKaryawan: 201,
    totalLibur: 34,
    totalCuti: 21,
    totalIzinKerja: 11,
  };
  //! DEBUG

  const statics = {
    totalKaryawan: {
      label: "Total Karyawan",
      icon: RiTeamFill,
      iconBgColor: "green.400",
      bgColor: "green.200",
    },
    totalLibur: {
      label: "Total Libur",
      icon: RiHome4Fill,
      iconBgColor: "red.400",
      bgColor: "red.200",
    },
    totalCuti: {
      label: "Total Cuti",
      icon: RiLandscapeFill,
      iconBgColor: "#D7AA67",
      bgColor: "#FBD38D",
    },
    totalIzinKerja: {
      label: "Total Izin Kerja",
      icon: RiFileCopy2Fill,
      iconBgColor: "blue.400",
      bgColor: "blue.200",
    },
  };
  const [data] = useState<Dashboard__Total__Interface | null>(dummy);
  const [loading] = useState<boolean>(false);
  useEffect(() => {
    // setLoading(true);
    //TODO api get dashboard summary data
  }, []);

  return (
    <SimpleGrid columns={[1, 2, 4]} gap={responsiveSpacing} {...props}>
      {!loading &&
        data &&
        Object.entries(data).map(([key, value]) => (
          <VStack
            key={key}
            align={"flex-start"}
            p={4}
            borderRadius={12}
            color={"dark"}
            // @ts-ignore
            bg={statics[key].bgColor}
          >
            <HStack>
              {/* @ts-ignore */}
              <Center p={2} borderRadius={8} bg={statics[key].iconBgColor}>
                {/* @ts-ignore */}
                <Icon as={statics[key].icon} color={"white"} />
              </Center>

              <Text lineHeight={1.2} fontSize={14}>
                {/* @ts-ignore */}
                {statics[key].label}
              </Text>
            </HStack>

            <Text fontWeight={700} fontSize={24}>
              {formatNumber(value)}
            </Text>
          </VStack>
        ))}
    </SimpleGrid>
  );
}
