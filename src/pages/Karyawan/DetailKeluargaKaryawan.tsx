import {
  Avatar,
  Button,
  HStack,
  Icon,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { RiErrorWarningFill } from "@remixicon/react";
import { useState } from "react";
import TabelDetailKeluargaKaryawan from "../../components/dependent/TabelDetailKeluargaKaryawan";
import ComponentSpinner from "../../components/independent/ComponentSpinner";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useBodyColor } from "../../constant/colors";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import { dummyDetailKeluargaKaryawan } from "../../const/dummy";

export default function DetailKeluargaKaryawan() {
  const [data] = useState<any | null>(dummyDetailKeluargaKaryawan);
  const [loading] = useState<boolean>(false);

  // SX

  return (
    <CWrapper>
      <CContainer
        p={responsiveSpacing}
        flex={0}
        bg={useBodyColor()}
        borderRadius={12}
      >
        {loading && <ComponentSpinner minH={"300px"} flex={1} />}

        {!loading && data && (
          <>
            <Wrap
              spacing={responsiveSpacing}
              mb={responsiveSpacing}
              align={"center"}
            >
              <Avatar
                size={"lg"}
                src={data.user.foto_profil}
                name={data.user.nama}
              />

              <VStack align={"stretch"}>
                <Text fontSize={14} opacity={0.6}>
                  Nama Karyawan
                </Text>
                <Text fontWeight={500}>{data.user.nama}</Text>
              </VStack>

              <VStack align={"stretch"}>
                <Text fontSize={14} opacity={0.6}>
                  Jumlah Keluarga
                </Text>
                <Text fontWeight={500}>
                  {data.data_karyawan.data_keluargas.length} Anggota
                </Text>
              </VStack>

              <HStack ml={"auto"}>
                <Button
                  leftIcon={
                    <Icon as={RiErrorWarningFill} fontSize={iconSize} />
                  }
                  pl={5}
                  pr={6}
                  className="btn-ap clicky"
                  colorScheme="ap"
                >
                  Verifikasi
                </Button>
              </HStack>
            </Wrap>

            <TabelDetailKeluargaKaryawan
              data={data.data_karyawan.data_keluargas}
            />
          </>
        )}
      </CContainer>
    </CWrapper>
  );
}
