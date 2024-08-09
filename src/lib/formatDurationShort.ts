export default function formatDurationShort(seconds: number) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);

  let formattedHours = String(hours).padStart(2, "0");
  let formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}j ${formattedMinutes}m`;
}
