import { Box, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { Outlet, Route, Routes } from "react-router-dom";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import FormForgotPasswordStep1 from "../../components/form/Auth/FormForgotPasswordStep1";
import FormForgotPasswordStep2 from "../../components/form/Auth/FormForgotPasswordStep2";
import FormForgotPasswordStep3 from "../../components/form/Auth/FormForgotPasswordStep3";
import FormLogin from "../../components/form/Auth/FormLogin";
import CContainer from "../../components/wrapper/CContainer";
import Container from "../../components/wrapper/Container";
import { useLightDarkColor } from "../../constant/colors";
import MissingPage from "../Error/MissingPage";

const PagesLayout = () => {
  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <Container>
      <CContainer>
        <Stack
          flexDir={["column", null, "row"]}
          minH={"100vh"}
          w={"100%"}
          h={"100%"}
          align={"stretch"}
        >
          <VStack
            align={"stretch"}
            justify={"space-between"}
            minH={"100vh"}
            py={6}
            px={[6, null, 12]}
            maxW={"450px"}
            w={"100%"}
          >
            <VStack h={"200px"} align={"flex-start"} mb={6}>
              <Image
                src={"/logo512.png"}
                h={"140px"}
                mx={["auto", null, "0"]}
              />
            </VStack>

            <Box>
              <Outlet />
            </Box>

            <CContainer h={"200px"} justify={"end"}>
              <Text opacity={0.6} mt={6}>
                Copyright 2024 RSKI All right Reserved
              </Text>
            </CContainer>
          </VStack>

          <VStack p={6} minH={"300px"} flex={1}>
            <VStack
              borderRadius={12}
              justify={"space-between"}
              align={"flex-start"}
              p={4}
              overflow={"clip"}
              w={"100%"}
              bgImage={"/images/login.png"}
              bgSize={"cover"}
              bgPos={"center"}
              flex={1}
            >
              <ColorModeSwitcher
                ml={"auto"}
                bg={`${lightDarkColor} !important`}
                _hover={{ bg: `${lightDarkColor} !important` }}
                _active={{ bg: `${lightDarkColor} !important` }}
              />

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
};

export default function Auth() {
  return (
    <Routes>
      <Route path="/*" element={<PagesLayout />}>
        <Route index element={<FormLogin />} />
        <Route
          path={"forgot-password-1"}
          element={<FormForgotPasswordStep1 />}
        />
        <Route
          path={"forgot-password-2/:email"}
          element={<FormForgotPasswordStep2 />}
        />
        <Route
          path={"forgot-password-3/:email/:otp"}
          element={<FormForgotPasswordStep3 />}
        />

        <Route path={"*"} element={<MissingPage />} />
      </Route>
    </Routes>
  );
}
