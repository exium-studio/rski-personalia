import isDatePassed from "./isDatePassed";

export default function calculateMasaKerjaFromTanggalMasuk(dateString: string) {
  if (dateString) {
    if (isDatePassed(dateString, true)) {
      return "-";
    } else {
      // Parse the input date string (format: d-m-y)
      const [day, month, year] = dateString?.split("-")?.map(Number);
      const startDate = new Date(year, month - 1, day);

      // Get the current date
      const currentDate = new Date();

      // Calculate the difference in years, months, and days
      let years = currentDate.getFullYear() - startDate.getFullYear();
      let months = currentDate.getMonth() - startDate.getMonth();
      let days = currentDate.getDate() - startDate.getDate();

      // Adjust for negative days
      if (days < 0) {
        months--;
        const previousMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        );
        days += previousMonth.getDate();
      }

      // Adjust for negative months
      if (months < 0) {
        years--;
        months += 12;
      }

      return `${years} tahun ${months} bulan ${days} hari`;
    }
  }

  return "";
}
