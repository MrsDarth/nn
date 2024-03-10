import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography"
import daisyui, { type Config as DaisyuiConfig } from "daisyui";

export default <Config>{
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: <DaisyuiConfig>{
    themes: ["light", "dark"]
  },
  plugins: [typography, daisyui],
}

