import formatDate from "./formatDate";

export default function isDatePassed(
  date: string | Date,
  isTodayCounted?: boolean
): boolean {
  const inputDateIso = formatDate(date, "iso");
  const inputDate = new Date(inputDateIso);
  const today = new Date();

  // Mengatur waktu (hours, minutes, seconds, ms) ke 0 untuk memastikan perbandingan hanya berdasarkan tanggal
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (isTodayCounted) {
    return inputDate < today;
  } else {
    return inputDate <= today;
  }
}
