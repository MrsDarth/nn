import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography"
import daisyui from "daisyui";

export default <Config> {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [typography, daisyui],
}

