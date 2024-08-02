const formatMasaKerja = (bulan: number): string => {
  if (bulan <= 0) {
    return "";
  }

  const tahun = Math.floor(bulan / 12);
  const sisaBulan = bulan % 12;
  let formatted = "";

  if (tahun > 0) {
    formatted += `${tahun} tahun`;
  }

  if (sisaBulan > 0) {
    if (tahun > 0) {
      formatted += " ";
    }
    formatted += `${sisaBulan} bulan`;
  }

  return formatted;
};

export default formatMasaKerja;
