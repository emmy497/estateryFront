import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { toast } from "react-toastify";
import api from "../api/api";
import { AuthContext } from "../context/authContext";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const email = (location.state?.email as string) || "";
  const password = (location.state?.password as string) || "";
  const flow = (location.state?.flow as string) || "forgot-password";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(900);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  const handleResend = async () => {
    if (!email) { toast.error("Email not found. Please go back and try again."); return; }
    try {
      setResending(true);
      const endpoint = flow === "signup" ? "/auth/resend-otp" : "/auth/forgot-password";
      await api.post(endpoint, { email });
      setOtp(["", "", "", "", "", ""]);
      setSecondsLeft(900);
      inputsRef.current[0]?.focus();
      toast.success("A new code has been sent to your email");
    } catch {
      toast.error("Failed to resend code. Try again.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) { toast.error("Enter the complete 6-digit code"); return; }
    if (!email) { toast.error("Email not found. Please go back and try again."); return; }

    try {
      setLoading(true);

      if (flow === "signup") {
        await api.post("/auth/verify-email", { email, otp: finalOtp });
        const loginRes = await api.post("/auth/login", { email, password });
        const { token, user } = loginRes.data;
        login({ token, user });
        toast.success("Email verified! Welcome aboard.");
        navigate("/");
      } else {
        await api.post("/auth/verify-otp", { email, otp: finalOtp });
        localStorage.setItem("resetData", JSON.stringify({ email, otp: finalOtp }));
        toast.success("OTP verified successfully");
        navigate("/reset-password");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:bg-[#F7F5F2] flex flex-col">
      {/* Top-left logo */}
      <NavLink to="/" className="px-8 py-6">
        <Logo className="text-[24px] text-[#111418]" />
      </NavLink>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="lg:bg-white lg:rounded-2xl lg:shadow-lg w-full max-w-[575px] px-4 lg:px-8 py-6 lg:py-10">

          {/* Shield icon */}
          <div className="flex justify-center mb-6">
            <div className="w-[68px] h-[68px] rounded-full bg-[#1C1915] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-[22px] font-semibold text-center text-[#1A1A1A] mb-2">
            {flow === "signup" ? "Verify Your Email" : "OTP Verification"}
          </h1>
          <p className="text-center text-[14px] text-[#6B7280] mb-7">
            {flow === "signup"
              ? "We sent a verification code to your email. Enter it below to activate your account."
              : "Enter the 6-digit code sent to"}{" "}
            <span className="font-medium text-[#1A1A1A]">{email || "your email"}</span>
          </p>

          {/* OTP inputs */}
          <div className="flex justify-between gap-2 mb-5" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputsRef.current[index] = el; }}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="w-[52px] h-[52px] text-center text-[20px] font-bold border-2 border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#8B6B4E] transition-colors"
              />
            ))}
          </div>

          {/* Countdown */}
          <p className="text-center text-[13px] text-[#6B7280] mb-7">
            {secondsLeft > 0
              ? <>Code expires in <span className="font-semibold text-[#1A1A1A]">{formatTime(secondsLeft)}</span></>
              : <span className="text-red-500">Code expired. Please resend.</span>
            }
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleResend}
              disabled={resending}
              className="flex-1 h-[48px] border-2 border-[#8B6B4E] text-[#8B6B4E] rounded-lg font-medium text-[15px] hover:bg-[#F5F0EA] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {resending ? "Sending..." : "Resend Code"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || otp.join("").length !== 6}
              className="flex-1 h-[48px] bg-[#1C1915] text-white rounded-lg font-medium text-[15px] hover:bg-[#D1D5DB] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
