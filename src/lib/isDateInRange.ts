export default function isDateInRange(
  date: Date | string,
  range: { from: Date | string; to: Date | string }
) {
  const dateObj = new Date(date);
  const startDate = new Date(range.from);
  const endDate = new Date(range.to);

  return dateObj >= startDate && dateObj <= endDate;
}
