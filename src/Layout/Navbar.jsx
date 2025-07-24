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
  Sun,
  Moon,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Sidebar } from "./Sidebar"; // Assuming Sidebar is in the same layout folder

export function Navbar({
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
}) {
  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile menu trigger */}
        <div className="flex items-center space-x-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-300 hover:text-white rounded-md"
              >
                {" "}
                {/* Added rounded-md */}
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-80 bg-slate-900 border-white/10"
            >
              {/* Sidebar in mobile view, passing activeTab and setActiveTab */}
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </SheetContent>
          </Sheet>

          {/* Search Input */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 pr-4 w-80 bg-white/5 border-white/20 focus:border-[#3EB489] text-white placeholder-gray-400 rounded-md" // Added rounded-md
            />
          </div>
        </div>

        {/* Right side - Quick Actions, Notifications, Theme Toggle, User Menu */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white rounded-md"
          >
            {" "}
            {/* Added rounded-md */}
            <Plus className="w-5 h-5" />
          </Button>

          {/* Notifications Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white relative rounded-md"
          >
            {" "}
            {/* Added rounded-md */}
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </Button>

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white rounded-md" // Added rounded-md
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 border-2 border-[#3EB489]/30">
                  <AvatarImage
                    src="https://placehold.co/40x40/3EB489/ffffff?text=AC"
                    alt="User"
                  />{" "}
                  {/* Placeholder image for Avatar */}
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
              {" "}
              {/* Added rounded-lg */}
              <DropdownMenuLabel className="text-white">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Animish Chopade</p>
                  <p className="text-xs text-gray-400">animish@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10 rounded-md">
                {" "}
                {/* Added rounded-md */}
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10 rounded-md">
                {" "}
                {/* Added rounded-md */}
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              {/* <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10 rounded-md">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem> */}
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md">
                {" "}
                {/* Added rounded-md */}
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
