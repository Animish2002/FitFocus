// components/layout/DashboardLayout.jsx
"use client"; // This directive is typically used in Next.js App Router, ensure it's compatible with your setup.

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom"; // Import Outlet for nested routes

// DashboardLayout component that provides the common UI for dashboard pages
export function DashboardLayout() {
  // State to control mobile sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // State to control dark mode (though not fully implemented for theme switching in this example)
  const [darkMode, setDarkMode] = useState(true);

  // Function to close the mobile sidebar when a navigation link is clicked
  const handleNavLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    // Main container for the layout, setting the overall background and text color
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-inter">
      {/* Flex container for sidebar and main content */}
      <div className="flex h-screen">
        {/* Desktop Sidebar - hidden on small screens */}
        <div className="hidden lg:flex w-80 flex-shrink-0">
          {/* Sidebar component, passing the click handler for mobile view */}
          <Sidebar onNavLinkClick={handleNavLinkClick} />
        </div>

        {/* Main Content Area - takes remaining space, handles overflow */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar component, handling mobile sidebar, search, notifications, and user menu */}
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          {/* Page Content Area - scrollable for individual page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-8">
              {/* Outlet will render the matched nested route component here */}
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
