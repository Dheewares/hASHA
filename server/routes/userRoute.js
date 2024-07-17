import { Router } from "express";
import upload from "../middlewares/multer.js";
import {
  login,
  logout,
  register,
  resendOTP,
  userInfo,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
} from "../controllers/userController.js";

const router = Router();

router.post("/register", upload.single("identification_doc"), register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", userInfo);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
