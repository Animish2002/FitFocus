import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// For Dialog, you typically import from Shadcn's dialog component
// For simplicity, I'll assume a basic Dialog structure or you can replace with your actual Shadcn Dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Lucide React Icons
import { User, Save, Trash2, X, CheckCircle, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth(); // Get user and logout from context
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    bodyweight: "",
    bmi: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState(""); // For optional re-authentication
  const [deleteError, setDeleteError] = useState(null);
  const userid = localStorage.getItem("user");

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) {
        // Ensure user context is available
        setError("User not logged in or context not loaded.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/profile/${user.id}`);
        const userData = response.data.user;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          age: userData.age || "",
          bodyweight: userData.bodyweight || "",
          bmi: userData.bmi || "",
        });
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load profile data."
        );
        // If error is due to auth (e.g., token expired), force logout
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id, logout]); // Depend on user.id to refetch if user changes, and logout for consistency

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle saving profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const dataToUpdate = { ...formData };
    // Convert empty strings to null for optional number fields
    if (dataToUpdate.age === "") dataToUpdate.age = null;
    if (dataToUpdate.bodyweight === "") dataToUpdate.bodyweight = null;
    if (dataToUpdate.bmi === "") dataToUpdate.bmi = null;

    // Ensure number fields are actual numbers or null
    if (dataToUpdate.age !== null && dataToUpdate.age !== "")
      dataToUpdate.age = Number(dataToUpdate.age);
    if (dataToUpdate.bodyweight !== null && dataToUpdate.bodyweight !== "")
      dataToUpdate.bodyweight = Number(dataToUpdate.bodyweight);
    if (dataToUpdate.bmi !== null && dataToUpdate.bmi !== "")
      dataToUpdate.bmi = Number(dataToUpdate.bmi);

    // Remove email from update if it's the same as current user's email and not explicitly changed
    // This prevents unnecessary unique constraint errors if email is not intended to be changed
    if (dataToUpdate.email === user.email) {
      delete dataToUpdate.email;
    }

    try {
      const response = await axiosInstance.put(
        `user/edit-profile/${user.id}`,
        dataToUpdate
      );
      setSuccess(response.data.message || "Profile updated successfully!");
      // Optionally update user in AuthContext if profile update was successful
      // You might need to call a `updateUser` function from your AuthContext
      // if it provides one, or re-set the user with the new data.
      // For now, we'll just rely on the next fetchUserProfile to get updated data.
      // If your AuthContext's `login` function is flexible enough, you could:
      // authLogin(response.data.user, user.token); // Assuming token remains the same
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while saving profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setDeleteError(null);
    try {
      // If your backend's DELETE /api/users/me requires password re-authentication:
      // await axiosInstance.delete('/users/me', { data: { password: deletePassword } });
      await axiosInstance.delete(`/user/delete-user/${user.id}`); // Using simplified call without password for this example

      setSuccess("Account deleted successfully!");
      setShowDeleteConfirm(false);
      logout(); // Log out the user from the frontend context (this should also redirect)
    } catch (err) {
      console.error("Failed to delete account:", err);
      setDeleteError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete account."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8 flex justify-center items-start ">
      <div className="bg-slate-800 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-[#3EB489]/30 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 border-4 border-[#3EB489]">
            <AvatarImage
              src={`https://placehold.co/96x96/3EB489/ffffff?text=${
                formData.name ? formData.name.charAt(0).toUpperCase() : "U"
              }`}
              alt="User Avatar"
            />
            <AvatarFallback className="text-4xl font-bold bg-[#3EB489] text-white">
              {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-bold mt-4 text-white">
            {formData.name || "User Profile"}
          </h2>
          <p className="text-slate-400 text-sm">{formData.email}</p>
        </div>

        <h3 className="text-xl font-semibold mb-6 text-white border-b border-white/10 pb-2">
          Personal Information
        </h3>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 p-3 rounded-md flex items-center mb-4">
            <AlertCircle className="w-5 h-5 mr-2" /> {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/30 border border-green-500 text-green-300 p-3 rounded-md flex items-center mb-4">
            <CheckCircle className="w-5 h-5 mr-2" /> {success}
          </div>
        )}

        <form
          onSubmit={handleSaveProfile}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-focus-ring"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-focus-ring"
              disabled // Email is usually not editable via profile page for security/complexity reasons
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              className="input-focus-ring"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bodyweight">Bodyweight (kg)</Label>
            <Input
              id="bodyweight"
              name="bodyweight"
              type="number"
              step="0.1"
              value={formData.bodyweight}
              onChange={handleInputChange}
              className="input-focus-ring"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bmi">BMI</Label>
            <Input
              id="bmi"
              name="bmi"
              type="number"
              step="0.1"
              value={formData.bmi}
              onChange={handleInputChange}
              className="input-focus-ring"
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end mt-6">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </span>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-10 pt-6 border-t border-white/10">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Account Management
          </h3>
          <p className="text-slate-400 mb-4">
            Permanently delete your FitFocus account and all your data. This
            action cannot be undone.
          </p>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Account
          </Button>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="sm:max-w-[425px] bg-slate-800 border-white/20 rounded-lg p-6">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-400" /> Confirm
                Account Deletion
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                This action is irreversible. All your data, including goals,
                schedules, and logs, will be permanently deleted. Are you
                absolutely sure you want to proceed?
              </DialogDescription>
            </DialogHeader>
            {deleteError && (
              <div className="bg-red-900/30 border border-red-500 text-red-300 p-3 rounded-md flex items-center mt-4">
                <AlertCircle className="w-5 h-5 mr-2" /> {deleteError}
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="text-slate-300 hover:text-white hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="ml-2"
              >
                Delete My Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
