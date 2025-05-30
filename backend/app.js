const express = require("express");
const fs = require("fs");
const path = require("path");
const jsonlines = require("jsonlines");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Store normalized jobs in memory
let allJobs = [];

// File to store search keyword counts
const keywordsFilePath = path.join(__dirname, "searchKeywords.json");

// Load existing keywords data or initialize empty object
let searchKeywords = {};
if (fs.existsSync(keywordsFilePath)) {
  try {
    const rawData = fs.readFileSync(keywordsFilePath);
    searchKeywords = JSON.parse(rawData);
  } catch (err) {
    console.error("Failed to load search keywords:", err);
    searchKeywords = {};
  }
}

// Normalize job data once
function normalizeJob(job) {
  return {
    ...job,
    _normalized_title: (job.job_title || "").toLowerCase(),
    _normalized_location: (job.job_location || "").toLowerCase(),
    _normalized_company: (job.company_name || "").toLowerCase(),
    _normalized_description: (job.job_description || "").toLowerCase(),
  };
}

// Load and normalize jobs from JSONL file
const filePath = path.join(__dirname, "jobs/all_jobs_2025-05-22.jsonl");
fs.createReadStream(filePath)
  .pipe(jsonlines.parse())
  .on("data", (job) => allJobs.push(normalizeJob(job)))
  .on("end", () => console.log("✅ Jobs loaded and normalized"));

// Save search keywords to file asynchronously
function saveSearchKeywords() {
  fs.writeFile(keywordsFilePath, JSON.stringify(searchKeywords, null, 2), (err) => {
    if (err) console.error("Error saving search keywords:", err);
  });
}

// Debounced save to reduce disk writes
let saveTimeout;
function saveSearchKeywordsDebounced() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveSearchKeywords, 2000);
}

// Filter, sort, and paginate jobs
function filterJobs(jobs, query) {
  const {
    title,
    location,
    company,
    sortBy,
    order = "asc",
    page = 1,
    limit = 10,
  } = query;

  let filtered = [...jobs];

  if (title) {
    const lower = title.toLowerCase();
    filtered = filtered.filter((job) => job._normalized_title.includes(lower));
  }

  if (location) {
    const lower = location.toLowerCase();
    filtered = filtered.filter((job) => job._normalized_location.includes(lower));
  }

  if (company) {
    const lower = company.toLowerCase();
    filtered = filtered.filter((job) => job._normalized_company.includes(lower));
  }

  if (sortBy) {
    filtered.sort((a, b) => {
      const valA = (a[sortBy] || "").toString().toLowerCase();
      const valB = (b[sortBy] || "").toString().toLowerCase();
      return order === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  const start = (parseInt(page) - 1) * parseInt(limit);
  const paginated = filtered.slice(start, start + parseInt(limit));

  return {
    total: filtered.length,
    page: parseInt(page),
    limit: parseInt(limit),
    jobs: paginated,
  };
}

// GET /api/jobs - basic listing with filters and keyword tracking
app.get("/api/jobs", (req, res) => {
  const title = req.query.title;

  // Track keyword count for title if present
  if (title && title.trim() !== "") {
    const keyword = title.trim().toLowerCase();
    if (searchKeywords[keyword]) {
      searchKeywords[keyword]++;
    } else {
      searchKeywords[keyword] = 1;
    }
    saveSearchKeywordsDebounced();
  }

  res.json(filterJobs(allJobs, req.query));
});

// GET /api/search-keywords - returns current keyword counts
app.get("/api/search-keywords", (req, res) => {
  res.json(searchKeywords);
});

// File upload setup
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/upload-resume - match jobs by resume text
app.post("/api/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file || req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF resumes are supported" });
    }

    const data = await pdfParse(req.file.buffer);
    const resumeText = data.text.toLowerCase();
    const resumeWords = resumeText
      .split(/\s+/)
      .filter((word) => word.length > 3);
    const resumeWordSet = new Set(resumeWords);

    // Score jobs based on matches in title and description
    const scoredJobs = allJobs.map((job) => {
      let score = 0;
      resumeWordSet.forEach((word) => {
        if (job._normalized_title.includes(word)) score += 2;
        if (job._normalized_description.includes(word)) score += 1;
      });
      return { ...job, score };
    });

    // Filter, sort by score, then normalize before filtering by query params
    const matchedJobs = scoredJobs
      .filter((job) => job.score > 0)
      .sort((a, b) => b.score - a.score);

    res.json(filterJobs(matchedJobs, req.query));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process resume" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
