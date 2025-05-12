import { ButtonProps, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Interface__SelectOption } from "../../../constant/interfaces";
import req from "../../../lib/req";
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

export default function SelectKategoriUnitKerja({
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
        .get("/api/get-list-kategori-unit-kerja")
        .then((r) => {
          if (r.status === 200) {
            const options = r.data.data.map((item: any) => ({
              value: item.id,
              label: item.label,
            }));
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
        });
    }
  }, [isOpen, options, toast]);

  return (
    <SingleSelectModal
      id="select-kategori-unit-kerja-modal"
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
      placeholder={placeholder || "Pilih Kategori Unit Kerja"}
      nonNullable={nonNullable}
      {...props}
    />
  );
}
