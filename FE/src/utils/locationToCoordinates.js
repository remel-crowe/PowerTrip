import axios from "axios";

async function getLocationCoordinates(location) {
  const apiKey = import.meta.env.VITE_APP_GEOCODING_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    location
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error("Geocoding failed: " + response.data.status);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default getLocationCoordinates;
