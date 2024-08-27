import { VStack } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { LatLng } from "../../constant/interfaces";

// Props untuk komponen GMaps
interface Props {
  center: LatLng;
  officeCenter: LatLng;
  presence_radius: number;
  zoom?: number;
}

// Hook untuk mengatur peta saat klik
function SetViewOnClick({ center }: { center: LatLng }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function LokasiPresensi({
  center,
  officeCenter,
  presence_radius,
  zoom = 17,
}: Props) {
  const userIcon = new L.Icon({
    iconUrl: "/vectors/icons/userPin.svg",
    iconSize: [64, 64], // Ukuran ikon
  });

  const officeIcon = new L.Icon({
    iconUrl: "/vectors/icons/hospital.svg",
    iconSize: [48, 48], // Ukuran ikon
  });

  const containerStyle = {
    width: `100%`,
    height: `100%`,
    borderRadius: "12px",
    aspectRatio: 1,
    // padding: "8px",
  };

  const minZoomLevel = 3; // Tentukan level zoom minimum di sini
  const maxZoomLevel = 18; // Tentukan level zoom maksimum di sini

  // Tentukan batas maksimum yang dapat digeser
  const maxBounds = L.latLngBounds(
    L.latLng(-90, -180), // Batas bawah kiri (selatan barat)
    L.latLng(90, 180) // Batas atas kanan (utara timur)
  );

  return (
    <VStack w={"100%"} aspectRatio={1} borderRadius={12} overflow={"clip"}>
      <MapContainer
        //@ts-ignore
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={containerStyle as any}
        minZoom={minZoomLevel}
        maxZoom={maxZoomLevel}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0} // Biarkan peta memantul ketika mencapai batas
        scrollWheelZoom={false} // Nonaktifkan scroll zoom
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker
          position={[officeCenter.lat, officeCenter.lng]}
          //@ts-ignore
          icon={officeIcon}
        />

        <Marker
          position={[center.lat, center.lng]}
          //@ts-ignore
          icon={userIcon}
        />

        {/* Marker kantor */}
        <Circle
          center={[officeCenter.lat, officeCenter.lng]}
          //@ts-ignore
          radius={presence_radius} // Radius dalam meter
          pathOptions={{
            color: "#16b3ac", // Warna garis lingkaran
            fillColor: "#16b3ac", // Warna isi lingkaran
            fillOpacity: 0.35, // Opasitas isi lingkaran
          }}
        />
        <SetViewOnClick center={center} />
      </MapContainer>
    </VStack>
  );
}
