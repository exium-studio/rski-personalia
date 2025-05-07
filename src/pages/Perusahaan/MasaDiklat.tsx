import {
  Button,
  ButtonGroup,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiEqualizer3Fill } from "@remixicon/react";
import { useRef, useState } from "react";
import DisclosureHeader from "../../components/dependent/DisclosureHeader";
import ExportModal from "../../components/dependent/ExportModal";
import NumberInput from "../../components/dependent/input/NumberInput";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import TabelMasaDiklat from "../../components/dependent/TabelMasaDiklat";
import CContainer from "../../components/wrapper/CContainer";
import CWrapper from "../../components/wrapper/CWrapper";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import formatNumber from "../../lib/formatNumber";
import isHasPermissions from "../../lib/isHasPermissions";

const Filter = (props: any) => {
  const { filterConfig, setFilterConfig } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("filter-masa-diklat", isOpen, onOpen, onClose);

  const [localFilterConfig, setLocalFilterConfig] = useState<any | null>(
    filterConfig
  );
  const initialRef = useRef(null);
  const filterCount = () => {
    let count = 0;
    if (filterConfig?.less_than) count += 1;
    if (filterConfig?.more_than) count += 1;
    return count;
  };
  const lightDarkColor = useLightDarkColor();

  return (
    <>
      <Button
        className="btn-outline clicky"
        leftIcon={<Icon as={RiEqualizer3Fill} fontSize={iconSize} />}
        flexShrink={0}
        pl={5}
        onClick={() => {
          onOpen();
          // setLocalFilterConfig(filterKaryawan);
          // setClear(false);
        }}
      >
        <HStack>
          {filterCount() && (
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
              <Text color={lightDarkColor} fontSize={12} fontWeight={600}>
                {formatNumber(filterCount())}
              </Text>
            </Center>
          )}

          <Text>Filter Masa Diklat</Text>
        </HStack>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        isCentered
        // scrollBehavior="inside"
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title={"Filter Masa Diklat"} />

            <ModalBody>
              <SimpleGrid columns={[1, null, 2]} gap={4}>
                <FormControl>
                  <FormLabel>{`Lebih dari (>)`}</FormLabel>
                  <InputGroup>
                    <InputRightElement mr={3}>jam</InputRightElement>
                    <NumberInput
                      onChangeSetter={(input) => {
                        setLocalFilterConfig({
                          ...localFilterConfig,
                          more_than: input,
                        });
                      }}
                      inputValue={localFilterConfig?.more_than}
                      name="more_than"
                      placeholder="Lebih dari"
                      pr={"56px"}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>{`Kurang dari (<)`}</FormLabel>
                  <InputGroup>
                    <InputRightElement mr={3}>jam</InputRightElement>
                    <NumberInput
                      onChangeSetter={(input) => {
                        setLocalFilterConfig({
                          ...localFilterConfig,
                          less_than: input,
                        });
                      }}
                      inputValue={localFilterConfig?.less_than}
                      name="less_than"
                      placeholder="Kurang dari"
                      pr={"56px"}
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            </ModalBody>

            <ModalFooter>
              <ButtonGroup w={"100%"}>
                <Button
                  w={"50%"}
                  className="btn-solid clicky"
                  onClick={() => {
                    setLocalFilterConfig({
                      ...localFilterConfig,
                      less_than: undefined,
                      more_than: undefined,
                    });
                  }}
                >
                  Clear
                </Button>

                <Button
                  onClick={() => {
                    setFilterConfig(localFilterConfig);
                    backOnClose();
                  }}
                  w={"50%"}
                  colorScheme="ap"
                  className="btn-ap clicky"
                >
                  Terapkan
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalHeader>
        </ModalContent>
      </Modal>
    </>
  );
};

export default function MasaDiklat() {
  // SX
  const lightDarkColor = useLightDarkColor();

  // Filter Config
  const defaultFilterConfig = {
    search: "",
    less_than: undefined as any,
    more_than: undefined as any,
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);

  const { userPermissions } = useAuth();
  const exportPermissions = isHasPermissions(userPermissions, [9]);

  return (
    <>
      <CWrapper>
        <CContainer
          flex={1}
          px={responsiveSpacing}
          pb={responsiveSpacing}
          pt={0}
          bg={lightDarkColor}
          borderRadius={12}
          overflowY={"auto"}
          className="scrollY"
        >
          <HStack
            py={responsiveSpacing}
            justify={"space-between"}
            w={"100%"}
            className="tabelConfig scrollX"
            overflowX={"auto"}
            flexShrink={0}
          >
            <SearchComponent
              minW={"165px"}
              name="search"
              onChangeSetter={(input) => {
                setFilterConfig({ ...filterConfig, search: input });
              }}
              inputValue={filterConfig.search}
            />

            <Filter
              filterConfig={filterConfig}
              setFilterConfig={setFilterConfig}
            />

            <PermissionTooltip
              permission={exportPermissions}
              boxProps={{ w: "fit-content" }}
            >
              <ExportModal
                url="/api/rski/dashboard/perusahaan/diklat-eksternal/export"
                title="Export Diklat Eksternal"
                downloadFileName="Data Diklat Eksternal"
                isDisabled={!exportPermissions}
              />
            </PermissionTooltip>
          </HStack>

          <TabelMasaDiklat filterConfig={filterConfig} />
        </CContainer>
      </CWrapper>
    </>
  );
}
