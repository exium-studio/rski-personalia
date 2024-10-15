import { HStack, Text, Wrap } from "@chakra-ui/react";
import { Dispatch } from "react";
import { optionsStatusKaryawan } from "../../../constant/selectOptions";
import FilterItemWrapper from "../../wrapper/FilterItemWrapper";

interface Props {
  filterConfig: any;
  setFilterConfig: Dispatch<any>;
}

export default function FilterStatusKaryawan({
  filterConfig,
  setFilterConfig,
}: Props) {
  // SX

  return (
    <FilterItemWrapper
      title="Status Karyawan"
      filterValue={filterConfig.status_karyawan}
      setFilterConfig={setFilterConfig}
      filterKey="status_karyawan"
    >
      <Wrap py={4}>
        {optionsStatusKaryawan?.map((data, i) => {
          const active =
            filterConfig?.status_karyawan &&
            filterConfig?.status_karyawan.some(
              (unit: any) => unit.value === data.value
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
                    ps.status_karyawan.some(
                      (unit: any) => unit.value === data.value
                    );

                  if (isDataExist) {
                    return {
                      ...ps,
                      status_karyawan: ps.status_karyawan.filter(
                        (unit: any) => unit.value !== data.value
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
                {data.label}
              </Text>
            </HStack>
          );
        })}
      </Wrap>
    </FilterItemWrapper>
  );
}
