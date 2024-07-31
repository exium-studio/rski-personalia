import {
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Wrap,
} from "@chakra-ui/react";
import { RiSearchLine, RiUploadLine } from "@remixicon/react";
import { useState } from "react";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import { useBodyColor } from "../../constant/colors";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import SelectStatusPekerjaKontrak from "../../components/dependent/_Select/SelectStatusPekerjaKontrak";
import FilterTabelPekerjaKontrak from "../../components/dependent/FilterTabelPekerjaKontrak";
import TabelPekerjaKontrak from "../../components/dependent/TabelPekerjaKontrak";

export default function PekerjaKontrak() {
  // Filter Config
  const defaultFilterConfig = {
    search: "",
    unit_kerja: [],
    tgl_masuk: [],
    status_aktif: {
      value: null,
      label: "Semua status",
    },
  };
  const confirmSelectStatusPekerjaKontrak = (newStatus: any) => {
    setFilterConfig((ps: any) => ({
      ...ps,
      status: newStatus,
    }));
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);

  return (
    <>
      <CWrapper>
        <CContainer p={responsiveSpacing} bg={useBodyColor()} borderRadius={12}>
          <Wrap w={"100%"} mb={responsiveSpacing} className="tabelConfig">
            <InputGroup flex={"1 1 165px"}>
              <InputLeftElement>
                <Icon as={RiSearchLine} color={"p.500"} fontSize={iconSize} />
              </InputLeftElement>
              <Input
                placeholder="Pencarian"
                flex={"1 1 0"}
                onChange={(e) => {
                  setFilterConfig((ps: any) => ({
                    ...ps,
                    search: e.target.value,
                  }));
                }}
                value={filterConfig.search}
              />
            </InputGroup>

            <SelectStatusPekerjaKontrak
              placeholder="Pilih Status Aktif"
              initialSelected={filterConfig.status_aktif}
              confirmSelect={confirmSelectStatusPekerjaKontrak}
              noSearch
              noReset
              flex={"1 1 110px"}
            />

            <FilterTabelPekerjaKontrak
              defaultFilterConfig={defaultFilterConfig}
              filterConfig={filterConfig}
              setFilterConfig={setFilterConfig}
            />

            <Button
              flex={"1 1 110px"}
              variant={"outline"}
              colorScheme="ap"
              className="clicky"
              rightIcon={<Icon as={RiUploadLine} fontSize={iconSize} />}
            >
              Export
            </Button>
          </Wrap>

          <TabelPekerjaKontrak filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
