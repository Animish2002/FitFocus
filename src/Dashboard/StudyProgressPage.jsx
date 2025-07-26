// src/pages/StudyProgressPage.jsx
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
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Clock,
  BarChart3,
  Plus,
  Loader2,
  AlertCircle,
  XCircle,
  Edit,
  Trash2,
  CheckCircle,
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

export function StudyProgressPage() {
  const { user, logout } = useAuth();
  const [studyGoals, setStudyGoals] = useState([]);
  const [recentStudySessions, setRecentStudySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Log New Session Modal
  const [isLogSessionModalOpen, setIsLogSessionModalOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    topic: "",
    durationMinutes: "",
    notes: "",
    status: "completed",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Chart.js related states and ref
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [studyChartData, setStudyChartData] = useState([]); // State to hold data for the chart

  // --- Fetch All Data (Goals, Recent Sessions, Chart Data) ---
  const fetchData = async () => {
    if (!user?.id) {
      setError("User not logged in or context not loaded.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch Study Goals
      const goalsResponse = await axiosInstance.get("/goals/get-goals", {
        params: { category: "Study" },
      });
      setStudyGoals(goalsResponse.data.goals);

      // Fetch Recent Study Sessions (e.g., last 10)
      const sessionsResponse = await axiosInstance.get(
        "/study/sessions/get-sessions",
        {
          params: { sortBy: "dateDesc", limit: 10 },
        }
      );
      setRecentStudySessions(sessionsResponse.data.studySessions);

      // Fetch data for chart (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const chartSessionsResponse = await axiosInstance.get(
        "/study/sessions/get-sessions",
        {
          params: {
            startDate: sevenDaysAgo.toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
          },
        }
      );
      setStudyChartData(chartSessionsResponse.data.studySessions); // Store data in state for chart useEffect
    } catch (err) {
      console.error("Error fetching study data:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load study data."
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
    if (!chartRef.current || studyChartData.length === 0) {
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
    const dateStringsForLookup = []; // To store YYYY-MM-DD for accurate data lookup
    for (let i = 6; i >= 0; i--) {
      // Iterate for last 7 days (today to 6 days ago)
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split("T")[0]; // e.g., "2025-07-27"
      labels.push(
        d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      ); // Display label
      dateStringsForLookup.push(dateString); // Store the actual date string for data mapping
      dailyMinutes[dateString] = 0; // Initialize minutes for this day
    }

    // Aggregate minutes per day from fetched study sessions
    studyChartData.forEach((session) => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0); // Normalize session date to start of day
      const dateString = sessionDate.toISOString().split("T")[0];
      if (dailyMinutes.hasOwnProperty(dateString)) {
        dailyMinutes[dateString] += session.durationMinutes;
      }
    });

    // Populate data array in correct order using the prepared dateStringsForLookup
    const data = dateStringsForLookup.map(
      (dateString) => dailyMinutes[dateString]
    );

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels, // Use the display labels
        datasets: [
          {
            label: "Study Minutes",
            data: data, // Use the correctly ordered data
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
                // Wrap labels if they are too long (e.g., 16 chars)
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

    // Cleanup function: destroy chart instance when component unmounts or dependencies change
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [studyChartData, chartRef]); // Dependencies: studyChartData (when data changes) and chartRef (when canvas is available)

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

  // --- Log Session Modal Handlers ---
  const handleLogSessionClick = () => {
    setSessionForm({
      topic: "",
      durationMinutes: "",
      notes: "",
      status: "completed",
    });
    setFormError(null);
    setFormSuccess(null);
    setIsLogSessionModalOpen(true);
  };

  const handleSessionFormChange = (e) => {
    const { name, value } = e.target;
    setSessionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSessionStatusChange = (value) => {
    setSessionForm((prev) => ({ ...prev, status: value }));
  };

  const handleSubmitSessionForm = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);

    const dataToSend = { ...sessionForm };
    if (dataToSend.durationMinutes === "") dataToSend.durationMinutes = null;
    if (dataToSend.durationMinutes !== null)
      dataToSend.durationMinutes = Number(dataToSend.durationMinutes);

    if (
      !dataToSend.topic ||
      !dataToSend.durationMinutes ||
      dataToSend.durationMinutes <= 0 ||
      !dataToSend.status
    ) {
      setFormError("Topic, valid duration (minutes), and status are required.");
      setFormLoading(false);
      return;
    }

    try {
      await axiosInstance.post("/study/sessions", dataToSend);
      setFormSuccess("Study session logged successfully!");
      setIsLogSessionModalOpen(false);
      fetchData(); // Re-fetch all data to update lists and chart
    } catch (err) {
      console.error("Error logging session:", err);
      setFormError(
        err.response?.data?.message ||
          err.message ||
          "Failed to log study session."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // --- Edit/Delete Session Handlers ---
  const handleEditSession = (id) => {
    alert(`Edit Session ${id} functionality coming soon!`);
    // Implement a modal for editing a specific session here
  };

  const handleDeleteSession = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this study session?")
    ) {
      return;
    }
    setLoading(true); // Use main loading for this operation
    setError(null);
    try {
      await axiosInstance.delete(`/study/sessions/delete-sessions/${id}`);
      setFormSuccess("Study session deleted successfully!"); // Provide feedback
      fetchData(); // Re-fetch data to update the UI
    } catch (err) {
      console.error("Error deleting session:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete study session."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#3EB489]" />
        <p>Loading study data...</p>
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
        <h1 className="text-3xl font-bold text-white">Study Progress</h1>
        <p className="text-gray-400 mt-2">
          Track your learning journey and subject mastery.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Study Goals Progress */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Study Goals Progress</CardTitle>
              <CardDescription className="text-gray-400">
                Your progress towards defined study objectives.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {studyGoals.length > 0 ? (
                studyGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className={`w-5 h-5 text-blue-400`} />
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
                <p className="text-gray-400 text-center py-4">
                  No study goals defined yet. Add them in the Goals & Targets
                  section!
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Study Sessions & Quick Actions */}
        <motion.div variants={fadeInUp} className="space-y-6">
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">
                Recent Study Sessions
              </CardTitle>
              <CardDescription className="text-gray-400">
                A log of your latest study activities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentStudySessions.length > 0 ? (
                recentStudySessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-white">
                        {session.topic}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {session.durationMinutes} mins &bull;{" "}
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-400" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white hover:bg-white/5 rounded-md"
                        onClick={() => handleEditSession(session.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md"
                        onClick={() => handleDeleteSession(session.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">
                  No recent study sessions logged.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Study Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Visualizing your study time over the last 7 days.
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
                onClick={handleLogSessionClick}
              >
                <Plus className="mr-2 h-4 w-4" /> Log New Session
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Log New Session Dialog */}
      <Dialog
        open={isLogSessionModalOpen}
        onOpenChange={setIsLogSessionModalOpen}
      >
        <DialogContent className="sm:max-w-[425px] bg-slate-800 border-white/20 rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-white">
              Log New Study Session
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Record your completed study time.
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
          <form onSubmit={handleSubmitSessionForm} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                name="topic"
                value={sessionForm.topic}
                onChange={handleSessionFormChange}
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
                value={sessionForm.durationMinutes}
                onChange={handleSessionFormChange}
                className="input-focus-ring"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={sessionForm.notes}
                onChange={handleSessionFormChange}
                className="input-focus-ring min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={sessionForm.status}
                onValueChange={handleSessionStatusChange}
                required
              >
                <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white input-focus-ring">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="mt-6">
              <Button type="submit" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Log Session
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
