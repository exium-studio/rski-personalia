import { ButtonProps, useDisclosure } from "@chakra-ui/react";
import { Interface__SelectOption } from "../../../constant/interfaces";
import SingleSelectModal from "../input/SingleSelectModal";
import { useEffect, useRef, useState } from "react";

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

export default function SelectPtkp({
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

  const dummy = [
    {
      id: "T001",
      kategori_ter: {
        id: 3,
        nama_kategori_ter: "TER Kategori C",
        created_at: "2024-01-13T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      ptkp: {
        id: 3,
        kode_ptkp: "K/0",
        kategori_ter: 1,
        created_at: "2024-05-24T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      from_ter: 4964062,
      to_ter: 9471915,
      percentage_ter: 23,
      created_at: "2023-11-05T03:42:50.000000Z",
      updated_at: "2024-05-24T03:42:50.000000Z",
    },
    {
      id: "T002",
      kategori_ter: {
        id: 3,
        nama_kategori_ter: "TER Kategori C",
        created_at: "2024-01-13T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      ptkp: {
        id: 3,
        kode_ptkp: "K/0",
        kategori_ter: 1,
        created_at: "2024-05-24T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      from_ter: 3372038,
      to_ter: 6948819,
      percentage_ter: 5,
      created_at: "2024-05-15T03:42:50.000000Z",
      updated_at: "2024-05-24T03:42:50.000000Z",
    },
    {
      id: "T003",
      kategori_ter: {
        id: 2,
        nama_kategori_ter: "TER Kategori B",
        created_at: "2024-01-13T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      ptkp: {
        id: 5,
        kode_ptkp: "TK/3",
        kategori_ter: 2,
        created_at: "2024-05-24T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      from_ter: 2976703,
      to_ter: 8559858,
      percentage_ter: 13,
      created_at: "2024-04-21T03:42:50.000000Z",
      updated_at: "2024-05-24T03:42:50.000000Z",
    },
    {
      id: "T004",
      kategori_ter: {
        id: 2,
        nama_kategori_ter: "TER Kategori B",
        created_at: "2024-01-13T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      ptkp: {
        id: 6,
        kode_ptkp: "K/1",
        kategori_ter: 2,
        created_at: "2024-05-24T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      from_ter: 4512782,
      to_ter: 8290141,
      percentage_ter: 7,
      created_at: "2023-10-23T03:42:50.000000Z",
      updated_at: "2024-05-24T03:42:50.000000Z",
    },
    {
      id: "T005",
      kategori_ter: {
        id: 1,
        nama_kategori_ter: "TER Kategori A",
        created_at: "2024-01-13T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      ptkp: {
        id: 1,
        kode_ptkp: "TK/0",
        kategori_ter: 1,
        created_at: "2024-05-24T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      from_ter: 4975499,
      to_ter: 6499790,
      percentage_ter: 24,
      created_at: "2024-02-08T03:42:50.000000Z",
      updated_at: "2024-05-24T03:42:50.000000Z",
    },
    {
      id: "T006",
      kategori_ter: {
        id: 2,
        nama_kategori_ter: "TER Kategori B",
        created_at: "2024-01-13T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      ptkp: {
        id: 5,
        kode_ptkp: "TK/3",
        kategori_ter: 2,
        created_at: "2024-05-24T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      from_ter: 3584147,
      to_ter: 7594382,
      percentage_ter: 18,
      created_at: "2024-03-17T03:42:50.000000Z",
      updated_at: "2024-05-24T03:42:50.000000Z",
    },
    {
      id: "T007",
      kategori_ter: {
        id: 2,
        nama_kategori_ter: "TER Kategori B",
        created_at: "2024-01-13T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      ptkp: {
        id: 6,
        kode_ptkp: "K/1",
        kategori_ter: 2,
        created_at: "2024-05-24T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      from_ter: 2188757,
      to_ter: 7456492,
      percentage_ter: 34,
      created_at: "2024-01-13T03:42:50.000000Z",
      updated_at: "2024-05-24T03:42:50.000000Z",
    },
    {
      id: "T008",
      kategori_ter: {
        id: 2,
        nama_kategori_ter: "TER Kategori B",
        created_at: "2024-01-13T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      ptkp: {
        id: 1,
        kode_ptkp: "TK/0",
        kategori_ter: 1,
        created_at: "2024-05-24T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      from_ter: 5122914,
      to_ter: 7994344,
      percentage_ter: 18,
      created_at: "2024-01-12T03:42:50.000000Z",
      updated_at: "2024-05-24T03:42:50.000000Z",
    },
    {
      id: "T009",
      kategori_ter: {
        id: 3,
        nama_kategori_ter: "TER Kategori C",
        created_at: "2024-01-13T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      ptkp: {
        id: 8,
        kode_ptkp: "K/3",
        kategori_ter: 3,
        created_at: "2024-05-24T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      from_ter: 2505829,
      to_ter: 9568444,
      percentage_ter: 16,
      created_at: "2023-08-05T03:42:50.000000Z",
      updated_at: "2024-05-24T03:42:50.000000Z",
    },
    {
      id: "T0010",
      kategori_ter: {
        id: 3,
        nama_kategori_ter: "TER Kategori C",
        created_at: "2024-01-13T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      ptkp: {
        id: 1,
        kode_ptkp: "TK/0",
        kategori_ter: 1,
        created_at: "2024-05-24T03:42:50.000000Z",
        updated_at: "2024-05-24T03:42:50.000000Z",
      },
      from_ter: 1675122,
      to_ter: 9500370,
      percentage_ter: 11,
      created_at: "2023-12-29T03:42:50.000000Z",
      updated_at: "2024-05-24T03:42:50.000000Z",
    },
  ];

  const dummyRef = useRef(dummy);

  const [options, setOptions] = useState<Interface__SelectOption[] | undefined>(
    undefined
  );

  useEffect(() => {
    // TODO get all unit kerja

    const options = dummyRef.current.map((item) => ({
      value: item.id,
      label: item.ptkp.kode_ptkp,
    }));
    setOptions(options);
  }, []);

  return (
    <SingleSelectModal
      id="select-ptkp-modal"
      name={name}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      options={options?.sort((a, b) => {
        return a.label.localeCompare(b.label);
      })}
      onConfirm={(input) => {
        onConfirm(input);
      }}
      inputValue={inputValue}
      withSearch={withSearch}
      optionsDisplay={optionsDisplay}
      isError={isError}
      placeholder={placeholder || "Pilih PTKP"}
      nonNullable={nonNullable}
      {...props}
    />
  );
}
