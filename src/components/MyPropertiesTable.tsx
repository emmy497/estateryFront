import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import {
  getProperties,
  updatePropertyStatus,
} from "../api/Properties";
import { formatPrice } from "../utils/formatPrice";
import ViewPropertyModal from "./viewPropertyModal";
import EditPropertyModal from "./editPropertyModal";

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  unlisted: "bg-gray-100 text-gray-600",
};

interface Filters {
  search?: string;
  propertyType?: string;
  status?: string;
}

interface PropertyItem {
  _id: string;
  title: string;
  images?: string[];
  category?: string;
  location?: string;
  price?: number;
  status?: string;
  createdAt?: string;
}

function UnlistConfirmModal({
  open,
  propertyTitle,
  loading,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  propertyTitle: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  const overlay = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-2">Unlist property?</h3>
        <p className="text-gray-600 text-sm mb-6">
          &quot;{propertyTitle}&quot; will no longer appear on the public
          listings site. You can activate it again later from My Properties.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Unlisting..." : "Unlist"}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(overlay, document.body)
    : null;
}

export default function MyPropertiesTable({
  filters = { search: "", propertyType: "all", status: "all" },
}: {
  filters?: Filters;
}) {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 6;

  const [viewOpen, setViewOpen] = useState(false);
  const [viewPropertyId, setViewPropertyId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editPropertyId, setEditPropertyId] = useState<string | null>(null);
  const [confirmUnlistOpen, setConfirmUnlistOpen] = useState(false);
  const [unlistTargetId, setUnlistTargetId] = useState<string | null>(null);
  const [unlistLoading, setUnlistLoading] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const bumpRefresh = () => setRefreshNonce((n) => n + 1);

  const queryParams = useMemo(
    () => ({
      search: filters.search?.trim() || undefined,
      type:
        filters.propertyType && filters.propertyType !== "all"
          ? filters.propertyType
          : undefined,
      status:
        filters.status && filters.status !== "all"
          ? filters.status
          : undefined,
    }),
    [filters.search, filters.propertyType, filters.status],
  );

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);
      setCurrentPage(1);

      try {
        const response = await getProperties(queryParams);
        setProperties(response || []);
      } catch (err) {
        console.error("Error loading properties:", err);
        setError("Unable to load properties. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [queryParams]);

  useEffect(() => {
    if (refreshNonce === 0) return;

    const refetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getProperties(queryParams);
        setProperties(response || []);
      } catch (err) {
        console.error("Error loading properties:", err);
        setError("Unable to load properties. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    refetch();
    // Intentionally only when owner bumps refresh after mutations — queryParams comes from latest closure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshNonce]);

  const totalPages = Math.max(1, Math.ceil(properties.length / pageSize));
  const paginatedProperties = useMemo(
    () =>
      properties.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, properties],
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPropertyImage = (item: PropertyItem) =>
    item.images?.[0] ||
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85";

  const getTypeLabel = (item: PropertyItem) => {
    if (item.category === "rent") return "For Rent";
    if (item.category === "sale") return "For Sale";
    return item.category || "-";
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return "-";
    return status === "active"
      ? "Available"
      : status === "unlisted"
        ? "Unavaiable"
        : status;
  };

  const getLocationState = (location?: string) => {
    if (!location) return "-";
    const parts = location
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length === 0) return "-";
    const last = parts[parts.length - 1];

    if (/^\d{5}(-\d{4})?$/.test(last) && parts.length > 1) {
      return parts[parts.length - 2];
    }

    const stateZipMatch = last.match(/^([A-Za-z]{2})\s*\d{5}(?:-\d{4})?$/);
    if (stateZipMatch) {
      return stateZipMatch[1];
    }

    if (/^[A-Za-z]{2}$/.test(last)) {
      return last;
    }

    return last;
  };

  const openView = (id: string) => {
    setViewPropertyId(id);
    setViewOpen(true);
  };

  const openEdit = (id: string) => {
    setEditPropertyId(id);
    setEditOpen(true);
  };

  const requestUnlist = (id: string) => {
    setUnlistTargetId(id);
    setConfirmUnlistOpen(true);
  };

  const confirmUnlist = async () => {
    if (!unlistTargetId) return;
    try {
      setUnlistLoading(true);
      await updatePropertyStatus(unlistTargetId, "unlisted");
      toast.success(
        "Property unlisted. It will no longer appear on the public site.",
      );
      setConfirmUnlistOpen(false);
      setUnlistTargetId(null);
      bumpRefresh();
    } catch {
      toast.error("Could not unlist property. Please try again.");
    } finally {
      setUnlistLoading(false);
    }
  };

  const activateProperty = async (id: string) => {
    try {
      await updatePropertyStatus(id, "active");
      toast.success("Property is active again on the site.");
      bumpRefresh();
    } catch {
      toast.error("Could not activate property.");
    }
  };

  const unlistTitle =
    properties.find((p) => p._id === unlistTargetId)?.title ||
    "this property";

  if (isLoading && properties.length === 0 && refreshNonce === 0) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="border border-red-100 rounded-md p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="border border-gray-100 rounded-md p-6 text-gray-600">
        No properties found for the selected filter.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 ">
        <div className="lg:hidden space-y-4">
          {paginatedProperties.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={getPropertyImage(item)}
                  alt={item.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.title || "Untitled Property"}
                    </h3>
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-gray-500">
                      {getTypeLabel(item)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {getLocationState(item.location)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-700">
                    <span className="font-semibold">
                      {item.price ? formatPrice(item.price) : "-"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Added {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => openView(item._id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(item._id)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Edit
                </button>
                {item.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => requestUnlist(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Unlist
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => activateProperty(item._id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Activate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block w-full overflow-x-auto lg:mt-[40px] border border-[#E6E3E3] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm border-collapse bg-white">
            <thead className="text-left text-gray-600">
              <tr className="bg-[#FEFAFA]">
                <th className="p-6">Property</th>
                <th>Type</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
                <th>Date Added</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedProperties.map((item) => (
                <tr
                  key={item._id}
                  className="border border-[#E6E3E3] hover:bg-gray-50 transition"
                >
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={getPropertyImage(item)}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <span className="font-medium text-gray-800">
                      {item.title || "Untitled Property"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        item.category === "rent"
                          ? "text-[#A9744A] "
                          : "text-[#097521] "
                      }`}
                    >
                      {getTypeLabel(item)}
                    </span>
                  </td>

                  <td className="text-gray-600">
                    {getLocationState(item.location)}
                  </td>

                  <td className="font-medium text-gray-800">
                    {item.price ? formatPrice(item.price) : "-"}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-2 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                        statusStyles[item.status?.toLowerCase() || ""] ||
                        "bg-gray-100 text-[#605F5F]"
                      }`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                  </td>

                  <td className="text-gray-600">
                    {formatDate(item.createdAt)}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-3 text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => openView(item._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(item._id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Edit
                      </button>
                      {item.status === "active" ? (
                        <button
                          type="button"
                          onClick={() => requestUnlist(item._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Unlist
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => activateProperty(item._id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Desktop pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E6E3E3] bg-white text-[13px] text-[#555]">
            <span>Showing {paginatedProperties.length} of {properties.length}</span>
            <div className="flex items-center gap-1">
              <span className="mr-2">Page {currentPage} of {totalPages}</span>
              <PaginationBtn onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</PaginationBtn>
              <PaginationBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</PaginationBtn>
              <PaginationBtn onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</PaginationBtn>
              <PaginationBtn onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</PaginationBtn>
            </div>
          </div>
        </div>

        {/* Mobile pagination — after mobile cards */}
        <div className="lg:hidden mt-4 flex items-center justify-between px-2 py-3 text-[13px] text-[#555]">
          <span>Showing {paginatedProperties.length} of {properties.length}</span>
          <div className="flex items-center gap-1">
            <PaginationBtn onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</PaginationBtn>
            <PaginationBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</PaginationBtn>
            <span className="px-2">Page {currentPage}/{totalPages}</span>
            <PaginationBtn onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</PaginationBtn>
            <PaginationBtn onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</PaginationBtn>
          </div>
        </div>
      </div>

      <ViewPropertyModal
        isOpen={viewOpen}
        propertyId={viewPropertyId}
        onClose={() => {
          setViewOpen(false);
          setViewPropertyId(null);
        }}
        onEdit={() => {
          const id = viewPropertyId;
          setViewOpen(false);
          setViewPropertyId(null);
          if (id) openEdit(id);
        }}
        onRequestUnlist={() => {
          const id = viewPropertyId;
          setViewOpen(false);
          setViewPropertyId(null);
          if (id) requestUnlist(id);
        }}
      />

      <EditPropertyModal
        isOpen={editOpen}
        propertyId={editPropertyId}
        onClose={() => {
          setEditOpen(false);
          setEditPropertyId(null);
        }}
        onSaved={bumpRefresh}
      />

      <UnlistConfirmModal
        open={confirmUnlistOpen}
        propertyTitle={unlistTitle}
        loading={unlistLoading}
        onCancel={() => {
          if (!unlistLoading) {
            setConfirmUnlistOpen(false);
            setUnlistTargetId(null);
          }
        }}
        onConfirm={confirmUnlist}
      />
    </>
  );
}

const PaginationBtn = ({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-7 h-7 flex items-center justify-center rounded border border-[#E6E3E3] text-[13px] text-[#555] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
  >
    {children}
  </button>
);
