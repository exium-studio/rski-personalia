import {
  Box,
  Center,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Dispatch } from "react";
import FilterItemWrapper from "../../wrapper/FilterItemWrapper";

interface Props {
  filterConfig: any;
  setFilterConfig: Dispatch<any>;
}

export default function FilterMasaKerja({
  filterConfig,
  setFilterConfig,
}: Props) {
  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

  // SX

  return (
    <FilterItemWrapper
      title="Maksimal Masa Kerja"
      filterValue={filterConfig.masa_kerja}
      setFilterConfig={setFilterConfig}
      filterKey="masa_kerja"
    >
      <VStack align={"stretch"} gap={0} overflow={"clip"}>
        <Center>
          <Text fontSize={18} fontWeight={500}>
            {filterConfig.masa_kerja[0] || 0} Tahun
          </Text>
        </Center>

        <Box p={4} mb={4}>
          <Slider
            colorScheme="ap"
            aria-label="slider-ex-6"
            onChange={(val) => {
              const newValue = Math.round((val * 6) / 10);
              if (newValue > 0) {
                setFilterConfig((ps: any) => ({
                  ...ps,
                  masa_kerja: [newValue],
                }));
              } else {
                setFilterConfig((ps: any) => ({
                  ...ps,
                  masa_kerja: [],
                }));
              }
            }}
            value={(filterConfig.masa_kerja[0] * 10) / 6 || 0}
          >
            <SliderMark value={25} {...labelStyles}>
              15
            </SliderMark>
            <SliderMark value={50} {...labelStyles}>
              30
            </SliderMark>
            <SliderMark value={75} {...labelStyles}>
              45
            </SliderMark>

            <SliderTrack bg={"var(--divider2)"}>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb bg={"p.600"} />
          </Slider>
        </Box>
      </VStack>
    </FilterItemWrapper>
  );
}
