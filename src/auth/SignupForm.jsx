// src/components/auth/SignupForm.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Mail, User, ArrowRight } from "lucide-react";
import AuthCardWrapper from "./AuthCardWrapper";
import PasswordInput from "./PasswordInput";

const SignupForm = ({
  formData,
  handleInputChange,
  onSubmit,
  loading,
  error,
  success,
  setShowPassword,
  showPassword,
  setShowConfirmPage,
  showConfirmPassword,
  setCurrentPage,
}) => {
  return (
    <AuthCardWrapper
      title="Create Account"
      description="Start your journey to perfect balance"
    >
      <div className="relative">
        <Separator className="bg-white/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="px-4 bg-slate-900 text-gray-400 text-sm">
            Create with email
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name" // Changed placeholder to suggest full name
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-10 h-12 bg-white/5 border-white/20 focus:border-[#3EB489] text-white placeholder-gray-400"
                  required
                />
              </div>
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
            <PasswordInput
              id="signupPassword"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Create password"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </Label>
            <PasswordInput
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              placeholder="Confirm password"
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPage} // Corrected prop name
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) =>
                handleInputChange("acceptTerms", checked)
              }
              className="border-white/40 data-[state=checked]:bg-[#3EB489] data-[state=checked]:text-white"
            />
            <Label htmlFor="acceptTerms" className="text-gray-400 text-sm">
              I agree to the{" "}
              <a href="#" className="text-[#3EB489] hover:underline">
                Terms and Conditions
              </a>
            </Label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <Button
          type="submit"
          disabled={!formData.acceptTerms || loading}
          className="w-full h-12 bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Create Account"}
          {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
        </Button>

        <div className="text-center">
          <span className="text-gray-400">Already have an account? </span>
          <Button
            variant="link"
            className="text-[#3EB489] hover:text-[#2ea374] p-0 h-auto font-semibold"
            onClick={() => setCurrentPage("login")}
            disabled={loading}
          >
            Sign in
          </Button>
        </div>
      </form>
    </AuthCardWrapper>
  );
};

export default SignupForm;