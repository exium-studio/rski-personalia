export default function formatTime(
  timeString: string | undefined | null
): string {
  console.log(timeString);

  if (!timeString) {
    return "";
  }
  return timeString.slice(0, 5);
}
