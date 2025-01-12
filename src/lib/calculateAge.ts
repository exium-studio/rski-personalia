const calculateAge = (
  birthDate: Date | string | null | undefined
): number | null => {
  // Handle invalid or empty input
  if (
    !birthDate ||
    (typeof birthDate === "string" && birthDate.trim() === "")
  ) {
    return null; // Return null to indicate invalid input
  }

  // Convert string to Date if needed
  const date = typeof birthDate === "string" ? new Date(birthDate) : birthDate;

  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    return null; // Return null for invalid date formats
  }

  const today = new Date();
  const birthYear = date.getFullYear();
  const birthMonth = date.getMonth();
  const birthDay = date.getDate();

  let age = today.getFullYear() - birthYear;

  if (
    today.getMonth() < birthMonth ||
    (today.getMonth() === birthMonth && today.getDate() < birthDay)
  ) {
    age--;
  }

  return age;
};

export default calculateAge;
