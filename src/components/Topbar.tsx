import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { AuthContext } from "../context/authContext";
import { useContext, useState } from "react";
import LogoutModal from "./LogoutModal";

interface TopbarProps {
  openSidebar: () => void;
}

const Topbar = ({ openSidebar }: TopbarProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard": return "Dashboard";
      case "/my-properties": return "My Properties";
      case "/tour-requests": return "Tour Requests";
      case "/listing-requests": return "Listing Requests";
      case "/user-management": return "User Management";
      default: return "";
    }
  };

  return (
    <>
      <header className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-6">
        {/* LEFT: Hamburger (mobile) + Page Title */}
        <div className="flex items-center gap-3">
          <button onClick={openSidebar} className="lg:hidden p-1 cursor-pointer">
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-semibold">{getTitle()}</h1>
        </div>

        {/* RIGHT: Bell + Avatar + Name + Email + Chevron */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <Bell size={20} className="text-gray-600" />
          </button>

          <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              className="rounded-full w-[38px] h-[38px] object-cover shrink-0"
              src={user?.avatar || "/images/UserProfile.png"}
              alt="user"
            />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-black leading-tight">{user?.fullName || "Admin"}</p>
              <p className="text-xs text-gray-500 leading-tight">{user?.email || ""}</p>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {profileOpen && (
            <div className="animate-dropdown-in absolute right-0 top-full z-10 mt-2 w-[220px] rounded-[16px] border border-[#E1E1E1] bg-white shadow-xl p-[20px]">
              <NavLink
                to="/account-settings"
                onClick={() => setProfileOpen(false)}
                className="block px-4 py-3 text-sm text-black hover:bg-[#F5F0EA] rounded-lg"
              >
                Account Settings
              </NavLink>
              <NavLink
                to="/dashboard"
                onClick={() => setProfileOpen(false)}
                className="block px-4 py-3 text-sm text-black hover:bg-[#F5F0EA] rounded-lg"
              >
                Dashboard
              </NavLink>
              <button
                type="button"
                onClick={() => { setProfileOpen(false); setShowLogoutModal(true); }}
                className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-[#FFF5F5] rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
          </div>
        </div>
      </header>

      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => { logout(); setShowLogoutModal(false); navigate("/"); }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
};

export default Topbar;
