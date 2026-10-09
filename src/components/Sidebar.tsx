import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import {
  Building2,
  Settings,
  X,
  Binoculars,
  LayoutDashboard,
  Inbox,
  Users2,
  LogOut,
} from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import LogoutModal from "./LogoutModal";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const { logout } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all";

  const activeClass = "bg-[#1C1915] text-white";
  const inactiveClass = "text-gray-600 hover:bg-gray-100";

  return (
    <>
      {/* ================= OVERLAY (mobile only) ================= */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:w-64 bg-white shadow-md z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* LOGO + CLOSE */}
        <div className="p-6 flex items-center justify-between">
          <NavLink to="/">
            <Logo className="text-[22px] text-[#111418]" />
          </NavLink>

          {/* Close button (mobile only) */}
          <button onClick={closeSidebar} className="lg:hidden">
            <X size={22} />
          </button>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink
            to="/my-properties"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Building2 size={20} />
            My Properties
          </NavLink>

          <NavLink
            to="/tour-requests"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Binoculars size={20} />
            Tour Requests
          </NavLink>

          <NavLink
            to="/listing-requests"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Inbox size={20} />
            Listing Requests
          </NavLink>


          <NavLink
            to="/user-management"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
        
            <Users2 size={20} />
           User Management
          </NavLink>

          <NavLink
            to="/account-settings"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Settings size={20} />
            Account Settings
          </NavLink>
        </nav>

        {/* Log Out */}
        <div className="p-4 pb-10 border-t border-gray-100">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>

      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => { logout(); closeSidebar(); setShowLogoutModal(false); }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
