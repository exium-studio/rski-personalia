import {
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { RiSearch2Line } from "@remixicon/react";
import { Dispatch, useEffect, useState } from "react";
import { useBodyColor } from "../../../constant/colors";
import req from "../../../lib/req";
import { iconSize } from "../../../constant/sizes";
import DataNotFound from "../../independent/DataNotFound";
import FilterItemWrapper from "../../wrapper/FilterItemWrapper";
import ComponentSpinner from "../../independent/ComponentSpinner";

interface Props {
  filterConfig: any;
  setFilterConfig: Dispatch<any>;
}

export default function FilterPendidikanTerakhir({
  filterConfig,
  setFilterConfig,
}: Props) {
  const [search, setSearch] = useState<string>("");

  const [options, setOptions] = useState<any>(undefined);

  useEffect(() => {
    if (!options) {
      req
        .get("/api/get-list-pendidikan")
        .then((r) => {
          if (r.status === 200) {
            const options = r.data.data.map((item: any) => ({
              id: item.id,
              label: item.label,
            }));
            setOptions(options);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [options]);

  const filteredList = options?.filter((data: any) =>
    data?.label?.toLowerCase().includes(search.toLowerCase())
  );

  // SX

  return (
    <FilterItemWrapper
      title="Pendidikan Terakhir"
      filterValue={filterConfig.pendidikan_terakhir}
      setFilterConfig={setFilterConfig}
      filterKey="pendidikan_terakhir"
    >
      <InputGroup position={"sticky"} top={0} bg={useBodyColor()} zIndex={2}>
        <InputLeftElement>
          <Icon as={RiSearch2Line} fontSize={iconSize} opacity={0.4} />
        </InputLeftElement>

        <Input
          name="search"
          placeholder="Pencarian"
          border={"0 !important"}
          borderBottom={"1px solid var(--divider) !important"}
          borderRadius={"0 !important"}
          _focus={{
            border: "0 !important",
            borderBottom: "1px solid var(--p500) !important",
          }}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
        />
      </InputGroup>

      <VStack align={"stretch"} h={"calc(300px - 52px)"} gap={0}>
        {filteredList?.length === 0 && (
          <VStack h={"100px"} justify={"center"}>
            <DataNotFound />
          </VStack>
        )}

        {!options && <ComponentSpinner my="auto" />}

        {options && (
          <Wrap py={4} w={"100%"}>
            {filteredList?.map((data: any, i: number) => {
              const active =
                filterConfig?.pendidikan_terakhir &&
                filterConfig?.pendidikan_terakhir.some(
                  (pendidikan: any) => pendidikan?.id === data?.id
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
                          (pendidikan: any) => pendidikan.id === data.id
                        );

                      // Jika data sudah ada, maka hapus data dari pendidikan_terakhir
                      if (isDataExist) {
                        return {
                          ...ps,
                          pendidikan_terakhir: ps.pendidikan_terakhir.filter(
                            (pendidikan: any) => pendidikan.id !== data.id
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
        )}
      </VStack>
    </FilterItemWrapper>
  );
}
