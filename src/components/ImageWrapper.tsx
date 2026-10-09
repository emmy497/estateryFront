import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";

interface ImageWrapperProps {
  children: ReactNode;
}

const ImageWrapper = ({ children }: ImageWrapperProps) => {
  return (
    <div className="w-full min-h-screen bg-white lg:bg-[#F7F5F2] flex justify-center items-center px-4">
      <div className="w-full max-w-6xl  lg:min-w-[1253px]  flex flex-col md:flex-row  ">
        {/* LEFT SIDE */}
        {children}

        {/* RIGHT SIDE IMAGE */}
        <div className="hidden lg:bg-[url('/images/home/hero-1200.webp')] bg-cover bg-position-[50%_85%] lg:block relative w-[50%] rounded-xl overflow-hidden h-[521px] my-auto">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(80,128,168,0.55)_0%,rgba(84,132,170,0)_45%,rgba(28,25,21,0.25)_100%)]"></div>
          <NavLink to="/" aria-label="Estatery home" className="absolute top-5 right-6 z-20 text-white">
            <Logo className="text-[24px]" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ImageWrapper;
