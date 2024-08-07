import { Image, ImageProps } from "@chakra-ui/react";
import { useState } from "react";

interface Props extends ImageProps {
  fallbackSrc?: string;
}

export default function Img({ fallbackSrc, ...props }: Props) {
  const [src, setSrc] = useState<string | undefined>(props.src);

  return <Image src={src} onError={() => setSrc(fallbackSrc)} {...props} />;
}
