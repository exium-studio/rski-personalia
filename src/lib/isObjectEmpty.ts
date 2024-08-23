export default function isObjectEmpty(
  filter: any,
  excludedKeys: string[] = []
): boolean {
  // Loop through each property in the filter object
  for (const key in filter) {
    if (Object.prototype.hasOwnProperty.call(filter, key)) {
      const value = filter[key];

      // Skip keys that are in the excludedKeys array
      if (excludedKeys.includes(key)) {
        continue;
      }

      // Check if the value is an array
      if (Array.isArray(value)) {
        // If array length is not 0, filter is not empty
        if (value.length !== 0) {
          return false;
        }
      } else {
        // Check if the value is a non-empty string
        if (value !== "") {
          return false;
        }
      }
    }
  }
  // If all checks passed, filter is empty
  return true;
}
