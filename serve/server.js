import express from "express";
import { fileURLToPath } from "url";

const app = express();
app.use("/nn/", express.static("dist"));
app.use((_, res) => res.sendFile(fileURLToPath(import.meta.resolve("../dist/404.html"))));
app.listen(3000, () => console.log("serving preview on http://localhost:3000/"));
