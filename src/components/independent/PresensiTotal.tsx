import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Wrap,
  WrapProps,
} from "@chakra-ui/react";
import { responsiveSpacing } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import formatNumber from "../../lib/formatNumber";
import Retry from "../dependent/Retry";
import Skeleton from "./Skeleton";

interface Props extends WrapProps {
  tanggal: Date;
}

export default function PresensiTotal({ ...props }: Props) {
  const { error, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/presensi/calculated`,
    dependencies: [],
  });

  return (
    <>
      <Wrap spacing={responsiveSpacing} {...props}>
        {loading && (
          <>
            <Skeleton flex={"1 1"} h={"80px"} />
            <Skeleton flex={"1 1"} h={"80px"} />
            <Skeleton flex={"1 1"} h={"80px"} />
          </>
        )}

        {!loading && (
          <>
            {error && (
              <Center mx={"auto"}>
                <Retry loading={loading} retry={retry} />
              </Center>
            )}

            {!error && (
              <>
                {data && (
                  <>
                    <VStack
                      borderRadius={12}
                      px={responsiveSpacing}
                      justify={"center"}
                      bg={"var(--p500a4)"}
                      align={"flex-start"}
                      h={"80px"}
                      // border={"1px solid var(--divider3)"}
                    >
                      <HStack
                        align={"stretch"}
                        gap={6}
                        justify={"space-between"}
                        w={"100%"}
                      >
                        <VStack gap={0}>
                          <Text fontSize={26} fontWeight={600} color={"p.500"}>
                            {formatNumber(data?.total_karyawan)}
                          </Text>
                          <Text
                            fontSize={14}
                            opacity={0.6}
                            whiteSpace={"nowrap"}
                          >
                            Total Karyawan
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>

                    <VStack
                      borderRadius={12}
                      px={responsiveSpacing}
                      justify={"center"}
                      // bg={"var(--p500a4)"}
                      bg={"var(--divider)"}
                      align={"flex-start"}
                      flex={"1 1 350px"}
                      h={"80px"}
                    >
                      <HStack
                        align={"stretch"}
                        gap={6}
                        justify={"space-between"}
                        w={"100%"}
                      >
                        <VStack gap={0} flex={"1 1"}>
                          <Text fontSize={26} fontWeight={600} color={"p.500"}>
                            {formatNumber(
                              data?.total_tepat_waktu + data?.total_terlambat
                            )}
                          </Text>
                          <Text
                            fontSize={14}
                            opacity={0.6}
                            whiteSpace={"nowrap"}
                          >
                            Hadir Hari Ini
                          </Text>
                        </VStack>

                        <Box w={"1px"} bg={"var(--divider3)"} />

                        <VStack gap={0} flex={"1 1"}>
                          <Text
                            fontSize={26}
                            fontWeight={600}
                            color={"var(--divider-text)"}
                          >
                            {formatNumber(data?.total_tepat_waktu)}
                          </Text>
                          <Text
                            fontSize={14}
                            opacity={0.6}
                            whiteSpace={"nowrap"}
                          >
                            Tepat Waktu
                          </Text>
                        </VStack>

                        <VStack gap={0} flex={"1 1"}>
                          <Text
                            fontSize={26}
                            fontWeight={600}
                            color={"var(--divider-text)"}
                          >
                            {formatNumber(data?.total_terlambat)}
                          </Text>
                          <Text
                            fontSize={14}
                            opacity={0.6}
                            whiteSpace={"nowrap"}
                          >
                            Terlambat
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>

                    <VStack
                      borderRadius={12}
                      px={responsiveSpacing}
                      justify={"center"}
                      bg={"var(--divider)"}
                      align={"flex-start"}
                      flex={"1 1 450px"}
                      h={"80px"}
                    >
                      <HStack
                        align={"stretch"}
                        gap={6}
                        justify={"space-between"}
                        w={"100%"}
                      >
                        <VStack
                          gap={0}
                          flex={"1 1"}
                          // borderRight={"1px solid var(--divider3)"}
                        >
                          <Text
                            fontSize={26}
                            fontWeight={600}
                            color={"red.400"}
                          >
                            {formatNumber(
                              data.total_libur +
                                data?.total_cuti +
                                data?.total_absen
                            )}
                          </Text>
                          <Text
                            fontSize={14}
                            opacity={0.6}
                            whiteSpace={"nowrap"}
                          >
                            Absen Hari Ini
                          </Text>
                        </VStack>

                        <Box w={"1px"} bg={"var(--divider3)"} />

                        <VStack gap={0} flex={"1 1"}>
                          <Text
                            fontSize={26}
                            fontWeight={600}
                            color={"var(--divider-text)"}
                          >
                            {formatNumber(data.total_libur)}
                          </Text>
                          <Text
                            fontSize={14}
                            opacity={0.6}
                            whiteSpace={"nowrap"}
                          >
                            Libur
                          </Text>
                        </VStack>

                        <VStack gap={0} flex={"1 1"}>
                          <Text
                            fontSize={26}
                            fontWeight={600}
                            color={"var(--divider-text)"}
                          >
                            {formatNumber(data.total_cuti)}
                          </Text>
                          <Text
                            fontSize={14}
                            opacity={0.6}
                            whiteSpace={"nowrap"}
                          >
                            Cuti
                          </Text>
                        </VStack>

                        <VStack gap={0} flex={"1 1"}>
                          <Text
                            fontSize={26}
                            fontWeight={600}
                            color={"var(--divider-text)"}
                          >
                            {formatNumber(
                              data.total_karyawan -
                                (data.total_hadir - data.total_tidak_hadir)
                            )}
                          </Text>
                          <Text
                            fontSize={14}
                            opacity={0.6}
                            whiteSpace={"nowrap"}
                          >
                            Belum
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Wrap>
    </>
  );
}
