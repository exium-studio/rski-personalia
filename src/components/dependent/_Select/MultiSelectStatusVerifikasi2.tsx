import { ButtonProps, useDisclosure } from "@chakra-ui/react";
import { Interface__SelectOption } from "../../../constant/interfaces";
import MultipleSelectModal from "../input/MultipleSelectModal";

interface Props extends ButtonProps {
  name: string;
  onConfirm: (inputValue: Interface__SelectOption[] | undefined) => void;
  inputValue: Interface__SelectOption[] | undefined;
  withSearch?: boolean;
  optionsDisplay?: "list" | "chip";
  maxSelectedDisplay?: number;
  isError?: boolean;
  placeholder?: string;
  nonNullable?: boolean;
}

export default function MultiSelectStatusVerifikasi2({
  name,
  onConfirm,
  inputValue,
  withSearch,
  optionsDisplay = "list",
  maxSelectedDisplay = 2,
  isError,
  placeholder,
  nonNullable,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const options = [
    {
      value: 1,
      label: "Menunggu Verifikasi",
    },
    {
      value: 2,
      label: "Verif. 1 Disetujui",
    },
    {
      value: 3,
      label: "Verif. 1 Ditolak",
    },
    {
      value: 4,
      label: "Verif. 2 Disetujui",
    },
    {
      value: 5,
      label: "Verif. 2 Ditolak",
    },
  ];

  return (
    <MultipleSelectModal
      id="multi-select-status-verifikasi-2-modal"
      name={name}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      options={options}
      onConfirm={(input) => {
        onConfirm(input);
      }}
      inputValue={inputValue}
      withSearch={withSearch}
      optionsDisplay={optionsDisplay}
      maxSelectedDisplay={maxSelectedDisplay}
      isError={isError}
      placeholder={placeholder || "Multi Pilih Jenis Cuti"}
      nonNullable={nonNullable}
      {...props}
    />
  );
}
