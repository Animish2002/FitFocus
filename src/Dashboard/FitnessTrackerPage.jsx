// components/dashboard/FitnessTrackerPage.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Dumbbell, Heart, Flame, TrendingUp, Plus, BarChart3,Timer } from "lucide-react";

// Mock data for fitness metrics
const fitnessMetrics = [
  { label: "Daily Steps", current: 7500, target: 10000, unit: "steps", icon: Dumbbell, color: "text-[#3EB489]" },
  { label: "Calories Burned", current: 500, target: 700, unit: "kcal", icon: Flame, color: "text-orange-500" },
  { label: "Heart Rate (Avg)", current: 72, target: 70, unit: "bpm", icon: Heart, color: "text-red-500" },
  { label: "Workout Duration", current: 45, target: 60, unit: "mins", icon: Timer, color: "text-blue-500" },
];

const recentWorkouts = [
  { name: "Morning HIIT", duration: "30 mins", date: "Today", calories: 350, type: "Cardio" },
  { name: "Strength Training", duration: "45 mins", date: "Yesterday", calories: 400, type: "Strength" },
  { name: "Yoga Flow", duration: "60 mins", date: "2 days ago", calories: 200, type: "Flexibility" },
];

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
        {/* Fitness Metrics */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Your Daily Metrics</CardTitle>
              <CardDescription className="text-gray-400">
                Track your key fitness indicators.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fitnessMetrics.map((metric, index) => (
                <div key={index} className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <metric.icon className={`w-5 h-5 ${metric.color}`} />
                      <span className="text-sm text-gray-300 font-medium">{metric.label}</span>
                    </div>
                    <span className="text-sm font-medium text-white">
                      {metric.current} / {metric.target} {metric.unit}
                    </span>
                  </div>
                  <Progress value={(metric.current / metric.target) * 100} className="h-2 bg-white/10">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        metric.color === "text-[#3EB489]" ? "from-[#3EB489] to-[#2ea374]" :
                        metric.color === "text-orange-500" ? "from-orange-500 to-orange-400" :
                        metric.color === "text-red-500" ? "from-red-500 to-red-400" :
                        "from-blue-500 to-blue-400"
                      } rounded-full`}
                      style={{ width: `${(metric.current / metric.target) * 100}%` }}
                    />
                  </Progress>
                </div>
              ))}
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
              {recentWorkouts.length > 0 ? (
                recentWorkouts.map((workout, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-white">{workout.name}</h4>
                      <p className="text-xs text-gray-400">{workout.duration} &bull; {workout.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-300">{workout.calories} kcal</span>
                      <Dumbbell className="w-4 h-4 text-[#3EB489]" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No recent workouts logged.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-[#3EB489] hover:bg-[#2ea374] text-white rounded-md">
                <Plus className="mr-2 h-4 w-4" /> Log New Workout
              </Button>
              <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10 hover:text-white rounded-md">
                <BarChart3 className="mr-2 h-4 w-4" /> View Analytics
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
