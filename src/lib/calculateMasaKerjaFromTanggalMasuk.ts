export default function calculateMasaKerjaFromTanggalMasuk(startDate: string) {
  const start = new Date(startDate);
  const today = new Date();

  let years = today.getFullYear() - start.getFullYear();
  let months = today.getMonth() - start.getMonth();
  let days = today.getDate() - start.getDate();

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
