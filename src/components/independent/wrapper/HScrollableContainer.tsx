import {
  Box,
  BoxProps,
  HStack,
  Icon,
  IconButton,
  StackProps,
  VStack,
} from "@chakra-ui/react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { useRef, useState } from "react";

interface Props extends BoxProps {
  children?: any;
  buttonContainerProps?: StackProps;
}

export default function HorizontalScrollableContainer({
  children,
  buttonContainerProps,
  ...props
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const handleScroll = () => {
    const navContainer = containerRef.current;
    if (navContainer) {
      const maxScrollLeft = navContainer.scrollWidth - navContainer.clientWidth;
      setShowLeftButton(navContainer.scrollLeft > 0);
      setShowRightButton(navContainer.scrollLeft < maxScrollLeft - 1);
    }
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <VStack w={"100%"} position={"relative"} align={"stretch"}>
      <HStack
        position={"absolute"}
        top={0}
        left={0}
        w={"100%"}
        h={"100%"}
        justify={"space-between"}
        px={4}
        pointerEvents="none"
        {...buttonContainerProps}
      >
        <IconButton
          aria-label="scroll left"
          icon={<Icon as={RiArrowLeftSLine} />}
          zIndex={1}
          onClick={scrollLeft}
          bg={"#303030df"}
          _hover={{ bg: "#303030df" }}
          _active={{ bg: "#303030df" }}
          color={"white"}
          backdropFilter={"blur(5px)"}
          pointerEvents="auto"
          mr={"auto"}
          visibility={showLeftButton ? "visible" : "hidden"}
          opacity={showLeftButton ? 1 : 0}
          transition={"200ms"}
        />

        <IconButton
          aria-label="scroll right"
          icon={<Icon as={RiArrowRightSLine} />}
          zIndex={1}
          onClick={scrollRight}
          bg={"#303030df"}
          _hover={{ bg: "#303030df" }}
          _active={{ bg: "#303030df" }}
          color={"white"}
          backdropFilter={"blur(5px)"}
          pointerEvents="auto"
          ml={"auto"}
          visibility={showRightButton ? "visible" : "hidden"}
          opacity={showRightButton ? 1 : 0}
          transition={"200ms"}
        />
      </HStack>

      <Box
        w={"100%"}
        ref={containerRef}
        overflow={"auto"}
        className="noScroll"
        position={"relative"}
        whiteSpace="nowrap"
        onScroll={handleScroll}
        {...props}
      >
        <HStack w={"max-content"}>{children}</HStack>
      </Box>
    </VStack>
  );
}
