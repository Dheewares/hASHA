import { Router } from "express";
import {
  applyForJob,
  getPreviousJobPostings,
  jobPostings,
  listAllJobPostings,
} from "../controllers/jobController.js";
const router = Router();

router.post("/job-postings", jobPostings);
router.get("/get-previous-job", getPreviousJobPostings);
router.get("/list-all-jobs", listAllJobPostings);
router.post("/appliedFor", applyForJob);

export default router;
