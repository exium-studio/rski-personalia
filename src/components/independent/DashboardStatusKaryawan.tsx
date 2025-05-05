import {
  Box,
  Center,
  HStack,
  StackProps,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { colorSchemesHex, useBodyColor } from "../../constant/colors";
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
  const labels = data?.map((item: any) => item?.status_karyawan.label);
  const datasets = [
    {
      label: "Jumlah Karyawan",
      data: data?.map((item: any) => item.jumlah_karyawan),
      backgroundColor: data?.map(
        (item: any) =>
          colorSchemesHex[item?.status_karyawan?.id % colorSchemesHex.length]
      ),
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
                      {data.map((item: any, i: number) => (
                        <HStack key={i} gap={4}>
                          <Box
                            w={"10px"}
                            h={"10px"}
                            borderRadius={"full"}
                            bg={
                              colorSchemesHex[
                                item?.status_karyawan?.id %
                                  colorSchemesHex.length
                              ]
                            }
                          />
                          <Text>{item.status_karyawan.label}</Text>
                          <Text ml={"auto"}>{item.jumlah_karyawan}</Text>
                        </HStack>
                      ))}
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
