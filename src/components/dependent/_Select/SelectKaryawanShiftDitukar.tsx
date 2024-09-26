import { ButtonProps, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Interface__SelectOption } from "../../../constant/interfaces";
import req from "../../../lib/req";
import backOnClose from "../../../lib/backOnClose";
import SingleSelectModal from "../input/SingleSelectModal";

interface Props extends ButtonProps {
  jadwal_id?: number;
  name: string;
  onConfirm: (inputValue: Interface__SelectOption | undefined) => void;
  inputValue: Interface__SelectOption | undefined;
  withSearch?: boolean;
  optionsDisplay?: "list" | "chip";
  isError?: boolean;
  placeholder?: string;
  nonNullable?: boolean;
}

export default function SelectKaryawanDitukar({
  jadwal_id,
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
        .get(
          `/api/rski/dashboard/jadwal-karyawan/get-tukar-jadwal/user-ditukar/${jadwal_id}`
        )
        .then((r) => {
          if (r.status === 200) {
            const options = r.data.data.user.map((item: any) => ({
              value: item?.id,
              label: item?.nama,
              label2: r.data.data?.unit_kerja?.jenis_karyawan
                ? "Shift"
                : "Non-Shift",
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
          backOnClose();
        });
    }
  }, [isOpen, options, toast, jadwal_id]);

  return (
    <SingleSelectModal
      id="select-karyawan-ditukar-modal"
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
      placeholder={placeholder || "Pilih Karyawan Ditukar"}
      nonNullable={nonNullable}
      {...props}
    />
  );
}
