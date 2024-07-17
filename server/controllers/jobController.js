import db from "../config/db.js";
import AppError from "../utils/errorUtil.js";
import sendEmail from "../utils/sendEmail.js";

export const jobPostings = async (req, res) => {
  const {
    serviceName,
    description,
    address,
    city,
    state,
    pincode,
    serviceType,
    serviceHours,
    serviceDays,
    startTime,
    endTime,
    deadline,
    email,
  } = req.body;

  console.log("Received job posting request:", req.body);

  if (
    !serviceName ||
    !description ||
    !address ||
    !city ||
    !state ||
    !pincode ||
    !serviceType ||
    !serviceHours ||
    !serviceDays ||
    !startTime ||
    !endTime ||
    !deadline ||
    !email
  ) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  try {
    const query = `
      INSERT INTO job_postings (email, title, description, street_address, city, state, pincode, employment_type, start_time, end_time, deadline, service_days, service_hours) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db
      .promise()
      .query(query, [
        email,
        serviceName,
        description,
        address,
        city,
        state,
        pincode,
        serviceType,
        startTime,
        endTime,
        deadline,
        serviceDays,
        serviceHours,
      ]);

    res.status(201).json({ message: "Job posting created successfully" });
  } catch (error) {
    console.error("Error creating job posting:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPreviousJobPostings = async (req, res) => {
  const email = req.query.email;

  console.log("Fetching job postings for email:", email);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const [results] = await db
      .promise()
      .query(
        "SELECT * FROM job_postings WHERE email = ? ORDER BY posted_at DESC LIMIT 3",
        [email]
      );
    res.json(results);
  } catch (error) {
    console.error("Error fetching job postings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const listAllJobPostings = async (req, res) => {
  const email = req.query.email;
  try {
    const [results] = await db
      .promise()
      .query(
        "SELECT * FROM JOB_POSTINGS WHERE SELECTED_CANDIDATE IS NULL AND email !=?",
        [email]
      );
    res.json({ jobs: results });
  } catch (error) {
    console.error("Error while fetching jobs", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Controller function to handle job application submission and updating selected candidate
export const applyForJob = async (req, res) => {
  const { job_id, email, status } = req.body;

  try {
    // Check if the email exists in your database to verify the user
    const [user] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (!user.length) {
      return res
        .status(404)
        .json({ message: "User not found. Please log in." });
    }

    // Insert application details into applications table
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO applications (job_id, email, status) VALUES (?, ?, ?)",
        [job_id, email, status]
      );

    // Check if insertion was successful
    if (result.affectedRows === 1) {
      // Check if the status is "Hired" to update selected_candidate in job_postings table
      if (status === "Hired") {
        const [userInfo] = await db
          .promise()
          .query("SELECT name FROM users WHERE email = ?", [email]);
        const userName = userInfo[0].name;

        await db
          .promise()
          .query(
            "UPDATE job_postings SET selected_candidate = ? WHERE job_id = ?",
            [userName, job_id]
          );
      }

      return res
        .status(200)
        .json({ message: "Job application submitted successfully." });
    } else {
      return res.status(500).json({
        message: "Failed to submit job application. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Error applying for job:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

/**
 * Service requested by particular user
 */

export const servicesRequested = async(req,res,next)=>{
  
}