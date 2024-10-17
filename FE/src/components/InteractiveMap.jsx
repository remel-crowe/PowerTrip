import * as turf from "@turf/turf";

import { useEffect, useState, useRef } from "react";
import { FcChargeBattery } from "react-icons/fc";
import { FaSearchengin } from "react-icons/fa";

import fetchLocation from "../services/location.service";
import {
  fetchRouteData,
  fetchChargingStations,
} from "../services/route.service";
import getLocationCoordinates from "../utils/locationToCoordinates";

import mapboxgl from "mapbox-gl";
import TripDetails from "./TripDetails";

import "mapbox-gl/dist/mapbox-gl.css";
import { createRoot } from "react-dom/client";

mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_KEY;
const OpenChargeToken = import.meta.env.VITE_APP_OCM_KEY;

const InteractiveMap = ({ selectedCar }) => {
  const { maxMiles, charge } = selectedCar || {};

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState("");
  const [markers, setMarkers] = useState([]);

  const [tripDuration, setTripDuration] = useState(null);
  const [tripDistance, setTripDistance] = useState(null);

  const [chargingStations, setChargingStations] = useState([]);
  const [bearing, setBearing] = useState(0);

  const mapContainerRef = useRef(null);
  const chargeStationMarkers = useRef([]);
  const map = useRef(null);

  const removeChargeStationMarkers = () => {
    chargeStationMarkers.current.forEach((marker) => marker.remove());
    chargeStationMarkers.current = [];
  };

  const fetchAndDisplayStations = async () => {
    removeChargeStationMarkers();
    if (map.current && chargingStations.length > 0) {
      const startCoords = await getLocationCoordinates(start);
      for (const station of chargingStations) {
        const { Latitude, Longitude } = station.AddressInfo;
        const stationBearing = turf.bearing(
          turf.point([startCoords.longitude, startCoords.latitude]),
          turf.point([Longitude, Latitude])
        );

        if (Math.abs(stationBearing - bearing) <= 45) {
          const el = document.createElement("div");
          el.className = "marker";
          const root = createRoot(el);
          root.render(<FcChargeBattery className="w-[20px] h-[20px]" />);

          const marker = new mapboxgl.Marker(el)
            .setLngLat([Longitude, Latitude])
            .addTo(map.current);

          chargeStationMarkers.current.push(marker);
        }
      }
    }
  };

  useEffect(() => {
    fetchAndDisplayStations();
  }, [chargingStations, bearing, start]);

  useEffect(() => {
    const initializeMap = async () => {
      const fetchedLocation = await fetchLocation();

      const { latitude, longitude } = fetchedLocation || {};
      const centerLng = longitude;
      const centerLat = latitude;
      const zoomLevel = 10;

      setStart({ latitude: centerLat, longitude: centerLng });

      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [centerLng, centerLat],
        zoom: zoomLevel,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.current.on("load", () => {
        map.current.resize();
      });
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const fetchAndDisplayRoute = async () => {
    removeChargeStationMarkers();
    markers.forEach((marker) => marker.remove());
    setMarkers([]);

    const userLocation = await fetchLocation();

    const startCoords = userLocation
      ? userLocation
      : await getLocationCoordinates(start);

    const endCoords = await getLocationCoordinates(end);

    const bearing = turf.bearing(
      turf.point([startCoords.longitude, startCoords.latitude]),
      turf.point([endCoords.longitude, endCoords.latitude])
    );

    if (
      startCoords.latitude &&
      startCoords.longitude &&
      endCoords.latitude &&
      endCoords.longitude
    ) {
      try {
        const data = await fetchRouteData(
          startCoords,
          endCoords,
          mapboxgl.accessToken
        );

        if (!data) {
          throw new Error("Failed to fetch route data.");
        }

        const { duration, distance, geometry } = data;

        setTripDuration(duration);
        setTripDistance(distance);

        const carAvailableMiles = Math.floor(maxMiles * (charge / 100));

        if ((tripDistance / 1609.34).toFixed(0) > carAvailableMiles) {
          const chargingStations = await fetchChargingStations(
            startCoords,
            OpenChargeToken,
            carAvailableMiles * 1.609
          );
          setChargingStations(chargingStations);
          setBearing(bearing);
          fetchAndDisplayStations(chargingStations, bearing, startCoords);
        }

        if (geometry) {
          if (map.current.getSource("route")) {
            map.current.getSource("route").setData(geometry);
          } else {
            map.current.addLayer({
              id: "route",
              type: "line",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: geometry,
                },
              },
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#3887be",
                "line-width": 8,
              },
            });
          }
          const newMarkers = [];

          const startMarker = new mapboxgl.Marker()
            .setLngLat([startCoords.longitude, startCoords.latitude])
            .addTo(map.current);
          newMarkers.push(startMarker);

          const endMarker = new mapboxgl.Marker()
            .setLngLat([endCoords.longitude, endCoords.latitude])
            .addTo(map.current);
          newMarkers.push(endMarker);

          setMarkers(newMarkers);

          map.current.flyTo({
            center: [startCoords.longitude, startCoords.latitude],
            zoom: 13,
            pitch: 65,
            bearing: bearing,
          });
        } else {
          console.error("Geometry data is missing in the response.");
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    }
  };

  return (
    <div className="flex gap-12">
      <div className="flex flex-col w-full md:px-10 items-center">
        <div className="flex absolute z-10 top-10">
          <div className="relative w-60">
            <input
              type="text"
              id="end"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              placeholder="Type in a destination"
              className="border-2 h-10 shadow-lg w-full px-10 rounded-full bg-white shadow-2xl"
            />
            {end && (
              <button
                onClick={fetchAndDisplayRoute}
                disabled={!end}
                className="absolute right-3 top-2 bg-blue-500 text-white rounded-full p-1 shadow-lg"
              >
                <FaSearchengin className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div
          className="w-full md:w-[1000px] mx-auto h-[100vh] sm:h-[600px] md:h-[950px] lg:max-h-[1050px] lg:max-w-[1100px] rounded shadow-md z-0"
          ref={mapContainerRef}
        >
          {tripDistance && tripDuration && (
            <TripDetails
              tripDuration={tripDuration}
              tripDistance={tripDistance}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
