import express from "express"
import { router } from "./routes/users.js";
import cors from "cors";

const app = express()
const userRouter = router
const port = 5501

app.use(cors());
app.use(express.json())
app.use("/api" , userRouter)



app.get("/", (req, res) => {
    res.send("Backend is running")
})
app.listen(port)


