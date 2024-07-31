import { Badge, Text, VStack, Wrap } from "@chakra-ui/react";
import { useState } from "react";
import TabelDetailLaporanRiwayatPenggajian from "../../components/dependent/TabelDetailLaporanRiwayatPenggajian";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useBodyColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";

export default function DetailLaporanThr() {
  const dummy = {
    id: 1,
    periode: new Date(),
    tanggal: new Date(),
    total_karyawan: 703,
    status: "Butuh Verifikasi 2",
  };
  const [data] = useState<any | null>(dummy);

  return (
    <>
      <CWrapper>
        <CContainer p={responsiveSpacing} bg={useBodyColor()} borderRadius={12}>
          <Wrap
            spacingX={8}
            spacingY={6}
            w={"100%"}
            mb={responsiveSpacing}
            className="tabelConfig"
          >
            <VStack align={"stretch"}>
              <Text fontSize={14} opacity={0.6}>
                Periode
              </Text>
              <Text>
                {formatDate(data.periode, { month: "long", year: "numeric" })}
              </Text>
            </VStack>

            <VStack align={"stretch"}>
              <Text fontSize={14} opacity={0.6}>
                Tanggal
              </Text>
              <Text>{formatDate(data.periode)}</Text>
            </VStack>

            <VStack align={"stretch"}>
              <Text fontSize={14} opacity={0.6}>
                Total Karyawan
              </Text>
              <Text>{formatNumber(data.total_karyawan)}</Text>
            </VStack>

            <VStack align={"stretch"}>
              <Text fontSize={14} opacity={0.6}>
                Status
              </Text>
              <Badge>{data.status}</Badge>
            </VStack>
          </Wrap>

          <TabelDetailLaporanRiwayatPenggajian />
        </CContainer>
      </CWrapper>
    </>
  );
}
