import { type PropsWithChildren, createContext, useContext, useState, useLayoutEffect } from "react";
import { MoonIcon, SunIcon } from "./Icons";

type Theme = "light" | "dark";

type ThemeState = [
    theme: Theme,
    setTheme: (theme: Theme) => void
]

function initialTheme(): Theme {
    const localTheme = localStorage.getItem("theme");
    if (localTheme === "light" || localTheme === "dark")
        return localTheme;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    return query.matches ? "dark" : "light";
}

const ThemeContext = createContext<ThemeState>(null!);

export const useTheme = () => useContext(ThemeContext);

export function ThemeToggle() {
    const [theme, setTheme] = useTheme();
    const isDark = theme === "dark";
    return (

        <label className="swap swap-rotate">
            <input
                type="checkbox"
                checked={isDark}
                onChange={() => setTheme(isDark ? "light" : "dark")}
            />
            <SunIcon className="swap-off fill-current w-10 h-10" />
            <MoonIcon className="swap-on fill-current w-10 h-10" />
        </label>
    );
    ;
}

export function ThemeProvider({ children }: PropsWithChildren) {
    const [theme, setTheme] = useState(initialTheme);
    useLayoutEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);
    return (
        <ThemeContext.Provider value={[theme, setTheme]}>
            {children}
        </ThemeContext.Provider>
    );
};
