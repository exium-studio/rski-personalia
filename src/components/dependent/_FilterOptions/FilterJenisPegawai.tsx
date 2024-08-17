import { HStack, Text, VStack, Wrap } from "@chakra-ui/react";
import { Dispatch } from "react";
import { optionsJenisKaryawan } from "../../../constant/selectOptions";
import DataNotFound from "../../independent/DataNotFound";
import FilterItemWrapper from "../../wrapper/FilterItemWrapper";

interface Props {
  filterConfig: any;
  setFilterConfig: Dispatch<any>;
}

export default function FilterJenisPegawai({
  filterConfig,
  setFilterConfig,
}: Props) {
  const data = optionsJenisKaryawan;

  // SX

  return (
    <FilterItemWrapper
      title="Jenis Karyawan"
      filterValue={filterConfig.jenis_karyawan}
      setFilterConfig={setFilterConfig}
      filterKey="jenis_karyawan"
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
              filterConfig?.jenis_karyawan &&
              filterConfig?.jenis_karyawan.some(
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
                    // Mengecek apakah data sudah ada dalam jenis_karyawan
                    const isDataExist =
                      ps.jenis_karyawan &&
                      ps.jenis_karyawan.some(
                        (status: any) => status.value === data.value
                      );

                    // Jika data sudah ada, maka hapus data dari jenis_karyawan
                    if (isDataExist) {
                      return {
                        ...ps,
                        jenis_karyawan: ps.jenis_karyawan.filter(
                          (status: any) => status.value !== data.value
                        ),
                      };
                    } else {
                      // Jika data belum ada, maka tambahkan data ke jenis_karyawan
                      return {
                        ...ps,
                        jenis_karyawan: ps.jenis_karyawan
                          ? [...ps.jenis_karyawan, data]
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
