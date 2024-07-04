import { Router } from "express";

import upload from "../middlewares/multer.js";
import {
  login,
  logout,
  register,
  userInfo,
  verifyOtp,
} from "../controllers/userController.js";

const router = Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", userInfo);
export default router;
