import {
  Box,
  BoxProps,
  Input as ChakraInput,
  InputProps,
  Text,
  TextProps,
  useColorMode,
} from "@chakra-ui/react";
import { css, Global } from "@emotion/react";

interface Props extends InputProps {
  fRef?: any;
  name: string;
  onChangeSetter: (inputValue: string | undefined) => void;
  inputValue: string | undefined;
  isError?: boolean;
  placeholder?: string;
  boxProps?: BoxProps;
  placeholderprops?: TextProps;
}

export default function StringInput({
  fRef,
  name,
  onChangeSetter,
  inputValue,
  isError,
  placeholder = "",
  boxProps,
  placeholderprops,
  ...props
}: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChangeSetter(e.target.value);
  }

  const { colorMode } = useColorMode();
  const darkLightColorManual = colorMode === "light" ? "white" : "var(--dark)";

  return (
    <>
      <Global
        styles={css`
          input:-webkit-autofill {
            border: 10px solid var(--divider3) !important;
          }
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px ${darkLightColorManual} inset !important;
            box-shadow: 0 0 0 30px ${darkLightColorManual} inset !important;
          }
        `}
      />

      <Box position={"relative"} w={"100%"} overflow={"visible"} {...boxProps}>
        <ChakraInput
          ref={fRef}
          name={name}
          border={"1px solid var(--divider3) !important"}
          _focus={{
            border: "1px solid var(--p500) !important",
            boxShadow: "none !important",
          }}
          onChange={handleChange}
          value={inputValue}
          placeholder=" "
          {...props}
        />
        {!inputValue && (
          <Text
            w={"calc(100% - 32px)"}
            position={"absolute"}
            top={"8px"}
            left={props?.pl || 4}
            pr={props?.pr}
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            color={`#96969691`}
            pointerEvents={"none"}
            {...placeholderprops}
          >
            {placeholder}
          </Text>
        )}
      </Box>
    </>
  );
}
