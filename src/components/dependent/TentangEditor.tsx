import { Button, HStack, useToast } from "@chakra-ui/react";
import JoditEditor from "jodit-react";
import { useRef, useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import CContainer from "../wrapper/CContainer";
import req from "../../lib/req";

interface Props {
  tentangId: number;
  data: any;
}

export default function TentangEditor({ tentangId, data }: Props) {
  const editor = useRef(null);

  // States
  const [content, setContent] = useState<any>(data?.konten || "");

  // Utils
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  function handleSubmit() {
    setLoading(true);
    const url = `/api/rski/dashboard/pengaturan/about-hospitals/${tentangId}`;
    const payload = {
      konten: content,
    };

    req
      .post(url, payload)
      .then((r) => {
        if (r.status === 200) {
          toast({
            status: "success",
            title: r?.data?.message,
            position: "bottom-right",
            isClosable: true,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        toast({
          status: "error",
          title:
            (typeof e?.response?.data?.message === "string" &&
              (e?.response?.data?.message as string)) ||
            "Maaf terjadi kesalahan pada sistem",
          position: "bottom-right",
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <CContainer flex={1} overflowY={"auto"} className="scrollY">
        <JoditEditor
          ref={editor}
          value={content}
          // @ts-ignore
          tabIndex={1}
          onChange={(newContent) => {
            setContent(newContent);
          }}
        />
      </CContainer>

      <HStack mt={responsiveSpacing}>
        <Button
          colorScheme="ap"
          className="btn-ap clicky"
          ml={"auto"}
          isLoading={loading}
          onClick={handleSubmit}
        >
          Simpan
        </Button>
      </HStack>
    </>
  );
}
