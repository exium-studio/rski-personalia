import {
  Center,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  Tooltip,
} from "@chakra-ui/react";
import { RiCloseLine, RiSearchLine } from "@remixicon/react";
import { Dispatch } from "react";
import { iconSize } from "../../../constant/sizes";

interface Props extends InputGroupProps {
  name: string;
  inputValue: string;
  onChangeSetter: Dispatch<string>;
  placeholder?: string;
  tooltipLabel?: string;
  inputRef?: any;
}

export default function SearchComponent({
  inputRef,
  name,
  inputValue,
  onChangeSetter,
  tooltipLabel,
  placeholder = "Pencarian",
  ...props
}: Props) {
  return (
    <Tooltip
      label={tooltipLabel || placeholder}
      openDelay={500}
      placement="bottom-start"
    >
      <InputGroup {...props}>
        <InputLeftElement>
          <Icon as={RiSearchLine} opacity={0.3} fontSize={iconSize} />
        </InputLeftElement>

        <Input
          ref={inputRef ? inputRef : null}
          placeholder={placeholder}
          pr={"36px"}
          onChange={(e) => {
            onChangeSetter(e.target.value);
          }}
          value={inputValue}
          boxShadow={"none !important"}
        />

        {inputValue && (
          <Center
            flexShrink={0}
            zIndex={3}
            position={"absolute"}
            h={"100%"}
            right={2}
          >
            <IconButton
              aria-label="Clear Search"
              icon={
                <Icon as={RiCloseLine} fontSize={props.fontSize || iconSize} />
              }
              onClick={() => {
                onChangeSetter("");
              }}
              colorScheme="error"
              variant={"ghost"}
              borderRadius={"full"}
              size={"xs"}
            />
          </Center>
        )}
      </InputGroup>
    </Tooltip>
  );
}
