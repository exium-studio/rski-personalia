import { ButtonProps, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Interface__SelectOption } from "../../../constant/interfaces";
import req from "../../../lib/req";
import formatTime from "../../../lib/formatTime";
import SingleSelectModal from "../input/SingleSelectModal";
import backOnClose from "../../../lib/backOnClose";

interface Props extends ButtonProps {
  data_karyawan_id: number;
  name: string;
  onConfirm: (inputValue: Interface__SelectOption | undefined) => void;
  inputValue: Interface__SelectOption | undefined;
  withSearch?: boolean;
  optionsDisplay?: "list" | "chip";
  isError?: boolean;
  placeholder?: string;
  nonNullable?: boolean;
}

export default function SelectShiftByUser({
  data_karyawan_id,
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

  const toast = useToast();
  const [options, setOptions] = useState<Interface__SelectOption[] | undefined>(
    undefined
  );

  useEffect(() => {
    if (isOpen && !options) {
      req
        .get(`/api/get-list-shift/${data_karyawan_id}`)
        .then((r) => {
          if (r.status === 200) {
            const options = r.data.data.map((item: any) => ({
              value: item.id,
              label: `${formatTime(item.jam_from)} - ${formatTime(
                item.jam_to
              )}`,
              // label2: item?.unit_kerja?.nama_unit,
              label2: item?.nama,
            }));
            // setOptions([{ value: 0, label: "Libur" }, ...options]);
            setOptions(options);
          }
        })
        .catch((e) => {
          console.log(e);
          toast({
            status: "error",
            title:
              (typeof e?.response?.data?.message === "string" &&
                (e?.response?.data?.message as string)) ||
              "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
            isClosable: true,
            position: "bottom-right",
          });
          backOnClose();
        });
    }
  }, [isOpen, options, toast, data_karyawan_id]);

  return (
    <SingleSelectModal
      id="select-shift-by-user-modal"
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
      placeholder={placeholder || "Pilih Shift"}
      nonNullable={nonNullable}
      {...props}
    />
  );
}
