import { ButtonProps, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Interface__SelectOption } from "../../../constant/interfaces";
import req from "../../../lib/req";
import formatTime from "../../../lib/formatTime";
import SingleSelectModal from "../input/SingleSelectModal";
import formatDate from "../../../lib/formatDate";
import backOnClose from "../../../lib/backOnClose";

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

export default function SelectJadwalKaryawanDitukar({
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
      req
        .get(
          `/api/rski/dashboard/jadwal-karyawan/get-tukar-jadwal/jadwal-ditukar/${user_id}`
        )
        .then((r) => {
          if (r.status === 200) {
            const options = r.data.data.list_jadwal.map((item: any) => {
              if (item) {
                return {
                  value: item?.id,
                  label: formatDate(item?.tanggal, "basicShort"),
                  label2: `${formatTime(item?.jam_from)} - ${formatTime(
                    item?.jam_to
                  )}`,
                };
              }
              return null;
            });
            setOptions(options);
          }
        })
        .catch((e) => {
          console.log("Error:", e);
          backOnClose();
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
      placeholder={placeholder || "Pilih Jadwal Karyawan Pengajuan"}
      nonNullable={nonNullable}
      {...props}
    />
  );
}
