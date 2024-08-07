export default function countDateRange(fromDate: Date, toDate: Date): number {
  // Set the time to the start of the day for both dates
  fromDate?.setHours(0, 0, 0, 0);
  toDate?.setHours(0, 0, 0, 0);

  // Calculate the difference in time
  const diffTime = Math.abs(toDate?.getTime() - fromDate?.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + 1;
}
