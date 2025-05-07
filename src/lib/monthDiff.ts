const monthDiff = (dateFrom: Date, dateTo: Date): number => {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);

  // Return 0 if dateTo is earlier than dateFrom
  if (to < from) return 0;

  const yearDiff = to.getFullYear() - from.getFullYear();
  const monthDiff = to.getMonth() - from.getMonth();

  let totalMonths = yearDiff * 12 + monthDiff;

  // Jika tanggal di 'to' lebih kecil dari tanggal di 'from', kurangi 1 bulan
  if (to.getDate() < from.getDate()) {
    totalMonths -= 1;
  }

  return totalMonths;
};

export default monthDiff;
