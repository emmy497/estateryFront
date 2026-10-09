import { type FormEvent, useContext, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import ImageWrapper from "../components/ImageWrapper";
import Logo from "../components/Logo";
import { toast } from "react-toastify";
import api from "../api/api";
import { AuthContext } from "../context/authContext";

const LoginR = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      if (token) {
        login({ token, user });
        toast.success("Logged in successfully");

        //  Redirect based on selected mode
        setTimeout(() => {
        if(user.role === "admin") {
          navigate("/dashboard");
        } else {

          navigate("/")
        }
        }, 1000);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 403) {
        toast.error("Please verify your email before logging in.");
        navigate("/verify-otp", { state: { email, flow: "signup" } });
      } else {
        toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageWrapper>
      <div className="w-full lg:w-1/2 py-10 px-6 md:px-10">
        {/* mobile logo */}
        <NavLink to="/" className="lg:hidden flex justify-center mb-8">
          <Logo className="text-[26px] text-[#111418]" />
        </NavLink>

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="font-semibold text-2xl mb-2 text-center lg:text-start">
            Welcome back
          </h1>
          <p className="text-sm text-[#4D5461] text-center lg:text-start">
            Enter your details to sign in to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1.5">
              Email <span className="text-[#A40003]">*</span>
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full h-[52px] rounded-lg border px-3 py-4 bg-white border-[#D9D9D9] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#8B6B4E]"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-2">
            <label className="block text-sm font-semibold mb-1.5">
              Password <span className="text-[#A40003]">*</span>
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full h-[52px] rounded-lg border px-3 pr-12 py-4 bg-white border-[#D9D9D9] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#8B6B4E]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end mb-6">
            <NavLink to="/forgot-password" className="text-[#8B6B4E] text-sm font-medium hover:underline">
              Forgot password?
            </NavLink>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] rounded-lg py-3 px-4 bg-[#1C1915] text-white flex justify-center items-center mb-6 cursor-pointer disabled:opacity-50 text-sm font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* SIGNUP */}
          <div className="text-center text-sm flex justify-center gap-1.5 flex-wrap">
            <span className="text-gray-500">Don't have an account?</span>
            <NavLink to="/signup">
              <span className="text-[#8B6B4E] font-semibold cursor-pointer">Sign Up</span>
            </NavLink>
          </div>
        </form>
      </div>
    </ImageWrapper>
  );
};

export default LoginR;
