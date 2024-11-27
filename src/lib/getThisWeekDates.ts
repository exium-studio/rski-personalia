const getThisWeekDates = () => {
  const today = new Date();
  const startOfWeek = today.getDate() - today.getDay() + 1;
  const startDate = new Date(today.setDate(startOfWeek));

  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startDate);
    currentDay.setDate(startDate.getDate() + i);
    weekDates.push(currentDay.toISOString().split("T")[0]);
  }

  return weekDates;
};

export default getThisWeekDates;
