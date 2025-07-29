// src/pages/GoalsTargetsPage.jsx
import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // For form fields
import { Label } from "@/components/ui/label"; // For form labels
import { Textarea } from "@/components/ui/textarea"; // For description
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // For modals
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // For category selection

import { motion } from "framer-motion";
import {
  Target,
  Plus,
  CheckCircle2,
  Clock,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  XCircle,
  Save,
  CheckCircle,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext"; // Import your AuthContext hook
import axiosInstance from "@/api/axiosInstance"; // Import your configured axios instance

// Framer Motion variants for animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function GoalsTargetsPage() {
  const { user, logout } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true); // For initial fetch
  const [error, setError] = useState(null); // For fetch errors

  // State for Add/Edit Goal Modal
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null); // null for add, goal object for edit
  const [goalForm, setGoalForm] = useState({
    name: "",
    category: "", // Must be one of "Study", "Fittness", "Personal Development", "Wellness"
    targetValue: "", // Can be empty string for optional number
    unit: "",
    dueDate: "", // YYYY-MM-DD format
    description: "",
  });
  const [formLoading, setFormLoading] = useState(false); // For modal form submission
  const [formError, setFormError] = useState(null); // For modal form errors
  const [formSuccess, setFormSuccess] = useState(null); // For modal form success
  const [deleteError, setDeleteError] = useState(null); // Separate error for delete

  // State for Delete Confirmation Dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [goalToDeleteId, setGoalToDeleteId] = useState(null);

  // --- Fetch Goals on Component Mount and on Changes ---
  // Wrap fetchGoals in useCallback to prevent unnecessary re-renders and ensure stable dependency
  const fetchGoals = useCallback(async () => {
    if (!user?.id) {
      setError("User not logged in or context not loaded.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/goals/get-goals");
      setGoals(response.data.goals);
    } catch (err) {
      console.error("Error fetching goals:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load goals."
      );
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id, logout]); // Re-fetch when user changes or logout function changes

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]); // Depend on the memoized fetchGoals

  // Helper to get color for progress bar based on category
  const getProgressColor = (category) => {
    switch (category) {
      case "Study":
        return "from-blue-500 to-blue-400";
      case "Fitness":
        return "from-[#3EB489] to-[#2ea374]";
      case "Personal Development":
        return "from-purple-500 to-purple-400";
      case "Wellness":
        return "from-pink-500 to-pink-400";
      default:
        return "from-gray-500 to-gray-400";
    }
  };

  // --- Modal Form Handlers ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setGoalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setGoalForm((prev) => ({ ...prev, category: value }));
  };

  const handleAddGoalClick = () => {
    setEditingGoal(null); // Indicate adding a new goal
    setGoalForm({
      name: "",
      category: "",
      targetValue: "",
      unit: "",
      dueDate: "",
      description: "",
    });
    setFormError(null);
    setFormSuccess(null);
    setIsGoalModalOpen(true);
  };

  const handleEditGoalClick = (goal) => {
    setEditingGoal(goal); // Set goal to be edited
    setGoalForm({
      name: goal.name || "",
      category: goal.category || "",
      progress: goal.progress || 0, // Progress is handled by AI command or separate update
      targetValue: goal.targetValue !== null ? goal.targetValue : "",
      unit: goal.unit || "",
      dueDate: goal.dueDate
        ? new Date(goal.dueDate).toISOString().split("T")[0]
        : "", // Format for input type="date"
      description: goal.description || "",
    });
    setFormError(null);
    setFormSuccess(null);
    setIsGoalModalOpen(true);
  };

  const handleSubmitGoalForm = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);

    const dataToSend = { ...goalForm };

    // Convert optional number fields from empty string to null if needed
    if (dataToSend.targetValue === "") dataToSend.targetValue = null;
    if (dataToSend.targetValue !== null)
      dataToSend.targetValue = Number(dataToSend.targetValue);

    // Convert dueDate to Date object or null
    if (dataToSend.dueDate === "") dataToSend.dueDate = null;
    else if (dataToSend.dueDate)
      dataToSend.dueDate = new Date(dataToSend.dueDate);

    // Basic validation for required fields
    if (!dataToSend.name || !dataToSend.category) {
      setFormError("Goal name and category are required.");
      setFormLoading(false);
      return;
    }

    try {
      if (editingGoal) {
        // Update existing goal
        await axiosInstance.put(`/goals/${editingGoal.id}`, dataToSend);
        setFormSuccess("Goal updated successfully!");
      } else {
        // Create new goal
        await axiosInstance.post("/goals", dataToSend);
        setFormSuccess("Goal created successfully!");
      }
      setIsGoalModalOpen(false);
      fetchGoals(); // Re-fetch goals to update the list
    } catch (err) {
      console.error("Error saving goal:", err);
      setFormError(
        err.response?.data?.message || err.message || "Failed to save goal."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // --- Delete Goal Handlers ---
  const handleDeleteGoalClick = (id) => {
    setGoalToDeleteId(id);
    setDeleteError(null); // Clear previous delete errors
    setShowDeleteConfirm(true);
  };

  const confirmDeleteGoal = async () => {
    if (!goalToDeleteId) return;

    setFormLoading(true); // Use formLoading for consistency in dialog buttons
    setDeleteError(null); // Clear error before new attempt

    try {
      await axiosInstance.delete(`/goals/delete-goals/${goalToDeleteId}`);
      // setFormSuccess("Goal deleted successfully!"); // Consider if you want this toast here or just a refresh
      setShowDeleteConfirm(false);
      setGoalToDeleteId(null);
      fetchGoals(); // Re-fetch goals to update the list
    } catch (err) {
      console.error("Error deleting goal:", err);
      setDeleteError(
        err.response?.data?.message || err.message || "Failed to delete goal."
      );
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#3EB489]" />
        <p>Loading goals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-red-400 text-center">
        <XCircle className="w-5 h-5 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={staggerChildren}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold text-white">Goals & Targets</h1>
        <p className="text-gray-400 mt-2">
          Define your aspirations and track your journey to success.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Your Personal Goals</CardTitle>
              <CardDescription className="text-gray-400">
                A comprehensive view of your short-term and long-term
                objectives.
              </CardDescription>
            </div>
            <Button
              className="bg-[#3EB489] hover:bg-[#2ea374] text-white rounded-md"
              onClick={handleAddGoalClick}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Goal
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-5 bg-white/5 border border-white/10 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {goal.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`text-xs rounded-md ${
                          goal.status === "Completed"
                            ? "bg-green-500/20 text-green-400"
                            : goal.status === "In Progress"
                            ? "bg-[#3EB489]/20 text-[#3EB489]"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {goal.status === "Completed" ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {goal.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-white/20 text-gray-400 rounded-md"
                      >
                        {goal.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{goal.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2 bg-white/10">
                      <div
                        className={`h-full bg-gradient-to-r ${getProgressColor(
                          goal.category
                        )} rounded-full`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </Progress>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <span>
                      Due Date:{" "}
                      {goal.dueDate
                        ? new Date(goal.dueDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white hover:bg-white/5 rounded-md"
                        onClick={() => handleEditGoalClick(goal)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md"
                        onClick={() => handleDeleteGoalClick(goal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">
                No goals defined yet. Click "Add New Goal" to get started!
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add/Edit Goal Dialog */}
      <Dialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-800 border-white/20 rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingGoal ? "Edit Goal" : "Add New Goal"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingGoal
                ? "Make changes to your goal here."
                : "Create a new goal to track your progress."}
            </DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 p-3 rounded-md flex items-center mt-4">
              <AlertCircle className="w-5 h-5 mr-2" /> {formError}
            </div>
          )}
          {formSuccess && (
            <div className="bg-green-900/30 border border-green-500 text-green-300 p-3 rounded-md flex items-center mt-4">
              <CheckCircle className="w-5 h-5 mr-2" /> {formSuccess}
            </div>
          )}
          <form onSubmit={handleSubmitGoalForm} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                name="name"
                value={goalForm.name}
                onChange={handleFormChange}
                className="input-focus-ring"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                value={goalForm.category}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white input-focus-ring">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="Study">Study</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Personal Development">
                    Personal Development
                  </SelectItem>
                  <SelectItem value="Wellness">Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetValue">Target Value (Optional)</Label>
              <Input
                id="targetValue"
                name="targetValue"
                type="number"
                value={goalForm.targetValue}
                onChange={handleFormChange}
                className="input-focus-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit (e.g., kg, %, books)</Label>
              <Input
                id="unit"
                name="unit"
                value={goalForm.unit}
                onChange={handleFormChange}
                className="input-focus-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={goalForm.dueDate}
                onChange={handleFormChange}
                className="input-focus-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={goalForm.description}
                onChange={handleFormChange}
                className="input-focus-ring min-h-[80px]"
              />
            </div>
            <DialogFooter className="mt-6">
              <Button type="submit" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Goal
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[425px] bg-slate-800 border-white/20 rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-400" /> Confirm
              Deletion
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete this goal? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {deleteError && ( // Use the separate deleteError state here
            <div className="bg-red-900/30 border border-red-500 text-red-300 p-3 rounded-md flex items-center mt-4">
              <XCircle className="w-5 h-5 mr-2" /> {deleteError}
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={formLoading}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteGoal}
              disabled={formLoading}
              className="ml-2"
            >
              {formLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
