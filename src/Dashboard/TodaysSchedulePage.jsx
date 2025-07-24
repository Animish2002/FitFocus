// components/dashboard/TodaysSchedulePage.jsx
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Dumbbell, BookOpen } from "lucide-react";

// Mock data for today's schedule (can be fetched from an API in a real app)
const todaySchedule = [
  { time: "06:00 AM", activity: "Morning Workout (HIIT)", type: "fitness", status: "completed" },
  { time: "08:30 AM", activity: "QA Practice - Data Structures", type: "study", status: "completed" },
  { time: "11:00 AM", activity: "VARC Session - Reading Comprehension", type: "study", status: "in-progress" },
  { time: "01:00 PM", activity: "Lunch Break", type: "misc", status: "completed" },
  { time: "02:00 PM", activity: "Client Meeting", type: "work", status: "pending" },
  { time: "04:00 PM", activity: "Cardio Session (Running)", type: "fitness", status: "pending" },
  { time: "07:00 PM", activity: "DILR Practice - Logical Reasoning", type: "study", status: "pending" },
  { time: "09:00 PM", activity: "Evening Meditation", type: "wellness", status: "pending" },
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

export function TodaysSchedulePage() {
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
          <CardHeader>
            <CardTitle className="text-white">Daily Activities</CardTitle>
            <CardDescription className="text-gray-400">
              Overview of your tasks and appointments for today.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((item, index) => (
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
                      <Badge variant="secondary" className={`text-xs rounded-md ${
                        item.type === 'fitness' ? 'bg-[#3EB489]/20 text-[#3EB489]' :
                        item.type === 'study' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {item.type === 'fitness' ? (
                          <><Dumbbell className="w-3 h-3 mr-1" />Fitness</>
                        ) : item.type === 'study' ? (
                          <><BookOpen className="w-3 h-3 mr-1" />Study</>
                        ) : (
                          item.type.charAt(0).toUpperCase() + item.type.slice(1) // Capitalize first letter
                        )}
                      </Badge>
                      <Badge variant="outline" className={`text-xs border-white/20 rounded-md ${
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
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No activities scheduled for today. Time to relax!</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
