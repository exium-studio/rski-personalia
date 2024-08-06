import { Avatar, Text, VStack, Wrap } from "@chakra-ui/react";
import { useState } from "react";
import TabelDetailPenilaianKaryawan from "../../components/dependent/TabelDetailPenilaianKaryawan";
import ComponentSpinner from "../../components/independent/ComponentSpinner";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useBodyColor } from "../../constant/colors";
import { dummyDetailKeluargaKaryawan } from "../../const/dummy";
import { responsiveSpacing } from "../../constant/sizes";

export default function DetailPenilaianKaryawan() {
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
                  Unit Kerja
                </Text>
                <Text fontWeight={500}>
                  {data.data_karyawan.data_keluargas.length}
                </Text>
              </VStack>

              <VStack align={"stretch"}>
                <Text fontSize={14} opacity={0.6}>
                  Jabatan
                </Text>
                <Text fontWeight={500}>dummy</Text>
              </VStack>

              <VStack align={"stretch"}>
                <Text fontSize={14} opacity={0.6}>
                  Total Rata-rata
                </Text>
                <Text fontWeight={500}>dummy</Text>
              </VStack>
            </Wrap>

            <TabelDetailPenilaianKaryawan
              data={data.data_karyawan.data_keluargas}
            />
          </>
        )}
      </CContainer>
    </CWrapper>
  );
}
