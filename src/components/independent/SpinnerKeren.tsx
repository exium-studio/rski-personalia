import { CircularProgress, CircularProgressProps } from "@chakra-ui/react";
import React from "react";

interface Props extends CircularProgressProps {}

export default function SpinnerKeren({ ...props }: Props) {
  return <CircularProgress isIndeterminate {...props} />;
}
