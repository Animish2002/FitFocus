import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  Send,
  Loader2,
  MessageSquareText,
  CheckCircle,
  XCircle,
  Goal,
  CalendarDays,
  Dumbbell,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion } from "framer-motion";

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

export function SmartAssistantPage() {
  const { user, logout } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [suggestedPlan, setSuggestedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [planAcceptedSuccess, setPlanAcceptedSuccess] = useState(null);
  const [planAcceptedError, setPlanAcceptedError] = useState(null);

  // State for Voice Input
  const [isListening, setIsListening] = useState(false);
  const [voiceInputStatus, setVoiceInputStatus] = useState(""); // e.g., "Listening...", "Processing..."
  const recognitionRef = useRef(null); // Ref for SpeechRecognition instance

  // Initialize SpeechRecognition on component mount
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Set to true for continuous listening
      recognitionRef.current.interimResults = true; // Get interim results to update prompt while speaking
      recognitionRef.current.lang = "en-US"; // Set language

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setVoiceInputStatus("Listening...");
        setError(null); // Clear any previous errors
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        // Update prompt with both final and interim results
        setPrompt(
          (prevPrompt) => prevPrompt + finalTranscript + interimTranscript
        );
        setVoiceInputStatus("Listening... (Speak clearly)");
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        setVoiceInputStatus("");
        setError(`Voice input error: ${event.error}. Please try again.`);
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "no-speech") {
          setError("No speech detected. Please try again.");
        } else if (event.error === "not-allowed") {
          setError(
            "Microphone access denied. Please allow microphone access in your browser settings."
          );
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setVoiceInputStatus("");
        // When recognition ends (due to stop() or error), don't automatically send.
        // Sending will be handled by the "Stop Listening" button.
      };
    } else {
      setError("Web Speech API is not supported in this browser.");
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle sending the prompt to the AI command endpoint
  const handleAskAI = async (currentPrompt = prompt) => {
    if (!currentPrompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setAiMessage("");
    setSuggestedPlan(null);
    setError(null);
    setPlanAcceptedSuccess(null);
    setPlanAcceptedError(null);
    setVoiceInputStatus(""); // Clear voice status

    try {
      const response = await axiosInstance.post("/ai/command", {
        command: currentPrompt,
      });

      const data = response.data;
      console.log("AI Command Response:", data);

      setAiMessage(data.message);

      if (data.suggestedPlan) {
        setSuggestedPlan(data.suggestedPlan);
      }
    } catch (err) {
      console.error("Error calling /api/ai/command:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to get response from AI command."
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

  // Function to start/stop voice input
  const handleVoiceInputToggle = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop(); // Stop recognition
        setIsListening(false);
        setVoiceInputStatus("");
        if (prompt.trim()) {
          // If there's a prompt, send it
          handleAskAI(prompt);
        }
      } else {
        setPrompt(""); // Clear prompt before starting voice input
        setAiMessage("");
        setSuggestedPlan(null);
        setError(null);
        setPlanAcceptedSuccess(null);
        setPlanAcceptedError(null);
        recognitionRef.current.start();
      }
    } else {
      setError("Web Speech API is not supported in this browser.");
    }
  };

  // Function to handle accepting a suggested plan (Study or Fitness)
  const handleAcceptPlan = async () => {
    if (!suggestedPlan) return;

    setPlanAcceptedSuccess(null);
    setPlanAcceptedError(null);
    setLoading(true);

    try {
      if (suggestedPlan.category === "Study") {
        const studyGoal = {
          name: `Study: ${suggestedPlan.topic}`,
          category: "Study",
          description:
            suggestedPlan.briefOutline ||
            `Study plan for ${suggestedPlan.topic}. Recommended duration: ${suggestedPlan.recommendedDurationMinutes} minutes.`,
          targetValue: suggestedPlan.practiceQuestions,
          unit: "questions",
          status: "In Progress",
        };
        await axiosInstance.post("/goals", studyGoal);
        setPlanAcceptedSuccess("Study plan added to your goals!");
      } else if (
        suggestedPlan.suggestedGoals &&
        suggestedPlan.suggestedGoals.length > 0
      ) {
        const goalPromises = suggestedPlan.suggestedGoals.map((goal) =>
          axiosInstance.post("/goals", {
            name: goal.name,
            category: goal.category,
            targetValue: goal.targetValue,
            unit: goal.unit,
            dueDate: goal.dueDate,
            description: goal.description,
            status: "In Progress",
          })
        );
        await Promise.all(goalPromises);
        setPlanAcceptedSuccess("Fitness plan goals added to your goals!");

        const schedulePromises = suggestedPlan.exerciseRecommendations.map(
          (exercise) => {
            return axiosInstance.post("/schedule", {
              activity: exercise.name,
              time: "08:00", // Placeholder time, user might adjust in dedicated schedule page
              type: "fitness",
              status: "pending",
              date: new Date().toISOString().split("T")[0], // Today's date
              notes: `Recommended: ${exercise.frequencyPerWeek}x/week for ${exercise.durationMinutesPerSession} mins. ${exercise.notes}`,
            });
          }
        );
        await Promise.all(schedulePromises);
        setPlanAcceptedSuccess(
          (prev) => prev + " And exercises added to today's schedule!"
        );
      } else {
        setPlanAcceptedError(
          "No actionable plan found to add to goals/schedule."
        );
      }
    } catch (err) {
      console.error("Error accepting plan:", err);
      setPlanAcceptedError(
        err.response?.data?.message || err.message || "Failed to accept plan."
      );
    } finally {
      setLoading(false);
      setSuggestedPlan(null);
      setAiMessage("");
      setPrompt(""); // Clear prompt after plan acceptance
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
        <h1 className="text-3xl font-bold text-white">Smart Assistant</h1>
        <p className="text-gray-400 mt-2">
          Command your assistant to manage tasks, get personalized plans, or ask
          anything.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Your Command</CardTitle>
            <CardDescription className="text-gray-400">
              Type or speak your request.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., 'I completed my morning workout today.' or 'Suggest a study plan for quantum physics.' or 'Give me a fitness plan to lose 5kg in 2 months.'"
              className="min-h-[120px] bg-white/5 border-white/20 focus:border-[#3EB489] text-white placeholder-gray-400 rounded-md"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isListening}
            />
            {isListening && (
              <p className="text-sm text-blue-400 flex items-center">
                <Volume2 className="w-4 h-4 mr-2 animate-pulse" />{" "}
                {voiceInputStatus || "Listening..."}
              </p>
            )}
            {error && !isListening && (
              <p className="text-red-400 flex items-center">
                <XCircle className="w-4 h-4 mr-2" /> {error}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white rounded-md"
                onClick={() => handleAskAI()}
                disabled={loading || isListening}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Command
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className={`flex-1 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white rounded-md ${
                  isListening ? "bg-blue-600/20 text-blue-400" : ""
                }`}
                onClick={handleVoiceInputToggle}
                disabled={
                  loading ||
                  (!window.SpeechRecognition && !window.webkitSpeechRecognition)
                }
              >
                {isListening ? (
                  <>
                    <VolumeX className="mr-2 h-4 w-4" /> Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" /> Voice Input
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Response Display */}
      {(aiMessage ||
        suggestedPlan ||
        planAcceptedSuccess ||
        planAcceptedError) && (
        <motion.div variants={fadeInUp}>
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquareText className="mr-2 h-5 w-5 text-[#3EB489]" />
                Assistant Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center text-gray-400">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating response...
                </div>
              )}
              {planAcceptedError && (
                <p className="text-red-400 flex items-center">
                  <XCircle className="w-4 h-4 mr-2" /> {planAcceptedError}
                </p>
              )}
              {planAcceptedSuccess && (
                <p className="text-green-400 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" /> {planAcceptedSuccess}
                </p>
              )}

              {/* Display General AI Message */}
              {aiMessage && !suggestedPlan && (
                <p className="text-gray-300 whitespace-pre-wrap">{aiMessage}</p>
              )}

              {/* Display Structured Plan */}
              {suggestedPlan && (
                <div className="space-y-4 text-gray-300">
                  <h4 className="text-lg font-semibold text-white flex items-center">
                    {suggestedPlan.category === "Study" ? (
                      <CalendarDays className="w-5 h-5 mr-2 text-blue-400" />
                    ) : (
                      <Dumbbell className="w-5 h-5 mr-2 text-pink-400" />
                    )}
                    Suggested {suggestedPlan.category} Plan:{" "}
                    {suggestedPlan.topic || suggestedPlan.summary}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {suggestedPlan.briefOutline || suggestedPlan.summary}
                  </p>

                  {suggestedPlan.dailyCalorieIntake && (
                    <p>
                      <strong>Daily Calories:</strong>{" "}
                      {suggestedPlan.dailyCalorieIntake} kcal
                    </p>
                  )}
                  {suggestedPlan.recommendedDurationMinutes && (
                    <p>
                      <strong>Recommended Duration:</strong>{" "}
                      {suggestedPlan.recommendedDurationMinutes} minutes
                    </p>
                  )}
                  {suggestedPlan.practiceQuestions && (
                    <p>
                      <strong>Practice Questions:</strong>{" "}
                      {suggestedPlan.practiceQuestions}
                    </p>
                  )}
                  {suggestedPlan.difficultyLevel && (
                    <p>
                      <strong>Difficulty:</strong>{" "}
                      {suggestedPlan.difficultyLevel}
                    </p>
                  )}

                  {suggestedPlan.subtopics &&
                    suggestedPlan.subtopics.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-white">Sub-topics:</p>
                        <ul className="list-disc list-inside text-sm text-gray-400 pl-4">
                          {suggestedPlan.subtopics.map((sub, index) => (
                            <li key={index}>{sub}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {suggestedPlan.exerciseRecommendations &&
                    suggestedPlan.exerciseRecommendations.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-white">
                          Exercise Recommendations:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-400 pl-4">
                          {suggestedPlan.exerciseRecommendations.map(
                            (ex, index) => (
                              <li key={index}>
                                <strong>
                                  {ex.name} ({ex.type}):
                                </strong>{" "}
                                {ex.frequencyPerWeek}x/week,{" "}
                                {ex.durationMinutesPerSession} mins/session.{" "}
                                {ex.notes}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {suggestedPlan.dietTips &&
                    suggestedPlan.dietTips.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-white">Diet Tips:</p>
                        <ul className="list-disc list-inside text-sm text-gray-400 pl-4">
                          {suggestedPlan.dietTips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {suggestedPlan.suggestedGoals &&
                    suggestedPlan.suggestedGoals.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-white flex items-center">
                          <Goal className="w-4 h-4 mr-2 text-yellow-400" />
                          Suggested Goals:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-400 pl-4">
                          {suggestedPlan.suggestedGoals.map((goal, index) => (
                            <li key={index}>
                              <strong>
                                {goal.name} ({goal.category}):
                              </strong>{" "}
                              {goal.description}
                              {goal.targetValue
                                ? ` Target: ${goal.targetValue} ${
                                    goal.unit || ""
                                  }.`
                                : ""}
                              {goal.dueDate
                                ? ` Due: ${new Date(
                                    goal.dueDate
                                  ).toLocaleDateString()}.`
                                : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  <div className="mt-6 flex justify-end">
                    <Button
                      className="bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white rounded-md"
                      onClick={handleAcceptPlan}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding to Goals...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" /> Accept Plan &
                          Add to Goals
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
