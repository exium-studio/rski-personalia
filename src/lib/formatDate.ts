const formatDate = (dateString: Date | string, options?: any) => {
  // Cek jika dateString kosong atau tidak valid
  if (!dateString) {
    return "";
  }

  const defaultFormat: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const basicShortFormat: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const longFormat: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const longShortFormat: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const shortFormat: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const short2Format: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const periodeFormat: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };

  const prefixOptions: Record<string, Intl.DateTimeFormatOptions> = {
    basic: defaultFormat,
    basicShort: basicShortFormat,
    long: longFormat,
    longShort: longShortFormat,
    short: shortFormat,
    short2: short2Format,
    periode: periodeFormat,
  };

  // Convert dd-mm-yyyy to yyyy-mm-dd for Date constructor
  let date: Date;
  if (
    typeof dateString === "string" &&
    /^\d{2}-\d{2}-\d{4}$/.test(dateString)
  ) {
    const [day, month, year] = dateString.split("-");
    date = new Date(`${year}-${month}-${day}T00:00:00`);
  } else {
    date = new Date(dateString);
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "";
  }

  const formatOptions =
    typeof options === "string"
      ? prefixOptions[options]
      : options || defaultFormat;

  let formattedDate;

  if (options === "iso") {
    formattedDate = date.toISOString();
  } else if (options === "short2") {
    // Format as yyyy-mm-dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    formattedDate = `${year}-${month}-${day}`;
  } else if (options === "short") {
    formattedDate = date
      .toLocaleDateString("id-ID", formatOptions)
      .replace(/\//g, "-"); // Replace slashes with hyphens
  } else {
    formattedDate = date.toLocaleDateString("id-ID", formatOptions);
  }

  return formattedDate;
};

export default formatDate;
