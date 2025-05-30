// models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  job_title: String,
  company_name: String,
  job_location: String,
  apply_link: String,
  job_description: String,
  source: String,
});

module.exports = mongoose.model('Job', JobSchema);
