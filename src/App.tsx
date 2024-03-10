import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/Theme";
import Home from "./pages/Home";

export default function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col bg-base-200">
        <Navbar />
        <Home />
      </div>
    </ThemeProvider>
  )
};
