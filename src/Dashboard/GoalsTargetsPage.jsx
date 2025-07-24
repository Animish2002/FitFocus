// components/dashboard/GoalsTargetsPage.jsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Target, Plus, CheckCircle2, Clock, Edit, Trash2 } from "lucide-react";

// Mock data for goals (can be managed with state/Firestore in a real app)
const initialGoals = [
  {
    id: 1,
    name: "Complete CAT Syllabus",
    category: "Study",
    progress: 70,
    dueDate: "2025-11-30",
    status: "In Progress",
    description: "Cover all topics in Quantitative Aptitude, VARC, and DILR.",
  },
  {
    id: 2,
    name: "Run a Half Marathon",
    category: "Fitness",
    progress: 40,
    dueDate: "2025-09-15",
    status: "In Progress",
    description: "Increase running distance and stamina over 12 weeks.",
  },
  {
    id: 3,
    name: "Read 10 Books",
    category: "Personal Development",
    progress: 100,
    dueDate: "2025-07-20",
    status: "Completed",
    description: "Finish 10 non-fiction books this year.",
  },
  {
    id: 4,
    name: "Meditate Daily",
    category: "Wellness",
    progress: 90,
    dueDate: "Ongoing",
    status: "In Progress",
    description: "Practice mindfulness meditation for 15 minutes every morning.",
  },
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

export function GoalsTargetsPage() {
  const [goals, setGoals] = useState(initialGoals);

  // Helper to get color for progress bar based on category
  const getProgressColor = (category) => {
    switch (category) {
      case "Study": return "from-blue-500 to-blue-400";
      case "Fitness": return "from-[#3EB489] to-[#2ea374]";
      case "Personal Development": return "from-purple-500 to-purple-400";
      case "Wellness": return "from-pink-500 to-pink-400";
      default: return "from-gray-500 to-gray-400";
    }
  };

  // Placeholder for adding/editing goals
  const handleAddGoal = () => {
    alert("Add Goal functionality coming soon!"); // Using alert for demo, replace with modal in real app
  };

  const handleEditGoal = (id) => {
    alert(`Edit Goal ${id} functionality coming soon!`);
  };

  const handleDeleteGoal = (id) => {
    if (confirm(`Are you sure you want to delete goal ID: ${id}?`)) { // Using confirm for demo, replace with modal
      setGoals(goals.filter(goal => goal.id !== id));
    }
  };

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
                A comprehensive view of your short-term and long-term objectives.
              </CardDescription>
            </div>
            <Button className="bg-[#3EB489] hover:bg-[#2ea374] text-white rounded-md" onClick={handleAddGoal}>
              <Plus className="mr-2 h-4 w-4" /> Add New Goal
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <div key={goal.id} className="p-5 bg-white/5 border border-white/10 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs rounded-md ${
                        goal.status === "Completed" ? "bg-green-500/20 text-green-400" :
                        goal.status === "In Progress" ? "bg-[#3EB489]/20 text-[#3EB489]" :
                        "bg-gray-500/20 text-gray-400"
                      }`}>
                        {goal.status === "Completed" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {goal.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-white/20 text-gray-400 rounded-md">
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
                        className={`h-full bg-gradient-to-r ${getProgressColor(goal.category)} rounded-full`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </Progress>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Due Date: {goal.dueDate}</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-md" onClick={() => handleEditGoal(goal.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md" onClick={() => handleDeleteGoal(goal.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No goals defined yet. Click "Add New Goal" to get started!</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
