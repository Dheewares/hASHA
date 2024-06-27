import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./routes/userRoute.js";
import { register } from "./controllers/userController.js";

config();

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);

// app.all("*", (req, res) => {
//   res.status(404).send("OOPS! Page Not found!!");
// });
export default app;
