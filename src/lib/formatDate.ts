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
    periode: periodeFormat,
  };

  const date = new Date(dateString);

  const formatOptions =
    typeof options === "string"
      ? prefixOptions[options]
      : options || defaultFormat;

  let formattedDate = date.toLocaleDateString("id-ID", formatOptions);

  // Jika menggunakan short format, ganti '/' menjadi '-'
  if (formatOptions === shortFormat) {
    formattedDate = formattedDate.replace(/\//g, "-");
  }

  return formattedDate;
};

export default formatDate;
