import { ThemeToggle } from "./Theme";

export default function Navbar() {
    return (
        <div className="flex justify-between bg-base-100 rounded-b-xl p-5">
            <div className="prose">
                <h1>Neural Network Playground</h1>
            </div>
            <ThemeToggle/>
        </div>
    );
};
