import {
  Box,
  Button,
  HStack,
  Icon,
  Input,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { RiUploadCloud2Line } from "@remixicon/react";
import React, { useRef, useState } from "react";
import { iconSize } from "../../constant/sizes";

interface Props {
  formik: any;
  name: string;
  accept?: string;
  defaultName?: string;
}

export default function FileInput({
  formik,
  name,
  accept,
  defaultName,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [fileName, setFileName] = useState(
    defaultName || "Seret & letakkan atau klik untuk cari"
  );
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDraggingOver(true); // Set state untuk menandakan sedang ada operasi seret-menyeret
  };

  const handleDragLeave = (e: any) => {
    setIsDraggingOver(false); // Set state untuk menandakan tidak ada operasi seret-menyeret lagi
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setIsDraggingOver(false); // Set state untuk menandakan tidak ada operasi seret-menyeret lagi
    const file = e.dataTransfer.files[0];
    if (file) {
      // console.log(file);
      setFileName(file.name);
      formik.setFieldValue(name, [file]);
    }
  };

  // SX
  const errorColor = useColorModeValue("red.500", "red.300");

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
            formik.setFieldValue(name, [file]);
          }
          // console.log(files);
        }}
        mb={4}
      />

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
        borderColor={formik.errors[name] ? errorColor : ""}
        borderRadius={8}
        cursor={"pointer"}
        _focus={{
          borderColor: "p.500",
        }}
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <HStack gap={0} w={"100%"}>
          <Box px={4} py={2} w={"100%"}>
            <Tooltip
              label={
                defaultName
                  ? defaultName
                  : formik.values[name]?.length > 0
                  ? formik.values[name]
                      .map((file: File) => file.name)
                      .join(", ")
                  : ""
              }
            >
              <HStack
                justify={"center"}
                opacity={formik.values[name]?.length > 0 ? 1 : 0.3}
              >
                <Icon as={RiUploadCloud2Line} fontSize={iconSize} />
                <Text
                  noOfLines={1}
                  fontSize={[12, null, 14]}
                  whiteSpace={"normal"}
                >
                  {fileName}
                  {/* {formik.values[name].length > 0
                  ? formik.values[name]
                      .map((file: File) => file.name)
                      .join(", ")
                  : "Pilih File"} */}
                </Text>
              </HStack>
            </Tooltip>
          </Box>
        </HStack>
      </Button>
    </>
  );
}
