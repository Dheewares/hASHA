import jwt from "jsonwebtoken";
import db from "../config/db.js";
import AppError from "../utils/errorUtil.js";
import sendEmail from "../utils/sendEmail.js";
import sendMessage from "../utils/sendMessage.js";
import bcrypt from "bcryptjs";
import { addMinutes, isBefore } from "date-fns";
import { sendOtp } from "../utils/otpHandler.js";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Module for signup
 */

export const register = async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    user_type,
    identification_doc_type,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !password ||
    !phone ||
    !user_type ||
    !identification_doc_type
  ) {
    return next(new AppError("All fields are mandatory!!", 400));
  }

  if (user_type !== "care_requester" && user_type !== "care_provider") {
    return res.status(400).send("Invalid user type.");
  }

  try {
    // Check if user already exists in the main table
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM Users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res
        .status(400)
        .send({ message: "User with this email already exists." });
    }

    // Check if user already exists in the temporary registration table
    const [existingTempUser] = await db
      .promise()
      .query("SELECT * FROM UserRegistration WHERE email = ?", [email]);
    if (existingTempUser.length > 0) {
      return res
        .status(400)
        .send("OTP already sent to this email. Please verify.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    const tempUser = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      user_type,
      identification_doc_type,
      otp,
    };

    await db.promise().query("INSERT INTO UserRegistration SET ?", tempUser);

    // Send OTP to email
    let subject = "OTP for validation";
    let message = `Your One Time Password for validation is ${otp}`;

    sendEmail(email, subject, message);
    sendOtp(phone, otp);

    // Send OTP to phone
    // sendMessage(message, phone);
    res.status(200).send({ message: "OTP sent to your phone and email." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Server error.");
  }
};

export const resendOTP = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required.");
  }

  try {
    // Fetch user details from the temporary registration table
    const [tempUser] = await db
      .promise()
      .query("SELECT * FROM UserRegistration WHERE email = ?", [email]);

    if (tempUser.length === 0) {
      return res.status(400).send("User not found or already verified.");
    }

    // Generate a new OTP
    const otp = generateOTP();

    // Update OTP in the database
    await db
      .promise()
      .query("UPDATE UserRegistration SET otp = ? WHERE email = ?", [
        otp,
        email,
      ]);

    // Send OTP to email and phone
    const { phone } = tempUser[0];
    const subject = "OTP for validation";
    const message = `Your One Time Password for validation is ${otp}`;

    sendEmail(email, subject, message);
    sendOtp(phone, otp);

    res.status(200).send({ message: "OTP has been resent successfully." });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).send("Server error.");
  }
};

/**
 * Module for verify otp and verify email
 */
export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).send("Email and OTP are required.");
  }

  try {
    // Fetch user details from the temporary registration table
    const [tempUser] = await db
      .promise()
      .query("SELECT * FROM UserRegistration WHERE email = ? AND otp = ?", [
        email,
        otp,
      ]);

    if (tempUser.length === 0) {
      return res.status(400).send("Invalid OTP.");
    }

    const user = tempUser[0];

    const otpTimestamp = new Date(tempUser.otp_timestamp);
    const expiryTime = addMinutes(otpTimestamp, 5);

    if (isBefore(new Date(), expiryTime)) {
      return res.status(400).send("OTP has expired.");
    }

    // Move user details to the main Users table
    const newUser = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      phone: user.phone,
      user_type: user.user_type,
      identification_doc_type: user.identification_doc_type,
    };

    await db.promise().query("INSERT INTO Users SET ?", newUser);

    // Delete the temporary registration record
    await db
      .promise()
      .query("DELETE FROM UserRegistration WHERE email = ?", [email]);

    res.status(201).send({ message: "User registered successfully." });
    next();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send("Server error.");
  }
};

/**
 * Module for Login
 */

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  try {
    const [userResult] = await db
      .promise()
      .query("SELECT * FROM Users WHERE email = ?", [email]);

    if (userResult.length === 0) {
      return res.status(400).send({ success: false, message: "Invalid email" });
    }

    const user = userResult[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        isLoggedIn: true,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // maxAge: 3600000, // 1 hour
      // sameSite: "Lax",
    });

    // console.log("Token:", token);

    res.status(200).send({ success: true, message: "Login successful." });
    next();
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Server error.");
  }
};

export const logout = async (req, res, next) => {
  try {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
      });
    } else {
      res.clearCookie("token");
      res.status(200).json({ message: "Logout successful" });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Module to get user Info
 *
 */

export const userInfo = async (req, res, next) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = "SELECT first_name, last_name FROM users WHERE email = ?";
  connection.query(query, [email], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    res.json(user);
  });
};

export const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required.");
  }

  try {
    const [userResult] = await db
      .promise()
      .query("SELECT * FROM Users WHERE email = ?", [email]);

    if (userResult.length === 0) {
      return res.status(400).send("User with this email does not exist.");
    }

    const user = userResult[0];
    const resetToken = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    const resetLink = `http://localhost:5501/resetPassword.html?token=${resetToken}`;

    const subject = "Password Reset Request";
    const message = `
      <html>
      <body>
        <p>Dear ${user.first_name},</p>
        <p>You requested a password reset. Click the button below to reset your password. The link is valid for 10 minutes.</p>
        <a href="${resetLink}" style="
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: #ffffff;
          background-color: #007bff;
          border-radius: 5px;
          text-align: center;
          text-decoration: none;
        ">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Regards,</p>
        <p>DHEEWARES PVT LTD.</p>
      </body>
      </html>
    `;

    await sendEmail(user.email, subject, message);

    res
      .status(200)
      .send({ message: "Password reset link has been sent to your email." });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).send("Server error.");
  }
};

export const resetPassword = async (req, res, next) => {
  const { token } = req.body;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).send("Invalid request.");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const [userResult] = await db
      .promise()
      .query("SELECT * FROM Users WHERE email = ?", [decoded.email]);

    if (userResult.length === 0) {
      return res.status(400).send("User does not exist.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .promise()
      .query("UPDATE Users SET password = ? WHERE email = ?", [
        hashedPassword,
        decoded.email,
      ]);

    res.status(200).send({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    if (error.name === "TokenExpiredError") {
      res.status(400).send("Password reset link has expired.");
    } else {
      res.status(500).send("Server error.");
    }
  }
};
