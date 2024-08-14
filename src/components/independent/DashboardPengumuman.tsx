import {
  Box,
  Center,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RiSearch2Line } from "@remixicon/react";
import { useState } from "react";
import { useBodyColor } from "../../constant/colors";
import {
  dashboardItemHeight,
  dashboardItemMinWidth,
  responsiveSpacing,
} from "../../constant/sizes";
import Skeleton from "./Skeleton";
import useDataState from "../../hooks/useDataState";
import DashboardBuatPengumumanModal from "./DashboardBuatPengumumanModal";
import DashboardPengumumanItemDetail from "./DashboardPengumumanItemDetail";
import NoData from "./NoData";
import Retry from "../dependent/Retry";

interface Props extends StackProps {}

export default function DashboardPengumuman({ ...props }: Props) {
  const [search, setSearch] = useState<string>("");
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/pengumuman`,
    dependencies: [],
  });

  // SX
  const bodyColor = useBodyColor();

  return (
    <>
      {error && (
        <>
          {notFound && <NoData minH={"300px"} />}

          {!notFound && (
            <Center my={"auto"} minH={"300px"}>
              <Retry loading={loading} retry={retry} />
            </Center>
          )}
        </>
      )}

      {!error && (
        <>
          {loading && (
            <Skeleton
              flex={"1 1 0"}
              borderRadius={12}
              h={dashboardItemHeight}
              minW={dashboardItemMinWidth}
            />
          )}

          {!loading && (
            <VStack
              align={"stretch"}
              bg={bodyColor}
              borderRadius={12}
              gap={0}
              minW={dashboardItemMinWidth}
              overflowX={"hidden"}
              h={dashboardItemHeight}
              pb={responsiveSpacing}
              {...props}
            >
              <Box p={responsiveSpacing}>
                <HStack
                  justify={"space-between"}
                  mb={responsiveSpacing}
                  align={"start"}
                >
                  <Box>
                    <Text fontWeight={600}>Pengumuman</Text>
                    <Text fontSize={14} opacity={0.6}>
                      Pengumuman saat ini
                    </Text>
                  </Box>

                  <DashboardBuatPengumumanModal />
                </HStack>

                <HStack>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={RiSearch2Line} />
                    </InputLeftElement>
                    <Input
                      name="search"
                      placeholder="Pencarian"
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      value={search}
                    />
                  </InputGroup>
                </HStack>
              </Box>

              <VStack
                align={"stretch"}
                overflowY={"auto"}
                className="scrollY"
                flex={1}
                gap={0}
              >
                {!data && (
                  <Text m={"auto"} opacity={0.6}>
                    Tidak ada pengumuman
                  </Text>
                )}

                {data &&
                  data.map((pengumuman: any, i: number) => (
                    <DashboardPengumumanItemDetail
                      key={i}
                      data={pengumuman}
                      borderBottom={
                        i < data.length - 1 ? "1px solid var(--divider2)" : ""
                      }
                    />
                  ))}
              </VStack>
            </VStack>
          )}
        </>
      )}
    </>
  );
}
