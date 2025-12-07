import express from "express";
import jobsRouter from "./routes/jobs.js";
import userRouter from "./routes/users.js";
import cors from "cors";
import { runSetup } from "./DB/migrations.js";
import applicationsRouter from "./routes/applications.js"

const app = express();
const port = 5501;

app.use(cors({
  origin: "https://jobboard-frontend.hosting.codeyourfuture.io",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors()); // ✅ THIS IS REQUIRED FOR LOGIN PREFLIGHT
app.use(express.json());
app.use('/api/applications', applicationsRouter)

await runSetup();

app.use('/api/jobs', jobsRouter);
app.use("/api", userRouter);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
