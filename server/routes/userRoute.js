import { Router } from "express";

import upload from "../middlewares/multer.js";
import { register, verifyOtp } from "../controllers/userController.js";

const router = Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);

export default router;
