import {
  Button,
  ButtonProps,
  Center,
  Icon,
  Image,
  ImageProps,
  Input,
  StackProps,
  Text,
  Tooltip,
  VStack,
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
import formatBytes from "../../../lib/formatBytes";
import CContainer from "../../independent/wrapper/CContainer";

interface Props extends ButtonProps {
  name: string;
  onChangeSetter: (inputValue: File | string | null | undefined) => void;
  inputValue: File | string | undefined;
  accept?: string;
  isError?: boolean;
  placeholder?: string;
  initialFilepath?: string;
  cProps?: StackProps;
  iProps?: ImageProps;
  disabled?: boolean;
}

export default function FileInputLarge({
  name,
  onChangeSetter,
  inputValue,
  accept,
  isError,
  placeholder,
  initialFilepath,
  cProps,
  iProps,
  disabled,
  ...props
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // console.log("input value", inputValue);

  const [fileName, setFileName] = useState(
    typeof inputValue === "string"
      ? inputValue.split("/").pop()
      : inputValue?.name || ""
  );
  const [fileURL, setFileURL] = useState<string | undefined>(
    initialFilepath || (typeof inputValue === "string" ? inputValue : undefined)
  );

  useEffect(() => {
    if (inputValue && typeof inputValue !== "string") {
      const objectURL = URL.createObjectURL(inputValue);
      setFileURL(objectURL);
      return () => URL.revokeObjectURL(objectURL);
    }
    setFileURL(typeof inputValue === "string" ? inputValue : undefined);
  }, [inputValue]);

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onChangeSetter(file);
    }
  };

  const errorColor = useErrorColor();

  //@ts-ignore@ 1
  const isImage = fileURL && /image\/.*/.test(inputValue?.type || "");

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

            // Reset nilai input untuk memungkinkan file yang sama dipilih lagi
            e.target.value = "";
          }
        }}
        mb={4}
      />

      <CContainer
        h={"100%"}
        w={"100%"}
        opacity={disabled ? 0.5 : 1}
        cursor={disabled ? "disabled !important" : "auto"}
      >
        <VStack
          as={Button}
          w={"100%"}
          justify={"center"}
          p={6}
          h={"300px"}
          className="btn"
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
              inputRef.current.value = ""; // Reset nilai sebelum dialog dibuka
              inputRef.current.click();
            }
          }}
          pointerEvents={disabled ? "none" : "auto"}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          {...cProps}
        >
          {isImage ? (
            <Image
              src={fileURL}
              alt={fileName}
              h="100%"
              w="100%"
              maxH="154px"
              objectFit={"contain"}
              mb={2}
              {...iProps}
            />
          ) : (
            <Center mb={2}>
              <Icon
                as={inputValue ? RiFileLine : RiUploadCloud2Line}
                fontSize={100}
              />
            </Center>
          )}

          {!inputValue && (
            <>
              <VStack gap={1}>
                <Text
                  fontSize={20}
                  fontWeight={600}
                  maxW={"300px"}
                  textAlign={"center"}
                  whiteSpace={"wrap"}
                >
                  Seret & Letakkan atau
                </Text>
                <Text
                  color={"p.500"}
                  fontSize={20}
                  fontWeight={600}
                  maxW={"300px"}
                  textAlign={"center"}
                  whiteSpace={"wrap"}
                  mb={2}
                >
                  Klik untuk telusuri
                </Text>
              </VStack>

              <Text
                fontWeight={400}
                fontSize={14}
                textAlign={"center"}
                opacity={0.4}
              >
                {placeholder || "Mendukung semua tipe file"}
              </Text>
            </>
          )}
          {inputValue && (
            <>
              <Tooltip label={fileName}>
                <Text
                  fontSize={18}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  whiteSpace={"nowrap"}
                  w={"100%"}
                >
                  {fileName}
                </Text>
              </Tooltip>
              {typeof inputValue !== "string" && (
                <Text opacity={0.4} fontSize={14}>
                  {formatBytes(inputValue.size)}
                </Text>
              )}
            </>
          )}
        </VStack>

        {inputValue && fileURL && (
          <Wrap spacingX={0} ml={"auto"}>
            <Button
              mt={2}
              pl={"6px"}
              leftIcon={<Icon className="iconButton" as={RiEyeFill} />}
              className="btn"
              size={"xs"}
              as={Link}
              to={fileURL}
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
                />
              }
              variant={"ghost"}
              colorScheme="error"
              size={"xs"}
              onClick={() => {
                onChangeSetter(null);
                setFileName("");
                setFileURL("");
                if (inputRef.current) {
                  inputRef.current.value = ""; // Reset input file saat file dihapus
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
