import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { getTours } from "../api/tour";
import NoPropertyListed from "./NoPropertyListed";

interface PropertyTableProps {
  activities?: any[];
  properties?: any[];
  filters?: {
    search?: string;
    propertyType?: string;
    status?: string;
  };
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-[#FFF7E9] text-[#FF9F10]";
    case "Active":
      return "bg-[#DCFCE7] text-[#048120]";
    case "Rescheduled":
      return "bg-[#F7F5F2] text-[#005BC4]";
    case "Accepted":
      return "bg-green-100 text-green-600";
    case "Declined":
      return "bg-[#FFEDED] text-[#E60E0E]";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function PropertyTable({
  activities,
  properties,
  filters,
}: PropertyTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedActivities, setFetchedActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  const searchQuery = filters?.search?.trim().toLowerCase() || "";
  const propertyTypeFilter = filters?.propertyType?.toLowerCase() || "all";
  const statusFilter = filters?.status?.toLowerCase() || "all";

  // Determine if we're showing properties or activities
  const isShowingProperties = properties !== undefined;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, propertyTypeFilter, statusFilter]);

  useEffect(() => {
    if (!isShowingProperties) {
      const fetchActivities = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem("token") || "";
          const response = await getTours(token);
          setFetchedActivities(response.data);
        } catch (error) {
          console.error("Error fetching recent activity:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchActivities();
    }
  }, [isShowingProperties]);

  const activityRows = activities?.length ? activities : fetchedActivities;

  // Filter logic for activities
  const filteredActivities = activityRows.filter((item) => {
    if (searchQuery) {
      const text = [
        item.property?.title,
        item.property?.location,
        item.property?.category,
        item.activity,
        item.user?.fullName,
        item.name,
        item.email,
        item.tourType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!text.includes(searchQuery)) {
        return false;
      }
    }

    if (propertyTypeFilter !== "all") {
      const category = (item.property?.category || "").toLowerCase();
      if (category !== propertyTypeFilter) {
        return false;
      }
    }

    if (statusFilter !== "all") {
      const itemStatus = (item.status || "").toLowerCase();
      if (itemStatus !== statusFilter) {
        return false;
      }
    }

    return true;
  });

  // Filter logic for properties
  const filteredProperties =
    properties?.filter((property) => {
      if (searchQuery) {
        const text = [
          property.title,
          property.location,
          property.state,
          property.category,
          property.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!text.includes(searchQuery)) {
          return false;
        }
      }

      if (propertyTypeFilter !== "all") {
        const category = (property.category || "").toLowerCase();
        if (category !== propertyTypeFilter) {
          return false;
        }
      }

      if (statusFilter !== "all") {
        const propertyStatus = (property.status || "").toLowerCase();
        if (propertyStatus !== statusFilter) {
          return false;
        }
      }

      return true;
    }) || [];

  const totalPages = Math.ceil(
    (isShowingProperties
      ? filteredProperties.length
      : filteredActivities.length) / pageSize,
  );
  const paginatedItems = (
    isShowingProperties ? filteredProperties : filteredActivities
  ).slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDate = (value: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (value: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getPropertyTitle = (item: any) => {
    const property = item.property;

    if (!property) {
      return item.propertyId || "Unknown Property";
    }

    if (typeof property === "string") {
      return property;
    }

    return (
      property.title ||
      property.name ||
      property.property?.title ||
      property._doc?.title ||
      property[0]?.title ||
      item.propertyId ||
      "Unknown Property"
    );
  };

  const getPropertyImage = (item: any) =>
    item.property?.images?.[0] ||
    item.image ||
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85";

  const getUserLabel = (item: any) =>
    item.user?.fullName || item.name || item.email || "-";

  const getTypeLabel = (item: any) => {
    if (item.tourType === "in-person") return "In-person";
    if (item.tourType === "virtual") return "Virtual";
    return item.type || "-";
  };

  const getActivityLabel = (item: any) => item.activity || "Tour Request";

  const getStatusLabel = (status: string) =>
    status ? `${status.charAt(0).toUpperCase()}${status.slice(1)}` : "-";

  if (isLoading && activityRows.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-[#E6E3E3] overflow-hidden shadow-sm p-4">
        <h2 className="font-semibold mb-4">
          {isShowingProperties ? "Properties" : "Recent Activity"}
        </h2>
        <Spinner />
      </div>
    );
  }

  if (paginatedItems.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-[#E6E3E3] overflow-hidden shadow-sm p-4">
        <h2 className="font-semibold mb-4">
          {isShowingProperties ? "Properties" : "Recent Activity"}
        </h2>
        <NoPropertyListed />
      </div>
    );
  }

  return (
    <>
      <div className="lg:rounded-xl lg:bg-white lg:border lg:border-[#E6E3E3] overflow-hidden lg:shadow-sm ">
        <h2 className="font-semibold mb-4 p-3 text-[14px]">
          {isShowingProperties ? "Properties" : "Recent Activity"}
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto ">
          <table className="w-full text-sm min-w-[800px] border-collapse">
            <thead>
              <tr className="text-left border-b border-[#E1E1E1] bg-[#FEFAFA] text-[14px]">
                {isShowingProperties ? (
                  <>
                    <th className="p-6">Image</th>
                    <th className="p-6">Title</th>
                    <th className="p-6">Location</th>
                    <th className="p-6">Category</th>
                    <th className="p-6">Price</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Date Added</th>
                  </>
                ) : (
                  <>
                    <th className="p-6">Date</th>
                    <th className="p-6">Property</th>
                    <th className="p-6">Type</th>
                    <th className="p-6">Activity</th>
                    <th className="p-6">User</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Time</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {paginatedItems.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-[#E1E1E1] hover:bg-gray-50 transition text-[14px]"
                >
                  {isShowingProperties ? (
                    <>
                      <td className="p-3">
                        <img
                          src={
                            item.images?.[0] ||
                            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
                          }
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-3 font-medium">{item.title}</td>
                      <td className="p-3 text-gray-600">
                        {item.location}, {item.state}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.category === "rent"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {item.category?.charAt(0).toUpperCase() +
                            item.category?.slice(1)}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">
                        ${item.price?.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "active"
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.status?.charAt(0).toUpperCase() +
                            item.status?.slice(1)}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {formatDate(item.createdAt)}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 text-gray-600">
                        {formatDate(item.createdAt || item.date)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getPropertyImage(item)}
                            alt="property"
                            className="w-10 h-10 rounded-md object-cover"
                          />
                          <span className="text-gray-800">
                            {getPropertyTitle(item)}
                          </span>
                        </div>
                      </td>
                      <td
                        className={`p-3 font-medium ${
                          getTypeLabel(item) === "In-person"
                            ? "text-orange-500"
                            : "text-green-600"
                        }`}
                      >
                        {getTypeLabel(item)}
                      </td>
                      <td className="p-3 text-gray-600">
                        {getActivityLabel(item)}
                      </td>
                      <td className="p-3 text-gray-600">
                        {getUserLabel(item)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            getStatusLabel(item.status),
                          )}`}
                        >
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {formatTime(item.createdAt || item.date)}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {paginatedItems.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-[#E6E3E3] rounded-xl p-4 shadow-sm"
            >
              {isShowingProperties ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={
                        item.images?.[0] ||
                        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
                      }
                      alt={item.title}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-500">Location:</p>
                    <p className="font-medium">
                      {item.location}, {item.state}
                    </p>

                    <p className="text-gray-500">Category:</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                        item.category === "rent"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.category?.charAt(0).toUpperCase() +
                        item.category?.slice(1)}
                    </span>

                    <p className="text-gray-500">Price:</p>
                    <p className="font-semibold">
                      ${item.price?.toLocaleString()}
                    </p>

                    <p className="text-gray-500">Status:</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                        item.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status?.charAt(0).toUpperCase() +
                        item.status?.slice(1)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={getPropertyImage(item)}
                      alt="property"
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {getPropertyTitle(item)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(item.createdAt || item.date)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-500">Type:</p>
                    <p
                      className={`font-medium ${
                        getTypeLabel(item) === "In-person"
                          ? "text-orange-500"
                          : "text-green-600"
                      }`}
                    >
                      {getTypeLabel(item)}
                    </p>

                    <p className="text-gray-500">Activity:</p>
                    <p>{getActivityLabel(item)}</p>

                    <p className="text-gray-500">User:</p>
                    <p>{getUserLabel(item)}</p>

                    <p className="text-gray-500">Status:</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${getStatusStyle(
                        getStatusLabel(item.status),
                      )}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>

                    <p className="text-gray-500">Time:</p>
                    <p>{formatTime(item.createdAt || item.date)}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Desktop pagination */}
        <div className="hidden md:flex items-center justify-between px-6 py-4 border-t border-[#E1E1E1] bg-white">
          <p className="text-[13px] text-[#555]">
            Showing {paginatedItems.length} of {(isShowingProperties ? filteredProperties : filteredActivities).length}
          </p>
          <div className="flex items-center gap-1 text-[13px] text-[#555]">
            <span className="mr-2">Page {currentPage} of {totalPages}</span>
            <PaginationBtn onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</PaginationBtn>
            <PaginationBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</PaginationBtn>
            <PaginationBtn onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</PaginationBtn>
            <PaginationBtn onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</PaginationBtn>
          </div>
        </div>

        {/* Mobile pagination */}
        <div className="md:hidden mt-4 flex items-center justify-between px-4 py-3 text-[13px] text-[#555]">
          <span>Showing {paginatedItems.length} of {(isShowingProperties ? filteredProperties : filteredActivities).length}</span>
          <div className="flex items-center gap-1">
            <PaginationBtn onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</PaginationBtn>
            <PaginationBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</PaginationBtn>
            <span className="px-2">Page {currentPage}/{totalPages}</span>
            <PaginationBtn onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</PaginationBtn>
            <PaginationBtn onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</PaginationBtn>
          </div>
        </div>
      </div>
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
