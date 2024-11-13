import { Box, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DetailDataKaryawan from "../../components/dependent/DetailDataKaryawan";
import Header from "../../components/dependent/Header";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import LogoutButton from "../../components/independent/LogoutButton";
import NoData from "../../components/independent/NoData";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useGetUserData from "../../hooks/useGetUserData";

export default function Profil() {
  // SX
  const lightDarkColor = useLightDarkColor();

  const userData = useGetUserData();

  const [search, setSearch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string[]>([]);

  useEffect(() => {
    const words = search.split(" ").filter((word) => word.length > 0);
    const modifiedWords = words.reduce((acc: string[], word) => {
      acc.push(word);
      if (word.toLowerCase() === "nomor") {
        acc.push("no.");
      } else if (word.toLowerCase() === "nik") {
        acc.push("no. induk karyawan");
      }
      return acc;
    }, []);
    setSearchQuery(modifiedWords);
  }, [search]);

  return (
    <CWrapper p={"0 !important"} position={"relative"}>
      <Stack
        flexShrink={0}
        zIndex={2}
        flexDir={["column", null, null, "row"]}
        flex={1}
        align={"stretch"}
        gap={0}
        overflowY={"auto"}
      >
        <VStack
          p={responsiveSpacing}
          pt={"0 !important"}
          gap={0}
          animation={"flyInFromTop 500ms ease"}
          // minW={"400px"}
        >
          <>
            <Box minW={"50px"} flex={"1 1 50px"} bg={"#353535"} mx={"auto"} />

            <Box
              flexShrink={0}
              w={"65px"}
              h={"20px"}
              bg={"#353535"}
              mx={"auto"}
              p={1}
              borderRadius={"full"}
            >
              <Box
                w={"100%"}
                h={"100%"}
                bg={lightDarkColor}
                borderRadius={"full"}
              />
            </Box>

            <Box
              flexShrink={0}
              mt={"-5px"}
              mb={"-10px"}
              w={"16px"}
              h={"30px"}
              bg={"gray"}
              mx={"auto"}
              borderRadius={"2px"}
              zIndex={3}
            />

            <Box
              flexShrink={0}
              w={"200px"}
              h={"16px"}
              bg={"p.500"}
              mx={"auto"}
              p={1}
              borderRadius={"100px 100px 0 0"}
              border={"1px solid var(--divider3)"}
              borderBottom={"none !important"}
              zIndex={2}
              mb={"-2px"}
            >
              <Box
                mt={"2px"}
                w={"50px"}
                h={"8px"}
                bg={"p.600"}
                borderRadius={"full"}
                mx={"auto"}
              />
            </Box>
          </>

          <Box m={"auto"} flex={1}>
            <Box position={"relative"}>
              <CContainer
                bg={"p.500"}
                borderRadius={12}
                position={"relative"}
                overflowY={"auto"}
                className="admin-card"
                w={"300px"}
                mb={responsiveSpacing}
                p={1}
                border={"1px solid var(--divider3)"}
              >
                <CContainer flex={"1 1 150px"} gap={responsiveSpacing}>
                  <Image
                    src={
                      userData?.foto_profil ||
                      "/images/defaultProfilePhoto.webp"
                    }
                    aspectRatio={1}
                    borderRadius={"8px 8px 0 0"}
                    boxSize={"289.61x"}
                  />
                </CContainer>

                <CContainer
                  p={responsiveSpacing}
                  bg={"white"}
                  color={"dark"}
                  borderRadius={"0 0 8px 8px"}
                  border={"1px solid var(--divider3)"}
                  position={"relative"}
                  overflow={"clip"}
                >
                  <Text fontWeight={600} fontSize={20}>
                    {userData?.nama}
                  </Text>

                  <Text opacity={0.4}>{userData?.role?.name}</Text>

                  <HStack align={"end"} mt={12}>
                    <Text fontSize={14}>
                      {userData?.data_karyawan?.nik
                        ? `NIK ${userData?.data_karyawan?.nik}`
                        : userData?.email}
                    </Text>
                  </HStack>

                  <Image
                    src="/logo512.png"
                    position={"absolute"}
                    bottom={-16}
                    right={-16}
                    w={"200px"}
                    opacity={0.1}
                  />
                </CContainer>
              </CContainer>

              <Box
                w={"100px"}
                h={"5px"}
                bg={"p.600"}
                position={"absolute"}
                bottom={"0"}
                left={"50%"}
                transform={"translateX(-50%)"}
                zIndex={99}
              ></Box>
            </Box>
          </Box>

          <VStack flex={1.4}>
            <LogoutButton w={"300px"} mb={"auto"} mx={"auto"} />
          </VStack>
        </VStack>

        <CContainer
          flexShrink={0}
          p={responsiveSpacing}
          // pl={"0 !important"}
          flex={1}
          gap={responsiveSpacing}
          overflowY={[null, null, null, "auto"]}
        >
          <Header title="Profil" noMiniProfile />

          <CContainer
            flex={1}
            borderRadius={12}
            bg={lightDarkColor}
            overflowY={"auto"}
            pb={responsiveSpacing}
          >
            {userData?.role?.id !== 1 && (
              <HStack p={responsiveSpacing}>
                <SearchComponent
                  name="search"
                  onChangeSetter={(input) => {
                    setSearch(input);
                  }}
                  inputValue={search}
                />
              </HStack>
            )}

            <CContainer
              flex={1}
              overflowY={"auto"}
              className="scrollY"
              bg={lightDarkColor}
              gap={responsiveSpacing}
              px={responsiveSpacing}
            >
              {userData?.role?.id === 1 && <NoData minH={"300px"} />}
              {userData?.role?.id !== 1 && (
                <DetailDataKaryawan
                  nama={userData?.nama}
                  data={userData?.data_karyawan}
                  searchQuery={searchQuery}
                />
              )}
            </CContainer>
          </CContainer>
        </CContainer>
      </Stack>
    </CWrapper>
  );
}
