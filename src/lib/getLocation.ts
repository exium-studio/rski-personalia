const navigatorLocationOptions = {
  enableHighAccuracy: true,
};

export default function getLocation(): Promise<{ lat: number; long: number }> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        resolve({ lat: latitude, long: longitude });
      },
      (error) => {
        console.log("Error", error);
        reject(error);
      },
      navigatorLocationOptions
    );
  });
}
