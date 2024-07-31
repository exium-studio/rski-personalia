import { Box, Image, Stack, Text, VStack } from "@chakra-ui/react";
import FormLogin from "../../components/form/Auth/FormLogin";
import CContainer from "../../components/wrapper/CContainer";
import Container from "../../components/wrapper/Container";

export default function Login() {
  return (
    <Container>
      <CContainer>
        <Stack flexDir={["column", null, "row"]} minH={"100vh"} w={"100%"}>
          <VStack
            align={"stretch"}
            justify={"space-between"}
            minH={"100vh"}
            py={6}
            px={[6, null, 12]}
            maxW={"450px"}
          >
            <VStack align={"flex-start"} mb={6}>
              <Image
                src={"/logo512.png"}
                w={"180px"}
                mx={["auto", null, "0"]}
              />
            </VStack>

            <Box>
              <Text fontSize={24} fontWeight={600}>
                Selamat Datang!
              </Text>
              <Text opacity={0.6} mb={8}>
                Masuk untuk mendapatkan akses tak terbatas ke data & informasi
              </Text>

              <FormLogin />
            </Box>

            <Text opacity={0.6} mt={6}>
              Copyright 2024 RSKI All right Reserved
            </Text>
          </VStack>

          <VStack p={6} minH={"400px"} h={"100vh"} flex={1}>
            <VStack
              borderRadius={20}
              justify={"flex-end"}
              align={"flex-start"}
              p={4}
              overflow={"clip"}
              w={"100%"}
              bgImage={"/images/login.png"}
              bgSize={"cover"}
              bgPos={"center"}
              flex={1}
            >
              <VStack
                // maxW={"700px"}
                bg={"blackAlpha.600"}
                color={"white"}
                p={4}
                borderRadius={12}
                backdropFilter={"blur(5px)"}
              >
                <Text>
                  “Di rumah sakit kami, kami memberikan perawatan yang tak
                  tertandingi, di mana keahlian berpadu dengan kasih sayang,
                  untuk memastikan hasil terbaik bagi setiap pasien”
                </Text>
              </VStack>
            </VStack>
          </VStack>
        </Stack>
      </CContainer>
    </Container>
  );
}
