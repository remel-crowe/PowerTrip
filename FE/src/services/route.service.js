import axios from "axios";

export const fetchRouteData = async (startCoords, endCoords, accessToken) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${startCoords.longitude},${startCoords.latitude};${endCoords.longitude},${endCoords.latitude}?geometries=geojson&access_token=${accessToken}`
    );
    return response.data.routes[0];
  } catch (error) {
    return (error.response = "Error fetching route data");
  }
};

export const fetchChargingStations = async (coords, accessToken, dist) => {
  try {
    const response = await axios.get(
      `https://api.openchargemap.io/v3/poi/?output=json&latitude=${coords.latitude}&longitude=${coords.longitude}&distance=${dist}&distanceunit=KM&key=${accessToken}`
    );

    return response.data;
  } catch (error) {
    return (error.response = "Error fetching charging stations");
  }
};
