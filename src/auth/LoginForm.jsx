// src/components/auth/LoginForm.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, ArrowRight } from "lucide-react";
import AuthCardWrapper from "./AuthCardWrapper";
import PasswordInput from "./PasswordInput";

const LoginForm = ({
  formData,
  handleInputChange,
  onSubmit,
  loading,
  error,
  success,
  setShowPassword,
  showPassword,
  setCurrentPage,
}) => {
  return (
    <AuthCardWrapper
      title="Welcome Back"
      description="Sign in to continue your journey"
    >
      <div className="relative">
        <Separator className="bg-white/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="px-4 bg-slate-900 text-gray-400 text-sm">
            Continue with email
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
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
            <PasswordInput
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter your password"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}


        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
          {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
        </Button>

        <div className="text-center">
          <span className="text-gray-400">Don't have an account? </span>
          <Button
            variant="link"
            className="text-[#3EB489] hover:text-[#2ea374] p-0 h-auto font-semibold"
            onClick={() => setCurrentPage("signup")}
            disabled={loading}
          >
            Sign up
          </Button>
        </div>
      </form>
    </AuthCardWrapper>
  );
};

export default LoginForm;