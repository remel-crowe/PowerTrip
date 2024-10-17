import axios from "axios";

async function getLocationCoordinates(location) {
  if (!location) {
    throw new Error("Location parameter is required");
  }

  // Check if location is already in the form of coordinates
  if (location.latitude && location.longitude) {
    return location;
  }

  const apiKey = import.meta.env.VITE_APP_GEOCODING_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    location
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else if (response.data.status === "ZERO_RESULTS") {
      throw new Error("No results found for the given location.");
    } else {
      throw new Error("Geocoding failed: " + response.data.status);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default getLocationCoordinates;
