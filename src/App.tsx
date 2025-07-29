import { ThemeProvider } from "@/components/theme-provider";
import Page from "@/Landing/Page";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthLayout from "@/auth/AuthLayout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "@/auth/ProtectedRoutes";

import { DashboardLayout } from "@/Layout/DashboardLayout";

// Import your dashboard content pages
import { DashboardContent } from "@/Dashboard/DashboardContent";
import { SmartAssistantPage } from "@/Dashboard/SmartAssistantPage";
import { TodaysSchedulePage } from "@/Dashboard/TodaysSchedulePage";
import { FitnessTrackerPage } from "@/Dashboard/FitnessTrackerPage";
import { StudyProgressPage } from "@/Dashboard/StudyProgressPage";
import { GoalsTargetsPage } from "@/Dashboard/GoalsTargetsPage";
import NotFoundPage from "./Dashboard/NotFoundPage";
import ProfilePage from "./Dashboard/Profile";
import { GeneralChatPage } from "./Dashboard/GeneralChatPage";
import { NotificationSettingsPage } from "./Dashboard/NotificationSettingsPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Page />} />
            <Route path="/auth" element={<AuthLayout />} />{" "}
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                {" "}
                {/* DashboardLayout wraps content */}
                {/* Index route for /dashboard will render DashboardContent */}
                <Route index element={<DashboardContent />} />
                <Route
                  path="smart-assistant"
                  element={<SmartAssistantPage />}
                />
                <Route path="general-assistant" element={<GeneralChatPage />} />
                <Route path="schedule" element={<TodaysSchedulePage />} />
                <Route path="fitness" element={<FitnessTrackerPage />} />
                <Route path="study" element={<StudyProgressPage />} />
                <Route path="goals" element={<GoalsTargetsPage />} />
                {/* Add routes for settings, help, profile etc. if you create pages for them */}
                {/* <Route path="settings" element={<SettingsPage />} /> */}
                <Route
                  path="settings/notifications"
                  element={<NotificationSettingsPage />}
                />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>
            {/* Catch-all for undefined routes within the dashboard if needed, or a 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
