import { ThemeProvider } from "@/components/theme-provider";
import Page from "@/Landing/Page";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Page />
      </ThemeProvider>
    </>
  );
}

export default App;
