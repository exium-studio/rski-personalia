import { Badge, BadgeProps } from "@chakra-ui/react";
import isDatePassed from "../../lib/isDatePassed";
import isDateToday from "../../lib/isDateToday";

interface Props extends BadgeProps {
  tgl_mulai_jadwal?: string;
}

export default function StatusLemburBadge({
  tgl_mulai_jadwal,
  ...props
}: Props) {
  const isPassed = isDatePassed(tgl_mulai_jadwal as string);
  const isToday = isDateToday(tgl_mulai_jadwal as string);
  const colorScheme = () => {
    if (!isToday) {
      if (isPassed) {
        return "green";
      } else {
        return "orange";
      }
    } else {
      return "blue";
    }
  };

  return (
    <Badge
      borderRadius={"full"}
      colorScheme={colorScheme()}
      textAlign={"center"}
      {...props}
    >
      {!isToday && (
        <>
          {isPassed && "Selesai"}

          {!isPassed && "Menunggu"}
        </>
      )}

      {isToday && "Berlangsung"}
    </Badge>
  );
}
