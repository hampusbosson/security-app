import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { raw } from "body-parser";

import authRoutes from "./routes/authRoutes"
import githubRoutes from "./routes/githubRoutes";
import scanRoutes from "./routes/scanRoutes";
import { githubWebhook } from "./controllers/githubWebhook";
import { recoverInterruptedScans } from "./services/scanRecovery";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


// FOR FUTURE GITHUB WEBHOOK HANDLING 
//app.post(
//  "/api/github/webhook",
//  raw({ type: "*/*" }),
//  githubWebhook
//);


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/scan", scanRoutes);

app.get("/", (_, res) => {
  res.send("Backend is running.");
});

async function bootstrap() {
  await recoverInterruptedScans();
  await import("./workers/scanWorker");

  app.listen(port, () => console.log(`Server running on port ${port}`));
}

bootstrap().catch((error) => {
  console.error("Failed to start backend:", error);
  process.exit(1);
});
