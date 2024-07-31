import { StackProps, VStack } from "@chakra-ui/react";

interface Props extends StackProps {
  children: any;
}

export default function ChartDoughnutContainer({ children, ...props }: Props) {
  return (
    <VStack
      w={"100%"}
      minW={"200px"}
      maxW={"280px"}
      h={"100%"}
      minH={"200px"}
      maxH={"280px"}
      {...props}
    >
      {children}
    </VStack>
  );
}
