import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

import BackgroundSVG from "./BackgroundSVG";
import FeaturesSidebar from "./FeaturesSidebar";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import MobileAuthNavigator from "./MobileAuthNavigator";
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout() {
  const [currentPage, setCurrentPage] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); // Destructure login from useAuth

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
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
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
        throw new Error(
          data.message || "Login failed. Please check your credentials."
        );
      }

      console.log("Login successful:", data);
      setSuccess("Login successful!");

      const token = data.token; // Extract the token
      const user = data.user; // Extract user data

      if (token && user) {
        authLogin(user, token); // Pass BOTH user data AND token to authLogin
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        throw new Error(
          "Login successful, but user data or token missing from response."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred during login.");
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
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      console.log("Registration successful:", data);
      setSuccess("Registration successful! Please log in.");
      setCurrentPage("login");
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        acceptTerms: false,
      });
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.message || "An unexpected error occurred during registration."
      );
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
    setShowConfirmPassword,
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
