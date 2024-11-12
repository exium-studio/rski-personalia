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
    noRt: true,
  });
  const labels = [
    "Tetap",
    "Kontrak",
    "Magang",
    "Outsourcing",
    "Paruh Waktu",
    "Dokter Mitra",
  ];
  const datasets = [
    {
      label: "Jumlah Karyawan",
      data: [
        data?.[0]?.jumlah_karyawan,
        data?.[1]?.jumlah_karyawan,
        data?.[2]?.jumlah_karyawan,
        data?.[3]?.jumlah_karyawan,
        data?.[4]?.jumlah_karyawan,
        data?.[5]?.jumlah_karyawan,
      ],
      backgroundColor: [
        "#805AD5",
        "#90CDF4",
        "#FBD38D",
        "#A0AEC0",
        "#FBB6CE",
        "#81E6D9",
      ],
      borderWidth: 0,
    },
  ];

  // SX
  const bodyColor = useBodyColor();

  return (
    <>
      {loading && (
        <Skeleton
          flex={"1 1 0"}
          borderRadius={12}
          h={dashboardItemHeight}
          minW={dashboardItemMinWidth}
        />
      )}

      {!loading && (
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
          <Text fontWeight={600}>Status Karyawan</Text>
          <Text fontSize={14} opacity={0.6}>
            Karyawan saat ini
          </Text>

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
              {data && (
                <>
                  <Wrap m={"auto"} spacingX={10}>
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
                          bg={"purple.400"}
                        />

                        <Text>Tetap</Text>

                        <Text ml={"auto"}>{data[0].jumlah_karyawan}</Text>
                      </HStack>

                      <HStack gap={4}>
                        <Box
                          borderRadius={"full"}
                          w={"10px"}
                          h={"10px"}
                          bg={"blue.200"}
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
                          bg={"orange.200"}
                        />
                        <Text>Magang</Text>

                        <Text pl={2} ml={"auto"}>
                          {data[2].jumlah_karyawan}
                        </Text>
                      </HStack>

                      <HStack gap={4}>
                        <Box
                          borderRadius={"full"}
                          w={"10px"}
                          h={"10px"}
                          bg={"gray.400"}
                        />

                        <Text>Outsourcing</Text>

                        <Text ml={"auto"}>{data[3].jumlah_karyawan}</Text>
                      </HStack>

                      <HStack gap={4}>
                        <Box
                          borderRadius={"full"}
                          w={"10px"}
                          h={"10px"}
                          bg={"pink.200"}
                        />
                        <Text>Paruh Waktu</Text>

                        <Text pl={2} ml={"auto"}>
                          {data[4].jumlah_karyawan}
                        </Text>
                      </HStack>

                      <HStack gap={4}>
                        <Box
                          borderRadius={"full"}
                          w={"10px"}
                          h={"10px"}
                          bg={"teal.200"}
                        />
                        <Text>Dokter Mitra</Text>

                        <Text pl={2} ml={"auto"}>
                          {data[5].jumlah_karyawan}
                        </Text>
                      </HStack>
                    </VStack>
                  </Wrap>
                </>
              )}
            </>
          )}
        </VStack>
      )}
    </>
  );
}
