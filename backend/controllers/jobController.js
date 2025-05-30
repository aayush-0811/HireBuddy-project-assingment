import { createReadStream } from 'fs';
import { join } from 'path';
import { parse } from 'jsonlines';
import { insertMany, find } from '../models/Job';

const importJobs = async (req, res) => {
  const filePath = join(__dirname, '..', 'jobs', 'all_jobs_2025-05-22.jsonl');
  const reader = parse();

  const jobs = [];

  reader.on('data', job => jobs.push(job));
  reader.on('end', async () => {
    try {
      await insertMany(jobs);
      res.status(200).json({ message: 'Jobs imported successfully', count: jobs.length });
    } catch (err) {
      res.status(500).json({ error: 'Failed to insert jobs into database' });
    }
  });

  createReadStream(filePath).pipe(reader);
};

const getJobs = async (req, res) => {
  try {
    const jobs = await find().limit(20); // Just to test retrieval
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

export default { importJobs, getJobs };
