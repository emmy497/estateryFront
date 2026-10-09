import { X } from "lucide-react";
import api from "../api/api";

interface ListingRequest {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

interface Props {
  request: ListingRequest;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (updatedRequest: ListingRequest) => void;
}

const ViewListingRequestModal = ({
  request,
  isOpen,
  onClose,
  onStatusUpdate,
}: Props) => {
  if (!isOpen) return null;

  const updateStatus = async (status: "accepted" | "declined") => {
    try {
      const res = await api.patch(
        `/listing-requests/${request._id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      onStatusUpdate(res.data.listingRequest);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusStyle = () => {
    switch (request.status) {
      case "pending":
        return "bg-orange-100 text-orange-600";
      case "accepted":
        return "bg-green-100 text-green-600";
      case "declined":
        return "bg-red-100 text-red-600";
      default:
        return "";
    }
  };

  return (
    <div className="animate-backdrop-in fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="animate-modal-in bg-white w-full max-w-md rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#F0F0F0]">
          <h2 className="text-lg font-semibold text-[#111111]">Listing Request Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 text-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-400 mb-1">Full Name</p>
              <p className="font-medium text-[#111111]">{request.fullName}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 mb-1">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle()}`}>
                {request.status}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-gray-400 mb-1">Email</p>
              <p className="font-medium text-[#111111]">{request.email}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 mb-1">Phone Number</p>
              <p className="font-medium text-[#111111]">{request.phoneNumber}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-400 mb-1">Location</p>
            <p className="font-medium text-[#111111]">{request.location}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-4 border-t border-[#F0F0F0] flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-[#D1D5DB] text-[#374151] rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {request.status === "pending" && (
            <>
              <button
                onClick={() => updateStatus("declined")}
                className="px-5 py-2.5 border border-red-400 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer"
              >
                Decline
              </button>
              <button
                onClick={() => updateStatus("accepted")}
                className="px-5 py-2.5 bg-[#1C1915] text-white rounded-xl text-sm font-medium hover:bg-[#3A332C] transition-colors cursor-pointer"
              >
                Accept
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewListingRequestModal;
