import express from "express";
import jobsRouter from "./routes/jobs.js";
import userRouter from "./routes/users.js";
import cors from "cors";
import { runSetup } from "./DB/migrations.js";
import applicationsRouter from "./routes/applications.js"

console.log("✅✅✅ NEW CORS VERSION IS RUNNING ✅✅✅");


const app = express();
const port = process.env.PORT ||5501;

// app.use(cors())

const allowedOrigin = "https://jobboard-frontend.hosting.codeyourfuture.io";

// ✅ CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// app.use(cors({
//   origin: allowedOrigin,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

// ✅ SAFE PREFLIGHT HANDLER
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", allowedOrigin);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
  }
  next();
});


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
