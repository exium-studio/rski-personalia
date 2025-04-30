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
import { responsiveSpacing } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import formatNumber from "../../lib/formatNumber";
import Retry from "../dependent/Retry";
import Skeleton from "./Skeleton";

interface Props extends SimpleGridProps {}

export default function DashboardTotal({ ...props }: Props) {
  const statics = [
    {
      key: "total_karyawan",
      label: "Total Karyawan",
      icon: RiTeamFill,
      iconBgColor: "orange.400",
      bgColor: "orange.200",
    },
    {
      key: "karyawan_fulltime",
      label: "Karyawan Fulltime",
      icon: RiFileCopy2Fill,
      iconBgColor: "purple.400",
      bgColor: "purple.200",
    },
    {
      key: "karyawan_parttime",
      label: "Karyawan Parttime",
      icon: RiFileCopy2Fill,
      iconBgColor: "green.400",
      bgColor: "green.200",
    },
    {
      key: "karyawan_outsourcing",
      label: "Karyawan Outsourcing",
      icon: RiFileCopy2Fill,
      iconBgColor: "pink.400",
      bgColor: "pink.200",
    },
    {
      key: "jumlah_libur",
      label: "Total Libur",
      icon: RiHome4Fill,
      iconBgColor: "teal.400",
      bgColor: "teal.200",
    },
    {
      key: "jumlah_cuti",
      label: "Total Cuti",
      icon: RiLandscapeFill,
      iconBgColor: "blue.400",
      bgColor: "blue.200",
    },
  ];

  const { error, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/calculated-header`,
    dependencies: [],
    noRt: true,
  });

  return (
    <>
      {error && (
        <Center minH={"300px"} m={"auto"}>
          <Retry retry={retry} />
        </Center>
      )}

      {!error && (
        <HStack wrap={"wrap"} gap={responsiveSpacing} {...props}>
          {loading && (
            <>
              <Skeleton flex={"1 1 150px"} h={"107.94px"} borderRadius={12} />
              <Skeleton flex={"1 1 150px"} h={"107.94px"} borderRadius={12} />
              <Skeleton flex={"1 1 150px"} h={"107.94px"} borderRadius={12} />
              <Skeleton flex={"1 1 150px"} h={"107.94px"} borderRadius={12} />
              <Skeleton flex={"1 1 150px"} h={"107.94px"} borderRadius={12} />
              <Skeleton flex={"1 1 150px"} h={"107.94px"} borderRadius={12} />
            </>
          )}

          {!loading &&
            data &&
            statics.map((stat, i) => (
              <VStack
                key={i}
                align={"flex-start"}
                p={4}
                borderRadius={12}
                color={"dark"}
                bg={stat.bgColor}
                flex={"1 1 150px"}
              >
                <HStack>
                  <Center p={2} borderRadius={8} bg={stat.iconBgColor}>
                    <Icon as={stat.icon} color={"white"} />
                  </Center>

                  <Text lineHeight={1.2} fontSize={14}>
                    {stat.label}
                  </Text>
                </HStack>

                <Text fontWeight={700} fontSize={24}>
                  {formatNumber(data[stat.key] || 0)}
                </Text>
              </VStack>
            ))}
        </HStack>
      )}
    </>
  );
}
