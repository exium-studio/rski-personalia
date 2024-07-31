import { Button, Image, Text, VStack } from "@chakra-ui/react";

import { Link } from "react-router-dom";

export default function MaintenancePage() {
  // SX
  // useStatusBarColor("#fff", "#191919");

  return (
    <VStack minH={"100vh"} gap={0}>
      <VStack p={8} flex={1} justify={"center"} gap={4} w={"100%"}>
        <Image src="/vectors/error503.webp" w={"100%"} maxW={"300px"} mb={4} />

        <Text textAlign={"center"} fontSize={32} fontWeight={600}>
          503 Sedang Dalam Pemeliharaan
        </Text>

        <Text textAlign={"center"} mb={4} maxW={"400px"} opacity={0.5}>
          Kami sedang memperbaiki masalah untuk meningkatkan pengalaman Anda.
          Terima kasih atas kesabaran Anda, dan kami akan segera kembali!
        </Text>

        <Button
          w={"100%"}
          maxW={"300px"}
          variant={"outline"}
          colorScheme="ap"
          className="lg-clicky"
          onClick={() => {
            window.history.back();
          }}
          mb={2}
        >
          Back
        </Button>

        <Button
          variant={"unstyled"}
          className="lg-clicky"
          as={Link}
          to={"/"}
          mx={"auto"}
          color={"p.500"}
        >
          Go to Landing Page
        </Button>
      </VStack>

      <VStack w={"100%"} bg={"p.500"} py={4}>
        <Text
          textAlign={"center"}
          color={"white"}
          fontSize={[10, null, 12]}
          opacity={0.5}
        >
          © 2023 powered by{" "}
          <span style={{ fontWeight: 600 }}>Distro Studio</span>
        </Text>
      </VStack>
    </VStack>
  );
}
