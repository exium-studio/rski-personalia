import { Textarea as ChakraTextarea, TextareaProps } from "@chakra-ui/react";
import { useCallback, useEffect, useRef } from "react";

interface Props extends TextareaProps {
  name: string;
  formik: any;
  placeholder?: string;
}

export default function Textarea({
  name,
  formik,
  placeholder,
  ...props
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const values = formik.values[name];

  const autoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 5
      }px`;
    }
  }, [textareaRef]);

  useEffect(() => {
    autoResize();
  }, [autoResize, values]);

  return (
    <ChakraTextarea
      ref={textareaRef}
      minH={"80px"}
      name={name}
      placeholder={placeholder || "Masukkan deskripsi singkat"}
      onChange={formik.handleChange}
      value={formik.values[name]}
      {...props}
    />
  );
}
