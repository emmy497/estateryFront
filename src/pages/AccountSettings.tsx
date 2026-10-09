import { useContext, useEffect, useState } from "react";
import { Bell, Lock, Trash2, User } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/authContext";
import ProfileSection from "../components/account/ProfileSection";
import SecuritySection from "../components/account/SecuritySection";
import DangerZone from "../components/account/DangerZone";
import SectionCard from "../components/account/SectionCard";

const SECTIONS = [
  { id: "profile", label: "Profile", Icon: User },
  { id: "security", label: "Password", Icon: Lock },
  { id: "notifications", label: "Notifications", Icon: Bell },
  { id: "delete", label: "Delete account", Icon: Trash2 },
] as const;

// Highlights the section currently in view in the side menu
const useActiveSection = () => {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // a section counts as "current" once it reaches the upper part of the screen
      { rootMargin: "-20% 0px -60% 0px" },
    );

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return active;
};

const AccountSettings = () => {
  const { user } = useContext(AuthContext);
  const active = useActiveSection();

  return (
    <>
      <Navbar />

      <main className="bg-[#FAFAF9] text-[#111418]">
        <div className="mx-auto max-w-[1120px] px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-16">
          <header>
            <h1 className="text-[30px] font-medium tracking-[-0.02em] sm:text-[36px]">
              Account settings
            </h1>
            <p className="mt-2 text-[15px] text-[#6B6F76]">
              Manage your profile, password and account.
            </p>
          </header>

          <div className="mt-10 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
            <nav aria-label="Settings sections" className="hidden lg:block">
              <ul className="sticky top-6 space-y-1">
                {SECTIONS.map(({ id, label, Icon }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      aria-current={active === id ? "true" : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors ${
                        active === id
                          ? "bg-white text-[#111418] shadow-[0_1px_2px_rgba(17,20,24,0.06)] ring-1 ring-[#ECE8E3]"
                          : "text-[#6B6F76] hover:text-[#111418]"
                      } ${id === "delete" ? "hover:text-[#B42318]" : ""}`}
                    >
                      <Icon size={17} />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-6">
              <ProfileSection />
              <SecuritySection />

              <SectionCard
                id="notifications"
                title="Notifications"
                description="How we keep you up to date."
              >
                <div className="flex items-start justify-between gap-4 rounded-xl border border-[#ECE8E3] p-4">
                  <div>
                    <p className="text-[15px] font-medium">Email updates</p>
                    <p className="mt-1 text-[14px] leading-[1.6] text-[#6B6F76]">
                      Tour confirmations, listing reviews and security alerts are sent to{" "}
                      <span className="text-[#111418]">{user?.email}</span>.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#ECFDF3] px-3 py-1 text-[12px] font-medium text-[#067647]">
                    On
                  </span>
                </div>
              </SectionCard>

              <DangerZone />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AccountSettings;
