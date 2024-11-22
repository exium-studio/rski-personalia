import {
  Box,
  Button,
  ButtonProps,
  HStack,
  Icon,
  Input,
  Text,
  Tooltip,
  Wrap,
} from "@chakra-ui/react";
import {
  RiCloseCircleFill,
  RiEyeFill,
  RiFileLine,
  RiUploadCloud2Line,
} from "@remixicon/react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useErrorColor } from "../../../constant/colors";
import CContainer from "../../independent/wrapper/CContainer";

interface Props extends ButtonProps {
  name: string;
  onChangeSetter: (inputValue: File | undefined) => void;
  inputValue: File | string | undefined;
  accept?: string;
  isError?: boolean;
  placeholder?: string;
  initialFilepath?: string;
}

export default function FileInput({
  name,
  onChangeSetter,
  inputValue,
  accept,
  isError,
  placeholder,
  initialFilepath,
  ...props
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [fileName, setFileName] = useState(
    typeof inputValue === "string"
      ? inputValue.split("/").pop()
      : inputValue?.name || ""
  );
  const [fileUrl, setFileUrl] = useState<string | undefined>(
    initialFilepath || (typeof inputValue === "string" ? inputValue : undefined)
  );
  const urlRef = useRef(fileUrl);

  useEffect(() => {
    const currentUrl = urlRef.current;
    if (inputValue && typeof inputValue !== "string") {
      setFileUrl(URL.createObjectURL(inputValue));
    } else {
      setFileUrl(typeof inputValue === "string" ? inputValue : undefined);
    }

    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [inputValue]);

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: any) => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onChangeSetter(file);
    }
  };

  const errorColor = useErrorColor();

  return (
    <>
      <Input
        ref={inputRef}
        display={"none"}
        name={name}
        type="file"
        accept={accept || "*"}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const files: FileList | null = e.target.files;
          if (files && files.length > 0) {
            const file = files[0];
            setFileName(file.name);
            onChangeSetter(file);

            // Reset nilai input untuk memungkinkan file yang sama dipilih ulang
            e.target.value = "";
          }
        }}
        mb={4}
      />

      <CContainer w={"100%"}>
        <Button
          px={0}
          w={"100%"}
          fontWeight={400}
          variant={"ghost"}
          className="btn"
          gap={0}
          border={`2px dashed ${
            isDraggingOver ? "var(--p500) !important" : "var(--divider3)"
          }`}
          borderColor={isError ? errorColor : ""}
          borderRadius={8}
          cursor={"pointer"}
          _focus={{
            borderColor: "p.500",
          }}
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = ""; // Reset input sebelum dialog file dibuka
              inputRef.current.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          {...props}
        >
          <HStack gap={0} w={"100%"}>
            <Box px={4} py={2} w={"100%"}>
              <Tooltip label={fileName}>
                <HStack justify={"center"} opacity={inputValue ? 1 : 0.3}>
                  <Icon as={inputValue ? RiFileLine : RiUploadCloud2Line} />
                  <Text
                    overflow={"hidden"}
                    textOverflow={"ellipsis"}
                    whiteSpace={"nowrap"}
                    textAlign={"left"}
                    fontSize={[12, null, 14]}
                  >
                    {fileName ||
                      placeholder ||
                      "Seret & letakkan atau klik untuk telusuri"}
                  </Text>
                </HStack>
              </Tooltip>
            </Box>
          </HStack>
        </Button>

        {inputValue && fileUrl && (
          <Wrap spacingX={0} ml={"auto"}>
            <Button
              mt={2}
              pl={"6px"}
              leftIcon={<Icon className="iconButton" as={RiEyeFill} />}
              className="btn"
              size={"xs"}
              as={Link}
              to={fileUrl}
              target="_blank"
            >
              <Text fontSize={12}>Lihat</Text>
            </Button>

            <Button
              mt={2}
              pl={"6px"}
              leftIcon={
                <Icon
                  className="iconButton"
                  as={RiCloseCircleFill}
                  strokeWidth={4}
                  mr={"-2.5px"}
                />
              }
              variant={"ghost"}
              colorScheme="error"
              size={"xs"}
              onClick={() => {
                onChangeSetter(undefined);
                setFileName("");
                if (inputRef.current) {
                  inputRef.current.value = ""; // Reset input saat file dihapus
                }
              }}
            >
              <Text fontSize={12}>Clear</Text>
            </Button>
          </Wrap>
        )}
      </CContainer>
    </>
  );
}
