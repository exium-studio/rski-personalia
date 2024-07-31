import {
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { RiArrowDownSLine } from "@remixicon/react";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import PaginationNav from "./PaginationNav";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  limitConfig?: number;
  setLimitConfig?: (limit: number) => void;
  pageConfig?: number;
  setPageConfig?: (page: number) => void;
  paginationData?: any;
  footer?: React.ReactNode;
}

export default function TabelFooterConfig({
  limitConfig,
  setLimitConfig,
  pageConfig,
  setPageConfig,
  paginationData,
  footer,
}: Props) {
  const limitButtonRef = useRef<HTMLButtonElement>(null);
  const [limitMenuListW, setLimitMenuListW] = useState<
    number | (number | null)[] | null
  >(null);
  useEffect(() => {
    if (limitButtonRef.current) {
      setLimitMenuListW(limitButtonRef.current.offsetWidth);
    }
  }, [limitButtonRef, limitConfig]);

  return (
    <Wrap
      spacing={responsiveSpacing}
      justify={"space-between"}
      mt={responsiveSpacing}
      align={"center"}
    >
      {limitConfig && setLimitConfig && (
        <Menu>
          <MenuButton
            ref={limitButtonRef}
            px={4}
            as={Button}
            className="btn-outline"
            rightIcon={
              <Icon as={RiArrowDownSLine} fontSize={iconSize} opacity={0.6} />
            }
          >
            <HStack>
              <Text color={"p.500"}>
                {limitConfig === -1 ? "Semua" : limitConfig}
              </Text>
              <Text fontWeight={400}>Row</Text>
            </HStack>
          </MenuButton>

          <MenuList minW={`${limitMenuListW}px`} zIndex={10}>
            <MenuItem
              color={limitConfig === 10 ? "p.500" : ""}
              onClick={() => {
                setLimitConfig(10);
              }}
            >
              10
            </MenuItem>
            <MenuItem
              color={limitConfig === 50 ? "p.500" : ""}
              onClick={() => {
                setLimitConfig(50);
              }}
            >
              50
            </MenuItem>
            <MenuItem
              color={limitConfig === 100 ? "p.500" : ""}
              onClick={() => {
                setLimitConfig(100);
              }}
            >
              100
            </MenuItem>

            <MenuItem
              color={limitConfig === -1 ? "p.500" : ""}
              onClick={() => {
                setLimitConfig(-1);
              }}
            >
              Semua
            </MenuItem>
          </MenuList>
        </Menu>
      )}

      {footer}

      {pageConfig && setPageConfig && (
        <PaginationNav
          page={pageConfig}
          setPage={setPageConfig}
          paginationData={paginationData}
        />
      )}
    </Wrap>
  );
}
