// src/components/auth/AuthLayout.jsx
"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Brain } from "lucide-react";

import BackgroundSVG from "./BackgroundSVG";
import FeaturesSidebar from "./FeaturesSidebar";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import MobileAuthNavigator from "./MobileAuthNavigator";

export default function AuthLayout() {
  const [currentPage, setCurrentPage] = useState("login"); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPage] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "", // Changed from firstName/lastName for simplicity with a single 'name' field
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login successful:", data);
      setSuccess("Login successful!");
      // Handle successful login (e.g., store token, redirect)
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!formData.acceptTerms) {
      setError("You must accept the terms and conditions.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name, // Using 'name' field
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log("Registration successful:", data);
      setSuccess("Registration successful! Please log in.");
      setCurrentPage("login"); // Optionally switch to login after successful registration
      setFormData({
        // Clear form after successful registration
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        acceptTerms: false,
      });
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const commonProps = {
    formData,
    handleInputChange,
    loading,
    error,
    success,
    setSuccess,
    setError,
    setShowPassword,
    showPassword,
    setShowConfirmPage,
    showConfirmPassword,
    setCurrentPage,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <BackgroundSVG />

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Features */}
        <div className="flex-1 md:flex items-center justify-center p-8 hidden">
          <FeaturesSidebar />
        </div>

        {/* Right Side - Auth Forms */}
        <div className="flex-1 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            {currentPage === "login" ? (
              <LoginForm key="login" onSubmit={handleLogin} {...commonProps} />
            ) : (
              <SignupForm
                key="signup"
                onSubmit={handleRegister}
                {...commonProps}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileAuthNavigator
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}