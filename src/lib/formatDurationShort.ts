export default function formatDurationShort(seconds: number) {
  // Menghitung jumlah jam, menit, dan detik
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);

  // Mengonversi ke format dua digit dengan leading zero jika perlu
  let formattedHours = String(hours).padStart(2, "0");
  let formattedMinutes = String(minutes).padStart(2, "0");

  // Mengembalikan format yang diinginkan
  return `${formattedHours}j ${formattedMinutes}m`;
}
