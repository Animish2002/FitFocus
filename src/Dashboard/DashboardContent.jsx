import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Zap,
  Activity,
  Timer,
  Award,
  CheckCircle2,
  Clock,
  Dumbbell,
  BookOpen,
  MoreHorizontal,
  Loader2,
  XCircle,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext"; // Import useAuth
import axiosInstance from "@/api/axiosInstance"; // Import axiosInstance

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

export function DashboardContent() {
  const { user, logout } = useAuth();
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Derived state for dynamic stats cards
  const [dynamicStats, setDynamicStats] = useState([]);

  // Mock data for achievements (no backend API for this yet)
  const recentAchievements = [
    {
      title: "First Week Complete!",
      description: "Completed your first week of balanced routine",
      date: "2 days ago",
    },
    {
      title: "Study Champion",
      description: "Maintained 7-day study streak",
      date: "5 days ago",
    },
    {
      title: "Fitness Milestone",
      description: "Completed 10 workout sessions",
      date: "1 week ago",
    },
  ];

  // Function to fetch all dashboard data
  const fetchDashboardData = async () => {
    if (!user?.id) {
      setError("User not logged in or context not loaded.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch Dashboard Summary
      const summaryResponse = await axiosInstance.get("/dashboard/summary");
      setDashboardSummary(summaryResponse.data.summary);

      // Fetch Today's Schedule
      const today = new Date();
      const todayDateString = today.toISOString().split("T")[0];
      const scheduleResponse = await axiosInstance.get(
        "/schedule/get-schedule",
        {
          params: { date: todayDateString },
        }
      );
      // Sort schedule items by time
      const sortedSchedule = scheduleResponse.data.scheduleItems.sort(
        (a, b) => {
          const timeA = a.time.split(":").map(Number);
          const timeB = b.time.split(":").map(Number);
          if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
          return timeA[1] - timeB[1];
        }
      );
      setTodaySchedule(sortedSchedule);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard data."
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
    fetchDashboardData();
  }, [user?.id, logout]); // Re-fetch when user changes or logout function changes

  // Effect to calculate dynamic stats once dashboardSummary and todaySchedule are available
  useEffect(() => {
    if (dashboardSummary && todaySchedule) {
      const totalTodayFocusMinutes = todaySchedule
        .filter(
          (item) =>
            item.status === "completed" &&
            (item.type === "fitness" || item.type === "study")
        )
        .reduce((sum, item) => sum + (item.durationMinutes || 0), 0); // Assuming schedule items might have durationMinutes in future

      const overallGoalCompletion =
        dashboardSummary.goals.total > 0
          ? Math.round(
              (dashboardSummary.goals.completed /
                dashboardSummary.goals.total) *
                100
            )
          : 0;

      setDynamicStats([
        {
          label: "Activity Streak",
          value: dashboardSummary.streaks.scheduleCompletionDays,
          unit: "days",
          icon: Zap,
          color: "text-orange-500",
        },
        {
          label: "Total Goals",
          value: dashboardSummary.goals.total,
          unit: "goals",
          icon: Award,
          color: "text-purple-500",
        },
        {
          label: "Completed Today",
          value: dashboardSummary.todaySchedule.completed,
          unit: "items",
          icon: CheckCircle2,
          color: "text-[#3EB489]",
        },
        {
          label: "Weekly Active",
          value:
            Math.round(
              ((dashboardSummary.last7Days.totalFitnessMinutes +
                dashboardSummary.last7Days.totalStudyMinutes) /
                60) *
                10
            ) / 10,
          unit: "hours",
          icon: Activity,
          color: "text-blue-500",
        },
      ]);
    }
  }, [dashboardSummary, todaySchedule]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#3EB489]" />
        <p>Loading dashboard data...</p>
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

  // Calculate pending activities for welcome message
  const pendingActivitiesToday = dashboardSummary?.todaySchedule?.pending || 0;
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 20) return "Good evening";
    return "Good night";
  };

  return (
    <motion.div
      className="space-y-8"
      variants={staggerChildren}
      initial="initial"
      animate="animate"
    >
      {/* Welcome Section */}
      <motion.div variants={fadeInUp}>
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {getGreeting()},{" "}
              <span className="text-[#3EB489] bitcount-grid-single-hero md:text-4xl text-3xl">{user?.name || "User"}</span>! 👋
            </h1>
            <p className="text-gray-400 mt-2">
              Ready to balance your body and mind today? You have{" "}
              {pendingActivitiesToday} activities scheduled.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              asChild
              className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white"
            >
              <Link to="/dashboard/smart-assistant">
                <Zap className="w-4 h-4 mr-2" />
                Generate Today's Plan
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dynamicStats.map((stat, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-[#3EB489]/30 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      {stat.label}
                    </p>
                    <div className="flex items-baseline space-x-1 mt-2">
                      <span className="text-2xl font-bold text-white">
                        {stat.value}
                      </span>
                      <span className="text-gray-400 text-sm">{stat.unit}</span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Today's Schedule</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your AI-optimized daily plan
                  </CardDescription>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <Link to="/dashboard/schedule">
                    <MoreHorizontal className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
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
                        <span className="text-sm text-gray-400">
                          {item.time}
                        </span>
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
                            item.type.charAt(0).toUpperCase() +
                            item.type.slice(1) // Capitalize first letter
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
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">
                  No activities scheduled for today. Time to relax!
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Side Panel */}
        <motion.div variants={fadeInUp} className="space-y-6">
          {/* Progress Overview */}
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Study Goals</span>
                  <span className="text-sm font-medium text-white">
                    {dashboardSummary?.goals?.total > 0
                      ? `${Math.round(
                          (dashboardSummary.goals.completed /
                            dashboardSummary.goals.total) *
                            100
                        )}%`
                      : "0%"}
                  </span>
                </div>
                <Progress
                  value={
                    dashboardSummary?.goals?.total > 0
                      ? (dashboardSummary.goals.completed /
                          dashboardSummary.goals.total) *
                        100
                      : 0
                  }
                  className="h-2 bg-white/10"
                >
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                    style={{
                      width: `${
                        dashboardSummary?.goals?.total > 0
                          ? (dashboardSummary.goals.completed /
                              dashboardSummary.goals.total) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </Progress>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Fitness Goals</span>
                  <span className="text-sm font-medium text-white">
                    {dashboardSummary?.goals?.total > 0
                      ? `${Math.round(
                          (dashboardSummary.goals.completed /
                            dashboardSummary.goals.total) *
                            100
                        )}%` // Assuming overall completion for now
                      : "0%"}
                  </span>
                </div>
                <Progress
                  value={
                    dashboardSummary?.goals?.total > 0
                      ? (dashboardSummary.goals.completed /
                          dashboardSummary.goals.total) *
                        100
                      : 0
                  }
                  className="h-2 bg-white/10"
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#3EB489] to-[#2ea374] rounded-full"
                    style={{
                      width: `${
                        dashboardSummary?.goals?.total > 0
                          ? (dashboardSummary.goals.completed /
                              dashboardSummary.goals.total) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </Progress>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Overall Balance</span>
                  <span className="text-sm font-medium text-white">
                    {dashboardSummary?.goals?.total > 0
                      ? `${Math.round(
                          (dashboardSummary.goals.completed /
                            dashboardSummary.goals.total) *
                            100
                        )}%`
                      : "0%"}
                  </span>
                </div>
                <Progress
                  value={
                    dashboardSummary?.goals?.total > 0
                      ? (dashboardSummary.goals.completed /
                          dashboardSummary.goals.total) *
                        100
                      : 0
                  }
                  className="h-2 bg-white/10"
                >
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                    style={{
                      width: `${
                        dashboardSummary?.goals?.total > 0
                          ? (dashboardSummary.goals.completed /
                              dashboardSummary.goals.total) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </Progress>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements (still mock data) */}
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="w-8 h-8 bg-[#3EB489]/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award className="w-4 h-4 text-[#3EB489]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-white">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {achievement.description}
                    </p>
                    <span className="text-xs text-gray-500">
                      {achievement.date}
                    </span>
                  </div>
                </div>
              ))}
              {recentAchievements.length === 0 && (
                <p className="text-gray-400 text-center py-4">
                  No recent achievements yet. Keep pushing!
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
