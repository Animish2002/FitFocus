// src/components/auth/MobileAuthNavigator.jsx
import React from 'react';
import { Button } from "@/components/ui/button";

const MobileAuthNavigator = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="lg:hidden fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
      <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-full py-1.5 border border-white/20 px-1">
        <Button
          variant={currentPage === "login" ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentPage("login")}
          className={
            currentPage === "login"
              ? "bg-[#3EB489] hover:bg-[#2ea374] text-white p-1"
              : "text-gray-400 hover:text-white hover:bg-white/10 p-1"
          }
        >
          Sign In
        </Button>
        <Button
          variant={currentPage === "signup" ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentPage("signup")}
          className={
            currentPage === "signup"
              ? "bg-[#3EB489] hover:bg-[#2ea374] text-white p-1"
              : "text-gray-400 hover:text-white hover:bg-white/10 p-1"
          }
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default MobileAuthNavigator;