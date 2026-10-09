import { NavLink } from "react-router-dom";
import { X, CheckCircle } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const TourRequestModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="animate-backdrop-in fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="animate-modal-in bg-white w-full max-w-sm rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#F0F0F0]">
          <h2 className="text-lg font-semibold text-[#111111]">Tour Request Sent</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your request has been submitted successfully. You'll receive an email update soon.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 border-t border-[#F0F0F0] pt-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-[#D1D5DB] text-[#374151] rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Close
          </button>
          <NavLink to="/properties">
            <button className="px-5 py-2.5 bg-[#1C1915] text-white rounded-xl text-sm font-medium hover:bg-[#3A332C] transition-colors cursor-pointer">
              View Properties
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default TourRequestModal;
