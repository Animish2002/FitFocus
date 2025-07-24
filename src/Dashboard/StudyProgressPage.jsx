// components/dashboard/StudyProgressPage.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, TrendingUp, CheckCircle2, Clock, BarChart3, Plus } from "lucide-react";

// Mock data for study progress
const studySubjects = [
  { name: "Quantitative Aptitude", progress: 85, totalHours: 120, completedHours: 102, color: "blue" },
  { name: "Verbal Ability & RC", progress: 70, totalHours: 100, completedHours: 70, color: "purple" },
  { name: "Data Interpretation & LR", progress: 60, totalHours: 90, completedHours: 54, color: "orange" },
  { name: "General Knowledge", progress: 40, totalHours: 50, completedHours: 20, color: "green" },
];

const recentSessions = [
  { topic: "Algebra Basics", duration: "60 mins", date: "Today", status: "completed" },
  { topic: "Reading Speed Drills", duration: "45 mins", date: "Yesterday", status: "completed" },
  { topic: "Puzzles & Seating Arrangements", duration: "90 mins", date: "2 days ago", status: "in-progress" },
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

export function StudyProgressPage() {
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
        {/* Subject Progress */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Subject Mastery</CardTitle>
              <CardDescription className="text-gray-400">
                Your progress across different study subjects.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {studySubjects.map((subject, index) => (
                <div key={index} className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className={`w-5 h-5 text-${subject.color}-400`} />
                      <span className="text-sm text-gray-300 font-medium">{subject.name}</span>
                    </div>
                    <span className="text-sm font-medium text-white">
                      {subject.progress}%
                    </span>
                  </div>
                  <Progress value={subject.progress} className="h-2 bg-white/10">
                    <div
                      className={`h-full bg-gradient-to-r from-${subject.color}-500 to-${subject.color}-400 rounded-full`}
                      style={{ width: `${subject.progress}%` }}
                    />
                  </Progress>
                  <p className="text-xs text-gray-500">
                    {subject.completedHours} of {subject.totalHours} hours completed
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Study Sessions & Quick Actions */}
        <motion.div variants={fadeInUp} className="space-y-6">
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Recent Study Sessions</CardTitle>
              <CardDescription className="text-gray-400">
                A log of your latest study activities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentSessions.length > 0 ? (
                recentSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-white">{session.topic}</h4>
                      <p className="text-xs text-gray-400">{session.duration} &bull; {session.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-400" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No recent study sessions logged.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-[#3EB489] hover:bg-[#2ea374] text-white rounded-md">
                <Plus className="mr-2 h-4 w-4" /> Log New Session
              </Button>
              <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10 hover:text-white rounded-md">
                <BarChart3 className="mr-2 h-4 w-4" /> View Study Analytics
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}