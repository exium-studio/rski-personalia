import {
  Box,
  Center,
  HStack,
  StackProps,
  Text,
  Tooltip,
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

export default function DashboardProfesi({ ...props }: Props) {
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/calculated-profesi`,
    dependencies: [],
    noRt: true,
  });

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
        <>
          <VStack
            flex={"1 1 0"}
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
              <Text fontWeight={600}>Profesi</Text>
              <Text fontSize={14} opacity={0.6}>
                Karyawan saat ini
              </Text>
            </Box>

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
                    <VStack
                      align={"stretch"}
                      gap={4}
                      overflowY={"auto"}
                      px={responsiveSpacing}
                      className="scrollY"
                    >
                      {data.map((profesi: any, i: number) => (
                        <HStack key={i} justify={"space-between"}>
                          <Tooltip
                            label={profesi.nama_kompetensi}
                            openDelay={500}
                            // placement="right"
                          >
                            <Text
                              fontSize={14}
                              whiteSpace={"nowrap"}
                              overflow={"hidden"}
                              textOverflow={"ellipsis"}
                            >
                              {profesi.nama_kompetensi}
                            </Text>
                          </Tooltip>

                          <FlexLine />

                          <Text fontSize={14}>{profesi.jumlah_karyawan}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </>
                )}
              </>
            )}
          </VStack>
        </>
      )}
    </>
  );
}
