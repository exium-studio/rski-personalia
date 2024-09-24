import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";

interface Props {
  children?: any;
  header?: any;
  body?: any;
}

export default function SimplePopover({ children, header, body }: Props) {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        {header && <PopoverHeader>{header}</PopoverHeader>}
        <PopoverBody>{body}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
