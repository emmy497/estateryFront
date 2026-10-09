import { useContext, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { AuthContext } from "../context/authContext";
import Logo from "./Logo";
import ListingRequestModal from "./ListingRequestModal";
import LogoutModal from "./LogoutModal";

interface NavbarProps {
  // "overlay" floats transparently over a hero image; "solid" is the default page header
  variant?: "overlay" | "solid";
}

// Closes a popover on outside click or Escape
const useDismiss = (open: boolean, close: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return ref;
};

const menuLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-[10px] px-3 py-2.5 text-[15px] transition-colors ${
    isActive
      ? "bg-[#F5F0EA] text-[#111418]"
      : "text-[#4A4D55] hover:bg-[#F7F5F2] hover:text-[#111418]"
  }`;

const Navbar = ({ variant = "solid" }: NavbarProps) => {
  const { user, logout } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const closeProfile = () => setProfileOpen(false);
  const menuRef = useDismiss(menuOpen, closeMenu);
  const profileRef = useDismiss(profileOpen, closeProfile);

  // close a popover once one of its links is followed
  const closeOnLinkClick = (close: () => void) => (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) close();
  };

  const isOverlay = variant === "overlay";
  const isAdmin = user?.role === "admin";
  const firstName = user?.fullName?.split(" ")[0] || "User";

  const topLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-[15px] transition-opacity ${
      isOverlay
        ? `text-white ${isActive ? "opacity-100" : "opacity-90 hover:opacity-100"}`
        : `${isActive ? "text-[#111418]" : "text-[#4A4D55] hover:text-[#111418]"}`
    }`;

  return (
    <header
      className={
        isOverlay
          ? "absolute inset-x-0 top-0 z-30 text-white"
          : "relative z-30 bg-white text-[#111418] border-b border-[#ECE8E3]"
      }
    >
      <nav className="relative flex items-center justify-between h-[76px] px-4 sm:px-6 lg:px-10">
        {/* Menu */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className={`flex items-center gap-2 h-9 pl-3.5 pr-4 rounded-full bg-white text-[#111418] text-[15px] transition-shadow ${
              isOverlay ? "shadow-sm hover:shadow-md" : "border border-[#E2DDD6] hover:border-[#C9C1B7]"
            }`}
          >
            {menuOpen ? <X size={16} strokeWidth={2} /> : <Menu size={16} strokeWidth={2} />}
            Menu
          </button>

          {menuOpen && (
            <div
              id="site-menu"
              onClick={closeOnLinkClick(closeMenu)}
              className="animate-dropdown-in absolute left-0 top-full mt-3 w-[280px] rounded-[16px] border border-[#ECE8E3] bg-white p-2 text-[#111418] shadow-[0_18px_40px_-12px_rgba(17,20,24,0.25)]"
            >
              <NavLink to="/" end className={menuLinkClass}>Home</NavLink>
              <NavLink to="/properties" className={menuLinkClass}>Properties</NavLink>
              <NavLink to="/about" className={menuLinkClass}>About Us</NavLink>
              <NavLink to="/contact" className={menuLinkClass}>Contact Us</NavLink>

              <div className="my-2 h-px bg-[#ECE8E3]" />

              {user ? (
                <>
                  <NavLink to="/saved-properties" className={menuLinkClass}>Saved Properties</NavLink>
                  <button
                    type="button"
                    onClick={() => { closeMenu(); setShowListingModal(true); }}
                    className={menuLinkClass({ isActive: false }) + " w-full text-left"}
                  >
                    List Property
                  </button>
                  <NavLink to="/account-settings" className={menuLinkClass}>Account Settings</NavLink>
                  {isAdmin && (
                    <NavLink to="/dashboard" className={menuLinkClass}>Dashboard</NavLink>
                  )}
                  <button
                    type="button"
                    onClick={() => { closeMenu(); setShowLogoutModal(true); }}
                    className="block w-full rounded-[10px] px-3 py-2.5 text-left text-[15px] text-[#B42318] hover:bg-[#FEF3F2]"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 p-1">
                  <NavLink
                    to="/login"
                    className="flex-1 rounded-full border border-[#E2DDD6] py-2.5 text-center text-[15px] hover:border-[#C9C1B7]"
                  >
                    Log in
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="flex-1 rounded-full bg-[#1C1915] py-2.5 text-center text-[15px] text-white hover:bg-[#3A332C]"
                  >
                    Sign up
                  </NavLink>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logo, centred */}
        <NavLink
          to="/"
          aria-label="Estatery home"
          className="absolute left-1/2 -translate-x-1/2"
        >
          <Logo className="text-[24px] sm:text-[26px]" />
        </NavLink>

        {/* Right links */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-7">
            <NavLink to="/contact" className={topLinkClass}>Contact Us</NavLink>
            <NavLink to="/about" className={topLinkClass}>About Us</NavLink>
            {!user && (
              <NavLink to="/login" className={topLinkClass}>Log in</NavLink>
            )}
          </div>

          {user && (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                className="flex items-center gap-2"
              >
                <img
                  className={`w-9 h-9 rounded-full object-cover ${isOverlay ? "ring-2 ring-white/70" : ""}`}
                  src={user.avatar || "/images/UserProfile.png"}
                  alt=""
                />
                <span className="hidden lg:inline text-[15px]">{firstName}</span>
                <ChevronDown size={16} className="hidden lg:block" />
              </button>

              {profileOpen && (
                <div
                  onClick={closeOnLinkClick(closeProfile)}
                  className="animate-dropdown-in absolute right-0 top-full mt-3 w-[220px] rounded-[16px] border border-[#ECE8E3] bg-white p-2 text-[#111418] shadow-[0_18px_40px_-12px_rgba(17,20,24,0.25)]">
                  <p className="px-3 pt-2 pb-3 text-[13px] text-[#6B6F76] truncate">{user.email}</p>
                  <NavLink to="/account-settings" className={menuLinkClass}>Account Settings</NavLink>
                  {isAdmin && (
                    <NavLink to="/dashboard" className={menuLinkClass}>Dashboard</NavLink>
                  )}
                  <button
                    type="button"
                    onClick={() => { closeProfile(); setShowLogoutModal(true); }}
                    className="block w-full rounded-[10px] px-3 py-2.5 text-left text-[15px] text-[#B42318] hover:bg-[#FEF3F2]"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <ListingRequestModal
        isOpen={showListingModal}
        onClose={() => setShowListingModal(false)}
      />

      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => { logout(); setShowLogoutModal(false); }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
