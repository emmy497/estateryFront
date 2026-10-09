import { useEffect, useState } from "react";
import api from "../api/api";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import { isPastSlot, minTimeFor, todayISO } from "../utils/tourDate";

interface TourRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  property: {
    _id: string;
    title: string;
  } | null;
  tourType: "in-person" | "virtual";
  date: string;
  time: string;
  status: "pending" | "accepted" | "declined" | "rescheduled";
  message: string;
}

interface TourRequestsTableProps {
  searchQuery?: string;
  tourType?: string;
  statusFilter?: string;
  sortBy?: string;
}

const formatDateTime = (date: string, time: string) => {
  const dateTime = new Date(`${date}T${time}`);

  const dateStr = dateTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const timeStr = dateTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${dateStr} - ${timeStr}`;
};

const getStatusBadgeClass = (status: TourRequest["status"]) => {
  switch (status) {
    case "pending":
      return "bg-[#FFF7E9]";

    case "accepted":
      return "bg-[#DCFCE7]";

    case "declined":
      return "bg-[#FFEDED]";

    case "rescheduled":
      return "bg-[#F7F5F2]";

    default:
      return "bg-gray-100";
  }
};

const getStatusTextClass = (status: TourRequest["status"]) => {
  switch (status) {
    case "pending":
      return "text-[#FF9F10]";

    case "accepted":
      return "text-[#048120]";

    case "declined":
      return "text-[#E60E0E]";

    case "rescheduled":
      return "text-[#005BC4]";

    default:
      return "text-gray-600";
  }
};

const TourRequestsTable = ({
  searchQuery = "",
  tourType = "all",
  statusFilter = "all",
  sortBy = "newest",
}: TourRequestsTableProps) => {
  const [requests, setRequests] = useState<TourRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<TourRequest | null>(
    null,
  );
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ date: "", time: "" });
  const [rescheduling, setRescheduling] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

  const fetchRequests = async () => {
    try {
      const res = await api.get("/tours");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/tours/${id}`, { status });
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReschedule = async () => {
    if (!selectedRequest) return;
    if (!rescheduleData.date || !rescheduleData.time) {
      toast.error("Please choose a new date and time");
      return;
    }
    if (isPastSlot(rescheduleData.date, rescheduleData.time)) {
      toast.error("Please choose a date and time that hasn't passed yet");
      return;
    }
    try {
      setRescheduling(true);
      await api.put(`/tours/${selectedRequest._id}`, {
        status: "rescheduled",
        date: rescheduleData.date,
        time: rescheduleData.time,
      });
      setShowReschedule(false);
      setRescheduleData({ date: "", time: "" });
      setSelectedRequest(null);
      fetchRequests();
      toast.success("Tour rescheduled and email notification sent.");
    } catch (err) {
      console.error(err);
      const message = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      toast.error(message || "Failed to reschedule tour");
    } finally {
      setRescheduling(false);
    }
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredRequests = requests
    .filter((req) =>
      statusFilter !== "all" ? req.status === statusFilter : true,
    )
    .filter((req) => (tourType !== "all" ? req.tourType === tourType : true))
    .filter((req) => {
      if (!normalizedSearch) return true;

      const searchable = [req.name, req.email, req.phone, req.property?.title]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedSearch);
    })
    .sort((a, b) => {
      const aDate = Date.parse(a.date) || 0;
      const bDate = Date.parse(b.date) || 0;

      return sortBy === "oldest" ? aDate - bDate : bDate - aDate;
    });

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));

  const pagedRequests = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, tourType, statusFilter, sortBy]);

  if (loading) return <Spinner />;

  return (
    <div className="w-full">
      {filteredRequests.length === 0 && (
        <p className="text-gray-500 text-sm">No matching requests</p>
      )}

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E1E1E1]">
        <table className="w-full bg-white text-sm border-collapse">
          <thead className="bg-[#FEFAFA] border-b border-[#E1E1E1]">
            <tr>
              <th className="px-4 py-[24px] text-left font-semibold text-gray-700">Full Name</th>
              <th className="px-4 py-[24px] text-left font-semibold text-gray-700">Property</th>
              <th className="px-4 py-[24px] text-left font-semibold text-gray-700">Tour Type</th>
              <th className="px-4 py-[24px] text-left font-semibold text-gray-700">Date & Time</th>
              <th className="px-4 py-[24px] text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-[24px] text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedRequests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50 border-b border-[#E1E1E1]">
                <td className="p-[24px] text-gray-900">{req.name}</td>
                <td className="px-4 py-3 text-gray-600">{req.property?.title || "Property not found"}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{req.tourType}</td>
                <td className="px-4 py-3 text-gray-600">{formatDateTime(req.date, req.time)}</td>
                <td className="px-4 py-3">
                  <span className={`capitalize font-semibold py-1 px-3 rounded-xl ${getStatusBadgeClass(req.status)} ${getStatusTextClass(req.status)}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-4">
        {pagedRequests.map((req) => (
          <div
            key={req._id}
            className="bg-white border border-[#E6E3E3] rounded-xl p-4 shadow-sm"
          >
            <p>
              <strong>Name:</strong> {req.name}
            </p>

            <p>
              <strong>Property:</strong>{" "}
              {req.property?.title || "Property not found"}
            </p>

            <p>
              <strong>Type:</strong> {req.tourType}
            </p>

            <p>
              <strong>Date:</strong> {formatDateTime(req.date, req.time)}
            </p>

            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(
                  req.status,
                )} ${getStatusTextClass(req.status)}`}
              >
                {req.status}
              </span>
            </div>

            <button
              onClick={() => setSelectedRequest(req)}
              className="mt-3 text-[#8B6B4E] underline text-sm"
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* Desktop pagination */}
      <div className="hidden md:flex items-center justify-between px-6 py-4 border-t border-[#E1E1E1] bg-white">
        <p className="text-[13px] text-[#555]">
          Showing {pagedRequests.length} of {filteredRequests.length}
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
      {filteredRequests.length > 0 && (
        <div className="md:hidden mt-4 flex items-center justify-between pt-2 text-[13px] text-[#555]">
          <span>Showing {pagedRequests.length} of {filteredRequests.length}</span>
          <div className="flex items-center gap-1">
            <PaginationBtn onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</PaginationBtn>
            <PaginationBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</PaginationBtn>
            <span className="px-2">Page {currentPage}/{totalPages}</span>
            <PaginationBtn onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</PaginationBtn>
            <PaginationBtn onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</PaginationBtn>
          </div>
        </div>
      )}

      {/* MODAL */}
      {selectedRequest && !showReschedule && (
        <div className="animate-backdrop-in fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="animate-modal-in w-full max-w-[500px] bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-8 pb-6 border-b border-[#E5E5E5]">
              <h2 className="text-[20px] leading-[30px] font-semibold text-[#111111] max-w-[300px]">
                {selectedRequest.name} –{" "}
                {selectedRequest.property?.title || "Property not found"}
              </h2>

              <button
                onClick={() => setSelectedRequest(null)}
                className="text-[#777777] text-2xl leading-none cursor-pointer hover:text-black transition"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-7">
              <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                <div>
                  <p className="text-[14px] text-[#8B8B8B] mb-2">Tour Type</p>
                  <p className="text-[18px] font-medium text-[#1A1A1A]">
                    {selectedRequest.tourType.charAt(0).toUpperCase() +
                      selectedRequest.tourType.slice(1)}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] text-[#8B8B8B] mb-2">Status</p>

                  <span
                    className={`inline-flex items-center px-4 py-1.5 rounded-full ${getStatusTextClass(selectedRequest.status)} ${getStatusBadgeClass(selectedRequest.status)} text-[14px] font-medium`}
                  >
                    {selectedRequest.status?.charAt(0).toUpperCase() +
                      selectedRequest.status?.slice(1)}
                  </span>
                </div>

                <div>
                  <p className="text-[14px] text-[#8B8B8B] mb-2">Date</p>
                  <p className="text-[18px] font-medium text-[#1A1A1A]">
                    {selectedRequest.date}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] text-[#8B8B8B] mb-2">Time</p>
                  <p className="text-[18px] font-medium text-[#1A1A1A]">
                    {selectedRequest.time}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="mt-8">
                <p className="text-[14px] text-[#8B8B8B] mb-2">User Email</p>
                <p className="text-[18px] font-medium text-[#1A1A1A] break-all">
                  {selectedRequest.email}
                </p>
              </div>

              {/* Message */}
              <div className="mt-8">
                <p className="text-[14px] text-[#8B8B8B] mb-3">
                  Message from User
                </p>

                <div className="border border-[#D9D9D9] rounded-xl px-4 py-4 bg-[#FAFAFA] text-[16px] text-[#333333]">
                  {selectedRequest.message}
                </div>
              </div>
            </div>

            {/* Footer */}
            {selectedRequest.status !== "declined" && (
              <div className="border-t border-[#E5E5E5] px-6 py-8 flex items-center gap-3">
                <button
                  onClick={() => {
                    setRescheduleData({
                      date: selectedRequest.date,
                      time: selectedRequest.time,
                    });
                    setShowReschedule(true);
                  }}
                  className="h-[44px] px-5 border border-[#AFAFAF] rounded-xl text-[#707070] font-medium flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                  Reschedule
                </button>

                {selectedRequest.status === "pending" && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateStatus(selectedRequest._id, "declined")}
                      className="h-[44px] px-7 border border-[#FF3B30] rounded-xl text-[#FF3B30] font-medium hover:bg-red-50 transition cursor-pointer"
                    >
                      Decline
                    </button>

                    <button
                      onClick={() => updateStatus(selectedRequest._id, "accepted")}
                      className="h-[44px] px-7 bg-[#1C1915] rounded-xl text-white font-medium hover:opacity-90 transition shadow-sm cursor-pointer"
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {showReschedule && selectedRequest && (
        <div className="animate-backdrop-in fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]">
          <div className="animate-modal-in w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-7 pb-5 border-b border-[#E5E5E5]">
              <h2 className="text-[18px] font-semibold text-[#111111]">
                Reschedule Tour
              </h2>
              <button
                onClick={() => {
                  setShowReschedule(false);
                  setRescheduleData({ date: "", time: "" });
                }}
                className="text-[#777777] text-2xl leading-none hover:text-black transition cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 flex flex-col gap-4">
              <p className="text-[14px] text-[#8B8B8B]">
                Pick a new date and time for{" "}
                <span className="font-medium text-[#111]">
                  {selectedRequest.name}
                </span>
                's tour of{" "}
                <span className="font-medium text-[#111]">
                  {selectedRequest.property?.title || "this property"}
                </span>
                .
              </p>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#555]">New Date</label>
                <input
                  type="date"
                  min={todayISO()}
                  value={rescheduleData.date}
                  onChange={(e) =>
                    setRescheduleData((d) => ({ ...d, date: e.target.value }))
                  }
                  className="border border-[#D9D9D9] rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#8B6B4E]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#555]">New Time</label>
                <input
                  type="time"
                  min={minTimeFor(rescheduleData.date)}
                  value={rescheduleData.time}
                  onChange={(e) =>
                    setRescheduleData((d) => ({ ...d, time: e.target.value }))
                  }
                  className="border border-[#D9D9D9] rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#8B6B4E]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-7 flex gap-3">
              <button
                onClick={() => {
                  setShowReschedule(false);
                  setRescheduleData({ date: "", time: "" });
                }}
                className="flex-1 h-[44px] border border-[#AFAFAF] rounded-xl text-[#707070] font-medium hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                disabled={rescheduling || !rescheduleData.date || !rescheduleData.time}
                className="flex-1 h-[44px] bg-[#1C1915] rounded-xl text-white font-medium hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
              >
                {rescheduling ? "Saving..." : "Confirm Reschedule"}
              </button>
            </div>
          </div>
        </div>
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

export default TourRequestsTable;
