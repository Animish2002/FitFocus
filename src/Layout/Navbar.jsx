// components/layout/Navbar.jsx
import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { Button } from "@/components/ui/button";
// No need for Input in this context, removing to keep it clean
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
  // Search, // Not used in provided code snippet
  Bell,
  Plus,
  Menu,
  User,
  Settings,
  HelpCircle, // Not used in provided code snippet
  LogOut,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Import Popover components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Ensure this path is correct

export function Navbar({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) {
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

  // State to manage notification permission status
  const [notificationPermission, setNotificationPermission] = useState(
    "default" // Initialize with 'default'
  );

  useEffect(() => {
    // Check notification permission when the component mounts
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleRequestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.warn("Browser does not support desktop notifications.");
      return;
    }

    const permissionResult = await Notification.requestPermission();
    setNotificationPermission(permissionResult); // Update state with the new permission

    if (permissionResult === "granted") {
      console.log("Notification permission granted!");
      // Here you would typically send a push subscription to your backend
      // Example: subscribeUserToPushNotifications();
    } else if (permissionResult === "denied") {
      console.log("Notification permission denied.");
      // You might want to show a more persistent message or direct them to browser settings
    } else {
      console.log("Notification permission dismissed.");
    }
  };

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

          {/* Notifications Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white relative rounded-md"
              >
                <Bell className="w-5 h-5" />
                {/* You can still show a red dot if you have unread notifications from your backend */}
                {/* For demonstration, we'll show it if permission is default to subtly hint */}
                {notificationPermission === "default" && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end" // Align to the right of the trigger
              className="w-64 p-4 bg-slate-800 border-white/20 rounded-lg text-white"
            >
              {notificationPermission === "default" && (
                <div className="space-y-3 text-center">
                  <Bell className="mx-auto h-6 w-6 text-gray-300" />
                  <p className="text-sm font-medium">Enable Notifications</p>
                  <p className="text-xs text-gray-400">
                    Get real-time updates and important alerts directly to your
                    desktop.
                  </p>
                  <Button
                    onClick={handleRequestNotificationPermission}
                    className="w-full bg-[#3EB489] hover:bg-[#2e9270] text-white"
                  >
                    Allow Notifications
                  </Button>
                </div>
              )}
              {notificationPermission === "granted" && (
                <div className="space-y-2 text-center">
                  <Bell className="mx-auto h-6 w-6 text-[#3EB489]" />
                  <p className="text-sm font-medium">Notifications Enabled</p>
                  <p className="text-xs text-gray-400">
                    You'll receive updates. You can manage settings{" "}
                    <Link
                      to="/dashboard/settings/notifications"
                      className="text-[#3EB489] hover:underline"
                    >
                      here
                    </Link>
                    .
                  </p>
                </div>
              )}
              {notificationPermission === "denied" && (
                <div className="space-y-2 text-center">
                  <Bell className="mx-auto h-6 w-6 text-red-400" />
                  <p className="text-sm font-medium text-red-400">
                    Notifications Blocked
                  </p>
                  <p className="text-xs text-gray-400">
                    Please enable notifications for this site in your browser
                    settings to receive alerts.
                  </p>
                  <Link
                    to="/dashboard/settings/notifications"
                    className="text-[#3EB489] hover:underline text-sm"
                  >
                    Go to Notification Settings
                  </Link>
                </div>
              )}
            </PopoverContent>
          </Popover>

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

              {/* Keep the Notification Settings link as a fallback for granular control */}
              <DropdownMenuItem
                className="text-gray-300 hover:text-white hover:bg-white/10 rounded-md"
                asChild
              >
                <Link to="/dashboard/settings/notifications">
                  <Settings className="mr-2 h-4 w-4" />
                  Notification Settings
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
