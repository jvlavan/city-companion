import dynamic from "next/dynamic";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

let L; // Declare L in the outer scope

const createIcon = (iconUrl) => {
  if (typeof window !== "undefined" && L === undefined) {
    // Import Leaflet only on the client side
    L = require("leaflet");
  }

  return L.icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });
};

const userIcon = createIcon(
  "https://raw.githubusercontent.com/jvlavan/leaflet-color-markers/master/img/marker-icon-red.png"
);
const turfIcon = createIcon(
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png"
);

const MapComponent = ({ coords, apiData }) => {
  useEffect(() => {
    if (typeof window !== "undefined" && L === undefined) {
      // Import Leaflet only on the client side
      L = require("leaflet");
    }
  }, []);

  if (!coords || !apiData) {
    return <div>Loading map...</div>;
  }

  return (
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
  );
};

export default MapComponent;
