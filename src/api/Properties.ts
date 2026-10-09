
import api from "./api";
import { type House } from "../types/House";

// const BASE_URL = "https://estateryback.onrender.com/api/properties";

export type PropertySort = "newest" | "oldest" | "price_asc" | "price_desc";

export interface PropertySearch {
  q?: string;
  category?: "rent" | "sale";
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  ids?: string[];
  near?: { lat: number; lng: number };
  radiusKm?: number;
  // map area: [minLng, minLat, maxLng, maxLat]
  bbox?: [number, number, number, number];
  sort?: PropertySort;
  page?: number;
  limit?: number;
}

export interface PropertyPage {
  items: House[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const DEFAULT_LIMIT = 12;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

// Great-circle distance in km, for the legacy "near" fallback
const distanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

// Older API versions ignore search parameters and return every property as an
// array. Apply the same filters, sort and paging here so the site works
// against either version (e.g. while the backend hasn't been redeployed yet).
const searchLocally = (houses: House[], search: PropertySearch): PropertyPage => {
  const { page = 1, limit = DEFAULT_LIMIT, sort = "newest" } = search;
  const q = search.q?.toLowerCase();
  const state = search.state?.toLowerCase();

  const matches = houses.filter((house) => {
    const status = (house as House & { status?: string }).status;
    const coords = house.coordinates;
    const hasCoords = Number.isFinite(coords?.lat) && Number.isFinite(coords?.lng);

    if (status && status !== "active") return false;
    if (search.category && house.category !== search.category) return false;
    if (state && house.state?.toLowerCase() !== state) return false;
    if (search.minPrice !== undefined && house.price < search.minPrice) return false;
    if (search.maxPrice !== undefined && house.price > search.maxPrice) return false;
    if (search.minBeds !== undefined && house.beds < search.minBeds) return false;
    if (search.minBaths !== undefined && house.baths < search.minBaths) return false;
    if (search.ids && !search.ids.includes(house._id)) return false;
    if (
      q &&
      ![house.title, house.location, house.state].some((field) => field?.toLowerCase().includes(q))
    ) {
      return false;
    }
    if (search.bbox) {
      const [minLng, minLat, maxLng, maxLat] = search.bbox;
      if (!hasCoords) return false;
      const { lat, lng } = coords as { lat: number; lng: number };
      if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) return false;
    }
    if (search.near) {
      if (!hasCoords) return false;
      const point = coords as { lat: number; lng: number };
      if (distanceKm(search.near, point) > (search.radiusKm ?? 10)) return false;
    }
    return true;
  });

  const createdAt = (house: House) =>
    new Date((house as House & { createdAt?: string }).createdAt ?? 0).getTime();
  const sorted = [...matches].sort((a, b) => {
    switch (sort) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "oldest":
        return createdAt(a) - createdAt(b);
      default:
        return createdAt(b) - createdAt(a);
    }
  });

  return {
    items: sorted.slice((page - 1) * limit, page * limit),
    page,
    limit,
    total: sorted.length,
    totalPages: Math.max(1, Math.ceil(sorted.length / limit)),
  };
};

// Server-side search and pagination: only one page of listings is downloaded
export const searchProperties = async (search: PropertySearch = {}): Promise<PropertyPage> => {
  const { ids, near, bbox, page = 1, ...params } = search;
  const res = await api.get("/properties", {
    params: {
      ...params,
      page,
      ids: ids?.join(","),
      near: near ? `${near.lat},${near.lng}` : undefined,
      bbox: bbox?.join(","),
    },
  });

  if (Array.isArray(res.data)) {
    return searchLocally(res.data, { ...search, page });
  }
  return res.data;
};

// Returns every matching property as an array (used by the admin tables)
export const getProperties = async (
  params: {
    search?: string;
    type?: string;
    status?: string;
  } = {},
) => {
  const res = await api.get("/properties", { params });
  return res.data;
};

export const getPropertyById = async (id: string) => {
  const res = await api.get(`/properties/${id}`);
  return res.data;
};

export const updatePropertyStatus = async (
  id: string,
  status: "active" | "unlisted",
) => {
  const res = await api.patch(`/properties/${id}/status`, { status });
  return res.data as { message: string; property: unknown };
};

export const updateProperty = async (
  id: string,
  body: Record<string, unknown>,
) => {
  const res = await api.patch(`/properties/${id}`, body);
  return res.data as { message: string; property: unknown };
};

export const updatePropertyImages = async (
  id: string,
  keepImages: string[],
  removedImages: string[],
  newFiles: File[],
) => {
  const formData = new FormData();
  formData.append("keepImages", JSON.stringify(keepImages));
  formData.append("removedImages", JSON.stringify(removedImages));
  newFiles.forEach((file) => formData.append("images", file));
  const res = await api.patch(`/properties/${id}/images`, formData);
  return res.data as { message: string; property: unknown };
};
