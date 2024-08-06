import { HStack, Text, VStack, Wrap } from "@chakra-ui/react";
import { Dispatch } from "react";
import { optionsPendidikan } from "../../../constant/selectOptions";
import DataNotFound from "../../independent/DataNotFound";
import FilterItemWrapper from "../../wrapper/FilterItemWrapper";

interface Props {
  filterConfig: any;
  setFilterConfig: Dispatch<any>;
}

export default function FilterPendidikanTerakhir({
  filterConfig,
  setFilterConfig,
}: Props) {
  const data = optionsPendidikan;

  // SX

  return (
    <FilterItemWrapper
      title="Pendidikan Terakhir"
      filterValue={filterConfig.pendidikan_terakhir}
      setFilterConfig={setFilterConfig}
      filterKey="pendidikan_terakhir"
    >
      <VStack align={"stretch"} gap={0}>
        {data?.length === 0 && (
          <VStack h={"100px"} justify={"center"}>
            <DataNotFound />
          </VStack>
        )}

        <Wrap py={4} w={"100%"}>
          {data?.map((data, i) => {
            const active =
              filterConfig?.pendidikan_terakhir &&
              filterConfig?.pendidikan_terakhir.some(
                (status: any) => status.value === data.value
              );

            return (
              <HStack
                key={i}
                borderRadius={"full"}
                className="btn-outline"
                fontWeight={400}
                opacity={active ? 1 : 0.6}
                bg={active && `var(--p500a5) !important`}
                borderColor={active && "p.500 !important"}
                flexShrink={0}
                h={"40px"}
                maxW={"100%"}
                justify={"center"}
                px={4}
                cursor={"pointer"}
                transition={"200ms"}
                onClick={() => {
                  setFilterConfig((ps: any) => {
                    // Mengecek apakah data sudah ada dalam pendidikan_terakhir
                    const isDataExist =
                      ps.pendidikan_terakhir &&
                      ps.pendidikan_terakhir.some(
                        (status: any) => status.value === data.value
                      );

                    // Jika data sudah ada, maka hapus data dari pendidikan_terakhir
                    if (isDataExist) {
                      return {
                        ...ps,
                        pendidikan_terakhir: ps.pendidikan_terakhir.filter(
                          (status: any) => status.value !== data.value
                        ),
                      };
                    } else {
                      // Jika data belum ada, maka tambahkan data ke pendidikan_terakhir
                      return {
                        ...ps,
                        pendidikan_terakhir: ps.pendidikan_terakhir
                          ? [...ps.pendidikan_terakhir, data]
                          : [data],
                      };
                    }
                  });
                }}
              >
                <Text
                  lineHeight={1.3}
                  textAlign={"center"}
                  w={"100%"}
                  h={"20px !important"}
                  noOfLines={1}
                >
                  {data.label}
                </Text>
              </HStack>
            );
          })}
        </Wrap>
      </VStack>
    </FilterItemWrapper>
  );
}
