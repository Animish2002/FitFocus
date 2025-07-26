// src/pages/TodaysSchedulePage.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Import Button
import { Input } from "@/components/ui/input"; // For form fields
import { Label } from "@/components/ui/label"; // For form labels
import { Textarea } from "@/components/ui/textarea"; // For notes
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
} from "@/components/ui/select"; // For type/status selection

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Dumbbell,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  XCircle,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";

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

export function TodaysSchedulePage() {
  const { user, logout } = useAuth();
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true); // For initial page fetch
  const [error, setError] = useState(null); // For initial page fetch errors

  // State for Add/Edit Schedule Item Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingScheduleItem, setEditingScheduleItem] = useState(null); // null for add, item object for edit
  const [scheduleForm, setScheduleForm] = useState({
    activity: "",
    time: "", // HH:MM format
    type: "", // e.g., fitness, study, work, misc, wellness
    status: "pending", // Default status for new items
    date: new Date().toISOString().split("T")[0], // Default to today's date (YYYY-MM-DD)
    notes: "",
  });
  const [formLoading, setFormLoading] = useState(false); // For modal form submission
  const [formError, setFormError] = useState(null); // For modal form errors
  const [formSuccess, setFormSuccess] = useState(null); // For modal form success

  // State for Delete Confirmation Dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  // --- Fetch Today's Schedule on Component Mount ---
  const fetchTodaySchedule = async () => {
    if (!user?.id) {
      setError("User not logged in or context not loaded.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const todayDateString = today.toISOString().split("T")[0]; // YYYY-MM-DD

      const response = await axiosInstance.get("/schedule/get-schedule", {
        params: { date: todayDateString },
      });
      // Sort items by time before setting
      const sortedSchedule = response.data.scheduleItems.sort((a, b) => {
        const timeA = a.time.split(":").map(Number);
        const timeB = b.time.split(":").map(Number);
        if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
        return timeA[1] - timeB[1];
      });
      setTodaySchedule(sortedSchedule);
    } catch (err) {
      console.error("Error fetching today's schedule:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load today's schedule."
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
  };

  useEffect(() => {
    fetchTodaySchedule();
  }, [user?.id, logout]);

  // --- Modal Form Handlers ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setScheduleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value) => {
    setScheduleForm((prev) => ({ ...prev, type: value }));
  };

  const handleStatusChange = (value) => {
    setScheduleForm((prev) => ({ ...prev, status: value }));
  };

  const handleAddActivityClick = () => {
    setEditingScheduleItem(null); // Indicate adding a new item
    setScheduleForm({
      activity: "",
      time: "",
      type: "",
      status: "pending",
      date: new Date().toISOString().split("T")[0], // Default to today
      notes: "",
    });
    setFormError(null);
    setFormSuccess(null);
    setIsScheduleModalOpen(true);
  };

  const handleEditActivityClick = (item) => {
    setEditingScheduleItem(item); // Set item to be edited
    setScheduleForm({
      activity: item.activity || "",
      time: item.time || "",
      type: item.type || "",
      status: item.status || "pending",
      date: item.date
        ? new Date(item.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0], // Format for input type="date"
      notes: item.notes || "",
    });
    setFormError(null);
    setFormSuccess(null);
    setIsScheduleModalOpen(true);
  };

  const handleSubmitScheduleForm = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);

    const dataToSend = { ...scheduleForm };

    // Basic validation for required fields
    if (
      !dataToSend.activity ||
      !dataToSend.time ||
      !dataToSend.type ||
      !dataToSend.status ||
      !dataToSend.date
    ) {
      setFormError("Activity, time, type, status, and date are required.");
      setFormLoading(false);
      return;
    }

    // Ensure date is a Date object (backend expects this)
    dataToSend.date = new Date(dataToSend.date);

    try {
      if (editingScheduleItem) {
        // Update existing item
        await axiosInstance.put(
          `/schedule/${editingScheduleItem.id}`,
          dataToSend
        );
        setFormSuccess("Schedule item updated successfully!");
      } else {
        // Create new item
        await axiosInstance.post("/schedule", dataToSend);
        setFormSuccess("Schedule item created successfully!");
      }
      setIsScheduleModalOpen(false);
      fetchTodaySchedule(); // Re-fetch schedule to update the list
    } catch (err) {
      console.error("Error saving schedule item:", err);
      setFormError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save schedule item."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // --- Delete Schedule Item Handlers ---
  const handleDeleteActivityClick = (id) => {
    setItemToDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteActivity = async () => {
    if (!itemToDeleteId) return;

    setFormLoading(true); // Use formLoading for consistency in dialog buttons
    setFormError(null); // Clear previous delete error
    try {
      await axiosInstance.delete(`/schedule/delete-schedule/${itemToDeleteId}`);
      setFormSuccess("Schedule item deleted successfully!");
      setShowDeleteConfirm(false);
      setItemToDeleteId(null);
      fetchTodaySchedule(); // Re-fetch schedule to update the list
    } catch (err) {
      console.error("Error deleting schedule item:", err);
      setFormError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete schedule item."
      );
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#3EB489]" />
        <p>Loading today's schedule...</p>
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
        <h1 className="text-3xl font-bold text-white">Today's Schedule</h1>
        <p className="text-gray-400 mt-2">
          Your detailed plan for a productive day.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Daily Activities</CardTitle>
              <CardDescription className="text-gray-400">
                Overview of your tasks and appointments for today.
              </CardDescription>
            </div>
            <Button
              className="bg-[#3EB489] hover:bg-[#2ea374] text-white rounded-md"
              onClick={handleAddActivityClick}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Activity
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((item) => (
                <div
                  key={item.id} // Use item.id for unique key
                  className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : item.status === "in-progress"
                          ? "bg-[#3EB489]/20 text-[#3EB489]"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {item.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : item.status === "in-progress" ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`font-medium ${
                          item.status === "completed"
                            ? "text-gray-400 line-through"
                            : "text-white"
                        }`}
                      >
                        {item.activity}
                      </h4>
                      <span className="text-sm text-gray-400">{item.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs rounded-md ${
                          item.type === "fitness"
                            ? "bg-[#3EB489]/20 text-[#3EB489]"
                            : item.type === "study"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {item.type === "fitness" ? (
                          <>
                            <Dumbbell className="w-3 h-3 mr-1" />
                            Fitness
                          </>
                        ) : item.type === "study" ? (
                          <>
                            <BookOpen className="w-3 h-3 mr-1" />
                            Study
                          </>
                        ) : (
                          item.type.charAt(0).toUpperCase() + item.type.slice(1) // Capitalize first letter
                        )}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs border-white/20 rounded-md ${
                          item.status === "completed"
                            ? "text-green-400"
                            : item.status === "in-progress"
                            ? "text-[#3EB489]"
                            : "text-gray-400"
                        }`}
                      >
                        {item.status === "completed"
                          ? "Completed"
                          : item.status === "in-progress"
                          ? "In Progress"
                          : "Pending"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white hover:bg-white/5 rounded-md"
                      onClick={() => handleEditActivityClick(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md"
                      onClick={() => handleDeleteActivityClick(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">
                No activities scheduled for today. Click "Add New Activity" to
                get started!
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add/Edit Schedule Item Dialog */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-800 border-white/20 rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingScheduleItem
                ? "Edit Schedule Item"
                : "Add New Schedule Item"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingScheduleItem
                ? "Make changes to your scheduled activity."
                : "Plan a new activity for your day."}
            </DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 p-3 rounded-md flex items-center mt-4">
              <AlertCircle className="w-5 h-5 mr-2" /> {formError}
            </div>
          )}
          {formSuccess && (
            <div className="bg-green-900/30 border border-green-500 text-green-300 p-3 rounded-md flex items-center mt-4">
              <CheckCircle2 className="w-5 h-5 mr-2" /> {formSuccess}
            </div>
          )}
          <form onSubmit={handleSubmitScheduleForm} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="activity">Activity Name</Label>
              <Input
                id="activity"
                name="activity"
                value={scheduleForm.activity}
                onChange={handleFormChange}
                className="input-focus-ring"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time" // HTML5 time input for easy selection
                value={scheduleForm.time}
                onChange={handleFormChange}
                className="input-focus-ring"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                name="type"
                value={scheduleForm.type}
                onValueChange={handleTypeChange}
                required
              >
                <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white input-focus-ring">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="misc">Miscellaneous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={scheduleForm.status}
                onValueChange={handleStatusChange}
                required
              >
                <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white input-focus-ring">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={scheduleForm.date}
                onChange={handleFormChange}
                className="input-focus-ring"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={scheduleForm.notes}
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
                    <Plus className="mr-2 h-4 w-4" />{" "}
                    {editingScheduleItem ? "Update Activity" : "Add Activity"}
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
              Are you sure you want to delete this schedule item? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {formError && ( // Re-using formError for delete dialog errors
            <div className="bg-red-900/30 border border-red-500 text-red-300 p-3 rounded-md flex items-center mt-4">
              <XCircle className="w-5 h-5 mr-2" /> {formError}
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
              onClick={confirmDeleteActivity}
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
