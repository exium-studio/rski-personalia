import { Text, TextProps, Tooltip, TooltipProps } from "@chakra-ui/react";
import React from "react";

interface Props extends TextProps {
  data: string;
  tooltipProps?: TooltipProps;
}

export default function TabelElipsisText({
  data,
  tooltipProps,
  ...props
}: Props) {
  return (
    <Tooltip openDelay={500} label={data} placement="right" {...tooltipProps}>
      <Text
        w={"100%"}
        maxW={"243px"}
        overflow={"hidden"}
        whiteSpace={"nowrap"}
        textOverflow={"ellipsis"}
        {...props}
      >
        {data}
      </Text>
    </Tooltip>
  );
}
