import {
  Button,
  Icon,
  Input,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { RiUploadCloud2Line } from "@remixicon/react";
import React, { useRef, useState } from "react";

interface Props {
  formik: any;
  name: string;
  accept?: string;
}

export default function FileInputBig({ formik, name, accept }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [fileName, setFileName] = useState<string | null>(null);
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
            formik.setFieldValue(name, [file]); // Setel ke array dengan satu file
          }
          // console.log(files);
        }}
        mb={4}
      />

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
        onDragLeave={handleDragLeave} // Tambahkan event handler untuk menangani event drag leave
        onDrop={handleDrop}
      >
        <Icon as={RiUploadCloud2Line} fontSize={124} color={"p.500"} />

        {!fileName && (
          <>
            <Text
              fontSize={22}
              fontWeight={600}
              maxW={"300px"}
              textAlign={"center"}
              whiteSpace={"wrap"}
              mb={2}
            >
              Seret & Letakkan atau{" "}
              <span style={{ color: "var(--p500)" }}>Klik untuk Cari</span>
            </Text>

            <Text
              fontWeight={400}
              fontSize={14}
              textAlign={"center"}
              opacity={0.6}
            >
              Mendukung CSV, XLS dan XLSX
            </Text>
          </>
        )}
        {fileName && <Text>{fileName}</Text>}
      </VStack>
    </>
  );
}
