import { Icon, Text, VStack } from "@chakra-ui/react";
import { RiSettings3Fill } from "@remixicon/react";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";

export default function PengaturanLanding() {
  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <CContainer
      px={responsiveSpacing}
      pb={responsiveSpacing}
      pt={0}
      h={"100%"}
      overflowY={"auto"}
      className="scrollY"
      bg={lightDarkColor}
      borderRadius={12}
      flex={"1 1 600px"}
    >
      <VStack p={responsiveSpacing} justify={"center"} flex={1}>
        <Icon as={RiSettings3Fill} fontSize={120} opacity={0.6} />
        <Text textAlign={"center"} fontWeight={600} fontSize={20} opacity={0.6}>
          Pengaturan
        </Text>
        <Text textAlign={"center"} opacity={0.4}>
          Silahkan pilih menu pengaturan
        </Text>
      </VStack>
    </CContainer>
  );
}
