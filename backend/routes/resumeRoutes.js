const express = require("express");
const multer = require("multer");
const { uploadResumeAndMatchJobs } = require("../controllers/resumeController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-resume", upload.single("resume"), uploadResumeAndMatchJobs);

module.exports = router;
