import { Box, Button, HStack, StackProps, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { TopNavs__Interface } from "../../constant/interfaces";
import CWrapper from "../wrapper/CWrapper";
import { useEffect, useRef } from "react";

interface Props extends StackProps {
  data: TopNavs__Interface[];
  active: number;
}

export default function TopNavs({ data, active, ...props }: Props) {
  const activeNavRef = useRef<any>(null);

  useEffect(() => {
    if (activeNavRef.current) {
      activeNavRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [active]);

  return (
    <Box overflowX={"auto"} className="noScroll" w={"100%"}>
      <CWrapper scrollSnapType={"x mandatory"}>
        <HStack w={"max-content"} {...props}>
          {data.map((nav, i) => (
            <Button
              key={i}
              size={"sm"}
              as={Link}
              fontWeight={400}
              to={nav.link}
              className={active === i ? "btn-apa" : "btn"}
              scrollSnapAlign={"center"}
              // color={"p.500"}
              ref={active === i ? activeNavRef : null}
            >
              <Text
                opacity={active === i ? 1 : 0.6}
                fontSize={"14px !important"}
              >
                {nav.label}
              </Text>
            </Button>
          ))}
        </HStack>
      </CWrapper>
    </Box>
  );
}
