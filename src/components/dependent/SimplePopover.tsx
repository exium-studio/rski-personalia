import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverContentProps,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";

interface Props {
  children?: any;
  header?: any;
  body?: any;
  contentProps?: PopoverContentProps;
}

export default function SimplePopover({
  children,
  header,
  body,
  contentProps,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent {...contentProps}>
        <PopoverCloseButton />
        <PopoverArrow />
        {header && <PopoverHeader>{header}</PopoverHeader>}
        <PopoverBody>{body}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
