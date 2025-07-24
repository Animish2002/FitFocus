// components/dashboard/DashboardContent.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Zap, Activity, Timer, Award, CheckCircle2, Clock, Dumbbell, BookOpen, MoreHorizontal } from "lucide-react";

// Mock data for dashboard
const todaySchedule = [
  { time: "06:00", activity: "Morning Workout", type: "fitness", status: "completed" },
  { time: "08:30", activity: "QA Practice", type: "study", status: "completed" },
  { time: "11:00", activity: "VARC Session", type: "study", status: "in-progress" },
  { time: "16:00", activity: "Cardio Session", type: "fitness", status: "pending" },
  { time: "19:00", activity: "DILR Practice", type: "study", status: "pending" },
];

const stats = [
  { label: "Study Streak", value: "12", unit: "days", icon: Zap, color: "text-orange-500" },
  { label: "Workout Streak", value: "8", unit: "days", icon: Activity, color: "text-[#3EB489]" },
  { label: "Today's Focus", value: "4.2", unit: "hours", icon: Timer, color: "text-blue-500" },
  { label: "Weekly Progress", value: "87", unit: "%", icon: Award, color: "text-purple-500" },
];

const recentAchievements = [
  { title: "First Week Complete!", description: "Completed your first week of balanced routine", date: "2 days ago" },
  { title: "Study Champion", description: "Maintained 7-day study streak", date: "5 days ago" },
  { title: "Fitness Milestone", description: "Completed 10 workout sessions", date: "1 week ago" },
];

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
              Good morning, <span className="text-[#3EB489]">Animish</span>! 👋
            </h1>
            <p className="text-gray-400 mt-2">
              Ready to balance your body and mind today? You have 3 activities scheduled.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white">
              <Zap className="w-4 h-4 mr-2" />
              Generate Today's Plan
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-[#3EB489]/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                    <div className="flex items-baseline space-x-1 mt-2">
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                      <span className="text-gray-400 text-sm">{stat.unit}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
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
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaySchedule.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      item.status === 'in-progress' ? 'bg-[#3EB489]/20 text-[#3EB489]' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {item.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : item.status === 'in-progress' ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${
                        item.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'
                      }`}>
                        {item.activity}
                      </h4>
                      <span className="text-sm text-gray-400">{item.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className={`text-xs ${
                        item.type === 'fitness' ? 'bg-[#3EB489]/20 text-[#3EB489]' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {item.type === 'fitness' ? (
                          <><Dumbbell className="w-3 h-3 mr-1" />Fitness</>
                        ) : (
                          <><BookOpen className="w-3 h-3 mr-1" />Study</>
                        )}
                      </Badge>
                      <Badge variant="outline" className={`text-xs border-white/20 ${
                        item.status === 'completed' ? 'text-green-400' :
                        item.status === 'in-progress' ? 'text-[#3EB489]' :
                        'text-gray-400'
                      }`}>
                        {item.status === 'completed' ? 'Completed' :
                          item.status === 'in-progress' ? 'In Progress' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Side Panel */}
        <motion.div variants={fadeInUp} className="space-y-6">
          {/* Progress Overview */}
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Study Goals</span>
                  <span className="text-sm font-medium text-white">75%</span>
                </div>
                <Progress value={75} className="h-2 bg-white/10">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{width: '75%'}} />
                </Progress>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Fitness Goals</span>
                  <span className="text-sm font-medium text-white">92%</span>
                </div>
                <Progress value={92} className="h-2 bg-white/10">
                  <div className="h-full bg-gradient-to-r from-[#3EB489] to-[#2ea374] rounded-full" style={{width: '92%'}} />
                </Progress>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Overall Balance</span>
                  <span className="text-sm font-medium text-white">84%</span>
                </div>
                <Progress value={84} className="h-2 bg-white/10">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" style={{width: '84%'}} />
                </Progress>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 bg-[#3EB489]/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award className="w-4 h-4 text-[#3EB489]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-white">{achievement.title}</h4>
                    <p className="text-xs text-gray-400">{achievement.description}</p>
                    <span className="text-xs text-gray-500">{achievement.date}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

