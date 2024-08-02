import { ButtonProps, Icon, IconButton } from "@chakra-ui/react";
import { RiRestartLine } from "@remixicon/react";
import { useState } from "react";

interface Props extends ButtonProps {}

export default function RefreshButton({ ...props }: Props) {
  const [rotate, setRotate] = useState(false);

  console.log(rotate);

  const handleRotate = () => {
    setRotate(true);
  };

  const handleStopRotate = () => {
    setRotate(false);
  };

  const handleClick = () => {
    setTimeout(() => {
      window.location.reload();
    }, 300); // Delay to allow rotation to be visible
  };

  return (
    <IconButton
      aria-label="refresh button"
      icon={
        <Icon
          as={RiRestartLine}
          fontSize={20}
          transform={rotate ? "rotate(40deg)" : "none"}
          transition="transform 0.3s"
          onMouseDown={handleRotate}
          onMouseUp={handleStopRotate}
          onMouseLeave={handleStopRotate}
          onClick={handleClick}
        />
      }
      {...props}
    />
  );
}
