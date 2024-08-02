import { VStack } from "@chakra-ui/react";
import { Dispatch } from "react";
import FilterItemWrapper from "../../wrapper/FilterItemWrapper";
import DatePickerModal from "../input/DatePickerModal";

interface Props {
  filterConfig: any;
  setFilterConfig: Dispatch<any>;
}

export default function FilterTglMasuk({
  filterConfig,
  setFilterConfig,
}: Props) {
  function confirmDate(date: Date | undefined) {
    setFilterConfig((ps: any) => ({
      ...ps,
      tgl_masuk: date ? [date] : [],
    }));
  }

  // SX

  return (
    <FilterItemWrapper
      title="Tanggal Masuk"
      filterValue={filterConfig.tgl_masuk}
      setFilterConfig={setFilterConfig}
      filterKey="tgl_masuk"
      panelMaxH={"380px"}
    >
      <VStack py={4}>
        <DatePickerModal
          id="filter-karyawan-tgl-masuk"
          name="tgl_masuk"
          onConfirm={(input) => {
            confirmDate(input);
          }}
          inputValue={
            filterConfig.tgl_masuk[0]
              ? new Date(filterConfig.tgl_masuk[0])
              : undefined
          }
        />
      </VStack>
    </FilterItemWrapper>
  );
}
