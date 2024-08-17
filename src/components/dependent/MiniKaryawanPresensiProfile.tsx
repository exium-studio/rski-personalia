import {
  Avatar,
  Badge,
  Box,
  HStack,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { responsiveSpacing } from "../../constant/sizes";
import formatDate from "../../lib/formatDate";
import FlexLine from "../independent/FlexLine";

interface Props extends StackProps {
  data: any;
}

export default function MiniKaryawanPresensiProfile({ data, ...props }: Props) {
  return (
    <VStack gap={responsiveSpacing} flexShrink={0} {...props}>
      <Avatar
        mb={"auto"}
        size={"xl"}
        src={data.user.foto_profil}
        name={data.user.nama}
      />

      <VStack align={"stretch"} w={"100%"} gap={3}>
        <HStack justify={"space-between"}>
          <Text fontSize={14} opacity={0.6}>
            Nama
          </Text>
          <FlexLine />
          <Text textAlign={"right"} fontWeight={500}>
            {data.user.nama}
          </Text>
        </HStack>

        <HStack justify={"space-between"}>
          <Text fontSize={14} opacity={0.6}>
            Tanggal
          </Text>{" "}
          <FlexLine />
          <Text textAlign={"right"}>
            {formatDate(data.jadwal.jam_from as string)}
          </Text>
        </HStack>

        <HStack justify={"space-between"}>
          <Text fontSize={14} opacity={0.6}>
            Jenis Karyawan
          </Text>
          <FlexLine />
          <Badge
            ml={"auto"}
            h={"24px"}
            pt={"2.5px"}
            colorScheme={data.unit_kerja.jenis_karyawan === 1 ? "ap" : "gray"}
          >
            {data.unit_kerja.jenis_karyawan === 1 ? "Shift" : "Non-Shift"}
          </Badge>
        </HStack>
      </VStack>
    </VStack>
  );
}
