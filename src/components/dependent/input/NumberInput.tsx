import { BoxProps, InputProps } from "@chakra-ui/react";
import formatNumber from "../../../lib/formatNumber";
import parseNumber from "../../../lib/parseNumber";
import StringInput from "./StringInput";

interface Props extends InputProps {
  name: string;
  onChangeSetter: (inputValue: number | undefined) => void;
  inputValue: number | undefined;
  isError?: boolean;
  placeholder?: string;
  noFormat?: boolean;
  boxProps?: BoxProps;
  formatValue?: (value: number | undefined) => string;
}

export default function NumberInput({
  name,
  onChangeSetter,
  inputValue,
  isError,
  placeholder,
  noFormat,
  boxProps,
  formatValue,
  ...props
}: Props) {
  const formattedInputValue = formatValue
    ? formatValue(inputValue)
    : noFormat
    ? inputValue?.toString()
    : formatNumber(inputValue);

  return (
    <StringInput
      name={name}
      inputMode="numeric"
      onChangeSetter={(i) => {
        if (i === "") {
          onChangeSetter(undefined);
        } else {
          //@ts-ignore
          onChangeSetter(parseNumber(i));
        }
      }}
      inputValue={formattedInputValue || ""}
      placeholder={placeholder || "Masukan Nominal"}
      boxProps={boxProps}
      {...props}
    />
  );
}
