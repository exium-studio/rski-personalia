export default function isShiftMalam(
  jam_masuk: string,
  jam_keluar: string
): boolean {
  if (jam_masuk && jam_keluar) {
    // Parse jam_masuk dan jam_keluar menjadi array [hour, minute, second]
    const [jamMasukHour] = jam_masuk.split(":").map(Number);
    const [jamKeluarHour] = jam_keluar.split(":").map(Number);

    // Jika jam keluar lebih kecil dari jam masuk, berarti shift melewati tengah malam
    if (jamKeluarHour < jamMasukHour) {
      return true;
    }

    return false;
  }

  return false;
}
