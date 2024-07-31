import {
  Accordion,
  Button,
  ButtonGroup,
  Center,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiEqualizer3Line } from "@remixicon/react";
import { Dispatch, useRef, useState } from "react";
import { useBodyColor } from "../../constant/colors";
import { iconSize } from "../../constant/sizes";
import backOnClose from "../../lib/backOnCloseOld";
import formatNumber from "../../lib/formatNumber";
import useBackOnClose from "../../lib/useBackOnCloseOld";
import FilterMasaKerja from "./_FilterOptions/FilterMasaKerja";
import FilterStatusKaryawan from "./_FilterOptions/FilterStatusKaryawan";
import FilterUnitKerja from "./_FilterOptions/FilterUnitKerja";

interface Props {
  defaultFilterConfig: any;
  filterConfig: any;
  setFilterConfig: Dispatch<any>;
}

export default function FilterTabelRekamJejak({
  defaultFilterConfig,
  filterConfig,
  setFilterConfig,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(isOpen, onClose);
  const initialRef = useRef(null);

  const [localFilterConfig, setLocalFilterConfig] = useState<any | null>(
    defaultFilterConfig
  );

  function filterData() {
    setFilterConfig(localFilterConfig);
    backOnClose(onClose);
  }

  // SX
  const bodyColor = useBodyColor();
  const adaFilter =
    filterConfig &&
    ((filterConfig.masa_kerja && filterConfig.masa_kerja.length > 0) ||
      (filterConfig.unit_kerja && filterConfig.unit_kerja.length > 0) ||
      (filterConfig.status_karyawan &&
        filterConfig.status_karyawan.length > 0));

  return (
    <>
      <Button
        flex={"1 1 110px"}
        variant={"outline"}
        colorScheme="ap"
        className="clicky"
        rightIcon={<Icon as={RiEqualizer3Line} fontSize={iconSize} />}
        flexShrink={0}
        pr={3}
        onClick={onOpen}
      >
        <HStack>
          {adaFilter && (
            <Center
              position={"absolute"}
              right={"-6px"}
              top={"-6px"}
              flexShrink={0}
              minW={"20px"}
              h={"20px"}
              borderRadius={"full"}
              bg={"p.500"}
              ml={"auto"}
            >
              <Text color={bodyColor} fontSize={12} fontWeight={600}>
                {formatNumber(
                  filterConfig.masa_kerja.length +
                    filterConfig.unit_kerja.length +
                    filterConfig.status_karyawan.length
                )}
              </Text>
            </Center>
          )}

          <Text>Filter</Text>
        </HStack>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose(onClose);
          setLocalFilterConfig(filterConfig);
        }}
        initialFocusRef={initialRef}
        isCentered
        // scrollBehavior="inside"
      >
        <ModalOverlay />

        <ModalContent minW={"328px"}>
          <ModalCloseButton />
          <ModalHeader ref={initialRef}>Filter</ModalHeader>

          <ModalBody>
            <Accordion allowToggle>
              <FilterUnitKerja
                filterConfig={localFilterConfig}
                setFilterConfig={setLocalFilterConfig}
              />
              <FilterStatusKaryawan
                filterConfig={localFilterConfig}
                setFilterConfig={setLocalFilterConfig}
              />
              <FilterMasaKerja
                filterConfig={localFilterConfig}
                setFilterConfig={setLocalFilterConfig}
              />
            </Accordion>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup w={"100%"}>
              <Button
                w={"50%"}
                className="btn-solid clicky"
                onClick={() => {
                  setLocalFilterConfig(defaultFilterConfig);
                }}
              >
                Reset
              </Button>

              <Button
                onClick={filterData}
                w={"50%"}
                colorScheme="ap"
                className="btn-ap clicky"
              >
                Terapkan
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
