// src/components/auth/AuthCardWrapper.jsx
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain } from "lucide-react";

const slideIn = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const AuthCardWrapper = ({ title, description, children }) => {
  return (
    <motion.div
      className="w-full max-w-md"
      variants={slideIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <motion.div
            className="flex items-center justify-center space-x-3 mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3EB489] to-[#2ea374] rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              FitFocus
            </span>
          </motion.div>

          <CardTitle className="text-3xl font-bold text-white">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuthCardWrapper;