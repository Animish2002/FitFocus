// app.tsx
import { ThemeProvider } from "@/components/theme-provider";
import Page from "@/Landing/Page";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPages from "./auth/AuthPages";
// Import the new DashboardLayout
import { DashboardLayout } from "@/Layout/DashboardLayout";

// Import your dashboard content pages
import { DashboardContent } from "@/Dashboard/DashboardContent"; // This is your original dashboard view
import { AskAIPage } from "@/Dashboard/AskAIPage";
import { TodaysSchedulePage } from "@/Dashboard/TodaysSchedulePage";
import { FitnessTrackerPage } from "@/Dashboard/FitnessTrackerPage";
import { StudyProgressPage } from "@/Dashboard/StudyProgressPage";
import { GoalsTargetsPage } from "@/Dashboard/GoalsTargetsPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="/auth" element={<AuthPages />} />{" "}
          {/* Use /* for nested auth routes if any */}
          {/* Dashboard Layout and Nested Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Index route for /dashboard will render DashboardContent */}
            <Route index element={<DashboardContent />} />
            <Route path="ask-ai" element={<AskAIPage />} />
            <Route path="schedule" element={<TodaysSchedulePage />} />
            <Route path="fitness" element={<FitnessTrackerPage />} />
            <Route path="study" element={<StudyProgressPage />} />
            <Route path="goals" element={<GoalsTargetsPage />} />
            {/* Add routes for settings, help, profile etc. if you create pages for them */}
            {/* <Route path="settings" element={<SettingsPage />} /> */}
            {/* <Route path="help" element={<HelpPage />} /> */}
            {/* <Route path="profile" element={<ProfilePage />} /> */}
            {/* <Route path="analytics" element={<AnalyticsPage />} /> */}
          </Route>
          {/* Catch-all for undefined routes within the dashboard if needed, or a 404 page */}
          {/* <Route path="/dashboard/*" element={<NotFoundPage />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
