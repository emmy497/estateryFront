import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <Sidebar isOpen={open} closeSidebar={() => setOpen(false)} />

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <Topbar openSidebar={() => setOpen(true)} />

        {/* PAGE CONTENT */}
        <main className="p-4 flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
