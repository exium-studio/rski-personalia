import {
  Box,
  Center,
  HStack,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useBodyColor } from "../../constant/colors";
import { dashboardItemHeight, responsiveSpacing } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import SearchComponent from "../dependent/input/SearchComponent";
import Retry from "../dependent/Retry";
import DashboardBuatPengumumanModal from "./DashboardBuatPengumumanModal";
import DashboardPengumumanItemDetail from "./DashboardPengumumanItemDetail";
import NoData from "./NoData";
import NotFound from "./NotFound";
import Skeleton from "./Skeleton";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";

interface Props extends StackProps {}

export default function DashboardPengumuman({ ...props }: Props) {
  const [search, setSearch] = useState<string>("");
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/pengumuman`,
    dependencies: [],
  });

  const fd = data?.filter((pengumuman: any) => {
    const searchTerm = search?.toLocaleLowerCase();

    const matches1 = pengumuman?.judul?.toLowerCase()?.includes(searchTerm);
    const matches2 = pengumuman?.konten?.toLowerCase()?.includes(searchTerm);

    return matches1 || matches2;
  });

  // SX
  const bodyColor = useBodyColor();

  const { userPermissions } = useAuth();
  const createPermission = isHasPermissions(userPermissions, [53]);

  return (
    <VStack
      align={"stretch"}
      bg={bodyColor}
      borderRadius={12}
      gap={0}
      minW={"450px"}
      overflowX={"hidden"}
      h={dashboardItemHeight}
      {...props}
    >
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
              minW={"450px"}
            />
          )}

          {!loading && (
            <>
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

                  <PermissionTooltip permission={createPermission}>
                    <DashboardBuatPengumumanModal
                      isDisabled={!createPermission}
                    />
                  </PermissionTooltip>
                </HStack>

                <SearchComponent
                  name="search"
                  onChangeSetter={(input) => {
                    setSearch(input);
                  }}
                  inputValue={search}
                />
              </Box>

              <VStack
                align={"stretch"}
                overflowY={"auto"}
                className="scrollY"
                flex={1}
                gap={0}
                pb={responsiveSpacing}
              >
                {!data && (
                  <Text m={"auto"} opacity={0.6}>
                    Tidak ada pengumuman
                  </Text>
                )}

                {data && (
                  <>
                    {fd?.length === 0 && (
                      <NotFound label="Pengumuman tidak ditemukan" />
                    )}

                    {fd?.map((pengumuman: any, i: number) => (
                      <DashboardPengumumanItemDetail
                        key={i}
                        data={pengumuman}
                        borderBottom={
                          i < data.length - 1 ? "1px solid var(--divider2)" : ""
                        }
                      />
                    ))}
                  </>
                )}
              </VStack>
            </>
          )}
        </>
      )}
    </VStack>
  );
}
