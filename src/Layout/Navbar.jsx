// components/layout/Navbar.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Search,
  Bell,
  Plus,
  Menu,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Sidebar } from "./Sidebar"; // Assuming Sidebar is in the same layout folder
import { Link } from "react-router-dom"; // Import Link
import { useAuth } from "@/context/AuthContext";

export function Navbar({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) {
  // onNavLinkClick is passed to Sidebar for mobile view to close the sheet after navigation
  const handleNavLinkClick = () => {
    setSidebarOpen(false); // Close sidebar on navigation
  };

  const { logout: authLogout, user } = useAuth();
  const handleLogout = () => {
    authLogout();
    window.location.href = "/auth";
  };

  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      <div className="flex items-center justify-between h-19 px-6">
        {/* Mobile menu trigger */}
        <div className="flex items-center space-x-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-300 hover:text-white rounded-md"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-80 bg-slate-900 border-white/10"
            >
              {/* Sidebar in mobile view, passing the click handler */}
              <Sidebar onNavLinkClick={handleNavLinkClick} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Right side - Quick Actions, Notifications, Theme Toggle, User Menu */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white rounded-md"
          >
            <Plus className="w-5 h-5" />
          </Button>

          {/* Notifications Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white relative rounded-md"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </Button>

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 border-2 border-[#3EB489]/30">
                  <AvatarImage
                    src="https://placehold.co/40x40/3EB489/ffffff?text=AC"
                    alt="User"
                  />
                  <AvatarFallback className="bg-[#3EB489] text-white">
                    AC
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-slate-800 border-white/20 rounded-lg"
            >
              <DropdownMenuLabel className="text-white">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {userData?.email || "No email"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem
                className="text-gray-300 hover:text-white hover:bg-white/10 rounded-md"
                asChild
              >
                <Link to="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
