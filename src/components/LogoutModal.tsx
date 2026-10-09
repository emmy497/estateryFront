import { LogOut } from "lucide-react";

interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal = ({ onConfirm, onCancel }: LogoutModalProps) => {
  return (
    <div className="animate-backdrop-in fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="animate-modal-in bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
          <LogOut size={28} className="text-red-500" />
        </div>

        <h2 className="text-[20px] font-bold text-[#1C1915] mb-2">Confirm Log Out</h2>

        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Are you sure you want to Log out of your account?
        </p>

        <div className="flex items-center justify-center gap-6 w-full">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
          >
            Log Out
          </button>
          <button
            onClick={onCancel}
            className="flex-1 text-gray-400 hover:text-gray-600 font-semibold py-3 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
