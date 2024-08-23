import {
  Button,
  FormControl,
  FormErrorMessage,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NumberInput from "./input/NumberInput";

type Props = {
  page: any;
  setPage: (n: number) => void;
  pagination: any;
};
export default function PaginationJump({ page, setPage, pagination }: Props) {
  const [data, setData] = useState<number | undefined>(page);

  useEffect(() => {
    if (page) {
      setData(page);
    }
  }, [page]);

  const validation = () => {
    if (
      pagination?.meta?.last_page === undefined ||
      pagination?.meta?.last_page === null
    ) {
      return true;
    }

    if (data && data > 0 && data <= pagination?.meta?.last_page) {
      return true;
    }

    return false;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (data && data > 0 && data <= pagination?.meta?.last_page) {
      setPage(data);
    }
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={VStack}
          justify={"center"}
          className="btn-outline"
          color={"p.500"}
          minW={"32px"}
          h={"32px"}
          borderRadius={8}
          cursor={"pointer"}
          transition={"200ms"}
          px={2}
        >
          <Text fontWeight={600} mt={1}>
            {page}
          </Text>
        </MenuButton>

        <MenuList minW={"200px"} maxW={"200px"} zIndex={99}>
          <MenuGroup
            title={`Terakhir : ${pagination?.meta?.last_page || "-"}`}
            fontWeight={400}
          ></MenuGroup>
          <form id={"jumpToPageForm"} onSubmit={handleSubmit}>
            <FormControl isInvalid={!validation()}>
              <NumberInput
                name="page"
                onChangeSetter={(input) => {
                  setData(input);
                }}
                inputValue={data}
                borderRadius={"0 !important"}
                borderLeft={"none !important"}
                borderRight={"none !important"}
                textAlign={"center"}
              />
              <MenuItem
                as={Button}
                justifyContent={"center"}
                type="submit"
                form="jumpToPageForm"
                isDisabled={!validation()}
                borderRadius={"0 0 8px 8px"}
                w={"100%"}
                color={"p.500"}
              >
                Lompat
              </MenuItem>
              <FormErrorMessage
                px={3}
                pb={2}
                color={"red.400"}
              >{`Input harus lebih dari 0 dan kurang dari/sama dengan halaman terakhir`}</FormErrorMessage>
            </FormControl>
          </form>
        </MenuList>
      </Menu>
    </>
  );
}
