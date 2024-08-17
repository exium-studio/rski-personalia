import {
  Avatar,
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
import NoData from "./NoData";
import Skeleton from "./Skeleton";
import formatDurationShort from "../../lib/formatDurationShort";

interface Props extends StackProps {}

export default function DashboardSiapaYangLembur({ ...props }: Props) {
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/get-lembur-today`,
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
        <VStack
          align={"stretch"}
          bg={bodyColor}
          borderRadius={12}
          gap={0}
          minW={dashboardItemMinWidth}
          pb={responsiveSpacing}
          h={dashboardItemHeight}
          {...props}
        >
          <Box p={responsiveSpacing}>
            <Text fontWeight={600}>Karyawan Lembur</Text>
            <Text fontSize={14} opacity={0.6}>
              Karyawan yang lembur hari ini
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
              {!loading && data && (
                <VStack
                  align={"stretch"}
                  gap={responsiveSpacing}
                  overflowY={"auto"}
                  px={responsiveSpacing}
                  className="scrollX scrollY"
                  // className="scrollY"
                >
                  {data.map((karyawan: any, i: number) => (
                    <HStack key={i}>
                      <Avatar
                        name={karyawan.user.nama}
                        src={karyawan.user.foto_profil}
                      />
                      <Box>
                        <Text mb={1}>{karyawan.user.nama}</Text>
                        <Text opacity={0.6} fontSize={12}>
                          {karyawan.unit_kerja.nama_unit}
                        </Text>
                      </Box>

                      <Box ml={"auto"}>
                        {formatDurationShort(karyawan.durasi)}
                      </Box>
                    </HStack>
                  ))}
                </VStack>
              )}
            </>
          )}
        </VStack>
      )}
    </>
  );
}
