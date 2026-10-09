import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import ImageWrapper from "../components/ImageWrapper";
import api from "../api/api";

const Forgot = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP sent! Check your email.");
      navigate("/verify-otp", { state: { email } });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageWrapper>
      <div className="w-full lg:w-1/2 h-[398px] py-[39px] px-10 lg:px-0 flex flex-col justify-center">
        <div>
          <div>
            <NavLink to="/login">
              <button className="w-[73px] h-[35px] text-[#666666] flex items-center gap-2 mb-[24px]">
                <IoMdArrowBack />
                Back
              </button>
            </NavLink>
          </div>

          <h1 className="text-[30px]">Forgot Your Password?</h1>

          <p className="h-[21px] w-[327px] max-w-full text-[16px] text-[#4D5461] mt-[8px]">
            We will send a one-time code to your email.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-[24px] w-[453px] max-w-full"
        >
          <div>
            <h3 className="text-[#0C0C0C] text-[16px] h-[21px] font-medium w-full mb-[6px] mt-[35px]">
              Email <span className="text-red-500">*</span>
            </h3>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white w-[453px] max-w-full h-[52px] rounded-[8px] border border-[#D9D9D9] pl-[12px] py-[17px] text-[14px]"
              type="email"
              placeholder="Enter email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#1C1915] text-white w-[453px] max-w-full h-[52px] mt-[20px] rounded cursor-pointer disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <div className="w-[453px] max-w-full text-center mt-[24px]">
            <h3>
              Remember Your Password?{" "}
              <NavLink to="/login">
                <span className="text-[#8B6B4E] cursor-pointer">Sign In</span>
              </NavLink>
            </h3>
          </div>
        </form>
      </div>
    </ImageWrapper>
  );
};

export default Forgot;
