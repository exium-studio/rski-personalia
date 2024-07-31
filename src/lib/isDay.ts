export default function isDay() {
  // Dapatkan waktu saat ini
  const currentHour = new Date().getHours();

  // Tentukan rentang waktu siang dan malam
  const startDaytime = 6; // Misalnya, dimulai dari pukul 06:00 pagi
  const endDaytime = 18; // Misalnya, berakhir pada pukul 18:00 sore

  // Jika waktu saat ini berada di antara waktu siang
  if (currentHour >= startDaytime && currentHour < endDaytime) {
    return true;
  } else {
    return false;
  }
}
