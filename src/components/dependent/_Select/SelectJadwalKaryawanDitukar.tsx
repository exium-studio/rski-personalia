import { ButtonProps, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Interface__SelectOption } from "../../../constant/interfaces";
import req from "../../../constant/req";
import formatTime from "../../../lib/formatTimeOld";
import SingleSelectModal from "../input/SingleSelectModal";
import formatDate from "../../../lib/formatDate";

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

export default function SelectJadwalKaryawanDitukar({
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
          `/api/rski/dashboard/jadwal-karyawan/get-tukar-jadwal/jadwal-ditukar/${jadwal_id}`
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
  }, [isOpen, options, toast, jadwal_id]);

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
