import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { motion } from "framer-motion";
import {
  Dumbbell,
  Heart,
  Flame,
  TrendingUp,
  Plus,
  BarChart3,
  Timer,
  Loader2,
  AlertCircle,
  XCircle,
  Edit,
  Trash2,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";
import Chart from "chart.js/auto"; // Import Chart.js

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

export function FitnessTrackerPage() {
  const { user, logout } = useAuth();
  const [fitnessGoals, setFitnessGoals] = useState([]);
  const [recentFitnessLogs, setRecentFitnessLogs] = useState([]);
  const [loading, setLoading] = useState(true); // For initial page fetch
  const [error, setError] = useState(null); // For initial page fetch errors

  // State for Log New Workout Modal
  const [isLogWorkoutModalOpen, setIsLogWorkoutModal] = useState(false);
  const [workoutForm, setWorkoutForm] = useState({
    workoutName: "",
    durationMinutes: "",
    caloriesBurned: "",
    type: "", // e.g., Cardio, Strength, Flexibility, Other
    weightLiftedKg: "",
    reps: "",
    sets: "",
    distanceKm: "",
    avgHeartRateBpm: "",
  });
  const [formLoading, setFormLoading] = useState(false); // For modal form submission
  const [formError, setFormError] = useState(null); // For modal form errors
  const [formSuccess, setFormSuccess] = useState(null); // For modal form success

  // State for Edit Workout Log Modal
  const [editingLog, setEditingLog] = useState(null); // null for add, log object for edit

  // State for Delete Confirmation Dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [logToDeleteId, setLogToDeleteId] = useState(null);

  // Chart.js related states and ref
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [fitnessChartData, setFitnessChartData] = useState([]); // State to hold data for the chart

  // --- Fetch All Data (Goals, Recent Logs, Chart Data) ---
  const fetchData = async () => {
    if (!user?.id) {
      setError("User not logged in or context not loaded.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch Fitness Goals
      const goalsResponse = await axiosInstance.get("/goals/get-goals", {
        params: { category: "Fitness" },
      });
      setFitnessGoals(goalsResponse.data.goals);

      // Fetch Recent Fitness Logs (e.g., last 10)
      const logsResponse = await axiosInstance.get("/fitness/logs/get-logs", {
        params: { sortBy: "dateDesc", limit: 10 },
      });
      setRecentFitnessLogs(logsResponse.data.fitnessLogs);

      // Fetch data for chart (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const chartLogsResponse = await axiosInstance.get(
        "/fitness/logs/get-logs",
        {
          params: {
            startDate: sevenDaysAgo.toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
          },
        }
      );
      setFitnessChartData(chartLogsResponse.data.fitnessLogs); // Store data in state for chart useEffect
    } catch (err) {
      console.error("Error fetching fitness data:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load fitness data."
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
    fetchData();
  }, [user?.id, logout]);

  // --- Chart Rendering Logic (Dedicated useEffect) ---
  useEffect(() => {
    // Ensure canvas element exists and we have data to draw
    if (!chartRef.current || fitnessChartData.length === 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy existing chart if data becomes empty
        chartInstance.current = null;
      }
      return; // Exit if no canvas or no data
    }

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = [];
    const dailyMinutes = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of today in local time

    // Prepare labels and initialize dailyMinutes for the last 7 days
    const dateStringsForLookup = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split("T")[0];
      labels.push(
        d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );
      dateStringsForLookup.push(dateString);
      dailyMinutes[dateString] = 0;
    }

    // Aggregate minutes per day from fetched fitness logs
    fitnessChartData.forEach((log) => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      const dateString = logDate.toISOString().split("T")[0];
      if (dailyMinutes.hasOwnProperty(dateString)) {
        dailyMinutes[dateString] += log.durationMinutes;
      }
    });

    // Populate data array in correct order
    const data = dateStringsForLookup.map(
      (dateString) => dailyMinutes[dateString]
    );

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Fitness Minutes",
            data: data,
            backgroundColor: "#3EB489", // Your accent color
            borderColor: "#2ea374",
            borderWidth: 1,
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // CRITICAL for responsiveness
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: function (context) {
                const title = context[0].label;
                return title.length > 16
                  ? title.match(/.{1,16}/g).join("\n")
                  : title;
              },
              label: function (context) {
                return `${context.dataset.label}: ${context.raw} mins`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
              borderColor: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45,
              callback: function (value, index, values) {
                const label = this.getLabelForValue(value);
                return label.length > 16 ? label.match(/.{1,16}/g) : label;
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
        },
      },
    });

    // Cleanup function for Chart.js
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [fitnessChartData, chartRef]); // Dependencies: chart data and the ref itself

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

  // --- Log Workout Modal Handlers ---
  const handleLogWorkoutClick = (log = null) => {
    setEditingLog(log);
    setWorkoutForm({
      workoutName: log ? log.workoutName : "",
      durationMinutes: log ? log.durationMinutes : "",
      caloriesBurned:
        log && log.caloriesBurned !== null ? log.caloriesBurned : "",
      type: log ? log.type : "",
      weightLiftedKg:
        log && log.weightLiftedKg !== null ? log.weightLiftedKg : "",
      reps: log && log.reps !== null ? log.reps : "",
      sets: log && log.sets !== null ? log.sets : "",
      distanceKm: log && log.distanceKm !== null ? log.distanceKm : "",
      avgHeartRateBpm:
        log && log.avgHeartRateBpm !== null ? log.avgHeartRateBpm : "",
    });
    setFormError(null);
    setFormSuccess(null);
    setIsLogWorkoutModal(true);
  };

  const handleWorkoutFormChange = (e) => {
    const { name, value } = e.target;
    setWorkoutForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkoutTypeChange = (value) => {
    setWorkoutForm((prev) => ({ ...prev, type: value }));
  };

  const handleSubmitWorkoutForm = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);

    const dataToSend = { ...workoutForm };

    // Convert optional number fields from empty string to null/Number
    for (const key of [
      "durationMinutes",
      "caloriesBurned",
      "weightLiftedKg",
      "reps",
      "sets",
      "distanceKm",
      "avgHeartRateBpm",
    ]) {
      if (dataToSend[key] === "") {
        dataToSend[key] = null;
      } else if (dataToSend[key] !== null) {
        dataToSend[key] = Number(dataToSend[key]);
      }
    }

    if (
      !dataToSend.workoutName ||
      !dataToSend.durationMinutes ||
      dataToSend.durationMinutes <= 0
    ) {
      setFormError("Workout name and valid duration (minutes) are required.");
      setFormLoading(false);
      return;
    }

    try {
      if (editingLog) {
        await axiosInstance.put(`/fitness/logs/${editingLog.id}`, dataToSend);
        setFormSuccess("Workout log updated successfully!");
      } else {
        await axiosInstance.post("/fitness/logs", dataToSend);
        setFormSuccess("Workout logged successfully!");
      }
      setIsLogWorkoutModal(false);
      fetchData(); // Re-fetch all data to update lists and chart
    } catch (err) {
      console.error("Error saving workout log:", err);
      setFormError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save workout log."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // --- Delete Workout Log Handlers ---
  const handleDeleteWorkoutClick = (id) => {
    setLogToDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteWorkout = async () => {
    if (!logToDeleteId) return;

    setFormLoading(true); // Use formLoading for consistency in dialog buttons
    setFormError(null); // Clear previous delete error
    try {
      await axiosInstance.delete(`/fitness/logs/delete-logs/${logToDeleteId}`);
      setFormSuccess("Workout log deleted successfully!");
      setShowDeleteConfirm(false);
      setLogToDeleteId(null);
      fetchData(); // Re-fetch data
    } catch (err) {
      console.error("Error deleting workout log:", err);
      setFormError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete workout log."
      );
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#3EB489]" />
        <p>Loading fitness data...</p>
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
        <h1 className="text-3xl font-bold text-white">Fitness Tracker</h1>
        <p className="text-gray-400 mt-2">
          Monitor your progress and stay on top of your fitness goals.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fitness Goals Progress */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">
                Fitness Goals Progress
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your progress towards defined fitness objectives.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fitnessGoals.length > 0 ? (
                fitnessGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Dumbbell className={`w-5 h-5 text-[#3EB489]`} />{" "}
                        {/* Using accent color for fitness goals */}
                        <span className="text-sm text-gray-300 font-medium">
                          {goal.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {goal.progress}%
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2 bg-white/10">
                      <div
                        className={`h-full bg-gradient-to-r ${getProgressColor(
                          goal.category
                        )} rounded-full`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </Progress>
                    <p className="text-xs text-gray-500">{goal.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                      <span>
                        Due Date:{" "}
                        {goal.dueDate
                          ? new Date(goal.dueDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4 col-span-full">
                  No fitness goals defined yet. Add them in the Goals & Targets
                  section!
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Workouts & Quick Actions */}
        <motion.div variants={fadeInUp} className="space-y-6">
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Recent Workouts</CardTitle>
              <CardDescription className="text-gray-400">
                A quick look at your latest activities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentFitnessLogs.length > 0 ? (
                recentFitnessLogs.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-white">
                        {workout.workoutName}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {workout.durationMinutes} mins &bull;{" "}
                        {new Date(workout.date).toLocaleDateString()}
                        {workout.caloriesBurned
                          ? ` • ${workout.caloriesBurned} kcal`
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Icon based on workout type */}
                      {workout.type === "Cardio" && (
                        <Heart className="w-4 h-4 text-red-400" />
                      )}
                      {workout.type === "Strength" && (
                        <Dumbbell className="w-4 h-4 text-purple-400" />
                      )}
                      {workout.type === "Flexibility" && (
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                      )}
                      {workout.type === "Other" && (
                        <Timer className="w-4 h-4 text-yellow-400" />
                      )}
                      {!workout.type && (
                        <Dumbbell className="w-4 h-4 text-gray-400" />
                      )}{" "}
                      {/* Default icon */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white hover:bg-white/5 rounded-md"
                        onClick={() => handleLogWorkoutClick(workout)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md"
                        onClick={() => handleDeleteWorkoutClick(workout.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">
                  No recent workouts logged.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Fitness Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Visualizing your fitness time over the last 7 days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="chart-container relative h-64 sm:h-72 md:h-80 max-h-[400px] w-full mx-auto">
                <canvas ref={chartRef}></canvas>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-[#3EB489] hover:bg-[#2ea374] text-white rounded-md"
                onClick={() => handleLogWorkoutClick(null)}
              >
                <Plus className="mr-2 h-4 w-4" /> Log New Workout
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Log/Edit Workout Dialog */}
      <Dialog open={isLogWorkoutModalOpen} onOpenChange={setIsLogWorkoutModal}>
        <DialogContent className="sm:max-w-[425px] bg-slate-800 border-white/20 rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingLog ? "Edit Workout Log" : "Log New Workout"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingLog
                ? "Adjust details for your workout."
                : "Record your completed fitness activity."}
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
          <form onSubmit={handleSubmitWorkoutForm} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workoutName">Workout Name</Label>
              <Input
                id="workoutName"
                name="workoutName"
                value={workoutForm.workoutName}
                onChange={handleWorkoutFormChange}
                className="input-focus-ring"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="durationMinutes">Duration (minutes)</Label>
              <Input
                id="durationMinutes"
                name="durationMinutes"
                type="number"
                value={workoutForm.durationMinutes}
                onChange={handleWorkoutFormChange}
                className="input-focus-ring"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                name="type"
                value={workoutForm.type}
                onValueChange={handleWorkoutTypeChange}
              >
                <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white input-focus-ring">
                  <SelectValue placeholder="Select workout type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="Cardio">Cardio</SelectItem>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Flexibility">Flexibility</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="caloriesBurned">Calories Burned (Optional)</Label>
              <Input
                id="caloriesBurned"
                name="caloriesBurned"
                type="number"
                value={workoutForm.caloriesBurned}
                onChange={handleWorkoutFormChange}
                className="input-focus-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distanceKm">Distance (km) (Optional)</Label>
              <Input
                id="distanceKm"
                name="distanceKm"
                type="number"
                step="0.1"
                value={workoutForm.distanceKm}
                onChange={handleWorkoutFormChange}
                className="input-focus-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weightLiftedKg">
                Weight Lifted (kg) (Optional)
              </Label>
              <Input
                id="weightLiftedKg"
                name="weightLiftedKg"
                type="number"
                step="0.1"
                value={workoutForm.weightLiftedKg}
                onChange={handleWorkoutFormChange}
                className="input-focus-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reps">Reps (Optional)</Label>
              <Input
                id="reps"
                name="reps"
                type="number"
                value={workoutForm.reps}
                onChange={handleWorkoutFormChange}
                className="input-focus-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sets">Sets (Optional)</Label>
              <Input
                id="sets"
                name="sets"
                type="number"
                value={workoutForm.sets}
                onChange={handleWorkoutFormChange}
                className="input-focus-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avgHeartRateBpm">
                Avg Heart Rate (bpm) (Optional)
              </Label>
              <Input
                id="avgHeartRateBpm"
                name="avgHeartRateBpm"
                type="number"
                value={workoutForm.avgHeartRateBpm}
                onChange={handleWorkoutFormChange}
                className="input-focus-ring"
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
                    {editingLog ? "Update Log" : "Log Workout"}
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
              Are you sure you want to delete this workout log? This action
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
              onClick={confirmDeleteWorkout}
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
