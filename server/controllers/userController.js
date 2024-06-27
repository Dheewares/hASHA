import db from "../config/db.js";
import AppError from "../utils/errorUtil.js";
import sendEmail from "../utils/sendEmail.js";
import sendMessage from "../utils/sendMessage.js";
import bcrypt from "bcryptjs";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const register = async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    password_hash,
    phone,
    user_type,
    identification_doc_type,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !password_hash ||
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
      return res.status(400).send("User with this email already exists.");
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

    // Hash the password_hash
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    // Generate OTP
    const otp = generateOTP();

    const tempUser = {
      first_name,
      last_name,
      email,
      password_hash:hashedPassword,
      phone,
      user_type,
      identification_doc_type,
      otp,
    };

    await db.promise().query("INSERT INTO userRegistration SET ?", tempUser);

    //sending otp to email
    let subject = "OTP for validation";
    let message = `Your One Time Password for validation is ${otp}`;

    sendEmail(email, subject, message);

    // Send OTP to phone
    // sendMessage(message, phone);
    res.status(200).send("OTP sent to your phone and email.");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Server error.");
  }
};

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

    // Move user details to the main Users table
    const newUser = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password_hash: user.password_hash,
      phone: user.phone,
      user_type: user.user_type,
      identification_doc_type: user.identification_doc_type,
    };

    await db.promise().query("INSERT INTO Users SET ?", newUser);

    // Delete the temporary registration record
    await db
      .promise()
      .query("DELETE FROM UserRegistration WHERE email = ?", [email]);

    res.status(201).send("User registered successfully.");
    next();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send("Server error.");
  }
};
