export default function calculateMasaKerjaFromTanggalMasuk(startDate: string) {
  // Split the date string into day, month, and year
  const [day, month, year] = startDate.split("-").map(Number);

  // Create a Date object for the start date
  const start = new Date(year, month - 1, day);

  // Get today's date
  const today = new Date();

  // Calculate the difference in years, months, and days
  let years = today.getFullYear() - start.getFullYear();
  let months = today.getMonth() - start.getMonth();
  let days = today.getDate() - start.getDate();

  // Adjust the month and day differences if necessary
  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} tahun ${months} bulan ${days} hari`;
}
