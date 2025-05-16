type MonthDiffOptions = {
  allowNegative?: boolean;
};

const monthDiff = (
  dateFrom: string | Date,
  dateTo: string | Date,
  options?: MonthDiffOptions
): number => {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);

  // console.log("From", dateFrom, from);
  // console.log("To", dateTo, to);

  // Return 0 if dates are invalid
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return 0;

  const yearDiff = to.getFullYear() - from.getFullYear();
  const monthDiff = to.getMonth() - from.getMonth();

  let totalMonths = yearDiff * 12 + monthDiff;

  // Adjust if 'to' day is less than 'from' day
  if (to.getDate() < from.getDate()) {
    totalMonths -= 1;
  }

  // Handle if negative months not allowed
  if (!options?.allowNegative && totalMonths < 0) {
    return 0;
  }

  return totalMonths;
};

export default monthDiff;
