const express = require('express');
const { importJobs, getJobs } = require('../controllers/jobController');
const router = express.Router();

router.post('/import', importJobs);
router.get('/', getJobs); // To test retrieval

module.exports = router;
