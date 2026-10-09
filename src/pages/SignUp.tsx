import { type ChangeEvent, type FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import ImageWrapper from "../components/ImageWrapper";
import Logo from "../components/Logo";
import { toast } from "react-toastify";
import api from "../api/api";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { fullName, email, password, confirmPassword } = formData;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    let hasError = false;

    if (!fullName.trim()) {
      setErrors((prev) => ({
        ...prev,
        fullName: "Field should not be left empty",
      }));
      hasError = true;
    }

    if (!email.trim()) {
      setErrors((prev) => ({
        ...prev,
        email: "Field should not be left empty",
      }));
      hasError = true;
    }

    if (!password.trim()) {
      setErrors((prev) => ({
        ...prev,
        password: "Field should not be left empty",
      }));
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Field should not be left empty",
      }));
      hasError = true;
    }

    if (hasError) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", {
        fullName,
        email,
        password,
      });

      toast.success("Account created! Check your email for the verification code.");
      navigate("/verify-otp", { state: { email, password, flow: "signup" } });
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Sign up failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageWrapper>
      <div className="w-full lg:w-1/2 py-10 px-6 md:px-10">
        {/* mobile logo */}
        <div className="lg:hidden flex justify-center mb-8">
          <NavLink to="/">
            <Logo className="text-[26px] text-[#111418]" />
          </NavLink>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2 ">Create an account</h1>
          <p className="text-sm text-[#4D5461]">
            Sign up to get started today.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1.5">
              Full Name <span className="text-[#A40003]">*</span>
            </label>
            <input
              value={fullName}
              onChange={handleChange}
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              className="rounded-lg border w-full h-[52px] py-4 px-3 text-sm placeholder:text-gray-400 bg-white border-[#D9D9D9] focus:outline-none focus:border-[#8B6B4E]"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1.5">
              Email <span className="text-[#A40003]">*</span>
            </label>
            <input
              value={email}
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="Enter your email"
              className="rounded-lg border w-full h-[52px] py-4 px-3 text-sm placeholder:text-gray-400 bg-white border-[#D9D9D9] focus:outline-none focus:border-[#8B6B4E]"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1.5">
              Password <span className="text-[#A40003]">*</span>
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={handleChange}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="rounded-lg border w-full h-[52px] py-4 px-3 pr-12 text-sm placeholder:text-gray-400 bg-white border-[#D9D9D9] focus:outline-none focus:border-[#8B6B4E]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1.5">
              Confirm Password <span className="text-[#A40003]">*</span>
            </label>
            <div className="relative">
              <input
                value={confirmPassword}
                onChange={handleChange}
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="rounded-lg border w-full h-[52px] py-4 px-3 pr-12 text-sm placeholder:text-gray-400 bg-white border-[#D9D9D9] focus:outline-none focus:border-[#8B6B4E]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1C1915] w-full h-[52px] rounded-lg text-white text-sm font-semibold disabled:opacity-50 mb-4"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {/* Redirect */}
          <div className="text-center text-sm flex justify-center gap-1.5 flex-wrap">
            <span className="text-gray-500">Already have an account?</span>
            <NavLink
              to="/login"
              className="text-[#8B6B4E] font-semibold hover:underline"
            >
              Login
            </NavLink>
          </div>
        </form>
      </div>
    </ImageWrapper>
  );
};

export default SignUp;
