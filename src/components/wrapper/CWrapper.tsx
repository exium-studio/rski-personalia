import { StackProps, VStack } from "@chakra-ui/react";
import useScreenWidth from "../../lib/useScreenWidth";

interface Props extends StackProps {
  children?: any;
}

export default function CWrapper({ children, ...props }: Props) {
  const smScreen = useScreenWidth() <= 768;

  return (
    <VStack
      px={smScreen ? 4 : 5}
      align={"stretch"}
      className="CWrapper noScroll"
      gap={0}
      w={"100%"}
      flex={1}
      overflowY={"auto"}
      pb={[0, null, 5]}
      {...props}
    >
      {children}
    </VStack>
  );
}
