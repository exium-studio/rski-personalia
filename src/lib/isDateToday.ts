export default function isDateToday(date: string | Date): boolean {
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Mengambil tanggal hari ini
  const today = new Date();
  const todayFormatted = formatDate(today);

  // Mengubah input menjadi objek Date jika dalam format string
  const inputDate = typeof date === "string" ? new Date(date) : date;
  const inputDateFormatted = formatDate(inputDate);

  // Membandingkan tanggal input dengan tanggal hari ini
  return todayFormatted === inputDateFormatted;
}
