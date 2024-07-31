import { Button, ButtonProps } from "@chakra-ui/react";
import { Link } from "react-router-dom";
interface Props extends ButtonProps {
  to: string;
  children: any;
}

export default function SmallLink({ to, children, ...props }: Props) {
  return (
    <Button
      colorScheme="ap"
      variant={"ghost"}
      size={"xs"}
      as={Link}
      target={"_blank"}
      to={to}
      {...props}
    >
      {children}
    </Button>
  );
}
