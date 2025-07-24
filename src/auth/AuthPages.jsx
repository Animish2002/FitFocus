"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Github,
  Chrome,
  Check,
  Star,
  Zap,
  Shield,
  BookOpen,
  Dumbbell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPages() {
  const [currentPage, setCurrentPage] = useState("login"); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    acceptTerms: false,
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const slideIn = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  // Custom SVG Components
  const BackgroundSVG = () => (
    <svg
      className="absolute inset-0 w-full h-full opacity-10"
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="authGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3EB489" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2ea374" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="authGradient2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3EB489" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3EB489" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="150" r="100" fill="url(#authGradient2)" />
      <circle cx="850" cy="850" r="150" fill="url(#authGradient2)" />
      <path
        d="M0 500 Q 250 250 500 500 T 1000 500"
        stroke="url(#authGradient1)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M500 0 Q 750 250 500 500 T 500 1000"
        stroke="url(#authGradient1)"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );

  const FeatureIconSVG = ({ type }) => {
    const iconMap = {
      ai: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#3EB489" fillOpacity="0.1" />
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
            fill="#3EB489"
          />
        </svg>
      ),
      security: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#3EB489" fillOpacity="0.1" />
          <path
            d="M12 2L3 7l9 18 9-18-9-5zM12 7.5l5.5 2.25L12 21 6.5 9.75 12 7.5z"
            fill="#3EB489"
          />
        </svg>
      ),
      growth: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#3EB489" fillOpacity="0.1" />
          <path
            d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"
            fill="#3EB489"
          />
        </svg>
      ),
    };
    return iconMap[type] || iconMap.ai;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const LoginPage = () => (
    <motion.div
      className="w-full max-w-md"
      variants={slideIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <motion.div
            className="flex items-center justify-center space-x-3 mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3EB489] to-[#2ea374] rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              FitFocus
            </span>
          </motion.div>

          <CardTitle className="text-3xl font-bold text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            Sign in to continue your journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Login */}

          <div className="relative">
            <Separator className="bg-white/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-4 bg-slate-900 text-gray-400 text-sm">
                Continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 h-12 bg-white/5 border-white/20 focus:border-[#3EB489] text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pl-10 pr-10 h-12 bg-white/5 border-white/20 focus:border-[#3EB489] text-white placeholder-gray-400"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border-white/20 data-[state=checked]:bg-[#3EB489] data-[state=checked]:border-[#3EB489]"
                />
                <Label htmlFor="remember" className="text-sm text-gray-300">
                  Remember me
                </Label>
              </div>
              <Button
                variant="link"
                className="text-[#3EB489] hover:text-[#2ea374] p-0 h-auto"
              >
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Sign In
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <div className="text-center">
              <span className="text-gray-400">Don't have an account? </span>
              <Button
                variant="link"
                className="text-[#3EB489] hover:text-[#2ea374] p-0 h-auto font-semibold"
                onClick={() => setCurrentPage("signup")}
              >
                Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );

  const SignupPage = () => (
    <motion.div
      className="w-full max-w-md"
      variants={slideIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <motion.div
            className="flex items-center justify-center space-x-3 mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3EB489] to-[#2ea374] rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              FitFocus
            </span>
          </motion.div>

          <CardTitle className="text-3xl font-bold text-white">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            Start your journey to perfect balance
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Signup */}

          <div className="relative">
            <Separator className="bg-white/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-4 bg-slate-900 text-gray-400 text-sm">
                Create with email
              </span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="pl-10 h-12 bg-white/5 border-white/20 focus:border-[#3EB489] text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="h-12 bg-white/5 border-white/20 focus:border-[#3EB489] text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signupEmail" className="text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 h-12 bg-white/5 border-white/20 focus:border-[#3EB489] text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signupPassword" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="signupPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pl-10 pr-10 h-12 bg-white/5 border-white/20 focus:border-[#3EB489] text-white placeholder-gray-400"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="pl-10 pr-10 h-12 bg-white/5 border-white/20 focus:border-[#3EB489] text-white placeholder-gray-400"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("acceptTerms", checked)
                }
                className="border-white/20 data-[state=checked]:bg-[#3EB489] data-[state=checked]:border-[#3EB489] mt-1"
              />
              <Label
                htmlFor="terms"
                className="text-sm text-gray-300 leading-relaxed"
              >
                I agree to the{" "}
                <Button
                  variant="link"
                  className="text-[#3EB489] hover:text-[#2ea374] p-0 h-auto text-sm"
                >
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button
                  variant="link"
                  className="text-[#3EB489] hover:text-[#2ea374] p-0 h-auto text-sm"
                >
                  Privacy Policy
                </Button>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={!formData.acceptTerms}
              className="w-full h-12 bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <div className="text-center">
              <span className="text-gray-400">Already have an account? </span>
              <Button
                variant="link"
                className="text-[#3EB489] hover:text-[#2ea374] p-0 h-auto font-semibold"
                onClick={() => setCurrentPage("login")}
              >
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );

  const FeaturesSidebar = () => (
    <motion.div
      className="hidden lg:flex flex-col justify-center space-y-12 max-w-lg"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="space-y-6">
        <motion.h2
          className="text-4xl font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Transform Your{" "}
          <span className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] bg-clip-text text-transparent bitcount-grid-single-hero">
            Daily Routine
          </span>
        </motion.h2>
        <motion.p
          className="text-xl text-gray-300 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Join thousands of students who've revolutionized their study-fitness
          balance with AI-powered planning.
        </motion.p>
      </div>

      <div className="space-y-8">
        {[
          {
            icon: "ai",
            title: "AI-Powered Scheduling",
            description:
              "Intelligent planning that adapts to your energy levels and preferences.",
          },
          {
            icon: "security",
            title: "Secure & Private",
            description:
              "Your data is encrypted and never shared with third parties.",
          },
          {
            icon: "growth",
            title: "Track Your Progress",
            description:
              "Detailed analytics to monitor your fitness and study improvements.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-start space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
          >
            <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              <FeatureIconSVG type={feature.icon} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <BackgroundSVG />

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Features */}
        <div className="flex-1 flex items-center justify-center p-8">
          <FeaturesSidebar />
        </div>

        {/* Right Side - Auth Forms */}
        <div className="flex-1 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            {currentPage === "login" ? (
              <LoginPage key="login" />
            ) : (
              <SignupPage key="signup" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-full p-2 border border-white/20">
          <Button
            variant={currentPage === "login" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentPage("login")}
            className={
              currentPage === "login"
                ? "bg-[#3EB489] hover:bg-[#2ea374] text-white"
                : "text-gray-400 hover:text-white hover:bg-white/10"
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
                ? "bg-[#3EB489] hover:bg-[#2ea374] text-white"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
