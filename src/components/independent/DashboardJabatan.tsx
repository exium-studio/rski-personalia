import {
  Box,
  Center,
  HStack,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useBodyColor } from "../../constant/colors";
import {
  dashboardItemHeight,
  dashboardItemMinWidth,
  responsiveSpacing,
} from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import Retry from "../dependent/Retry";
import FlexLine from "./FlexLine";
import NoData from "./NoData";
import Skeleton from "./Skeleton";

interface Props extends StackProps {}

export default function DashboardJabatan({ ...props }: Props) {
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/calculated-jabatan`,
    dependencies: [],
  });

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
              align={"stretch"}
              bg={bodyColor}
              borderRadius={12}
              minW={dashboardItemMinWidth}
              gap={0}
              h={dashboardItemHeight}
              pb={responsiveSpacing}
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
                overflowY={"auto"}
                px={responsiveSpacing}
                className="scrollY"
              >
                {data.map((jabatan: any, i: number) => (
                  <HStack key={i} justify={"space-between"}>
                    <Text
                      fontSize={14}
                      whiteSpace={"nowrap"}
                      overflow={"hidden"}
                      textOverflow={"ellipsis"}
                    >
                      {jabatan.nama_jabatan}
                    </Text>
                    <FlexLine />
                    <Text fontSize={14}>{jabatan.jumlah_karyawan}</Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          )}
        </>
      )}
    </>
  );
}
