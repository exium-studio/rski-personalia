export default function formattedFilterKaryawanReducer(formattedFilters: any) {
  // Menghapus properti dengan array kosong kecuali 'search'
  const filteredFormattedFilterKaryawan = Object.entries(formattedFilters)
    .filter(
      ([key, value]) =>
        key === "search" || (Array.isArray(value) && value.length > 0)
    )
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as { [key: string]: any });

  return filteredFormattedFilterKaryawan;
}
