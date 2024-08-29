import { Box, Button, HStack, StackProps, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import CWrapper from "../wrapper/CWrapper";
import PermissionTooltip from "../wrapper/PermissionTooltip";

interface Props extends StackProps {
  data: any[];
  active: number;
}

export default function TopNavs({ data, active, ...props }: Props) {
  const activeNavRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeNavRef.current) {
      activeNavRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [active]);

  const { userPermissions } = useAuth();

  return (
    <Box overflowX={"auto"} className="noScroll" w={"100%"}>
      <CWrapper scrollSnapType={"x mandatory"}>
        <HStack w={"max-content"} {...props}>
          {data.map((nav, i) => {
            const viewPermission = isHasPermissions(
              userPermissions,
              nav.allowed
            );

            return (
              <PermissionTooltip key={i} permission={viewPermission}>
                <Button
                  size={"sm"}
                  fontWeight={400}
                  className={active === i ? "btn-apa" : "btn"}
                  scrollSnapAlign={"center"}
                  // color={"p.500"}
                  ref={active === i ? activeNavRef : null}
                  isDisabled={!viewPermission}
                  onClick={() => {
                    navigate(nav.link);
                  }}
                >
                  <Text
                    opacity={active === i ? 1 : 0.6}
                    fontSize={"14px !important"}
                  >
                    {nav.label}
                  </Text>
                </Button>
              </PermissionTooltip>
            );
          })}
        </HStack>
      </CWrapper>
    </Box>
  );
}
