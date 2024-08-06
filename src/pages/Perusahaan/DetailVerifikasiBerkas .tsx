import {
  Avatar,
  Button,
  ButtonGroup,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { RiFileLine } from "@remixicon/react";
import { useState } from "react";
import ComponentSpinner from "../../components/independent/ComponentSpinner";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useBodyColor } from "../../constant/colors";
import { dummyDetailKaryawan } from "../../const/dummy";
import { responsiveSpacing } from "../../constant/sizes";
import formatNumber from "../../lib/formatNumber";

export default function DetailVerifikasiBerkas() {
  const dummy = [
    {
      filename: "Nama File.jpg",
      size: "1.2kb",
    },
    {
      filename: "Nama File.jpg",
      size: "1.2kb",
    },
    {
      filename: "Nama File.jpg",
      size: "1.2kb",
    },
    {
      filename: "Nama File.jpg",
      size: "1.2kb",
    },
    {
      filename: "Nama File.jpg",
      size: "1.2kb",
    },
    {
      filename: "Nama File.jpg",
      size: "1.2kb",
    },
    {
      filename: "Nama File.jpg",
      size: "1.2kb",
    },
  ];
  const [data] = useState<any | null>(dummyDetailKaryawan);
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
                  Total Berkas
                </Text>
                <Text fontWeight={500}>{formatNumber(12)}</Text>
              </VStack>
            </Wrap>

            <SimpleGrid columns={[2, 3, 4, 5]} gap={responsiveSpacing}>
              {dummy.map((berkas: any, i: number) => (
                <VStack
                  key={i}
                  bg={"var(--divider)"}
                  borderRadius={6}
                  p={responsiveSpacing}
                  cursor={"pointer"}
                  gap={0}
                >
                  <Icon as={RiFileLine} fontSize={52} mb={2} />
                  <Text>{berkas.filename}</Text>
                  <Text>{berkas.size}</Text>
                </VStack>
              ))}
            </SimpleGrid>

            <ButtonGroup ml={"auto"} mt={responsiveSpacing}>
              <Button colorScheme="red" variant={"outline"} className="clicky">
                Ditolak
              </Button>
              <Button colorScheme="ap" className="btn-ap clicky">
                Disetujui
              </Button>
            </ButtonGroup>
          </>
        )}
      </CContainer>
    </CWrapper>
  );
}
