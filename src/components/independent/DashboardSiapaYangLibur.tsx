import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RiArrowDownSLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { useBodyColor } from "../../constant/colors";
import { dummyKaryawanList } from "../../const/dummy";
import {
  dashboardItemHeight,
  dashboardItemMinWidth,
  iconSize,
  responsiveSpacing,
} from "../../constant/sizes";
import whosOffPeriode from "../../constant/whosOffPeriode";
import Skeleton from "./Skeleton";

interface Props extends StackProps {}

export default function DashboardSiapaYangLibur({ ...props }: Props) {
  //! DEBUG
  //! DEBUG

  const [periode, setPeriode] = useState<number>(0);
  const [data] = useState<any[] | null>(dummyKaryawanList);
  const [loading] = useState<boolean>(false);
  useEffect(() => {
    //TODO api get data dashboard jenis kelamin
  }, []);

  // SX
  const bodyColor = useBodyColor();

  return (
    <>
      {loading && <Skeleton flex={"1 1 0"} h={"100%"} minH={"400px"} />}

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
          <HStack justify={"space-between"} p={responsiveSpacing}>
            <Text fontWeight={600}>Siapa Yang Libur</Text>

            <Menu>
              <MenuButton
                as={Button}
                size={"xs"}
                className="btn-clear"
                color={"p.500"}
                rightIcon={<Icon as={RiArrowDownSLine} fontSize={iconSize} />}
              >
                {whosOffPeriode[periode]}
              </MenuButton>

              <MenuList minW={"160px"}>
                {whosOffPeriode.map((periodeLabel, i) => (
                  <MenuItem
                    key={i}
                    color={periode === i ? "p.500" : ""}
                    onClick={() => {
                      setPeriode(i);
                    }}
                  >
                    {periodeLabel}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>

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
