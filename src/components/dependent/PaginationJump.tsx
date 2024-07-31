import {
  Button,
  FormControl,
  FormErrorMessage,
  Menu,
  MenuButton,
  MenuGroup,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import NumberInput from "./input/NumberInput";

type Props = {
  page: any;
  setPage: (n: number) => void;
  pagination: any;
};
export default function PaginationJump({ page, setPage, pagination }: Props) {
  const [data, setData] = useState<number | undefined>(page);

  const validation = () => {
    if (data && data > 0 && data <= pagination.last_page) {
      return true;
    }
    return false;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (data && data > 0 && data <= pagination.last_page) {
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

        <MenuList minW={"180px"} maxW={"180px"} zIndex={99}>
          <MenuGroup
            title={`Terakhir : ${pagination.last_page}`}
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
              <Button
                variant={"ghost"}
                colorScheme="ap"
                // className="btn-solid"
                type="submit"
                form="jumpToPageForm"
                isDisabled={!validation()}
                borderRadius={"0 0 8px 8px"}
                w={"100%"}
              >
                Lompat
              </Button>
              <FormErrorMessage
                px={3}
                pb={2}
              >{`Input harus lebih dari 0 dan kurang dari/sama dengan halaman terakhir`}</FormErrorMessage>
            </FormControl>
          </form>
        </MenuList>
      </Menu>
      {/* <Center
        className="btn-outline clicky"
        color={"p.500"}
        w={"32px"}
        h={"32px"}
        borderRadius={8}
        cursor={"pointer"}
        transition={"200ms"}
        onClick={onOpen}
      >
        <Text fontWeight={600}>{page}</Text>
      </Center>

      <Modal
        isOpen={isOpen}
        onClose={handleOnClose}
        initialFocusRef={initialFocusRef}
        isCentered
        size={"sm"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title="Lompat Halaman Ke - " />
          </ModalHeader>

          <ModalBody>
            <Text mb={4}>{`Halaman terakhir : ${pagination.last_page}`}</Text>
            <form id={"jumpToPageForm"} onSubmit={handleSubmit}>
              <FormControl isInvalid={!validation()}>
                <Input
                  ref={initialFocusRef}
                  placeholder="Masukkan halaman ke -"
                  onChange={(e) => {
                    setData(parseNumber(e.target.value));
                  }}
                  value={formatNumber(data)}
                />
                <FormErrorMessage>{`Input harus lebih dari 0 dan kurang dari/sama dengan halaman terakhir`}</FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              className="btn-ap clicky"
              colorScheme="ap"
              type="submit"
              form="jumpToPageForm"
              isDisabled={!validation()}
              w={"100%"}
            >
              Lompat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </>
  );
}
