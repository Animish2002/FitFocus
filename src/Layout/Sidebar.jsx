// components/layout/Sidebar.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, Home, Calendar, Dumbbell, BookOpen, Target, TrendingUp, Settings, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom"; // Import Link and useLocation

// Custom SVG for AI Assistant icon
const AIAssistantSVG = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" fill="#3EB489" fillOpacity="0.2" />
    <path
      d="M10 2c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-1 13c-2.8-.4-5-2.9-5-5.8 0-.4.1-.8.2-1.2L8 12v1c0 .6.4 1 1 1v1zm5.5-1.8c-.2-.5-.8-.9-1.5-.9h-1v-2c0-.3-.2-.5-.5-.5H7v-1h1c.3 0 .5-.2.5-.5V6h1c.6 0 1-.4 1-1v-.3c2.1.9 3.5 3 3.5 5.3 0 1.2-.5 2.3-1.5 3.2z"
      fill="#3EB489"
    />
  </svg>
);

// Navigation items configuration with their respective paths
const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, badge: null, path: "/dashboard" },
  { id: "schedule", label: "Today's Schedule", icon: Calendar, badge: "3", path: "/dashboard/schedule" },
  { id: "fitness", label: "Fitness Tracker", icon: Dumbbell, badge: null, path: "/dashboard/fitness" },
  { id: "study", label: "Study Progress", icon: BookOpen, badge: "2", path: "/dashboard/study" },
  { id: "goals", label: "Goals & Targets", icon: Target, badge: null, path: "/dashboard/goals" },

  { id: "ask-ai", label: "Ask AI Assistant", icon: Brain, badge: null, path: "/dashboard/ask-ai" },
];

// Bottom navigation items configuration with their respective paths
const bottomNavItems = [
  { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" }, // Added path

];

// Sidebar functional component
export function Sidebar({ className = "", onNavLinkClick }) { // Removed activeTab, setActiveTab props
  const location = useLocation(); // Get current location to determine active tab

  return (
    <div className={`bg-gradient-to-b from-slate-900 to-slate-800 border-r border-white/10 ${className}`}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center space-x-3"> {/* Link to dashboard home */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3EB489] to-[#2ea374] rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#3EB489] rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                FitFocus
              </h1>
              <p className="text-xs text-gray-400">AI-Powered Planning</p>
            </div>
          </Link>
        </div>

        {/* Main Navigation Section */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              // Determine if the current path matches the item's path for active state
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              className={`w-full justify-start h-12 text-left transition-all duration-200 rounded-lg ${
                location.pathname === item.path
                  ? "bg-[#3EB489]/20 text-[#3EB489] border-r-2 border-[#3EB489] hover:bg-[#3EB489]/30"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
              asChild // Render as a child of Link
            >
              <Link to={item.path} onClick={onNavLinkClick}> {/* Use Link for navigation */}
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="bg-[#3EB489] text-white text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </Button>
          ))}
        </nav>

        <Separator className="bg-white/10 mx-4" />

        {/* Bottom Navigation Section */}
        <div className="p-4 space-y-2">
          {bottomNavItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start h-12 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg ${
                location.pathname === item.path ? "bg-white/5 text-white" : "" // Highlight if active
              }`}
              asChild
            >
              <Link to={item.path} onClick={onNavLinkClick}> {/* Use Link for navigation */}
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            </Button>
          ))}
        </div>

        {/* AI Assistant Card - now a direct link to the Ask AI page */}
        <div className="p-4">
          <Card className="bg-gradient-to-br from-[#3EB489]/20 to-[#2ea374]/10 border-[#3EB489]/30 rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#3EB489]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AIAssistantSVG />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white">AI Assistant</h4>
                  <p className="text-xs text-gray-300">
                    Need help optimizing your schedule?
                  </p>
                  <Button
                    size="sm"
                    className="bg-[#3EB489] hover:bg-[#2ea374] text-white h-8 rounded-md"
                    asChild
                  >
                    <Link to="/dashboard/ask-ai" onClick={onNavLinkClick}> {/* Use Link for navigation */}
                      Ask AI
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
