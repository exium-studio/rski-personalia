import { ButtonProps, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { dummyShift } from "../../../const/dummy";
import { Interface__SelectOption } from "../../../constant/interfaces";
import formatTime from "../../../lib/formatTime";
import SingleSelectModal from "../input/SingleSelectModal";

interface Props extends ButtonProps {
  karyawan_id?: number;
  name: string;
  onConfirm: (inputValue: Interface__SelectOption | undefined) => void;
  inputValue: Interface__SelectOption | undefined;
  withSearch?: boolean;
  optionsDisplay?: "list" | "chip";
  isError?: boolean;
  placeholder?: string;
  nonNullable?: boolean;
}

export default function SelectJadwalKaryawan({
  karyawan_id,
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

  const [options, setOptions] = useState<Interface__SelectOption[] | undefined>(
    undefined
  );

  useEffect(() => {
    if (karyawan_id) {
      // TODO get all jadwal by karyawan_id
    }
    const options = dummyShift.map((item) => ({
      value: item.id,
      label: item.nama,
      label2: `${formatTime(item.jam_from)} - ${formatTime(item.jam_to)}`,
    }));
    setOptions(options);
  }, [karyawan_id]);

  console.log(inputValue, props.isDisabled);

  return (
    <SingleSelectModal
      id="select-jadwal-karyawan-modal"
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
      isError={isError}
      placeholder={placeholder || "Pilih Jadwal Karyawan"}
      nonNullable={nonNullable}
      {...props}
    />
  );
}
