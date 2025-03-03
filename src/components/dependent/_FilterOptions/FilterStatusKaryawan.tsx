import { HStack, Text, Wrap } from "@chakra-ui/react";
import { Dispatch, useEffect, useState } from "react";
import req from "../../../lib/req";
import ComponentSpinner from "../../independent/ComponentSpinner";
import FilterItemWrapper from "../../wrapper/FilterItemWrapper";

interface Props {
  filterConfig: any;
  setFilterConfig: Dispatch<any>;
}

export default function FilterStatusKaryawan({
  filterConfig,
  setFilterConfig,
}: Props) {
  const [options, setOptions] = useState<any>(undefined);

  useEffect(() => {
    if (!options) {
      req
        .get("/api/get-list-status-karyawan")
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

  return (
    <FilterItemWrapper
      title="Status Karyawan"
      filterValue={filterConfig.status_karyawan}
      setFilterConfig={setFilterConfig}
      filterKey="status_karyawan"
    >
      {!options && <ComponentSpinner my="auto" />}

      {options && (
        <Wrap py={4} w={"100%"}>
          {options?.map((data: any, i: number) => {
            const active =
              filterConfig?.status_karyawan &&
              filterConfig?.status_karyawan.some(
                (unit: any) => unit?.id === data?.id
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
                    // Mengecek apakah data sudah ada dalam status_karyawan
                    const isDataExist =
                      ps.status_karyawan &&
                      ps.status_karyawan.some(
                        (unit: any) => unit.id === data.id
                      );

                    // Jika data sudah ada, maka hapus data dari status_karyawan
                    if (isDataExist) {
                      return {
                        ...ps,
                        status_karyawan: ps.status_karyawan.filter(
                          (unit: any) => unit.id !== data.id
                        ),
                      };
                    } else {
                      // Jika data belum ada, maka tambahkan data ke status_karyawan
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
      {/* <Wrap py={4}>
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
      </Wrap> */}
    </FilterItemWrapper>
  );
}
