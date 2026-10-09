import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { NavLink } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Search } from "lucide-react";
import { type House } from "../types/House";
import { formatPrice, formatPriceShort } from "../utils/formatPrice";

export type BBox = [number, number, number, number]; // minLng, minLat, maxLng, maxLat

interface PropertySearchMapProps {
  houses: House[];
  bbox?: BBox;
  activeId: string | null;
  onActiveChange: (id: string | null) => void;
  onSearchArea: (bbox: BBox) => void;
}

// Nigeria, used when there's nothing to fit the map to
const DEFAULT_CENTER: [number, number] = [9.08, 8.68];
const DEFAULT_ZOOM = 6;

const hasCoordinates = (house: House) =>
  Number.isFinite(house.coordinates?.lat) && Number.isFinite(house.coordinates?.lng);

// 4 decimals is ~11m: plenty for a search area and keeps URLs short
const round = (value: number) => Math.round(value * 10_000) / 10_000;

const toBBox = (bounds: L.LatLngBounds): BBox => [
  round(bounds.getWest()),
  round(bounds.getSouth()),
  round(bounds.getEast()),
  round(bounds.getNorth()),
];

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

// Listings are geocoded from their area name, so several can share the exact
// same point; they become one pin instead of a pile of overlapping ones.
interface PinGroup {
  key: string;
  position: [number, number];
  houses: House[];
}

const groupByPosition = (houses: House[]): PinGroup[] => {
  const groups = new Map<string, PinGroup>();
  for (const house of houses.filter(hasCoordinates)) {
    const { lat, lng } = house.coordinates as { lat: number; lng: number };
    const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
    const group = groups.get(key) ?? { key, position: [lat, lng], houses: [] };
    group.houses.push(house);
    groups.set(key, group);
  }
  return [...groups.values()];
};

const PinMarker = ({
  group,
  activeId,
  onActiveChange,
}: {
  group: PinGroup;
  activeId: string | null;
  onActiveChange: (id: string | null) => void;
}) => {
  const [first] = group.houses;
  const single = group.houses.length === 1;
  const active = group.houses.some((house) => house._id === activeId);
  const label = single ? formatPriceShort(first.price) : `${group.houses.length} homes`;

  const icon = useMemo(
    () =>
      L.divIcon({
        className: "",
        iconSize: [0, 0],
        html: `<div class="map-pill${active ? " is-active" : ""}">${escapeHtml(label)}</div>`,
      }),
    [label, active],
  );

  return (
    <Marker
      position={group.position}
      icon={icon}
      zIndexOffset={active ? 1000 : 0}
      title={single ? first.title : `${group.houses.length} homes in ${first.location}`}
      eventHandlers={
        single
          ? {
              mouseover: () => onActiveChange(first._id),
              mouseout: () => onActiveChange(null),
            }
          : undefined
      }
    >
      <Popup className="estatery-popup" closeButton offset={[0, -30]}>
        {single ? (
          <NavLink to={`/property/${first._id}`} className="block text-[#111418] no-underline">
            <div className="photo-tint h-[130px] overflow-hidden">
              <img src={first.images[0]} alt={first.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-3">
              <p className="truncate text-[15px] font-medium">{first.title}</p>
              <p className="mt-1 flex items-center gap-1 truncate text-[12px] text-[#6B6F76]">
                <MapPin size={12} className="shrink-0" />
                {first.location}, {first.state}
              </p>
              <p className="mt-2 text-[15px] font-semibold">{formatPrice(first.price)}</p>
            </div>
          </NavLink>
        ) : (
          <div>
            <p className="flex items-center gap-1 border-b border-[#ECE8E3] px-3 py-2.5 pr-8 text-[13px] text-[#6B6F76]">
              <MapPin size={12} className="shrink-0" />
              {group.houses.length} homes in {first.location}, {first.state}
            </p>
            <ul className="max-h-[260px] overflow-y-auto py-1">
              {group.houses.map((house) => (
                <li key={house._id}>
                  <NavLink
                    to={`/property/${house._id}`}
                    className="flex items-center gap-3 px-3 py-2 text-[#111418] no-underline hover:bg-[#F7F5F2]"
                  >
                    <span className="photo-tint block h-11 w-14 shrink-0 overflow-hidden rounded-[6px]">
                      <img src={house.images[0]} alt="" className="h-full w-full object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-medium">{house.title}</span>
                      <span className="block text-[13px] text-[#6B6F76]">{formatPrice(house.price)}</span>
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Popup>
    </Marker>
  );
};

// Moves the map to the search area, or to fit the results. Programmatic moves
// are flagged so they don't count as the user panning.
const Viewport = ({
  houses,
  bbox,
  programmatic,
}: {
  houses: House[];
  bbox?: BBox;
  programmatic: React.RefObject<boolean>;
}) => {
  const map = useMap();
  const bboxKey = bbox?.join(",");
  const resultsKey = houses.filter(hasCoordinates).map((house) => house._id).join(",");

  // with animation off Leaflet fires moveend synchronously, so the flag only
  // covers this move (and is cleared even if the view didn't change).
  // invalidateSize first: the container may have been resized since mount,
  // and fitting to stale dimensions leaves pins off the edge.
  const moveProgrammatically = (move: () => void) => {
    programmatic.current = true;
    map.invalidateSize({ pan: false });
    move();
    programmatic.current = false;
  };

  useEffect(() => {
    if (!bboxKey) return;
    const [minLng, minLat, maxLng, maxLat] = bboxKey.split(",").map(Number);
    moveProgrammatically(() =>
      map.fitBounds([[minLat, minLng], [maxLat, maxLng]], { animate: false }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, bboxKey]);

  useEffect(() => {
    // when searching an area, keep the map where the user put it
    if (bboxKey) return;
    const points = houses
      .filter(hasCoordinates)
      .map((house) => [house.coordinates!.lat!, house.coordinates!.lng!] as [number, number]);
    if (points.length === 0) return;

    moveProgrammatically(() => {
      if (points.length === 1) map.setView(points[0], 13, { animate: false });
      else map.fitBounds(points, { padding: [48, 48], maxZoom: 14, animate: false });
    });
    // re-fit only when the set of results changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, resultsKey, bboxKey]);

  return null;
};

const MoveWatcher = ({
  programmatic,
  onUserMove,
}: {
  programmatic: React.RefObject<boolean>;
  onUserMove: (bounds: L.LatLngBounds) => void;
}) => {
  const map = useMapEvents({
    moveend: () => {
      if (programmatic.current) return;
      onUserMove(map.getBounds());
    },
  });
  return null;
};

const PropertySearchMap = ({
  houses,
  bbox,
  activeId,
  onActiveChange,
  onSearchArea,
}: PropertySearchMapProps) => {
  const programmatic = useRef(false);
  const [pendingBounds, setPendingBounds] = useState<L.LatLngBounds | null>(null);
  const [searchAsMove, setSearchAsMove] = useState(false);

  const groups = groupByPosition(houses);
  const unmapped = houses.length - houses.filter(hasCoordinates).length;

  const searchArea = (bounds: L.LatLngBounds) => {
    setPendingBounds(null);
    onSearchArea(toBBox(bounds));
  };

  const handleUserMove = (bounds: L.LatLngBounds) => {
    if (searchAsMove) searchArea(bounds);
    else setPendingBounds(bounds);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[12px] border border-[#ECE8E3] bg-[#F1EEEA]">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className="estatery-map h-full w-full"
        aria-label="Map of properties"
      >
        {/* OpenStreetMap needs no API key; CSS softens it to the site palette */}
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        <Viewport houses={houses} bbox={bbox} programmatic={programmatic} />
        <MoveWatcher programmatic={programmatic} onUserMove={handleUserMove} />
        {groups.map((group) => (
          <PinMarker
            key={group.key}
            group={group}
            activeId={activeId}
            onActiveChange={onActiveChange}
          />
        ))}
      </MapContainer>

      {/* controls float above the map */}
      <div className="pointer-events-none absolute inset-x-0 top-3 z-[500] flex flex-col items-center gap-2 px-3">
        {pendingBounds && !searchAsMove && (
          <button
            type="button"
            onClick={() => searchArea(pendingBounds)}
            className="pointer-events-auto animate-dropdown-in flex items-center gap-2 rounded-full bg-[#1C1915] px-4 py-2.5 text-[14px] font-medium text-white shadow-lg hover:bg-[#3A332C]"
          >
            <Search size={15} />
            Search this area
          </button>
        )}
      </div>

      <label className="absolute bottom-3 left-3 z-[500] flex cursor-pointer items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[13px] text-[#111418] shadow-md">
        <input
          type="checkbox"
          checked={searchAsMove}
          onChange={(e) => {
            setSearchAsMove(e.target.checked);
            if (e.target.checked && pendingBounds) searchArea(pendingBounds);
          }}
          className="accent-[#1C1915]"
        />
        Search as I move the map
      </label>

      {unmapped > 0 && (
        <p className="absolute bottom-3 right-3 z-[500] max-w-[60%] rounded-full bg-white/95 px-3 py-2 text-[12px] text-[#6B6F76] shadow-md">
          {unmapped} {unmapped === 1 ? "listing has" : "listings have"} no map location yet
        </p>
      )}
    </div>
  );
};

export default PropertySearchMap;
