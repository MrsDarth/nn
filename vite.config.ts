import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), viteStaticCopy({
    targets: [
      {
        src: "dist/index.html",
        dest: ".",
        rename: "404.html"
      }
    ]
  })],
  base: mode === "development" ? "/" : "/nn/"
}));
