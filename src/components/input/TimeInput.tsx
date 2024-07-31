import { HStack, Input, StackProps } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

interface Props extends StackProps {
  value: any;
  onChange: (newValue: any) => void;
}

export default function TimeInput({ value, onChange, ...props }: Props) {
  const [hour, setHour] = useState<any>(value ? new Date(value).getHours : "");
  const [minute, setMinute] = useState<any>(
    value ? new Date(value).getHours : ""
  );

  const onChangeRef = useRef(onChange);

  useEffect(() => {
    if (hour !== "" && minute !== "") {
      const date = new Date();
      date.setHours(hour);
      date.setMinutes(minute);
      onChangeRef.current(date.toISOString());
    } else {
      onChangeRef.current("");
    }
  }, [hour, minute]);

  return (
    <HStack {...props}>
      <Input
        name="jam_from_hour"
        placeholder="hh"
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || (hour === 0 && value === "0")) {
            setHour("");
          } else {
            const numValue = parseInt(value);
            if (numValue < 24) {
              setHour(numValue);
            }
          }
        }}
        value={hour === "" ? "" : hour.toString().padStart(2, "0")}
      />

      <Input
        name="jam_from_minute"
        placeholder="mm"
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || (minute === 0 && value === "0")) {
            setMinute("");
          } else {
            const numValue = parseInt(value);
            if (numValue < 60) {
              setMinute(numValue);
            }
          }
        }}
        value={minute === "" ? "" : minute.toString().padStart(2, "0")}
      />
    </HStack>
  );
}
