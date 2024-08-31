import { Text, TextProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import formatDurationNumeric from "../../lib/FormatDurationNumeric";

interface Props extends TextProps {
  initialSeconds: number;
  onCountFinished?: (() => void) | "stop";
}

export default function CountDownDurationShort({
  initialSeconds,
  onCountFinished,
  ...props
}: Props) {
  const [remainingTime, setRemainingTime] = useState(initialSeconds);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // console.log(remainingTime);

    if (remainingTime < 1) {
      if (onCountFinished) {
        if (onCountFinished === "stop") {
          setRemainingTime(0);
        } else {
          onCountFinished();
        }
      }
    }
  }, [remainingTime, onCountFinished]);

  return remainingTime === 0 ? (
    <Text mx={"auto"}>-</Text>
  ) : (
    <Text className="num" {...props}>
      {formatDurationNumeric(remainingTime)}
    </Text>
  );
}
