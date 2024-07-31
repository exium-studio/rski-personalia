const useCompareValues = (key: string, order: "asc" | "desc") => {
  return (a: any, b: any) => {
    const valueA = typeof a[key] === "string" ? a[key].toLowerCase() : a[key];
    const valueB = typeof b[key] === "string" ? b[key].toLowerCase() : b[key];

    if (typeof valueA === "string" && typeof valueB === "string") {
      // console.log(valueA, valueB);
      const dateA = new Date(valueA);
      const dateB = new Date(valueB);

      if (
        dateA instanceof Date &&
        !isNaN(dateA.getTime()) &&
        dateB instanceof Date &&
        !isNaN(dateB.getTime())
      ) {
        return order === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    }

    return order === "asc" ? valueA - valueB : valueB - valueA;
  };
};

export default useCompareValues;
