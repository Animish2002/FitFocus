import { ThemeProvider } from "@/components/theme-provider";
import Page from "@/Landing/Page";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPages from "./auth/AuthPages";
import Dashboard from "./Dashboard/UserDashboard";
import { AskAIPage } from "./Dashboard/AskAIPage";
import { TodaysSchedulePage } from "./Dashboard/TodaysSchedulePage";
import { FitnessTrackerPage } from "./Dashboard/FitnessTrackerPage";
import { StudyProgressPage } from "./Dashboard/StudyProgressPage";
import { GoalsTargetsPage } from "./Dashboard/GoalsTargetsPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="/auth" element={<AuthPages />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ask-ai" element={<AskAIPage />} />
          <Route path="/schedule" element={<TodaysSchedulePage />} />
          <Route path="/fitness" element={<FitnessTrackerPage />} />
          <Route path="/study" element={<StudyProgressPage />} />
          <Route path="/goals" element={<GoalsTargetsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
