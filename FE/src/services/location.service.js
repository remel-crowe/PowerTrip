const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
};

const fetchLocation = async () => {
  try {
    const position = await getLocation();
    const { latitude, longitude } = position.coords;
    return { latitude, longitude };
  } catch (error) {
    return error.message;
  }
};

export default fetchLocation;
