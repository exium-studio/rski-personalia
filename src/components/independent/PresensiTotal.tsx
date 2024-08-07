import { Box, HStack, Text, VStack, Wrap, WrapProps } from "@chakra-ui/react";
import { useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import formatNumber from "../../lib/formatNumber";
import Skeleton from "./Skeleton";

interface Props extends WrapProps {}

export default function PresensiTotal({ ...props }: Props) {
  const dummy = {
    hadir: {
      hadir: 489 + 31,
      tepat_waktu: 489,
      terlambat: 31,
    },
    tidak_hadir: {
      tidak_hadir: 38,
      absen: 2,
      cuti: 7,
      libur: 41,
    },
  };
  const [loading] = useState<boolean>(false);
  const [data] = useState<any | null>(dummy);

  // SX

  return (
    <Wrap spacing={responsiveSpacing} {...props}>
      {loading && (
        <>
          <Skeleton flex={"1 1"} h={"80px"} />
          <Skeleton flex={"1 1"} h={"80px"} />
          <Skeleton flex={"1 1"} h={"80px"} />
        </>
      )}
      {!loading && data && (
        <>
          <VStack
            borderRadius={12}
            px={responsiveSpacing}
            justify={"center"}
            bg={"var(--p500a4)"}
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
                  {formatNumber(data?.hadir.hadir)}
                </Text>
                <Text fontSize={14} opacity={0.6} whiteSpace={"nowrap"}>
                  Hadir
                </Text>
              </VStack>

              <Box w={"1px"} bg={"var(--p500a4)"} />

              <VStack gap={0} flex={"1 1"}>
                <Text fontSize={26} fontWeight={600} color={"p.500"}>
                  {formatNumber(data?.hadir.tepat_waktu)}
                </Text>
                <Text fontSize={14} opacity={0.6} whiteSpace={"nowrap"}>
                  Tepat Waktu
                </Text>
              </VStack>

              <VStack gap={0} flex={"1 1"}>
                <Text fontSize={26} fontWeight={600} color={"p.500"}>
                  {formatNumber(data?.hadir.terlambat)}
                </Text>
                <Text fontSize={14} opacity={0.6} whiteSpace={"nowrap"}>
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
                  color={"var(--divider-text)"}
                >
                  {formatNumber(data.tidak_hadir.tidak_hadir)}
                </Text>
                <Text fontSize={14} opacity={0.6} whiteSpace={"nowrap"}>
                  Tidak Hadir
                </Text>
              </VStack>

              <Box w={"1px"} bg={"var(--divider3)"} />

              <VStack gap={0} flex={"1 1"}>
                <Text
                  fontSize={26}
                  fontWeight={600}
                  color={"var(--divider-text)"}
                >
                  {formatNumber(data.tidak_hadir.libur)}
                </Text>
                <Text fontSize={14} opacity={0.6} whiteSpace={"nowrap"}>
                  Libur
                </Text>
              </VStack>

              <VStack gap={0} flex={"1 1"}>
                <Text
                  fontSize={26}
                  fontWeight={600}
                  color={"var(--divider-text)"}
                >
                  {formatNumber(data.tidak_hadir.cuti)}
                </Text>
                <Text fontSize={14} opacity={0.6} whiteSpace={"nowrap"}>
                  Cuti
                </Text>
              </VStack>

              <VStack gap={0} flex={"1 1"}>
                <Text fontSize={26} fontWeight={600} color={"red.400"}>
                  {formatNumber(data.tidak_hadir.absen)}
                </Text>
                <Text fontSize={14} opacity={0.6} whiteSpace={"nowrap"}>
                  Absen
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </>
      )}
    </Wrap>
  );
}
