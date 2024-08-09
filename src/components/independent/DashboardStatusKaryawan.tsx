import {
  Box,
  Center,
  HStack,
  StackProps,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { useBodyColor } from "../../constant/colors";
import {
  dashboardItemHeight,
  dashboardItemMinWidth,
  responsiveSpacing,
} from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import ChartDoughnut from "../dependent/ChartDoughnut";
import Retry from "../dependent/Retry";
import NoData from "./NoData";
import Skeleton from "./Skeleton";

interface Props extends StackProps {}

export default function DashboardStatusKaryawan({ ...props }: Props) {
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/calculated-kepegawaian`,
    dependencies: [],
  });
  const labels = ["Pria", "Wanita", "Magang"];
  const datasets = [
    {
      label: "Jumlah Pegawai",
      data: [
        data?.[0]?.jumlah_karyawan,
        data?.[1]?.jumlah_karyawan,
        data?.[2]?.jumlah_karyawan,
      ],
      backgroundColor: ["#FBD38D", "#805AD5", "#48BB78"],
      borderWidth: 0,
    },
  ];

  // SX
  const bodyColor = useBodyColor();

  return (
    <>
      {error && (
        <>
          {notFound && <NoData minH={"300px"} />}

          {!notFound && (
            <Center my={"auto"} minH={"300px"}>
              <Retry loading={loading} retry={retry} />
            </Center>
          )}
        </>
      )}

      {!error && (
        <>
          {loading && (
            <Skeleton
              flex={"1 1 0"}
              borderRadius={12}
              h={dashboardItemHeight}
              minW={dashboardItemMinWidth}
            />
          )}

          {!loading && data && (
            <VStack
              flex={"1 1 0"}
              align={"stretch"}
              bg={bodyColor}
              borderRadius={12}
              minW={dashboardItemMinWidth}
              p={responsiveSpacing}
              gap={0}
              h={dashboardItemHeight}
              {...props}
            >
              <Text fontWeight={600}>Status Kepegawaian</Text>
              <Text fontSize={14} opacity={0.6}>
                Karyawan saat ini
              </Text>

              <Wrap m={"auto"} spacing={responsiveSpacing}>
                <VStack
                  flex={"1 1 0"}
                  my={responsiveSpacing}
                  position={"relative"}
                >
                  <VStack w={"100%"} className="doughnutChartContainer">
                    <ChartDoughnut labels={labels} datasets={datasets} />
                  </VStack>

                  <Text
                    position={"absolute"}
                    left={"50%"}
                    top={"50%"}
                    transform={"translate(-50%, -50%)"}
                    fontSize={48}
                    opacity={0.6}
                  >
                    N
                  </Text>
                </VStack>

                <VStack
                  flex={"1 1 0"}
                  align={"stretch"}
                  justify={"center"}
                  maxW={"240px"}
                  mx={"auto"}
                >
                  <HStack gap={4}>
                    <Box
                      borderRadius={"full"}
                      w={"10px"}
                      h={"10px"}
                      bg={"orange.200"}
                    />

                    <Text>Tetap</Text>

                    <Text ml={"auto"}>{data[0].jumlah_karyawan}</Text>
                  </HStack>

                  <HStack gap={4}>
                    <Box
                      borderRadius={"full"}
                      w={"10px"}
                      h={"10px"}
                      bg={"purple.400"}
                    />
                    <Text>Kontrak</Text>

                    <Text pl={2} ml={"auto"}>
                      {data[1].jumlah_karyawan}
                    </Text>
                  </HStack>

                  <HStack gap={4}>
                    <Box
                      borderRadius={"full"}
                      w={"10px"}
                      h={"10px"}
                      bg={"green.400"}
                    />
                    <Text>Magang</Text>

                    <Text pl={2} ml={"auto"}>
                      {data[2].jumlah_karyawan}
                    </Text>
                  </HStack>
                </VStack>
              </Wrap>
            </VStack>
          )}
        </>
      )}
    </>
  );
}
