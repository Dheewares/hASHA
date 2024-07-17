import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./routes/userRoute.js";
import jobRoutes from "./routes/jobRoutes.js";

config();

const allowedOrigins = [process.env.FRONTEND_URL_N, process.env.FRONTEND_URL_D];
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/jobs", jobRoutes);

// app.all("*", (req, res) => {
//   res.status(404).send("OOPS! Page Not found!!");
// });
export default app;
