import { useState, useContext, useRef } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoggedInHeader from "../components/LoggedInHeader";
import PropertiesHeader from "../components/PropertiesHeader";
import Pagination from "../components/Pagination";
import { AuthContext } from "../context/authContext";
import PropertyCard from "../components/PropertyCard";
import ProperyNotFound from "../components/ProperyNotFound";
import Spinner from "../components/Spinner";
import { searchProperties, type PropertySort } from "../api/Properties";
import PropertySearchMap, { type BBox } from "../components/PropertySearchMap";
import { LayoutGrid, Map as MapIcon, X } from "lucide-react";

type PropertyTypeFilter = "all" | "rent" | "sale";

interface SearchValues {
  propertyType: PropertyTypeFilter;
  budget: string;
  location: string;
}

const PAGE_SIZE = 9;
const MAP_PAGE_SIZE = 24;

const SORT_OPTIONS: { value: PropertySort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "oldest", label: "Oldest first" },
];

const BED_OPTIONS = [
  { value: "", label: "Any beds" },
  { value: "1", label: "1+ beds" },
  { value: "2", label: "2+ beds" },
  { value: "3", label: "3+ beds" },
  { value: "4", label: "4+ beds" },
];

const positiveNumber = (value: string | null) => {
  const number = Number(value);
  return value && Number.isFinite(number) && number > 0 ? number : undefined;
};

// The URL is the source of truth, so searches can be shared, bookmarked and
// survive refresh and the back button.
const readFilters = (params: URLSearchParams) => {
  const category = params.get("category");
  const sort = params.get("sort") as PropertySort | null;

  return {
    category:
      category === "rent" || category === "sale"
        ? (category as "rent" | "sale")
        : undefined,
    q: params.get("q")?.trim() || undefined,
    maxPrice: positiveNumber(params.get("maxPrice")),
    minBeds: positiveNumber(params.get("minBeds")),
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? sort! : "newest",
    page: positiveNumber(params.get("page")) ?? 1,
    bbox: readBBox(params.get("bbox")),
  };
};

const readBBox = (value: string | null): BBox | undefined => {
  const parts = value?.split(",").map(Number);
  if (!parts || parts.length !== 4 || !parts.every(Number.isFinite)) return undefined;
  const [minLng, minLat, maxLng, maxLat] = parts;
  return minLng < maxLng && minLat < maxLat ? (parts as BBox) : undefined;
};

type Filters = ReturnType<typeof readFilters>;

const searchValuesFrom = (filters: Filters): SearchValues => ({
  propertyType: filters.category ?? "all",
  budget: filters.maxPrice ? filters.maxPrice.toLocaleString() : "",
  location: filters.q ?? "",
});

const Property = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readFilters(searchParams);
  const isMapView = searchParams.get("view") === "map";
  const resultsRef = useRef<HTMLDivElement>(null);
  // the listing under the pointer, highlighted in both the list and the map
  const [activeId, setActiveId] = useState<string | null>(null);

  // What's typed in the search bar but not yet applied. Reset whenever the URL
  // changes (e.g. back button), using React's "adjust state on prop change" pattern.
  const paramsKey = searchParams.toString();
  const [draft, setDraft] = useState<SearchValues>(() => searchValuesFrom(filters));
  const [draftKey, setDraftKey] = useState(paramsKey);
  if (draftKey !== paramsKey) {
    setDraftKey(paramsKey);
    setDraft(searchValuesFrom(filters));
  }

  // the map shows more pins per page than the grid shows cards
  const limit = isMapView ? MAP_PAGE_SIZE : PAGE_SIZE;
  const { data, isPending, isError, isPlaceholderData, refetch } = useQuery({
    queryKey: ["properties", "search", filters, limit],
    queryFn: () => searchProperties({ ...filters, limit }),
    // keep showing the current page while the next one loads
    placeholderData: keepPreviousData,
  });

  const updateParams = (changes: Record<string, string | undefined>, resetPage = true) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (resetPage) next.delete("page");
    setSearchParams(next);
  };

  const handleSearchChange = (field: keyof SearchValues, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const budget = draft.budget.replace(/[^0-9]/g, "");
    updateParams({
      category: draft.propertyType === "all" ? undefined : draft.propertyType,
      maxPrice: Number(budget) > 0 ? budget : undefined,
      q: draft.location.trim() || undefined,
    });
  };

  const handleQuickTypeFilter = (type: PropertyTypeFilter) => {
    updateParams({ category: type === "all" ? undefined : type });
  };

  const handleClearFilters = () => {
    // keep the list/map choice, drop everything else
    setSearchParams(isMapView ? new URLSearchParams({ view: "map" }) : new URLSearchParams());
  };

  const setView = (view: "list" | "map") => {
    // a map area only makes sense on the map
    updateParams({ view: view === "map" ? "map" : undefined, bbox: undefined });
  };

  const handlePageChange = (page: number) => {
    if (!data || page < 1 || page > data.totalPages) return;
    updateParams({ page: page > 1 ? String(page) : undefined }, false);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeType: PropertyTypeFilter = filters.category ?? "all";
  const typeButtonClass = (type: PropertyTypeFilter) =>
    `rounded-full py-[10px] px-[20px] border cursor-pointer transition-colors ${
      activeType === type
        ? "bg-[#1C1915] border-[#1C1915] text-white"
        : "border-[#E2DDD6] hover:border-[#8B6B4E]"
    }`;
  const selectClass =
    "h-[44px] rounded-full border border-[#E2DDD6] bg-white px-4 text-[15px] focus:outline-none focus:border-[#8B6B4E] cursor-pointer";

  return (
    <>
      <Navbar />

      {user ? (
        <LoggedInHeader
          searchValues={draft}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
        />
      ) : (
        <PropertiesHeader
          searchValues={draft}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
        />
      )}

      <div ref={resultsRef} className="bg-[#F9FAFB] lg:pt-[70px] lg:px-[100px] scroll-mt-4">
        <div className="flex flex-col gap-5 lg:flex-row justify-between lg:items-center pt-[60px] lg:pt-[20px] mb-[40px] px-[20px] lg:px-0">
          <div>
            <h3 className="text-[22px] font-medium tracking-[-0.01em]">
              {data
                ? `${data.total.toLocaleString()} ${data.total === 1 ? "home" : "homes"} ${filters.bbox ? "in this area" : "found"}`
                : "Properties"}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {filters.q && (
                <p className="text-[15px] text-[#6B6F76]">Matching “{filters.q}”</p>
              )}
              {filters.bbox && (
                <button
                  type="button"
                  onClick={() => updateParams({ bbox: undefined })}
                  className="flex items-center gap-1.5 rounded-full bg-[#F5F0EA] px-3 py-1 text-[13px] text-[#1C1915] hover:bg-[#ECE4DA]"
                >
                  Map area
                  <X size={13} aria-label="Clear map area" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div role="group" aria-label="View" className="flex rounded-full border border-[#E2DDD6] bg-white p-1">
              {([
                { value: "list", label: "List", Icon: LayoutGrid },
                { value: "map", label: "Map", Icon: MapIcon },
              ] as const).map(({ value, label, Icon }) => {
                const selected = (value === "map") === isMapView;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setView(value)}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[14px] transition-colors ${
                      selected ? "bg-[#1C1915] text-white" : "text-[#4A4D55] hover:text-[#111418]"
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={() => handleQuickTypeFilter("all")} className={typeButtonClass("all")}>
              All
            </button>
            <button type="button" onClick={() => handleQuickTypeFilter("rent")} className={typeButtonClass("rent")}>
              For Rent
            </button>
            <button type="button" onClick={() => handleQuickTypeFilter("sale")} className={typeButtonClass("sale")}>
              For Sale
            </button>

            <select
              aria-label="Minimum bedrooms"
              value={filters.minBeds ? String(filters.minBeds) : ""}
              onChange={(e) => updateParams({ minBeds: e.target.value || undefined })}
              className={selectClass}
            >
              {BED_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              aria-label="Sort by"
              value={filters.sort}
              onChange={(e) => updateParams({ sort: e.target.value === "newest" ? undefined : e.target.value })}
              className={selectClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {isMapView ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8 px-[20px] lg:px-0 pb-[74px]">
            {/* map first on small screens, on the right and pinned while scrolling on large ones */}
            <div className="h-[55vh] min-h-[360px] lg:order-2 lg:sticky lg:top-6 lg:h-[calc(100vh-48px)]">
              <PropertySearchMap
                houses={data?.items ?? []}
                bbox={filters.bbox}
                activeId={activeId}
                onActiveChange={setActiveId}
                onSearchArea={(bbox) => updateParams({ bbox: bbox.join(",") })}
              />
            </div>

            <div className="lg:order-1">
              {isPending ? (
                <div className="flex justify-center py-24">
                  <Spinner />
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center gap-4 py-24 text-center">
                  <p className="text-[#6B6F76]">We couldn't load properties. Please check your connection.</p>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="rounded-full bg-[#1C1915] px-6 py-3 text-white hover:bg-[#3A332C]"
                  >
                    Try again
                  </button>
                </div>
              ) : data.items.length > 0 ? (
                <div aria-busy={isPlaceholderData} className={`transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {data.items.map((house) => (
                      <div
                        key={house._id}
                        onMouseEnter={() => setActiveId(house._id)}
                        onMouseLeave={() => setActiveId(null)}
                        onFocus={() => setActiveId(house._id)}
                        onBlur={() => setActiveId(null)}
                        className={`rounded-[12px] transition-shadow ${
                          activeId === house._id ? "ring-2 ring-[#1C1915] ring-offset-2 ring-offset-[#F9FAFB]" : ""
                        }`}
                      >
                        <PropertyCard house={house} />
                      </div>
                    ))}
                  </div>
                  <Pagination
                    currentPage={data.page}
                    totalPages={data.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-[12px] border border-dashed border-[#E2DDD6] bg-white py-20 px-6 text-center">
                  <p className="text-[17px] font-medium">No homes here</p>
                  <p className="max-w-[320px] text-[15px] text-[#6B6F76]">
                    Try zooming out or moving the map, or clear your filters.
                  </p>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="mt-2 rounded-full bg-[#1C1915] px-5 py-2.5 text-[14px] text-white hover:bg-[#3A332C]"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : isPending ? (
          <div className="flex justify-center py-24">
            <Spinner />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-24 px-5 text-center">
            <p className="text-[#6B6F76]">We couldn't load properties. Please check your connection.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-full bg-[#1C1915] px-6 py-3 text-white hover:bg-[#3A332C]"
            >
              Try again
            </button>
          </div>
        ) : data.items.length === 0 && data.total > 0 ? (
          // a stale link asked for a page past the end: go to the last real page
          <Navigate
            replace
            to={{
              search: (() => {
                const next = new URLSearchParams(searchParams);
                if (data.totalPages > 1) next.set("page", String(data.totalPages));
                else next.delete("page");
                return next.toString();
              })(),
            }}
          />
        ) : data.items.length > 0 ? (
          <div aria-busy={isPlaceholderData} className={`transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] lg:gap-[50px] px-[20px] lg:px-0 mx-auto">
              {data.items.map((house) => (
                <PropertyCard key={house._id} house={house} />
              ))}
            </div>

            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
            {data.totalPages <= 1 && <div className="pb-[74px]" />}
          </div>
        ) : (
          <ProperyNotFound onClearFilters={handleClearFilters} />
        )}
      </div>

      <Footer />
    </>
  );
};

export default Property;
