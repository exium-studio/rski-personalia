import {
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiEqualizer3Fill } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import { useLightDarkColor } from "../../constant/colors";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import formatNumber from "../../lib/formatNumber";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";

const FilterMasaDiklat = (props: any) => {
  const { id, inputValue, onConfirm } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(id || "filter-masa-diklat", isOpen, onOpen, onClose);

  const [more, setMore] = useState(false);
  const [localFilterConfig, setLocalFilterConfig] = useState<any | null>(
    inputValue
  );
  const localFilterConfigRef = useRef(localFilterConfig);
  const initialRef = useRef(null);
  const filterCount = () => {
    let count = 0;
    if (inputValue?.less_than) count += 1;
    if (inputValue?.more_than) count += 1;
    return count;
  };
  const lightDarkColor = useLightDarkColor();

  useEffect(() => {
    if (more) {
      setLocalFilterConfig({
        ...localFilterConfigRef.current,
        less_than: undefined,
        more_than: 20,
      });
    }
  }, [more]);

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
              <FormControl>
                <FormLabel>{`Masa Diklat`}</FormLabel>

                <CContainer opacity={more ? 0.5 : 1}>
                  <Center>
                    <Text fontSize={18} fontWeight={500}>
                      {more
                        ? "> 20 jam"
                        : localFilterConfig.less_than ||
                          localFilterConfig.more_than
                        ? `${localFilterConfig.more_than || 0} - ${
                            localFilterConfig.less_than || 0
                          } jam`
                        : `Semua`}
                    </Text>
                  </Center>

                  <CContainer pr={4}>
                    <RangeSlider
                      min={0}
                      max={20}
                      step={1}
                      defaultValue={[
                        localFilterConfig.more_than || 0,
                        localFilterConfig.less_than || 0,
                      ]}
                      colorScheme="ap"
                      onChange={(val: number[]) => {
                        const [start, end] = val;

                        setLocalFilterConfig((ps: any) => ({
                          ...ps,
                          more_than: start,
                          less_than: end,
                        }));
                      }}
                      value={[
                        localFilterConfig.more_than || 0,
                        localFilterConfig.less_than || 0,
                      ]}
                    >
                      <RangeSliderTrack
                        bg={"var(--divider2)"}
                        w={"calc(100% + 15px) !important"}
                      >
                        <RangeSliderFilledTrack />
                      </RangeSliderTrack>

                      <RangeSliderThumb index={0} bg={"p.600"} />
                      <RangeSliderThumb index={1} bg={"p.600"} />
                    </RangeSlider>
                  </CContainer>

                  <Flex justify="space-between">
                    {[0, 5, 10, 15, 20].map((val, i) => {
                      const valid = i !== 0 && i !== 4;

                      return (
                        <Text
                          key={val}
                          w={"18px"}
                          textAlign={"center"}
                          fontSize="sm"
                          whiteSpace={"nowrap"}
                          opacity={valid ? 1 : 0}
                        >
                          {val}
                        </Text>
                      );
                    })}
                  </Flex>
                </CContainer>

                <Checkbox
                  colorScheme="ap"
                  mt={8}
                  onChange={(e) => {
                    setMore(e.target.checked);
                    if (!e.target.checked) {
                      setLocalFilterConfig({
                        ...localFilterConfig,
                        less_than: undefined,
                        more_than: undefined,
                      });
                    }
                  }}
                  isChecked={more}
                >
                  Lebih dari 20 jam
                </Checkbox>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <ButtonGroup w={"100%"}>
                <Button
                  w={"50%"}
                  className="btn-solid clicky"
                  onClick={() => {
                    setMore(false);
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
                    onConfirm(localFilterConfig);
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

export default FilterMasaDiklat;
