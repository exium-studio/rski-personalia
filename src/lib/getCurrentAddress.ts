async function getCurrentAddress(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=id`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);

    // Ambil alamat dari respons
    const address = data.display_name || "Alamat tidak ditemukan";
    // console.log(address);
    // const address =
    //   `${data.address.village}, ${data.address.city}, ${data.address.state}` ||
    //   "Alamat tidak ditemukan";

    return address;
  } catch (error) {
    console.error("Error:", error);
    return "Terjadi kesalahan saat mendapatkan alamat";
  }
}

export default getCurrentAddress;
