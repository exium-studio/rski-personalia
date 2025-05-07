import { ButtonProps, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Interface__SelectOption } from "../../../constant/interfaces";
import req from "../../../lib/req";
import MultipleSelectModalKaryawanPenerimaKaryawan from "../input/MultipleSelectModalKaryawanPenerimaKaryawan";

interface Props extends ButtonProps {
  name: string;
  onConfirm: (inputValue: Interface__SelectOption[] | undefined) => void;
  inputValue: Interface__SelectOption[] | undefined;
  withSearch?: boolean;
  optionsDisplay?: "list" | "chip";
  isError?: boolean;
  placeholder?: string;
  nonNullable?: boolean;
}

export default function MultiSelectKaryawanWithFilter({
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
  const [listKaryawan, setListKaryawan] = useState<any>(undefined);

  useEffect(() => {
    if (isOpen && !options) {
      req
        .get("/api/get-list-user")
        .then((r) => {
          if (r.status === 200) {
            setListKaryawan(r.data.data);
            const options = r.data.data.map((item: any) => ({
              value: item?.user?.id,
              label: item?.user?.nama,
              label2: item?.unit_kerja?.jenis_karyawan ? "Shift" : "Non-Shift",
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
    <MultipleSelectModalKaryawanPenerimaKaryawan
      id="select-unit_kerja-modal"
      name={name}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      options={options}
      listKaryawan={listKaryawan}
      onConfirm={(input) => {
        onConfirm(input);
      }}
      inputValue={inputValue}
      withSearch={withSearch}
      optionsDisplay={optionsDisplay}
      isError={isError}
      placeholder={placeholder || "Multi Pilih Karyawan"}
      nonNullable={nonNullable}
      {...props}
    />
  );
}
