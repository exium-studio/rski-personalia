export default function calculateDuration(keluar: string): number {
  const waktuMasuk: Date = new Date();

  const waktuKeluar: Date = new Date(keluar);

  // console.log(waktuMasuk, waktuKeluar);
  // ms
  const jarakWaktu: number = waktuKeluar.getTime() - waktuMasuk.getTime();

  return jarakWaktu / 1000;
}
