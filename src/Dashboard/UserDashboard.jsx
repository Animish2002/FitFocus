// app/dashboard/page.jsx (or whatever your main page component is called)
"use client";

import React, { useState } from "react";
import { Sidebar } from "@/Layout/Sidebar";
import { Navbar } from "@/Layout/Navbar";
import { DashboardContent } from "@/Dashboard/DashboardContent";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // You might want to manage this via a context or a global state for a full app

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-80 flex-shrink-0">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            activeTab={activeTab} // Passed for the mobile sidebar navigation
            setActiveTab={setActiveTab} // Passed for the mobile sidebar navigation
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="md:p-8 p-3">
              <DashboardContent />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
