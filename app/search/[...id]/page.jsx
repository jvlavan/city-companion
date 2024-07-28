"use client";
import { useGeolocated } from "react-geolocated";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Text,
  Card,
  RingProgress,
  Group,
  useMantineTheme,
} from "@mantine/core";
import classes from "./StatsRingCard.module.css";
import dynamic from "next/dynamic";
import "@mantine/core/styles.css";
// Dynamically import the MapComponent
import { Spinner } from "@nextui-org/react";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

export default function PricingPage({ params }) {
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

  const fetchMapData = async () => {
    try {
      const response = await axios.post(
        "/api/fetch-omap",
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          query: params.id[0],
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

  if (reload) return <Spinner label="Loading..." color="warning" />;

  return !isGeolocationAvailable ? (
    <div className="text font-semibold tracking-tight text-gray-900 dark:text-white">
      Your browser does not support Geolocation
    </div>
  ) : !isGeolocationEnabled ? (
    <div className="text font-semibold tracking-tight text-gray-900 dark:text-white">
      Geolocation is not enabled
    </div>
  ) : coords ? (
    <>
      <MapComponent coords={coords} apiData={apiData} />
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
                        <Text fz="sm" className={classes.label}>
                          {data.terms[0].value}
                        </Text>
                        <Text fz="sm" className={classes.label} mt={20}>
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
                          size={125}
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
                    <div className="mt-4">
                      <a
                        className="mt-3 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        href={`https://www.google.com/maps/search/?api=1&query=${data.geometry.location.lat},${data.geometry.location.lng}`}
                      >
                        View on Maps
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="text font-semibold tracking-tight text-gray-900 dark:text-white">
          No data available
        </div>
      )}
    </>
  ) : (
    <div>
      <Spinner label="Getting the location data..." color="warning" />
    </div>
  );
}
