import { format } from "date-fns";

export default function convertDateToMySQLFormat(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd HH:mm:ss");
}
