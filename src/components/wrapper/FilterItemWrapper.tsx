import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionItemProps,
  AccordionPanel,
  Center,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { RiCloseLine } from "@remixicon/react";
import { Dispatch } from "react";
import { useBodyColor } from "../../constant/colors";
import formatNumber from "../../lib/formatNumber";

interface Props extends AccordionItemProps {
  title: string;
  children: any;
  setFilterConfig: Dispatch<any>;
  filterValue?: any;
  filterKey: string;
  panelMaxH?: string;
}
export default function FilterItemWrapper({
  title,
  children,
  setFilterConfig,
  filterValue,
  filterKey,
  panelMaxH,
  ...props
}: Props) {
  // SX
  const bodyColor = useBodyColor();

  return (
    <AccordionItem {...props}>
      <AccordionButton
        h={"50px"}
        _expanded={{
          color: "p.500",
          fontWeight: 500,
        }}
        _hover={{ bg: "transparent" }}
        justifyContent={"space-between"}
        pl={2}
        pr={"2px"}
        position="relative"
        role="group"
      >
        <HStack w={"100%"} justify={"space-between"}>
          <Text flexShrink={0}>{title}</Text>

          <HStack>
            {filterValue && filterValue.length > 0 && (
              <>
                <Tooltip label={"Hapus filter ini"} openDelay={500}>
                  <IconButton
                    as={Center}
                    aria-label="Delete filter item button"
                    icon={<Icon as={RiCloseLine} fontSize={20} />}
                    size={"xs"}
                    borderRadius={"full"}
                    colorScheme="red"
                    variant={"ghost"}
                    opacity={0}
                    _groupHover={{ opacity: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterConfig((ps: any) => ({
                        ...ps,
                        [filterKey]: [],
                      }));
                    }}
                  />
                </Tooltip>

                <Center
                  flexShrink={0}
                  minW={"24px"}
                  h={"24px"}
                  borderRadius={"full"}
                  bg={"p.500"}
                  ml={"auto"}
                  mr={2}
                >
                  <Text color={bodyColor} fontSize={12} fontWeight={600}>
                    {formatNumber(filterValue.length)}
                  </Text>
                </Center>
              </>
            )}
          </HStack>
        </HStack>

        <AccordionIcon />
      </AccordionButton>

      <AccordionPanel p={0} w={"100%"}>
        <VStack
          align={"stretch"}
          maxH={panelMaxH || "300px"}
          overflowY={"auto"}
          // overflowX={"hidden"}
          gap={0}
          // pb={2}
          // px={2}
          className="scrollY scrollYkotak"
        >
          {children}
        </VStack>
      </AccordionPanel>
    </AccordionItem>
  );
}
