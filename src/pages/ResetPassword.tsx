import React, { useState, useContext, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import ImageWrapper from "../components/ImageWrapper";
import api from "../api/api";
import { AuthContext } from "../context/authContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  //  Get data from localStorage
  const storedData = JSON.parse(localStorage.getItem("resetData") || "{}");
  const email = storedData.email;
  const otp = storedData.otp;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  //  Redirect if data is missing
  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, otp, navigate]);

  // Prevent UI flash
  if (!email || !otp) {
    return <p className="text-center mt-10">Redirecting...</p>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      const { token, user } = response.data;

      //  Clear reset data after success
      localStorage.removeItem("resetData");

      login({ token, user });
      toast.success("Password reset successful!");

      navigate("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to reset password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageWrapper>
      <div className="w-full lg:w-1/2 py-[39px] px-10 lg:px-0 flex flex-col justify-center">
        <div>
          <NavLink to="/verify-otp">
            <button className="w-[73px] h-[35px] text-[#666666] flex items-center gap-2 mb-[24px]">
              <IoMdArrowBack />
              Back
            </button>
          </NavLink>

          <h1 className="text-[30px]">Set New Password</h1>
          <p className="text-[16px] text-[#4D5461] mt-[8px]">
            Create a strong password for your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-[32px] w-[453px] max-w-full"
        >
          {/* New Password */}
          <div className="mb-4">
            <h3 className="text-[#0C0C0C] text-[16px] font-medium mb-[6px]">
              New Password <span className="text-red-500">*</span>
            </h3>
            <div className="relative">
              <input
                className="bg-white w-full h-[52px] rounded-[8px] border border-[#D9D9D9] pl-[12px] pr-12 py-[17px] text-[14px] focus:outline-none focus:border-[#8B6B4E]"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <h3 className="text-[#0C0C0C] text-[16px] font-medium mb-[6px]">
              Confirm Password <span className="text-red-500">*</span>
            </h3>
            <div className="relative">
              <input
                className="bg-white w-full h-[52px] rounded-[8px] border border-[#D9D9D9] pl-[12px] pr-12 py-[17px] text-[14px] focus:outline-none focus:border-[#8B6B4E]"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Strength hint */}
          {password.length > 0 && (
            <p
              className={`text-[13px] mb-4 ${
                password.length < 6 ? "text-red-500" : "text-green-600"
              }`}
            >
              {password.length < 6
                ? "Too short — minimum 6 characters"
                : "Looks good!"}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#1C1915] text-white w-full h-[52px] rounded cursor-pointer disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </ImageWrapper>
  );
};

export default ResetPassword;
