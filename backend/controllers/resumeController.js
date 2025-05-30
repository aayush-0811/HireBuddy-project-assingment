const pdfParse = require("pdf-parse");
const { HfInference } = require("@huggingface/inference");
const path = require("path");
const fs = require("fs");
const jsonlines = require("jsonlines");

const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);

// Load job data at startup
const filePath = path.join(__dirname, "../jobs/all_jobs_2025-05-22.jsonl");
let allJobs = [];

const reader = jsonlines.parse();
fs.createReadStream(filePath)
  .pipe(reader)
  .on("data", (job) => allJobs.push(job))
  .on("end", () => console.log("Loaded all jobs from JSONL"))
  .on("error", (err) => console.error("Job load error:", err));

exports.uploadResumeAndMatchJobs = async (req, res) => {
  try {
    if (!req.file || req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Please upload a valid PDF file." });
    }

    const data = await pdfParse(req.file.buffer);
    const resumeText = data.text.toLowerCase().slice(0, 1000);

    const labels = [
      "Software Engineer",
      "Data Scientist",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Project Manager",
      "Product Manager",
      "DevOps Engineer",
      "Data Analyst",
      "HR Specialist",
      "Marketing Manager"
    ];

    const classification = await hf.zeroShotClassification({
      model: "facebook/bart-large-mnli",
      inputs: resumeText,
      parameters: {
        candidate_labels: labels,
        multi_label: true,
      },
    });

    const topRoles = classification.labels.slice(0, 3).map(label => label.toLowerCase());
    console.log("Predicted roles:", topRoles);

    let filteredJobs = allJobs.filter(job =>
      topRoles.some(role =>
        (job.job_title || "").toLowerCase().includes(role)
      )
    );

    const {
      title,
      location,
      company,
      sortBy,
      order = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    if (title) {
      filteredJobs = filteredJobs.filter((job) =>
        job.job_title?.toLowerCase().includes(title.toLowerCase())
      );
    }
    if (location) {
      filteredJobs = filteredJobs.filter((job) =>
        job.job_location?.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (company) {
      filteredJobs = filteredJobs.filter((job) =>
        job.company_name?.toLowerCase().includes(company.toLowerCase())
      );
    }

    if (sortBy) {
      filteredJobs.sort((a, b) => {
        const valA = (a[sortBy] || "").toString().toLowerCase();
        const valB = (b[sortBy] || "").toString().toLowerCase();
        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const paginated = filteredJobs.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      predicted_roles: topRoles,
      total: filteredJobs.length,
      page: pageNum,
      limit: limitNum,
      jobs: paginated,
    });
  } catch (err) {
    console.error("Resume parsing/matching failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
