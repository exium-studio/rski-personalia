import { InputProps } from "@chakra-ui/react";
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
}

export default function NumberInput({
  name,
  onChangeSetter,
  inputValue,
  isError,
  placeholder,
  noFormat,
  ...props
}: Props) {
  return (
    <StringInput
      name="tinggi_badan"
      inputMode="numeric"
      onChangeSetter={(i) => {
        if (i === "") {
          onChangeSetter(undefined);
        } else {
          //@ts-ignore
          onChangeSetter(parseNumber(i));
        }
      }}
      inputValue={
        (noFormat ? inputValue?.toString() : formatNumber(inputValue)) || ""
      }
      placeholder={placeholder || "Masukan Nominal"}
      {...props}
    />
  );
}
