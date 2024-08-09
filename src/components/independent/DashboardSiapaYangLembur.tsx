import {
  Avatar,
  Box,
  HStack,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { dummyKaryawanList } from "../../const/dummy";
import { useBodyColor } from "../../constant/colors";
import {
  dashboardItemHeight,
  dashboardItemMinWidth,
  responsiveSpacing,
} from "../../constant/sizes";
import Skeleton from "./Skeleton";

interface Props extends StackProps {}

export default function DashboardSiapaYangLembur({ ...props }: Props) {
  const [data] = useState<any[] | null>(dummyKaryawanList);
  const [loading] = useState<boolean>(false);
  useEffect(() => {
    //TODO api get data dashboard jenis kelamin
  }, []);

  // SX
  const bodyColor = useBodyColor();

  return (
    <>
      {loading && <Skeleton flex={"1 1 0"} h={"100%"} minH={"300px"} />}

      {!loading && data && (
        <VStack
          align={"stretch"}
          bg={bodyColor}
          borderRadius={12}
          gap={0}
          minW={dashboardItemMinWidth}
          h={dashboardItemHeight}
          {...props}
        >
          <Box p={responsiveSpacing}>
            <Text fontWeight={600}>Pegawai Lembur</Text>
            <Text fontSize={14} opacity={0.6}>
              Pegawai yang lembur hari ini
            </Text>
          </Box>

          <VStack
            align={"stretch"}
            gap={responsiveSpacing}
            pb={responsiveSpacing}
            overflowY={"auto"}
            px={responsiveSpacing}
            className="scrollX scrollY"
            // className="scrollY"
          >
            {data.map((user, i) => (
              <HStack key={i}>
                <Avatar name={user.nama} src={user.foto_profil} />
                <Box>
                  <Text mb={1}>{user.user.nama}</Text>
                  <Text opacity={0.6} fontSize={12}>
                    {user.unit_kerja.nama_unit}
                  </Text>
                </Box>
              </HStack>
            ))}
          </VStack>
        </VStack>
      )}
    </>
  );
}
