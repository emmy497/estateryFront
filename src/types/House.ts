export interface House {
  _id: string;
  title: string;
  location: string;
  state: string;
  beds: number;
  baths: number;
  price: number;
  category: string;
  images: string[];
  isFavorite: boolean;

  area: string;
  parking: number;
  features: string[];
  contactPhone: string;
  contactEmail: string;
  agentName?: string;
  agentImage?: string;
  // filled in by background geocoding after a listing is created
  coordinates?: { lat?: number; lng?: number } | null;
}
