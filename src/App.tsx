import { ThemeProvider } from "@/components/theme-provider";
import Page from "@/Landing/Page";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPages from "./auth/AuthPages";


function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="/auth" element={<AuthPages />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

