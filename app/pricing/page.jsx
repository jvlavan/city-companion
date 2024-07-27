"use client";
import { useGeolocated } from "react-geolocated";
import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@mantine/core/styles.css";
import {
  Text,
  Card,
  RingProgress,
  Group,
  useMantineTheme,
} from "@mantine/core";
import classes from "./StatsRingCard.module.css";
const stats = [
  { value: 447, label: "Remaining" },
  { value: 76, label: "In progress" },
];

// Custom icon for user location
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/jvlavan/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

// Custom icon for turf locations (red pin)
const turfIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

export default function PricingPage() {
  const [reload, setReload] = useState(true);
  const [apiData, setApiData] = useState(null);
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });
  const theme = useMantineTheme();
  const completed = 1887;
  const total = 2334;
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text className={classes.label}>{stat.value}</Text>
      <Text size="xs" c="dimmed">
        {stat.label}
      </Text>
    </div>
  ));
  const fetchMapData = async () => {
    try {
      let response = await axios.post(
        "/api/fetch-omap",
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          query: "hotel",
        },
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_AUTHORISATION_KEY,
          },
        }
      );
      setApiData(response.data);
    } catch (error) {
      console.error("Error fetching map data", error);
    }
  };

  useEffect(() => {
    if (coords) {
      fetchMapData();
    }
  }, [coords]);

  useEffect(() => {
    setReload(false);
  }, []);

  if (reload) return <>loading UI.....</>;

  return !isGeolocationAvailable ? (
    <div>Your browser does not support Geolocation</div>
  ) : !isGeolocationEnabled ? (
    <div>Geolocation is not enabled</div>
  ) : coords ? (
    <>
      <MapContainer
        center={[coords.latitude, coords.longitude]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[coords.latitude, coords.longitude]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
        {apiData?.res?.predictions?.map((data, index) => (
          <Marker
            key={index}
            position={[data.geometry.location.lat, data.geometry.location.lng]}
            icon={turfIcon}
          >
            <Popup>
              <div>
                <h5>{data.terms[0].value}</h5>
                <p>{data.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {apiData?.res?.predictions?.length > 0 ? (
        <div className="m-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {apiData.res?.predictions
              ?.sort((a, b) => a.distance_meters - b.distance_meters) // Inline sorting by distance
              .map((data, index) => (
                <div
                  key={index}
                  className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                >
                  <Card withBorder p="xl" radius="md" className={classes.card}>
                    <div className={classes.inner}>
                      <div>
                        <Text fz="lg" className={classes.label}>
                          {data.terms[0].value}
                        </Text>
                        <Text className={classes.lead} mt={30}>
                          {data.distance_meters / 1000}
                        </Text>
                        <Text className="mt-3" fz="xs" c="dimmed">
                          Kilo Metres Away
                        </Text>
                      </div>

                      <div className={classes.ring}>
                        <RingProgress
                          roundCaps
                          thickness={6}
                          size={150}
                          sections={[
                            {
                              value: (data.distance_meters / 10000) * 100,
                              color: theme.primaryColor,
                            },
                          ]}
                          label={
                            <div>
                              <Text
                                ta="center"
                                fz="lg"
                                className={classes.label}
                              >
                                {((data.distance_meters / 10000) * 100).toFixed(
                                  0
                                )}
                                %
                              </Text>
                              <Text ta="center" fz="xs" c="dimmed">
                                {"farer"}
                              </Text>
                            </div>
                          }
                        />
                      </div>
                    </div>
                    <Group mt="lg">
                      <div>
                        <Text className={classes.label}>
                          {data.geometry.location.lat}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {"latitude"}
                        </Text>
                      </div>
                      <div>
                        <Text className={classes.label}>
                          {data.geometry.location.lng}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {"longitude"}
                        </Text>
                      </div>
                    </Group>
                  </Card>
                  <div className="px-5 mt-5 pb-5">
                    <span className="text font-semibold tracking-tight text-gray-900 dark:text-white">
                      {data.description}
                    </span>
                    <br />
                    <button
                      onClick={() => {
                        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${data.geometry.location.lat},${data.geometry.location.lng}`;
                        window.open(googleMapsUrl, "_blank");
                      }}
                      className="mt-3 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      View on Maps
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div>No data available</div>
      )}
    </>
  ) : (
    <div>Getting the location data&hellip;</div>
  );
}
