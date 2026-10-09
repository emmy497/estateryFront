import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getPropertyById } from "../api/Properties";
import { formatPrice } from "../utils/formatPrice";
import { normalizeFeaturesArray } from "../utils/propertyFeatures";
import Spinner from "./Spinner";

export type ViewPropertyModalProps = {
  isOpen: boolean;
  propertyId: string | null;
  onClose: () => void;
  onEdit?: () => void;
  onRequestUnlist?: () => void;
};

function formatPropertyPrice(value: unknown): string {
  if (value === undefined || value === null) return "-";
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return String(value);
  return formatPrice(n);
}

export default function ViewPropertyModal({
  isOpen,
  propertyId,
  onClose,
  onEdit,
  onRequestUnlist,
}: ViewPropertyModalProps) {
  const [property, setProperty] = useState<Record<string, unknown> | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !propertyId) {
      setProperty(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    getPropertyById(propertyId)
      .then((data) => {
        if (!cancelled) setProperty(data as Record<string, unknown>);
      })
      .catch(() => {
        if (!cancelled) setProperty(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, propertyId]);

  if (!isOpen) return null;

  const images = (property?.images as string[] | undefined) ?? [];
  const features = normalizeFeaturesArray(property?.features);
  const typeLabel =
    property?.category === "rent"
      ? "For Rent"
      : property?.category === "sale"
        ? "For Sale"
        : String(property?.category ?? "-");

  const statusLabel =
    property?.status === "active"
      ? "Active (listed)"
      : property?.status === "unlisted"
        ? "Unlisted"
        : String(property?.status ?? "-");

  const overlay = (
    <div className="animate-backdrop-in fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="animate-modal-in bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#F0F0F0] shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-[#111111]">Property Details</h2>
            <p className="text-sm text-gray-400">
              {loading ? "Loading..." : String(property?.title ?? "Property")}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-6">
          {loading && (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          )}

          {!loading && property && (
            <>
              <div className="border rounded-xl border-[#ECE8E3] p-4 space-y-4">
                <h3 className="font-semibold">Basic Information</h3>

                {images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {images.map((src, i) => (
                      <img
                        key={`${src}-${i}`}
                        src={src}
                        alt={`${String(property.title)} ${i + 1}`}
                        className="rounded-lg w-full h-28 sm:h-32 object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No images uploaded.</p>
                )}

                <div>
                  <label className="text-sm text-gray-500">
                    Listing status
                  </label>
                  <input
                    className="w-full border rounded-lg border-[#ECE8E3] p-2 mt-1 bg-gray-50 capitalize"
                    value={statusLabel}
                    readOnly
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    Property Title
                  </label>
                  <input
                    className="w-full border border-[#ECE8E3] rounded-lg p-2 mt-1 bg-gray-50"
                    value={String(property.title ?? "")}
                    readOnly
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    About the Property
                  </label>
                  <textarea
                    className="w-full border border-[#ECE8E3] rounded-lg p-2 mt-1 bg-gray-50"
                    rows={4}
                    readOnly
                    value={String(property.description ?? "")}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">Property Type</label>
                  <input
                    className="w-full border border-[#ECE8E3] rounded-lg p-2 mt-1 bg-gray-50"
                    value={typeLabel}
                    readOnly
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">Price</label>
                  <input
                    className="w-full border border-[#ECE8E3] rounded-lg p-2 mt-1 bg-gray-50"
                    value={formatPropertyPrice(property.price)}
                    readOnly
                  />
                </div>
              </div>

              <div className="border rounded-xl border-[#ECE8E3] p-4 space-y-4">
                <h3 className="font-semibold">Location</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Location</label>
                    <input
                      className="w-full border border-[#ECE8E3] rounded-lg p-2 mt-1 bg-gray-50"
                      value={String(property.location ?? "")}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">State</label>
                    <input
                      className="w-full border border-[#ECE8E3] rounded-lg p-2 mt-1 bg-gray-50"
                      value={String(property.state ?? "")}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-xl border-[#ECE8E3] p-4 space-y-4">
                <h3 className="font-semibold">Details</h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Bedrooms</p>
                    <input
                      className="border border-[#ECE8E3] rounded-lg p-2 w-full bg-gray-50 mt-1"
                      value={String(property.beds ?? "")}
                      readOnly
                    />
                  </div>

                  <div>
                    <p className="text-gray-500">Bathrooms</p>
                    <input
                      className="border border-[#ECE8E3] rounded-lg p-2 w-full bg-gray-50 mt-1"
                      value={String(property.baths ?? "")}
                      readOnly
                    />
                  </div>

                  <div>
                    <p className="text-gray-500">Area</p>
                    <input
                      className="border border-[#ECE8E3] rounded-lg p-2 w-full bg-gray-50 mt-1"
                      value={String(property.area ?? "")}
                      readOnly
                    />
                  </div>

                  <div>
                    <p className="text-gray-500">Parking</p>
                    <input
                      className="border border-[#ECE8E3] rounded-lg p-2 w-full bg-gray-50 mt-1"
                      value={String(property.parking ?? "")}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-xl border-[#ECE8E3] p-4 space-y-4">
                <h3 className="font-semibold">Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <input
                      className="w-full border border-[#ECE8E3] rounded-lg p-2 mt-1 bg-gray-50"
                      value={String(property.contactPhone ?? "")}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <input
                      className="w-full border border-[#ECE8E3] rounded-lg p-2 mt-1 bg-gray-50"
                      value={String(property.contactEmail ?? "")}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-xl border-[#ECE8E3] p-4 space-y-4">
                <h3 className="font-semibold">Features</h3>
                {features.length === 0 ? (
                  <p className="text-sm text-gray-500">No features listed.</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
                    {features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          {!loading && !property && (
            <p className="text-center text-red-600 py-8">
              Could not load property.
            </p>
          )}
        </div>

        {!loading && property && (
          <div className="px-6 pb-6 pt-4 border-t border-[#F0F0F0] flex justify-end gap-3 shrink-0 flex-wrap">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="px-5 py-2.5 border border-[#D1D5DB] text-[#374151] rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Edit
              </button>
            )}
            {property.status === "active" && onRequestUnlist && (
              <button
                type="button"
                onClick={onRequestUnlist}
                className="px-5 py-2.5 border border-red-400 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer"
              >
                Unlist Property
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#1C1915] text-white rounded-xl text-sm font-medium hover:bg-[#3A332C] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(overlay, document.body)
    : null;
}
