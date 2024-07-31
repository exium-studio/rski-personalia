import { HStack, Text, Wrap } from "@chakra-ui/react";
import { Dispatch } from "react";
import FilterItemWrapper from "../../wrapper/FilterItemWrapper";

interface Props {
  filterConfig: any;
  setFilterConfig: Dispatch<any>;
}

export default function FilterStatusKaryawan({
  filterConfig,
  setFilterConfig,
}: Props) {
  const statusKaryawanList = [
    {
      id: 1,
      nama_status: "Tetap",
    },
    {
      id: 2,
      nama_status: "Kontrak",
    },
    {
      id: 3,
      nama_status: "Magang",
    },
  ];

  // SX

  return (
    <FilterItemWrapper
      title="Status Kepegawaian"
      filterValue={filterConfig.status_karyawan}
      setFilterConfig={setFilterConfig}
      filterKey="status_karyawan"
    >
      <Wrap py={4}>
        {statusKaryawanList?.map((data, i) => {
          const active =
            filterConfig?.status_karyawan &&
            filterConfig?.status_karyawan.some(
              (unit: any) => unit.id === data.id
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
              px={4}
              cursor={"pointer"}
              transition={"200ms"}
              onClick={() => {
                setFilterConfig((ps: any) => {
                  const isDataExist =
                    ps.status_karyawan &&
                    ps.status_karyawan.some((unit: any) => unit.id === data.id);

                  if (isDataExist) {
                    return {
                      ...ps,
                      status_karyawan: ps.status_karyawan.filter(
                        (unit: any) => unit.id !== data.id
                      ),
                    };
                  } else {
                    return {
                      ...ps,
                      status_karyawan: ps.status_karyawan
                        ? [...ps.status_karyawan, data]
                        : [data],
                    };
                  }
                });
              }}
            >
              <Text
                lineHeight={1.3}
                w={"100%"}
                h={"20px !important"}
                noOfLines={1}
              >
                {data.nama_status}
              </Text>
            </HStack>
          );
        })}
      </Wrap>
    </FilterItemWrapper>
  );
}
