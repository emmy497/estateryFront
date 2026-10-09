import { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { X, Check } from "lucide-react";
import Spinner from "./Spinner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ListingRequestModal = ({ isOpen, onClose }: Props) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/listing-requests", formData);
      toast.success("Listing request submitted successfully!");
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        location: "",
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error submitting listing request:", error);
      toast.error("Failed to submit listing request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  if (!isOpen) return null;

  if (showSuccessModal) {
    return (
      <div className="animate-backdrop-in fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
        <div className="animate-modal-in bg-white rounded-lg p-8 w-[90%] max-w-[400px] shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check size={32} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Request Received!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in listing your property. Our team will
            review your request and get back to you soon.
          </p>
          <button
            onClick={handleSuccessModalClose}
            className="px-6 py-2 bg-[#1C1915] text-white rounded-md hover:bg-[#3A332C] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-backdrop-in fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="animate-modal-in relative bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center z-10">
            <Spinner />
          </div>
        )}

        {/* Header */}
        <div className="px-8 pt-8 pb-5 border-b border-[#F0F0F0]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-[22px] font-semibold text-[#111111] mb-1">
                List Your Property
              </h2>
              <p className="text-[14px] text-[#969595] leading-snug">
                Share your contact details and our team will reach out
                <br className="hidden sm:block" /> to verify and help list your
                property.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#9CA3AF] hover:text-[#555] mt-1 ml-4 shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-[14px] font-medium text-[#111111] mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] placeholder-[#C0C0C0] focus:outline-none focus:border-[#8B6B4E]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[14px] font-medium text-[#111111] mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] placeholder-[#C0C0C0] focus:outline-none focus:border-[#8B6B4E]"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-[14px] font-medium text-[#111111] mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="Enter your phone"
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] placeholder-[#C0C0C0] focus:outline-none focus:border-[#8B6B4E]"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-[14px] font-medium text-[#111111] mb-2"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter your location"
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-[14px] placeholder-[#C0C0C0] focus:outline-none focus:border-[#8B6B4E]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 pt-2 border-t border-[#F0F0F0] flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-7 py-[11px] border border-[#D1D5DB] text-[#374151] rounded-xl text-[15px] font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-[11px] bg-[#1C1915] text-white rounded-xl text-[15px] font-medium hover:bg-[#3A332C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingRequestModal;
