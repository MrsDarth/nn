import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../components/Theme";
import Navbar from "../components/Navbar";

export default function Layout() {
    return (
        <ThemeProvider>
            <div className="flex flex-col bg-base-200">
                <Navbar />
                <Outlet />
            </div>
        </ThemeProvider>
    )
}
