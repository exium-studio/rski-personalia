import { ButtonProps, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Interface__SelectOption } from "../../../constant/interfaces";
import req from "../../../constant/req";
import formatTime from "../../../lib/formatTimeOld";
import SingleSelectModal from "../input/SingleSelectModal";

interface Props extends ButtonProps {
  user_id?: number;
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
  user_id,
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
    if (isOpen) {
      setOptions(undefined);
      req
        .get(
          `/api/rski/dashboard/jadwal-karyawan/get-tukar-jadwal/jadwal-pengajuan/${user_id}`
        )
        .then((r) => {
          if (r.status === 200) {
            let optionsRaw = r.data.data.list_jadwal;
            optionsRaw = optionsRaw.filter((item: any) => item !== null);
            const options = optionsRaw.map((item: any) => ({
              value: item?.id,
              label: item?.nama_shift,
              label2: `${formatTime(item?.jam_from)} - ${formatTime(
                item?.jam_to
              )}`,
            }));

            setOptions(options);
          }
        })
        .catch((e) => {
          console.log("Error:", e);
          toast({
            status: "error",
            title:
              (typeof e?.response?.data?.message === "string" &&
                (e?.response?.data?.message as string)) ||
              "Maaf terjadi kesalahan pada sistem",
            isClosable: true,
            position: "bottom-right",
          });
        });
    }
  }, [isOpen, toast, user_id]);

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
      placeholder={placeholder || "Pilih Jadwal Pegawai Pengajuan"}
      nonNullable={nonNullable}
      {...props}
    />
  );
}
