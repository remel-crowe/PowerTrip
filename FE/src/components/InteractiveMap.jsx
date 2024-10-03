import * as turf from "@turf/turf";
import { render } from "react-dom";

import { useEffect, useState, useRef } from "react";
import { MdOutlineElectricCar } from "react-icons/md";
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

  const start = "";
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

  const handleInsufficientCharge = (startCoords, miles, bearing) => {
    fetchChargingStations(startCoords, OpenChargeToken, miles * 1.609).then(
      (chargingStations) => {
        setChargingStations(chargingStations);
      }
    );
    setBearing(bearing);
  };

  useEffect(() => {
    const fetchAndDisplayStations = async () => {
      removeChargeStationMarkers();
      if (map.current && chargingStations.length > 0) {
        for (const station of chargingStations) {
          const { Latitude, Longitude } = station.AddressInfo;

          const startCoords = await getLocationCoordinates(start);

          const stationBearing = turf.bearing(
            turf.point([startCoords.longitude, startCoords.latitude]),
            turf.point([Longitude, Latitude])
          );

          if (Math.abs(stationBearing - bearing) <= 45) {
            const el = document.createElement("div");
            el.className = "marker";
            const root = createRoot(el);
            render(
              <MdOutlineElectricCar className="text-pink-500 w-[20px] h-[20px]" />,
              el
            );

            const marker = new mapboxgl.Marker(el)
              .setLngLat([Longitude, Latitude])
              .addTo(map.current);

            chargeStationMarkers.current.push(marker);
          }
        }
      }
    };

    // Call the async function
    fetchAndDisplayStations();
  }, [chargingStations]); // Ensure to include all dependencies here

  useEffect(() => {
    const initializeMap = async () => {
      const fetchedLocation = await fetchLocation();

      const { latitude, longitude } = fetchedLocation || {};
      const centerLng = longitude;
      const centerLat = latitude;
      const zoomLevel = 10;

      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [centerLng, centerLat],
        zoom: zoomLevel,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "bottom-left");

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

        const carAvailableMiles = maxMiles * (charge / 100);

        if ((tripDistance / 1609.34).toFixed(0) > carAvailableMiles) {
          handleInsufficientCharge(startCoords, carAvailableMiles, bearing);
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
      <div className="flex flex-col  w-full md:px-10">
        <div className="flex justify-between items-center gap-1 flex-col md:flex-row">
          <div className="flex gap-2 absolute z-10 top-20">
            <div className="flex ">
              <input
                type="text"
                id="end"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                placeholder="Type in a destination"
                className="border-2 border-r-0 border-blue-600 h-10 shadow-lg w-60 px-2 bg-white rounded-l-lg shadow-2xl"
              />
              <button onClick={fetchAndDisplayRoute} disabled={!end}>
                <FaSearchengin className="text-black w-8 h-10 bg-white border-2 border-l-0 border-blue-600 rounded-r-lg shadow-lg p-1" />
              </button>
            </div>
          </div>

          {/* <button
            onClick={fetchAndDisplayRoute}
            className="py-2 px-12 bg-green-500 text-black rounded w-full md:w-auto md:ml-2 shadow-md cursor-pointer w"
            disabled={!start || !end || !selectedCar}
          >
            Find Charging Stations
          </button> */}
        </div>
        <div
          className="w-full  md:w-[1000px] mx-auto h-[840px] sm:h-[600px] md:h-[950px] lg:max-h-[1050px] lg:max-w-[1100px] rounded shadow-md"
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
