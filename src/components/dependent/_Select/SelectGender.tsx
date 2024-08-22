import { ButtonProps, useDisclosure } from "@chakra-ui/react";
import { Interface__SelectOption } from "../../../constant/interfaces";
import { optionsJenisKelamin } from "../../../constant/selectOptions";
import SingleSelectModal from "../input/SingleSelectModal";

interface Props extends ButtonProps {
  name: string;
  onConfirm: (inputValue: Interface__SelectOption | undefined) => void;
  inputValue: Interface__SelectOption | undefined;
  withSearch?: boolean;
  optionsDisplay?: "list" | "chip";
  isError?: boolean;
  placeholder?: string;
  nonNullable?: boolean;
}

export default function SelectGender({
  name,
  onConfirm,
  inputValue,
  withSearch,
  optionsDisplay = "list",
  isError,
  placeholder,
  nonNullable,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <SingleSelectModal
      id="select-gender-modal"
      name={name}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      options={optionsJenisKelamin}
      onConfirm={(input) => {
        onConfirm(input);
      }}
      inputValue={inputValue}
      withSearch={withSearch}
      optionsDisplay={optionsDisplay}
      isError={isError}
      placeholder={placeholder || "Pilih Jenis Kelamin"}
      nonNullable={nonNullable}
      {...props}
    />
  );
}
