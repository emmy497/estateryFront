import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type PropertyProps = {
  lat?: number;
  lng?: number;
  title?: string;
  location?: string;
  image?: string;
};

const MapFix = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [map]);
  return null;
};

const createCardIcon = (title: string, location: string, image?: string) => {
  const img = image
    ? `<img src="${image}" style="width:58px;height:58px;border-radius:8px;object-fit:cover;flex-shrink:0;" />`
    : "";

  const html = `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="
        background:#fff;
        border-radius:14px;
        padding:10px 12px;
        display:flex;
        align-items:center;
        gap:10px;
        box-shadow:0 4px 20px rgba(0,0,0,0.18);
        min-width:200px;
        max-width:240px;
      ">
        ${img}
        <div style="overflow:hidden;">
          <div style="font-weight:600;font-size:14px;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${title}</div>
          <div style="display:flex;align-items:center;gap:4px;margin-top:5px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span style="font-size:12px;color:#6B7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${location}</span>
          </div>
        </div>
      </div>
      <div style="width:10px;height:10px;background:#111;border-radius:50%;margin-top:5px;"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "",
    iconSize: [240, 100],
    iconAnchor: [120, 100],
  });
};

const PropertyMap = ({ lat, lng, title = "", location = "", image }: PropertyProps) => {
  if (!lat || !lng) {
    return (
      <div className="h-full min-h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
        No location data available
      </div>
    );
  }

  const icon = createCardIcon(title, location, image);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer center={[lat, lng]} zoom={13} style={{ height: "100%", width: "100%", minHeight: "300px" }}>
        <MapFix />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Circle
          center={[lat, lng]}
          radius={1500}
          pathOptions={{ color: "#9CA3AF", fillColor: "#9CA3AF", fillOpacity: 0.15, weight: 0 }}
        />
        <Marker position={[lat, lng]} icon={icon} />
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
