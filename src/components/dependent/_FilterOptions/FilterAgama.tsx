import { HStack, Text, VStack, Wrap } from "@chakra-ui/react";
import { Dispatch } from "react";
import DataNotFound from "../../independent/DataNotFound";
import FilterItemWrapper from "../../wrapper/FilterItemWrapper";
import { optionsAgama } from "../../../constant/selectOptions";

interface Props {
  filterConfig: any;
  setFilterConfig: Dispatch<any>;
}

export default function FilterAgama({ filterConfig, setFilterConfig }: Props) {
  const data = optionsAgama;

  // SX

  return (
    <FilterItemWrapper
      title="Agama"
      filterValue={filterConfig.agama}
      setFilterConfig={setFilterConfig}
      filterKey="agama"
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
              filterConfig?.agama &&
              filterConfig?.agama.some(
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
                    // Mengecek apakah data sudah ada dalam agama
                    const isDataExist =
                      ps.agama &&
                      ps.agama.some(
                        (status: any) => status.value === data.value
                      );

                    // Jika data sudah ada, maka hapus data dari agama
                    if (isDataExist) {
                      return {
                        ...ps,
                        agama: ps.agama.filter(
                          (status: any) => status.value !== data.value
                        ),
                      };
                    } else {
                      // Jika data belum ada, maka tambahkan data ke agama
                      return {
                        ...ps,
                        agama: ps.agama ? [...ps.agama, data] : [data],
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
