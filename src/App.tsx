import Navbar from "./components/Navbar";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="flex flex-col bg-base-200">
      <Navbar />
      <Home />
    </div>
  )
};
