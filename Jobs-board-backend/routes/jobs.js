import express from 'express';
import { getAllJobs, getJobById, createJob } from 
'../services/jobsService.js';

const router = express.Router();

router.get('/test', (req, res) => { res.send('Test route works'); });

// Lists all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await getAllJobs({
      location: req.query.location,
      employment_type: req.query.employment_type,
      company: req.query.company,
      approved: req.query.approved // true or false will give
    });
    res.json({ jobs });  // Array wrapped in object
  } catch(err) {
    res.status(500).json({ error: "ServerError", message: err.message });
  }
});


// Views one job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await getJobById(parseInt(req.params.id));
    if (job) {
      res.json({ job }); // Object wrapped
    } else {
      res.status(404).json({
        error: "JobNotFound",
        message: `Job with id ${req.params.id} does not exist.`
      });
    }
  } catch (err) {
    res.status(500).json({ error: "ServerError", message: err.message });
  }
});

const ALLOWED_EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance"
];

// Helper to check valid URL
function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

router.post('/', async (req, res) => {
  const { title, company, apply_url, employment_type } = req.body;

  // Required fields
  if (!title) {
    return res.status(400).json({ error: "ValidationError", message: "Field 'title' is required." });
  }
  if (!company) {
    return res.status(400).json({ error: "ValidationError", message: "Field 'company' is required." });
  }
  if (!apply_url) {
    return res.status(400).json({ error: "ValidationError", message: "Field 'apply_url' is required." });
  }
  // Validate URL
  if (!isValidUrl(apply_url)) {
    return res.status(400).json({ error: "ValidationError", message: "Field 'apply_url' must be a valid URL." });
  }
  // Validate employment_type
  if (employment_type && !ALLOWED_EMPLOYMENT_TYPES.includes(employment_type)) {
    return res.status(400).json({
      error: "ValidationError",
      message: `Field 'employment_type' must be one of: ${ALLOWED_EMPLOYMENT_TYPES.join(', ')}.`
    });
  }

 //permission logic for admin approval 
 const userRole = req.header ("x-user-role");
 const isAdmin = userRole === 'admin';
 const {approved_at, ...rest} = req.body;
 const jobData = isAdmin
  ?{ ...rest, approved_at}
  : { ...rest, approved_at:null};
 
  // if validation passes it Creates a new job
  try {
    const job = await createJob(jobData); // Assumes createJob is defined and async
    res.status(201).json({message: "Job created successfully",job});
  } catch(err) {
    res.status(500).json({ error: "ServerError", message: err.message });
  }
});

export default router;
