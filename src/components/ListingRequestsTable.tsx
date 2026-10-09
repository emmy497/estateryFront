import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import api from "../api/api";
import ViewListingRequestModal from "./ViewListingRequestModal";

interface ListingRequest {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

const PAGE_SIZE = 8;

const ListingRequestsTable = () => {
  const [listingRequests, setListingRequests] = useState<ListingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ListingRequest | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<
    "all" | "pending" | "accepted" | "declined"
  >("all");
  const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
  const [page, setPage] = useState(1);

  const fetchListingRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/listing-requests");
      setListingRequests(res.data);
    } catch (error) {
      console.error("Error fetching listing requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListingRequests();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filter, sortBy]);

  const handleViewClick = (request: ListingRequest) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleStatusUpdate = (updatedRequest: ListingRequest) => {
    setListingRequests(
      listingRequests.map((req) =>
        req._id === updatedRequest._id ? updatedRequest : req,
      ),
    );
    setShowModal(false);
    setSelectedRequest(null);
  };

  // Filter requests based on search and status
  const filteredRequests = listingRequests.filter((req) => {
    const matchesSearch = searchQuery
      ? [req.fullName, req.email, req.phoneNumber, req.location]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    const matchesStatus = filter === "all" ? true : req.status === filter;

    return matchesSearch && matchesStatus;
  });

  // Sort requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === "Newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedRequests.length / PAGE_SIZE));
  const paginated = sortedRequests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500 bg-[#FFF7E9] py-1 px-3 rounded-xl";
      case "accepted":
        return "text-green-500";
      case "declined":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className=" overflow-hidden p-4 md:p-6 mt-[40px]">
      {/* Header and Filters */}
      <div className="mb-6 space-y-4">
        <div className="rounded-xl bg-white p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ">
            <div className="flex-1">
              <label className="mb-2 text-sm font-medium block">Search</label>
              <div className="relative w-full border border-[#E6E3E3] rounded-md px-3 py-2">
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-none focus:outline-none pl-7 text-sm"
                />
                <img
                  src="/images/proicons_search.png"
                  alt="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:w-[360px]">
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold">Status</label>
                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(
                      e.target.value as
                        | "all"
                        | "pending"
                        | "accepted"
                        | "declined",
                    )
                  }
                  className="w-full px-3 py-2 border border-[#E1E1E1] rounded-md focus:outline-none text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "Newest" | "Oldest")
                  }
                  className="w-full px-3 py-2 border border-[#E1E1E1] rounded-md focus:outline-none text-sm"
                >
                  <option value="Newest">Newest</option>
                  <option value="Oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table - Desktop View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E1E1E1]">
        <table className="w-full bg-white text-sm min-w-[800px] border-collapse">
          <thead className="bg-[#FEFAFA] border-b border-[#E1E1E1]">
            <tr>
              <th className="px-4 py-[24px] text-left font-semibold text-gray-700">
                Full Name
              </th>
              <th className="px-4 py-[24px] text-left font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-[24px] text-left font-semibold text-gray-700">
                Phone Number
              </th>
              <th className="px-4 py-[24px] text-left font-semibold text-gray-700">
                Location
              </th>
              <th className="px-4 py-[24px] text-left font-semibold text-gray-700">
                Date
              </th>
              <th className="px-4 py-[24px] text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-[24px] text-left font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((request) => (
                <tr
                  key={request._id}
                  className=" hover:bg-gray-50  border-b border-[#E1E1E1] "
                >
                  <td className="p-[24px] text-gray-900">{request.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{request.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {request.phoneNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {request.location}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`capitalize font-semibold ${getStatusColor(
                        request.status,
                      )}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewClick(request)}
                      className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No listing requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Desktop pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E1E1E1] bg-white">
          <p className="text-[13px] text-[#555]">
            Showing {paginated.length} of {sortedRequests.length}
          </p>
          <div className="flex items-center gap-1 text-[13px] text-[#555]">
            <span className="mr-2">Page {page} of {totalPages}</span>
            <PaginationBtn onClick={() => setPage(1)} disabled={page === 1}>«</PaginationBtn>
            <PaginationBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</PaginationBtn>
            <PaginationBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</PaginationBtn>
            <PaginationBtn onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</PaginationBtn>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {paginated.length > 0 ? (
          paginated.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-xl p-4 border border-[#E6E3E3] shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {request.fullName}
                  </p>
                  <p className="text-sm text-gray-600">{request.email}</p>
                </div>
                <span
                  className={`text-sm font-semibold capitalize ${getStatusColor(
                    request.status,
                  )}`}
                >
                  {request.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3 space-y-1">
                <p>
                  <strong>Phone:</strong> {request.phoneNumber}
                </p>
                <p>
                  <strong>Location:</strong> {request.location}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(request.createdAt)}
                </p>
              </div>
              <button
                onClick={() => handleViewClick(request)}
                className="w-full bg-[#1C1915] hover:bg-[#3A332C] text-white font-semibold py-2 rounded-md transition"
              >
                View
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            No listing requests found
          </p>
        )}

        {/* Mobile pagination */}
        {sortedRequests.length > 0 && (
          <div className="mt-4 flex items-center justify-between pt-2 text-[13px] text-[#555]">
            <span>Showing {paginated.length} of {sortedRequests.length}</span>
            <div className="flex items-center gap-1">
              <PaginationBtn onClick={() => setPage(1)} disabled={page === 1}>«</PaginationBtn>
              <PaginationBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</PaginationBtn>
              <span className="px-2">Page {page}/{totalPages}</span>
              <PaginationBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</PaginationBtn>
              <PaginationBtn onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</PaginationBtn>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <ViewListingRequestModal
          request={selectedRequest}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedRequest(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

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

export default ListingRequestsTable;
